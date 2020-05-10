import { withRouter } from "react-router-dom";
import React from "react";
import { ref } from "../../firebase/main";
import { PATH_CONST } from "../../constants/firebase";
import { MyButton } from "../styled/styled";
import TextField from "@material-ui/core/TextField";
import { GAMES_CONST, TRASH_CONSTS } from "../../constants/games";
import { shuffle } from "../../utils/utilities";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Container from "@material-ui/core/Container";
import { NAV_CONST } from "../../constants/nav";

const styles = {
  root: {
    padding: "0 30px",
  },
};

class DictionaryGame extends React.Component {
  state = {
    listeners: {},
    clientId: "",
    game: {
      players: {
        responses: [],
        votes: [],
      },
      status: {
        state: "",
        round: 0,
        step: "",
      },
    },
    response: "",
    vote: "",
  };

  componentDidMount() {
    this.setState((state) => {
      return { handler };
    });
    const handler = this.handleDisconnection;
    const self = this;

    window.addEventListener("beforeunload", function (event) {
      console.log(event);
      event.returnValue = "Hellooww";

      handler(self);
    });

    if (this.props.isOwner) {
      // Player already exist as owner
      this.setState((state) => {
        return { clientId: this.props.ownerId };
      });
    }

    // Set firebase listener to keep game updated
    const gameRef = ref.child(
      `${PATH_CONST.DICTIONARIES}/${this.props.match.params.gameId}`
    );

    gameRef
      .on("value", (snapshot) => {
        const game = snapshot.val();

        this.setState((state) => {
          return { game };
        });
      })
      .bind(this);

    // Keep listener in memory to remove it on unmount event
    this.setState((state) => {
      return {
        listeners: { ...state.listeners, gameRef: gameRef },
      };
    });
  }

