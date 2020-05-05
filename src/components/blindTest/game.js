import { withRouter } from "react-router-dom";
import React from "react";

class BlindTestGame extends React.Component {
  render() {
    return <h3>Game: {this.props.match.params.gameId}</h3>;
  }
}

export default withRouter(BlindTestGame);
