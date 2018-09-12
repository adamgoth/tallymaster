import React from "react";
import { connect } from "react-redux";
import { fetchHistory } from "../store/actions";

class Home extends React.Component {
  componentDidMount() {
    this.props.fetchHistory();
  }

  render() {
    console.log(this.props);
    return <div>main</div>;
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
