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

class AreaEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaInfo: {},
    };
  }

  componentDidMount() {
    const areaId = this.props.match.params.areaId || null;
    this.props.actions.getAreaInfo(areaId);
  }

  /**
   * Navigate to list screen
   */
  navigateToList = () => {
    this.props.history.push("/area");
  };
  /**
   * On edit area
   */
  onEditArea = (params) => {
    this.props.actions.editArea({
      params,
      onSuccess: this.onEditSuccess,
      onFailure: this.onEditFail,
      areaId: this.props.match.params.areaId || null,
    });
  };

  /**
   * On edit success
   */
  onEditSuccess = () => {
    Swal.fire({
      icon: "success",
      title: this.props.t("area_management:area_update_success"),
      showConfirmButton: true,
    }).then(async (result) => {
      this.navigateToList();
    });
  };

  /**
   * On edit fail
   */
  onEditFail = () => {
    Swal.fire({
      icon: "error",
      title: this.props.t("area_management:area_update_fail"),
      showConfirmButton: true,
    });
  };

  render() {
    // Normalize translation
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
              <span className="title-area">{trans("area_management:area_edit_title")}</span>
            </div>
            <AreaForm
              areaInfo={this.props.areaInfo}
              isEdit={true}
              onEdit={(params) => this.onEditArea(params)}
              trans={trans}
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
)(withNamespaces()(AreaEdit));