  render() {
    let gameOwnerCTAS = "",
      game = "",
      playerList = "";

    if (
      this.props.isOwner &&
      this.state.game &&
      (this.state.game.status.state === GAMES_CONST.LOBBY ||
        this.state.game.status.step === GAMES_CONST.SHOW)
    ) {
      gameOwnerCTAS = (
        <MyButton onClick={this.nextRound}>
          {this.state.game.status.state === GAMES_CONST.LOBBY
            ? "Start"
            : "Next round"}
        </MyButton>
      );
    }

    if (
      this.state.game &&
      this.state.game.status &&
      (this.state.game.status.state === GAMES_CONST.LOBBY ||
        this.state.game.status.step === GAMES_CONST.SHOW)
    ) {
      const players = Object.keys(this.state.game.players)
        .map((key) => {
          return { ...this.state.game.players[key], key };
        })
        .sort((a, b) => b.points - a.points);

      playerList = (
        <div>
          <Typography variant="h4" align="left" color="textSecondary">
            Players
          </Typography>
          <Container maxWidth={"xs"}>
            <List>
              {players.map((player, index) => {
                return (
                  <ListItem key={index} alignItems="center">
                    <ListItemAvatar>
                      <Avatar alt={player.name}>
                        {player.name.substring(0, 1).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${player.name} ${
                        player.key === this.state.clientId ? "(me)" : ""
                      }`}
                    />
                    <ListItemSecondaryAction>
                      {player.points} Points
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Container>
        </div>
      );
    }

    if (
      this.state.clientId &&
      this.state.game.status &&
      this.state.game.status.step &&
      this.state.game.status.step === GAMES_CONST.CREATE &&
      this.state.game.players[this.state.clientId].responses &&
      this.state.game.players[this.state.clientId].responses[
        this.state.game.status.round
      ]
    ) {
      game = (
        <div>
          <h4>Round: {this.state.game.status.round}</h4>
          <h4>Word: {this.state.game.status.word.word}</h4>

          <p>
            Your response:
            <b>
              {
                this.state.game.players[this.state.clientId].responses[
                  this.state.game.status.round
                ]
              }
            </b>
          </p>
        </div>
      );
    } else if (
      this.state.game &&
      this.state.game.status &&
      this.state.game.status.step === GAMES_CONST.VOTE
    ) {
      if (
        this.state.clientId &&
        this.state.game &&
        this.state.game.players[this.state.clientId].votes &&
        this.state.game.players[this.state.clientId].votes[
          this.state.game.status.round
        ]
      ) {
        game = (
          <div>
            <h4>Round: {this.state.game.status.round}</h4>
            <h4>Word: {this.state.game.status.word.word}</h4>

            <p>Voted</p>
          </div>
        );
      } else {
        game = (
          <div>
            <h4>Round: {this.state.game.status.round}</h4>
            <h4>Word: {this.state.game.status.word.word}</h4>

            <p>Choose your winner</p>
            <p>Time left: {this.state.counter}</p>

            <RadioGroup
              aria-label="Vote"
              name="vote"
              value={this.state.vote}
              onChange={this.voteChange}
            >
              {this.state.currentRoundResponse &&
                this.state.currentRoundResponse.map((response, index) => {
                  if (response.key === this.state.clientId) return "";
                  return (
                    <FormControlLabel
                      style={{ margin: "10px 0" }}
                      key={index}
                      value={response.key}
                      control={<Radio />}
                      label={response.response}
                    />
                  );
                })}
            </RadioGroup>
            <MyButton onClick={this.sendVote}>Vote</MyButton>
          </div>
        );
      }
    } else if (
      this.state.game &&
      this.state.game.status &&
      this.state.game.status.step === GAMES_CONST.SHOW
    ) {
      const votesByCreator = Object.keys(this.state.game.players).reduce(
        (obj, key) => {
          if (
            this.state.game.players[key].votes &&
            this.state.game.players[key] &&
            obj[
              this.state.game.players[key].votes[this.state.game.status.round]
            ]
          ) {
            obj[
              this.state.game.players[key].votes[this.state.game.status.round]
            ].push(key);
          } else if (
            this.state.game.players[key].votes &&
            this.state.game.players[key]
          ) {
            obj[
              this.state.game.players[key].votes[this.state.game.status.round]
            ] = [key];
          }
          return obj;
        },
        {}
      );

      game = (
        <Container maxWidth={"md"}>
          <Typography variant="h4" align="left">
            Round: <b>{this.state.game.status.round}</b>
          </Typography>
          <Typography variant="h5" align="left">
            Word: <b>{this.state.game.status.word.word}</b>
          </Typography>

          <Typography variant={"subtitle1"} color="textSecondary">
            Round result
          </Typography>

          <List>
            {this.state.currentRoundResponse &&
              this.state.currentRoundResponse.map((response, index) => {
                return (
                  <ListItem key={index} alignItems="center">
                    <ListItemText
                      primary={response.response}
                      secondary={
                        response.isGoodAnswer
                          ? " CORRECT"
                          : ` by ${this.state.game.players[response.key].name}`
                      }
                    />
                    <ListItemSecondaryAction
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      {votesByCreator &&
                        votesByCreator[response.key] &&
                        votesByCreator[response.key].map((key, index) => {
                          return (
                            <ListItemAvatar key={index}>
                              <Avatar alt={this.state.game.players[key].name}>
                                {this.state.game.players[key].name
                                  .substring(0, 1)
                                  .toUpperCase()}
                              </Avatar>
                            </ListItemAvatar>
                          );
                        })}
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
          </List>
        </Container>
      );
    } else if (
      this.state.game &&
      this.state.game.status &&
      this.state.game.status.state === "started" &&
      this.state.game.status.word
    ) {
      game = (
        <Container maxWidth={"md"}>
          <Typography variant="h4" align="left">
            Round: <b>{this.state.game.status.round}</b>
          </Typography>
          <Typography variant="h5" align="left">
            Word: <b>{this.state.game.status.word.word}</b>
          </Typography>

          <Typography variant={"subtitle1"} color="textSecondary">
            Find a definition
          </Typography>
          <Typography variant={"subtitle1"} color="textSecondary">
            Time left: <b>{this.state.counter}</b>
          </Typography>
          <TextField
            style={{ margin: "20px 0" }}
            label={"Definition"}
            fullWidth={true}
            value={this.state.response}
            onChange={this.updateResponse}
            multiline={true}
          />
          <MyButton onClick={this.sendResponse}>Submit</MyButton>
        </Container>
      );
    }

    return (
      <div className={this.props.classes.root}>
        {playerList}

        {game}

        {gameOwnerCTAS}
      </div>
    );
  }

  nextRound = () => {
    this.startRound(this.state.game.status.round + 1);
  };

  startRound = async (index) => {
    const snap = (
      await ref
        .child(`${PATH_CONST.DICTIONARY_DATA}/${PATH_CONST.WORDS}`)
        .orderByChild("index")
        .limitToFirst(1)
        .startAt(Math.random())
        .once("value")
    ).val();

    const word = {
      ...snap[Object.keys(snap)[0]],
      key: Object.keys(snap)[0],
    };

    const gameStatusRef = ref.child(
      `${PATH_CONST.DICTIONARIES}/${this.props.match.params.gameId}/${PATH_CONST.STATUS}`
    );

    await gameStatusRef.set({
      state: "started",
      round: index,
      step: GAMES_CONST.CREATE,
      word,
    });
  };

  updateResponse = (e) => {
    const response = e.target.value;

    this.setState((state) => {
      return { response };
    });
  };

  voteChange = (e) => {
    const vote = e.target.value;

    this.setState((state) => {
      return { vote };
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.state.game || !this.state.game.status) {
      // Game no longer exist
      this.props.history.push(`${NAV_CONST.DICTIONARY}`);
      return;
    }

    if (
      !this.state.clientId &&
      this.state.game.status.state &&
      (this.state.game.status.step === GAMES_CONST.SHOW ||
        this.state.game.status.state === GAMES_CONST.LOBBY ||
        this.state.game.status.step === GAMES_CONST.CREATE)
    ) {
      const name = prompt("Please enter your name", "Harry Potter");

      // Create a player
      const playerRef = ref.child(
        `${PATH_CONST.DICTIONARIES}/${this.props.match.params.gameId}/${PATH_CONST.PLAYERS}`
      );
      const client = playerRef.push({
        name: name || "Anonymous",
        responses: [],
        points: 0,
      });

      this.setState((state) => {
        return { clientId: client.key };
      });
    }

    if (
      this.state.game.status.round === prevState.game.status.round + 1 ||
      (this.state.game.status.round === 1 && !prevState.game.status.round)
    ) {
      // Start timer
      this.startTimer(120);
    }

    if (
      this.state.clientId &&
      this.state.game.status.word &&
      this.state.game.status.state === GAMES_CONST.STARTED &&
      this.state.game.players[this.state.clientId] &&
      this.state.game.status.round &&
      this.state.game.players[this.state.clientId].responses &&
      this.state.game.players[this.state.clientId].responses[
        this.state.game.status.round
      ] &&
      this.state.game.status.step === GAMES_CONST.CREATE &&
      prevState.game.status.step === GAMES_CONST.CREATE
    ) {
      let allResponded = true;
      Object.keys(this.state.game.players).forEach((playerId) => {
        if (
          !this.state.game.players[playerId].responses ||
          !this.state.game.players[playerId].responses[
            this.state.game.status.round
          ]
        ) {
          allResponded = false;
        }
      });

      if (allResponded) {
        const stateRef = ref.child(
          `${PATH_CONST.DICTIONARIES}/${this.props.match.params.gameId}/${PATH_CONST.STATUS}/${PATH_CONST.STEP}`
        );

        stateRef.set(GAMES_CONST.VOTE);

        const choices = Object.keys(this.state.game.players).map(
          (key, index) => {
            return {
              key,
              response: this.state.game.players[key].responses[
                this.state.game.status.round
              ],
            };
          }
        );

        choices.push({
          key: "response",
          isGoodAnswer: true,
          response: this.state.game.status.word.definition,
        });

        this.setState((state) => {
          return {
            currentRoundResponse: shuffle(choices),
          };
        });

        this.startTimer(120);
      }
    }

    if (
      this.state.clientId &&
      this.state.game.players[this.state.clientId] &&
      this.state.game.players[this.state.clientId].votes &&
      this.state.game.players[this.state.clientId].votes[
        this.state.game.status.round
      ] &&
      this.state.game.status.step === GAMES_CONST.VOTE &&
      prevState.game.status.step === GAMES_CONST.VOTE
    ) {
      let allVoted = true;
      Object.keys(this.state.game.players).forEach((playerId) => {
        if (
          !this.state.game.players[playerId].votes ||
          !this.state.game.players[playerId].votes[this.state.game.status.round]
        ) {
          allVoted = false;
        }
      });

      if (allVoted) {
        const stateRef = ref.child(
          `${PATH_CONST.DICTIONARIES}/${this.props.match.params.gameId}/${PATH_CONST.STATUS}/${PATH_CONST.STEP}`
        );

        stateRef.set(GAMES_CONST.SHOW);
      }
    }
  }

  startTimer = (startTime) => {
    // Clear old timer if exist
    const oldTimer = this.state.timer;
    if (oldTimer) {
      clearInterval(oldTimer);
    }

    this.setState((state) => {
      return { counter: startTime };
    });

    setTimeout(() => {
      const timer = setInterval(() => {
        let counter = this.state.counter;

        if (counter === 0) {
          if (this.state.game.status.step === GAMES_CONST.CREATE) {
            this.sendResponse();
          } else if (this.state.game.status.step === GAMES_CONST.VOTE) {
            this.sendVote();
          } else if (this.state.game.status.step === GAMES_CONST.SHOW) {
          }

          return;
        }

        this.setState((state) => {
          return { counter: counter - 1 };
        });
      }, 1000);

      this.setState((state) => {
        return { timer };
      });
    }, 500);
  };

  sendResponse = () => {
    const responseRef = ref.child(
      `${PATH_CONST.DICTIONARIES}/${this.props.match.params.gameId}/${PATH_CONST.PLAYERS}/${this.state.clientId}/${PATH_CONST.RESPONSES}/${this.state.game.status.round}`
    );

    responseRef.set(
      this.state.response !== "" ? this.state.response : TRASH_CONSTS[0]
    );

    clearInterval(this.state.timer);

    this.setState((state) => {
      return { response: "" };
    });
  };

  sendVote = () => {
    const responseObject = this.state.vote
        ? this.state.currentRoundResponse.find(
            (response) => response.key === this.state.vote
          )
        : this.state.currentRoundResponse.find(
            (response) =>
              !response.isGoodAnswer && response.key !== this.state.clientId
          ),
      bonus = responseObject.isGoodAnswer ? 3 : 1,
      player = responseObject.isGoodAnswer
        ? this.state.clientId
        : responseObject.key;

    const pointsRef = ref.child(
      `${PATH_CONST.DICTIONARIES}/${this.props.match.params.gameId}/${PATH_CONST.PLAYERS}/${player}/${PATH_CONST.POINTS}`
    );

    pointsRef.set(this.state.game.players[player].points + bonus);

    const voteRef = ref.child(
      `${PATH_CONST.DICTIONARIES}/${this.props.match.params.gameId}/${PATH_CONST.PLAYERS}/${this.state.clientId}/${PATH_CONST.VOTES}/${this.state.game.status.round}`
    );

    voteRef.set(
      responseObject.key === this.state.clientId
        ? "CORRECT"
        : responseObject.key
    );

    clearInterval(this.state.timer);

    this.setState((state) => {
      return { vote: "" };
    });
  };

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  componentWillUnmount() {
    this.handleDisconnection(this);
  }

  handleDisconnection = (self) => {
    if (self.state.handler) {
      window.removeEventListener("beforeunload", self.state.handler);
    }

    if (
      self.state.game.players &&
      Object.keys(self.state.game.players).length === 1
    ) {
      ref
        .child(`${PATH_CONST.DICTIONARIES}/${self.props.match.params.gameId}`)
        .remove()
        .then(() => console.log("Game removed success"));
    } else {
      // TODO: Check for owner to transfer ownership

      ref
        .child(
          `${PATH_CONST.DICTIONARIES}/${self.props.match.params.gameId}/${PATH_CONST.PLAYERS}/${self.state.clientId}`
        )
        .remove()
        .then(() => console.log("Player removed success"));
    }

    Object.keys(self.state.listeners).forEach((key) => {
      self.state.listeners[key].off();
    });
  };
}

export default withRouter(withStyles(styles)(DictionaryGame));
