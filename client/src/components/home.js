import React from "react";
import { connect } from "react-redux";
import { fetchHistory } from "../store/actions";
import { dig } from "../util/helpers";

class Home extends React.Component {
  componentDidMount() {
    this.props.fetchHistory();
  }

  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        {dig(this.props, "history", "matches", "length") > 0 && (
          <div>
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
