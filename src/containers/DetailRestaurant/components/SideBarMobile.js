import React, { Component } from "react";
import * as CONSTS from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import ComboList from "./ComboList";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import * as action from "../actions";
import { name } from "../reducers";

class SideBarMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.id,
    };
  }

  onClickSelected = (id, name, comboId) => {
    this.props.onSearch("", name, comboId);
    this.props.onChangeSelectedCombo(id);
    this.setState({
      selected: id
    })
  }

  render() {
    const { t, className, infoPartner, ...rest } = this.props;

    return (
      <aside className={`side-bar ${className}`}>
        <div className="side-bar__title">
          <div className="logo">
            <img src={require("./../../../images/ohazo_logo.png")} alt="" />
          </div>
          <div className="partner-name">
            {infoPartner ? infoPartner.name : ""}
        </div>
          <div className="close" onClick={this.props.onShowSideBar}
            onClick={this.props.hide}
          >
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <div className="side-bar__combo combo-item-side-bar">
          <ComboList
            comboList={this.props.comboItemList}
            innerClass="e-m-top-10 e-m-bottom-10"
            onClick={this.onClickSelected}
            id={this.state.selected}
            vertical={true}
            styleSideBar="side-bar-mobile"
          />
        </div>
      </aside>
    );
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(SideBarMobile));
