import React from "react";
import "./styles.scss";
import { Main } from "./components";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { name } from "./reducers";
import * as action from "./actions";
import { withNamespaces } from "react-i18next";
import { LIMIT_COMBO_ITEM } from "../../consts/settings/dish/dish";
import { withRouter } from "react-router-dom";
import * as actionPartner from "../SettingScreen/components/General/actions";
import { name as namePartner } from "../SettingScreen/components/General/reducers";
class DishManagement extends React.Component {

  componentDidMount() {
    this.props.actions.getPartnerSetting();
    this.props.actions.getComboList({ limit: LIMIT_COMBO_ITEM, page: this.props.page || 1 });
  }
  render() {
    const {
      ...rest
    } = this.props;
    return (<Main {
      ...rest
    }
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

var mapDispatchToProp = dispatch => {
  const actions = {
    ...action,
    ...actionPartner
  }
  return {
    actions: bindActionCreators(actions, dispatch)
  }

}
export default compose(withRouter, connect(mapStateToProps, mapDispatchToProp))(withNamespaces()(DishManagement))
