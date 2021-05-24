import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";

import { name } from "./reducers";
import * as action from "./actions";

import { Main } from "./components";
import { withRouter } from "react-router-dom";
import { withNamespaces } from "react-i18next";

class FoodCategoryManagement extends Component {
  componentDidMount() {
    this.props.actions.getCategoryItemList();
  }
  render() {
    const { ...rest } = this.props;
    return (
      <Main {...rest} />
    );
  }
}
const mapStateToProps = state => {
  return {
    ...state[name]
  };
};
const mapDispatchToProps = dispatch => {
  const actions = {
    ...action
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default compose(withRouter, connect(
  mapStateToProps,
  mapDispatchToProps
))(withNamespaces()(FoodCategoryManagement));
