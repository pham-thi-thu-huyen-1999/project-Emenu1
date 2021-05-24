import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { name } from "./reducers";
import * as action from "./actions";
import { withNamespaces } from "react-i18next";
import * as CONSTS from "./constants";
import { Main } from "./components";
import "./myStyles.scss";
import { withRouter } from "react-router-dom";
import * as actionPartner from "../SettingScreen/components/General/actions";
import { name as namePartner } from "../SettingScreen/components/General/reducers";

class FoodManagement extends Component {
  componentDidMount() {
    let page = CONSTS.PAGE;
    let limit = CONSTS.LIMIT;
    this.props.actions.getItemListBySearchAdvanced({ page, limit });
    this.props.actions.getUnitItemList();
    this.props.actions.getCategoryItemList();
    this.props.actions.getInfoVatSetting();
    this.props.actions.getPartnerSetting();
  }
  render() {
    const { ...rest } = this.props;
    return <Main {...rest} />;
  }
}
const mapStateToProps = state => {
  return {
    ...state[name],
    ...state[namePartner]
  };
};
const mapDispatchToProps = dispatch => {
  const actions = {
    ...action,
    ...actionPartner
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default compose(withRouter, connect(
  mapStateToProps,
  mapDispatchToProps
)) (withNamespaces()(FoodManagement));
