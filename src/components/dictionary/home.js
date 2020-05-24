import React from "react";
import { Switch, withRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import Game from "./game";
import { BlankLink, CardSVGContainer, MyButton } from "../styled/styled";
import { ref } from "../../firebase/main";
import { PATH_CONST } from "../../constants/firebase";
import { GAMES_CONST } from "../../constants/games";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Box from "@material-ui/core/Box";
import { DICTIONARY_ICON } from "../../assests/svgs";
import CircularProgress from "@material-ui/core/CircularProgress";

class Home extends React.Component {
  state = {
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
          return { ...state, games, now: new Date() };
        });
      })
      .bind(this);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path={`${this.props.match.path}/:gameId`}>
            <Game
              isOwner={this.state.isGameOwner}
              ownerId={this.state.ownerId}
            />
          </Route>
          <Route path={`${this.props.match.path}`}>
            <Container maxWidth="md">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Dictionary
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph
              >
                Invent the best definition matching the random word displayed.
                <br />
                Then try to find the correct among other players creations.
              </Typography>
              <div style={{ marginBottom: "30px" }}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <MyButton onClick={this.createRoom}>New Game</MyButton>
                  </Grid>
                </Grid>
              </div>
            </Container>
            <Container maxWidth="md">
              <Typography
                variant="h4"
                align="left"
                color="textSecondary"
                paragraph
              >
                Available games:
              </Typography>
              <Grid container spacing={4}>
                {this.state.games &&
                  this.state.games.map((value, index) => {
                    if (
                      value.status.state === GAMES_CONST.LOBBY ||
                      value.status.step === GAMES_CONST.SHOW
                    ) {
                      return (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                          <Card>
                            <CardSVGContainer>
                              <Box
                                dangerouslySetInnerHTML={{
                                  __html: DICTIONARY_ICON,
                                }}
                              />
                            </CardSVGContainer>
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                              >
                                {value.name}
                              </Typography>
                              <Typography>
                                Created:{" "}
                                <b>{this.computeCreatedAt(value.createdAt)}</b>
                              </Typography>
                              <Typography>
                                Players:{" "}
                                <b>
                                  {value.players &&
                                    Object.keys(value.players).length}
                                </b>
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <BlankLink
                                to={`${this.props.match.path}/${value.key}`}
                              >
                                <MyButton size="small" color="primary">
                                  Join
                                </MyButton>
                              </BlankLink>
                            </CardActions>
                          </Card>
                        </Grid>
                      );
                    } else {
                      return "";
                    }
                  })}
              </Grid>
              <Grid
                style={{ marginTop: "30px" }}
                container
                spacing={2}
                justify="center"
              >
                <Grid item>
                  {!this.state.games && (
                    <Box>
                      <CircularProgress />
                    </Box>
                  )}
                  {this.state.games && this.state.games.length === 0 && (
                    <Box>
                      <Typography
                        variant="h6"
                        align="left"
                        color="textSecondary"
                      >
                        No game available. Create a new one!
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Container>
          </Route>
        </Switch>
      </div>
    );
  }

  computeCreatedAt = (timestamp) => {
    const diff = this.state.now - timestamp;
    return `${Math.round(1 + diff / 60000)} minute${
      diff > 60000 ? "s" : ""
    } ago`;
  };

  createRoom = () => {
    const room = prompt("Please enter the room name", "New Dictionary Game");

    // Create a new game room in Firebase
    const gameRef = ref.child(PATH_CONST.DICTIONARIES);
    const newGame = gameRef.push({
      name: room || "Dictionary",
      status: {
        state: "lobby",
        round: 0,
        step: "",
      },
      players: {},
      createdAt: new Date().getTime(),
    });

    const name = prompt("Please enter your name", "Harry Potter");

    // Add the room owner as player
    const playersRef = ref.child(
      `${PATH_CONST.DICTIONARIES}/${newGame.key}/${PATH_CONST.PLAYERS}`
    );
    const owner = playersRef.push({
      name: name || "Creator (Tyler)",
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
