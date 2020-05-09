import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";

import Toolbar from "@material-ui/core/Toolbar";
import {
  MyAppBar,
  MyContainer,
  BlankLink,
  MyButton,
  CardSVGContainer,
  MyCard,
} from "./components/styled/styled";
import Typography from "@material-ui/core/Typography";
import BlindTestHome from "./components/blindTest/home";
import IntruderHome from "./components/intruder/home";
import DictionaryHome from "./components/dictionary/home";
import { NAV_CONST } from "./constants/nav";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { DICTIONARY_ICON } from "./assests/svgs";
import Box from "@material-ui/core/Box";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <MyAppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              <BlankLink to={"/"}>Games</BlankLink>
            </Typography>
          </Toolbar>
        </MyAppBar>

        <MyContainer>
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
            <Route path={"/"}>
              <MyCard>
                <CardSVGContainer>
                  <Box dangerouslySetInnerHTML={{ __html: DICTIONARY_ICON }} />
                </CardSVGContainer>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Dictionary
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Invent the best definition matching the random word
                    displayed. Then, try to find the correct one in the list of
                    proposition.
                  </Typography>
                </CardContent>
                <CardActions>
                  <BlankLink to={NAV_CONST.DICTIONARY}>
                    <MyButton size="small" color="primary">
                      Play
                    </MyButton>
                  </BlankLink>
                </CardActions>
              </MyCard>
            </Route>
          </Switch>
        </MyContainer>
      </div>
    );
  }
}

export default App;
