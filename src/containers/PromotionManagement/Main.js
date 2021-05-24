import React, { Component } from "react";
import { bindActionCreators } from "redux";

import { connect } from "react-redux";
import { name } from "./reducers";
import * as action from "./actions";
import PromotionScreen from "./components/PromotionScreen";
class Main extends Component {
  componentDidMount() {
    this.props.actions.getPromotionList();
  }

  render() {
    const { ...rest } = this.props;
    return <PromotionScreen {...rest} />;
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[name],
  };
};
const mapDispatchToProps = (dispatch) => {
  const actions = {
    ...action,
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default connect(mapStateToProps, mapDispatchToProps)(Main);
