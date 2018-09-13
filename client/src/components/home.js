import React from "react";
import { connect } from "react-redux";
import { fetchHistory } from "../store/actions";
import { dig } from "../util/helpers";

class Home extends React.Component {
  componentDidMount() {
    this.props.fetchHistory();
  }

  render() {
    return (
      <React.Fragment>
        {dig(this.props, "history", "tallies", "length") > 0 && (
          <div className="Tallies">
            <table>
              <tbody>
                <tr>
                  <th>Guardian</th>
                  <th>Wins</th>
                  <th>Games</th>
                </tr>
                {this.props.history.tallies
                  .sort((a, b) => (a.score < b.score ? 1 : -1))
                  .map(user => (
                    <tr key={user.user}>
                      <td>{user.user}</td>
                      <td>{user.data.wins}</td>
                      <td>{user.data.played}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {dig(this.props, "history", "lastUpdated") && (
              <p>{`Last updated: ${new Date(
                this.props.history.lastUpdated
              )}`}</p>
            )}
          </div>
        )}
        {/* {dig(this.props, "history", "matches", "length") > 0 && (
          <div className="MatchHistory">
            {this.props.history.matches.map(match => (
              <div key={match.id}>
                <p>{match.id}</p>
                <p>{match.date}</p>
                {Object.keys(match.results).map(result => (
                  <p key={Math.random()}>{`${result}: ${
                    match.results[result]
                  }`}</p>
                ))}
              </div>
            ))}
          </div>
        )} */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    history: state.history
  };
}

export default connect(
  mapStateToProps,
  { fetchHistory }
)(Home);
