import React from "react";
import { Switch, withRouter, Link } from "react-router-dom";
import { Route } from "react-router-dom";
import Game from "./game";
import Button from "@material-ui/core/Button";
import { ref } from "../../firebase/main";
import { PATH_CONST } from "../../constants/firebase";

class Home extends React.Component {
  state = {
    games: [],
    isGameOwner: false,
  };

  componentDidMount() {
    // List all available game room
    const gameList = ref.child(PATH_CONST.DICTIONARIES);

    gameList
      .on("value", (snapshot) => {
        const val = snapshot.val();

        const games = val
          ? Object.keys(val).map((key) => {
              return { ...val[key], key };
            })
          : [];

        this.setState((state) => {
          return { ...state, games };
        });
      })
      .bind(this);
  }

  render() {
    return (
      <div>
        <h2>Dictionary</h2>
        {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
        <Switch>
          <Route path={`${this.props.match.path}/:gameId`}>
            <Game
              isOwner={this.state.isGameOwner}
              ownerId={this.state.ownerId}
            />
          </Route>
          <Route path={`${this.props.match.path}`}>
            <h3>Please select a room or create on.</h3>
            <ul>
              {this.state.games.map((value, index) => {
                return (
                  <li key={index}>
                    <Link to={`${this.props.match.path}/${value.key}`}>
                      {value.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Button onClick={this.createRoom}>Create room</Button>
          </Route>
        </Switch>
      </div>
    );
  }

  createRoom = () => {
    const room = prompt("Please enter the room name", "New Dictionary Game");

    // Create a new game room in Firebase
    const gameRef = ref.child(PATH_CONST.DICTIONARIES);
    const newGame = gameRef.push({
      name: room,
      status: {
        state: "lobby",
      },
      players: {},
    });

    const name = prompt("Please enter your name", "Harry Potter");

    // Add the room owner as player
    const playersRef = ref.child(
      `${PATH_CONST.DICTIONARIES}/${newGame.key}/${PATH_CONST.PLAYERS}`
    );
    const owner = playersRef.push({
      name,
      isOwner: true,
      points: 0,
      responses: [],
    });

    this.setState((state) => {
      return { ...state, isGameOwner: true, ownerId: owner.key };
    });

    // Move to game lobby
    this.props.history.push(`${this.props.match.path}/${newGame.key}`);
  };
}

export default withRouter(Home);
