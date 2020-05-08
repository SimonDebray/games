import React from "react";
import "./App.css";
import { Switch, Route, Link } from "react-router-dom";

import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import BlindTestHome from "./components/blindTest/home";
import IntruderHome from "./components/intruder/home";
import DictionaryHome from "./components/dictionary/home";
import { NAV_CONST } from "./constants/nav";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <Typography variant="h6" color="inherit" noWrap>
                <Link to="/">Games</Link>
              </Typography>
              <nav>

                <Link
                  variant="button"
                  color="textPrimary"
                  to={NAV_CONST.DICTIONARY}
                >
                  Dictionary
                </Link>
              </nav>
            </Toolbar>
          </AppBar>
        </header>

        <Switch>
          <Route path={NAV_CONST.BLIND_TEST}>
            <BlindTestHome />
          </Route>
          <Route path={NAV_CONST.INTRUDER}>
            <IntruderHome />
          </Route>
          <Route path={NAV_CONST.DICTIONARY}>
            <DictionaryHome />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
