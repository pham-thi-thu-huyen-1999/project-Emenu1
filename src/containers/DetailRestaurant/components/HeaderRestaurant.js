import React, { Component } from "react";
import ComboList from "./ComboList";
import * as CONSTS from "./../constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars
} from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import * as action from "../actions";
import { name } from "../reducers";
import SideBarMobile from "./SideBarMobile"
class HeaderRestaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
  }

  onClickSelected = (id, name, comboId) => {
    this.props.onSearch("", name, comboId);
    this.setState({
      selected: id
    })
  }

  onChangeSelectedCombo = (selectedCombo) => {
    this.setState({
      selected: selectedCombo
    })
  }

  onClick = (id, name) => {
    const { infoPartnerSetting } = this.props;
    if (infoPartnerSetting.is_combo === true) {
      this.props.onSearch(name, "", "");
    } else {
      this.props.onSearchItem(name);
    }
    this.setState({
      showSelectedCategory: false,
      categoryName: name,
      id,
      status: true,
    })
  }

  render() {
    const { t, infoPartner, showSideBar, infoPartnerSetting, ...rest } = this.props;
    const { id } = this.state;
    return (
      <aside className="header-res">
        <div className="header-res__contain">
          <div className="header-res__logo">
            <img src={require("./../../../images/logo-omenu.png")} alt="" />
          </div>
          <div className="header-res__partner">
            <div className="partner">
              <div className="partner__image">
                <img src={infoPartner ? infoPartner.logo : /* require("./../../../images/lotte_logo.png")*/ ""} alt="***Chua co hinh anh logo" />
                <span className="partner__name">
                  {infoPartner ? infoPartner.name : ""}
                </span>
              </div>
              <span className="partner__name--instead">
                {infoPartner ? infoPartner.name : ""}
              </span>
            </div>
          </div>
          <div className="header-res__bar" onClick={this.props.onShowSideBar}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
        {infoPartnerSetting.is_combo ?
          <div className="header-res__combo">
            <ComboList
              comboList={this.props.comboItemList}
              innerClass="e-m-left-10 e-m-right-10"
              onClick={(id, name, comboId) => this.onClickSelected(id, name, comboId)}
              id={this.state.selected}
            />
          </div> :
          <div className="header-res__combo header-res-catogory">
            <ComboList
              comboList={this.props.categoryItemList}
              innerClass="e-m-left-10 e-m-right-10"
              onClick={(id, name, comboId) => this.onClick(id, name, comboId)}
              id={id}
            />
          </div>}
        {showSideBar && infoPartnerSetting.is_combo === true ? (
          <SideBarMobile
            onSearch={this.props.onSearch}
            onChangeSelectedCombo={this.onChangeSelectedCombo}
            hide={
              () => { this.props.onHiddenSideBar() }
            }
            className="display-none-side-bar"
            id={this.state.selected}
          />
        ) : null}
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
)(withNamespaces()(HeaderRestaurant));
