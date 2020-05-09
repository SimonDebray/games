import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";

import Toolbar from "@material-ui/core/Toolbar";
import { MyAppBar, BlankLink } from "./components/styled/styled";
import Typography from "@material-ui/core/Typography";
import BlindTestHome from "./components/blindTest/home";
import IntruderHome from "./components/intruder/home";
import DictionaryHome from "./components/dictionary/home";
import { NAV_CONST } from "./constants/nav";
import Container from "@material-ui/core/Container";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <MyAppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <Typography variant="h6" color="inherit" noWrap>
                <BlankLink href="/">Games</BlankLink>
              </Typography>
              <nav>
                <BlankLink
                  variant="button"
                  color="textPrimary"
                  href={NAV_CONST.DICTIONARY}
                >
                  Dictionary
                </BlankLink>
              </nav>
            </Toolbar>
          </MyAppBar>
        </header>

        <Container>
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
            <Route path={'/'}>

            </Route>
          </Switch>
        </Container>
      </div>
    );
  }
}

export default App;
