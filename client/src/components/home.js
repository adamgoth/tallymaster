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
        <h1 className="Tallymaster">Tallymaster!</h1>
        {dig(this.props, "history", "tallies", "length") > 0 && (
          <div className="Tallies">
            <table>
              <tbody>
                <tr>
                  <th className="Tallies-headerColumn">Guardian</th>
                  <th className="Tallies-headerColumn">Wins</th>
                  <th className="Tallies-headerColumn">Games</th>
                </tr>
                {this.props.history.tallies
                  .sort((a, b) => (a.score < b.score ? 1 : -1))
                  .map(user => (
                    <tr className="Tallies-dataRow" key={user.user}>
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
              ).toLocaleString()}`}</p>
            )}
          </div>
        )}
        {dig(this.props, "history", "matches", "length") > 0 && (
          <div className="MatchHistory">
            <table>
              <tbody>
                <tr>
                  <th className="Tallies-headerColumn">Match ID</th>
                  <th className="Tallies-headerColumn">Date</th>
                  <th className="Tallies-headerColumn">Results</th>
                </tr>
                {this.props.history.matches
                  .sort((a, b) => (a.date < b.date ? 1 : -1))
                  .map(match => (
                    <tr className="Tallies-dataRow" key={match.id}>
                      <td>{match.id}</td>
                      <td>{new Date(match.date).toLocaleString()}</td>
                      <td className="MatchHistory-scores">
                        {Object.keys(match.results)
                          .sort(
                            (a, b) =>
                              match.results[a] < match.results[b] ? 1 : -1
                          )
                          .map(result => (
                            <span
                              className="MatchHistory-score"
                              key={Math.random()}
                            >
                              {`${result}: ${match.results[result]}`}
                              <br />
                            </span>
                          ))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
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
