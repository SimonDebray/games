import { Link, Route, withRouter } from "react-router-dom";
import React from "react";
import { ref } from "../../firebase/main";
import { PATH_CONST } from "../../constants/firebase";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";

class BlindTestGame extends React.Component {
  state = {
    listeners: {},
    clientId: "",
    game: {
      players: {},
      status: {},
    },
  };

  componentDidMount() {
    console.log(this.props);

    if (this.props.isOwner) {
      // Player already exist as owner
      this.setState((state) => {
        return { ...state, clientId: this.props.ownerId };
      });
    }
    else {
      // Create a player
      const playerRef = ref.child(
          `${PATH_CONST.DICTIONARY}/${this.props.match.params.gameId}/${PATH_CONST.PLAYERS}`
      );
      const client = playerRef.push({
        name: "Player",
      });

      this.setState((state) => {
        return { ...state, clientId: client.key };
      });
    }

    // Set firebase listener to keep game updated
    const gameRef = ref.child(
      `${PATH_CONST.DICTIONARY}/${this.props.match.params.gameId}`
    );

    gameRef
      .on("value", (snapshot) => {
        const game = snapshot.val();

        this.setState((state) => {
          return { ...state, game };
        });
      })
      .bind(this);

    // Keep listener in memory to remove it on unmount event
    this.setState((state) => {
      return {
        ...state,
        listeners: { ...state.listeners, gameRef: gameRef },
      };
    });
  }

  render() {
    let startGameButton = '',
        game = '';

    console.log(this.state);

    if (this.props.isOwner && this.state.game.status.state === "lobby") {
      startGameButton = <Button onClick={this.startGame}>Start</Button>
    }

    if (this.state && this.state.game && this.state.game.status.state === "started") {
      game =  <TextField multiline={true} id="standard-basic" label="Standard" />
    }

    return (
      <div>
        <h3>Game: {this.props.match.params.gameId}</h3>
        <h4>Players</h4>
        <ul>
          {this.state.game &&
            Object.keys(this.state.game.players).map((key, index) => {
              return <li key={index}>{this.state.game.players[key].name} - {key} - {key === this.state.clientId ? '(me)' : ''}</li>;
            })}
        </ul>

        {startGameButton}
        {game}
      </div>
    );
  }

  startGame = () => {
    const gameRef = ref.child(
        `${PATH_CONST.DICTIONARY}/${this.props.match.params.gameId}/${PATH_CONST.STATUS}/${PATH_CONST.STATE}`
    );

    gameRef.set('started');
  };

  componentWillUnmount() {
    if (
      this.state.game.players &&
      Object.keys(this.state.game.players).length === 1
    ) {
      ref
        .child(`${PATH_CONST.DICTIONARY}/${this.props.match.params.gameId}`)
        .remove()
        .then(() => console.log("Game removed success"));
    } else {
      ref
        .child(
          `${PATH_CONST.DICTIONARY}/${this.props.match.params.gameId}/${PATH_CONST.PLAYERS}/${this.state.clientId}`
        )
        .remove()
        .then(() => console.log("Player removed success"));
    }

    Object.keys(this.state.listeners).forEach((key) => {
      this.state.listeners[key].off();
    });
  }
}

export default withRouter(BlindTestGame);
