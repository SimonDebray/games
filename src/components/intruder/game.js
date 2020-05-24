import { withRouter } from "react-router-dom";
import React from "react";
import { ref } from "../../firebase/main";
import { PATH_CONST } from "../../constants/firebase";

class BlindTestGame extends React.Component {
  state = {
    listeners: {},
    clientId: "",
    game: {
      players: {},
    },
  };

  componentDidMount() {
    const playerRef = ref.child(
      `${PATH_CONST.INTRUDERS}/${this.props.match.params.gameId}/${PATH_CONST.PLAYERS}`
    );
    const client = playerRef.push({
      name: "Player",
    });

    this.setState((state) => {
      return { ...state, clientId: client.key };
    });

    const gameRef = ref.child(
      `${PATH_CONST.INTRUDERS}/${this.props.match.params.gameId}`
    );

    gameRef
      .on("value", (snapshot) => {
        const game = snapshot.val();

        this.setState((state) => {
          return { ...state, game };
        });
      })
      .bind(this);

    this.setState((state) => {
      return {
        ...state,
        listeners: { ...state.listeners, gameRef: gameRef },
      };
    });
  }

  render() {
    return (
      <div>
        <h3>Game: {this.props.match.params.gameId}</h3>
        <h4>Players</h4>
        <ul>
          {this.state.game &&
            Object.keys(this.state.game.players).map((key, index) => {
              return <li key={index}>{this.state.game.players[key].name}</li>;
            })}
        </ul>
      </div>
    );
  }

  componentWillUnmount() {
    if (
      this.state.game.players &&
      Object.keys(this.state.game.players).length === 1
    ) {
      ref
        .child(`${PATH_CONST.INTRUDERS}/${this.props.match.params.gameId}`)
        .remove()
        .then(() => console.log("Game removed success"));
    } else {
      ref
        .child(
          `${PATH_CONST.INTRUDERS}/${this.props.match.params.gameId}/${PATH_CONST.PLAYERS}/${this.state.clientId}`
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
