import React, { Component } from "react";
import "./AreaManagement.scss";
import AreaForm from "./components/AreaForm";
import { withRouter } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import * as actions from "../actions";
import { AreaReducerName } from "../reducers";
import Swal from "../../../utils/sweetalert2";
import { Button } from "../../../components/common";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AreaNew extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Navigate to list screen
   */
  navigateToList = () => {
    this.props.history.push("/area");
  };
  /**
   * On create area
   */
  onCreateArea = (params) => {
    this.props.actions.createArea({
      params,
      onSuccess: this.onCreateSuccess,
      onFailure: this.onCreateFail,
    });
  };

  componentDidMount() {
    this.props.actions.getListArea();
  }

  /**
   * On create success
   */
  onCreateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: this.props.t("area_management:area_create_success"),
      showConfirmButton: true,
    }).then(async (result) => {
      this.navigateToList();
    });
  };

  /**
   * On create fail
   */
  onCreateFail = () => {
    Swal.fire({
      icon: "error",
      title: this.props.t("area_management:area_create_fail"),
      showConfirmButton: true,
    });
  };

  render() {
    // Normalize translation
    const { ...rest } = this.props
    const trans = this.props.t;

    return (
      <main id="site-main" className="nofooter">
        <div className="area-management e-main-content center">
          <div className="area-management-wrapper form-size">
            <div className="area-management-title center">
              <div className="btn-back">
                <Button
                  onClick={this.navigateToList.bind(this)}
                  className="s3"
                > <FontAwesomeIcon icon={faLongArrowAltLeft} />
                  <span className="e-m-left-5">{trans("textCommon.back")}</span>
                </Button>
              </div>
              <span className="title-area">{trans("area_management:area_new_title")}</span>
            </div>
            <AreaForm
              isEdit={false}
              onCreate={(params) => this.onCreateArea(params)}
              trans={trans}
              {...rest}
            />
          </div>
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[AreaReducerName],
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(AreaNew));
