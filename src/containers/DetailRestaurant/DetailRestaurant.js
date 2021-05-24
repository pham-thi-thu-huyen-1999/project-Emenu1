import React, { Component } from "react";
import "./style.scss";
import { withRouter } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux"
import { bindActionCreators, compose } from "redux";
import { Main } from "./components";
import { name } from "./reducers";
import * as action from "./actions";

class DetailRestaurantScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comboItemList: [],
      categoryItemList: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.comboItemList !== nextProps.comboItemList || prevState.categoryItemList !== nextProps.categoryItemList) {
      return {
        comboItemList: nextProps.comboItemList,
        categoryItemList: nextProps.categoryItemList
      };
    }
    return null;
  }

  componentDidMount() {
    this.props.actions.getInfoPartner(this.props.history.location.search);
    // this.props.actions.getComboItemList(this.props.history.location.search);
    this.props.actions.getCategoryItemList(this.props.history.location.search);
    this.props.actions.getPartnerSetting(this.props.history.location.search);
  }


  render() {
    const {
      ...rest
    } = this.props;
    return (
      <Main comboItemList={this.state.comboItemList} categoryItemList={this.state.categoryItemList}
        {
        ...rest
        } />
    )
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
export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(DetailRestaurantScreen));
