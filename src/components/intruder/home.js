import React from "react";
import { Switch, withRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import Game from "./game";
import Button from "@material-ui/core/Button";
import { ref } from "../../firebase/main";
import {PATH_CONST} from "../../constants/firebase";
import TextField from "@material-ui/core/TextField";

class Home extends React.Component {
  state = {
    games: [],
  };

  componentDidMount() {

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

              <TextField
                  value={this.state.word}
                  onChange={this.updateWord}
              />
              <TextField
                  value={this.state.def}
                  onChange={this.updateDef}
                  multiline={true}
              />
              <Button onClick={this.sendWord}>Done</Button>

          </Route>
        </Switch>
      </div>
    );
  }

    updateWord = (e) => {
        const word = e.target.value;

        this.setState((state) => {
            return { ...state, word };
        });
    };

    updateDef = (e) => {
        const def = e.target.value;

        this.setState((state) => {
            return { ...state, def };
        });
    };

  sendWord = () => {
    const wordsRef = ref.child(`${PATH_CONST.DICTIONARY_DATA}/${PATH_CONST.WORDS}`);

    wordsRef.push({
        definition: this.state.def,
        word: this.state.word,
        index: Math.random(),
    });

    this.setState(state => {
        return {
            ...state, word: "", def: ''
        }
    })
  };

  createRoom = () => {
    const gameRef = ref.child(PATH_CONST.INTRUDERS);
    const newGame = gameRef.push({
      name: "New Intruder Game",
    });

    this.props.history.push(`${this.props.match.path}/${newGame.key}`);
  };
}

export default withRouter(Home);
