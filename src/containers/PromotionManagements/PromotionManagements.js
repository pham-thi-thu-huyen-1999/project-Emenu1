import React from "react";
import { Main } from "./components";
import "./styles.scss";
import { withNamespaces } from "react-i18next";
import * as action from "./actions";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import { name } from "./reducers";
import { LIMIT_COMBO, LIMIT_ITEM, LIMIT_PROMOTION } from "../../consts/settings/promotion"
import { withRouter } from "react-router-dom";
import * as actionPartner from "../SettingScreen/components/General/actions";
import { name as namePartner } from "../SettingScreen/components/General/reducers";
class PromotionManagements extends React.Component {
  componentDidMount() {
    this.props.actions.getListPromotion({ page: 1, limit: LIMIT_PROMOTION });
    this.props.actions.setPage(1);
    this.props.actions.getListPromotionDiscount();
    this.props.actions.getListItem({ limit: LIMIT_ITEM, page: 1 });
    this.props.actions.getListComboItem({ limit: LIMIT_COMBO, page: 1 });
    this.props.actions.getPartnerSetting();
  }
  render() {
    const { ...rest } = this.props
    return (
      <Main
        {...rest}
      />
    )
  }
}
var mapStateToProps = state => {
  return {
    ...state[name],
    ...state[namePartner]
  }
}
var mapDispatchToProps = dispatch => {
  const actions = { ...action, ...actionPartner }
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}
export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps)) (withNamespaces()(PromotionManagements));