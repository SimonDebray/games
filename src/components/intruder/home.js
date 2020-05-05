import React from "react";
import { Switch, withRouter, Link } from "react-router-dom";
import { Route } from "react-router-dom";
import Game from "./game";
import Button from "@material-ui/core/Button";
import { ref } from "../../firebase/main";

class Home extends React.Component {
  state = {
    games: [],
  };

  componentDidMount() {
    const gameList = ref.child("intruders/");

    gameList
      .on("value", (snapshot) => {
        const val = snapshot.val();
        const games = Object.keys(val).map((key) => {
          return { ...val[key], key };
        });

        this.setState((state) => {
          return { ...state, games };
        });
      })
      .bind(this);
  }

  render() {
    return (
      <div>
        <h2>Intruder</h2>
        {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
        <Switch>
          <Route path={`${this.props.match.path}/:gameId`}>
            <Game />
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
    const gameRef = ref.child("intruders");
    const newGame = gameRef.push({
      name: "New Intruder Game",
    });

    this.props.history.push(`${this.props.match.path}/${newGame.key}`);
  };
}

export default withRouter(Home);
