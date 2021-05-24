import React, { Component } from "react";
import Styles from "../../../scss/TableList.module.scss";
import * as actions from "../../../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { TableListReducerName } from "../../../reducers";
import TABLE_CONST from "../../TableContants";
import IconSource from "../TableFeatureIcons";
// import Swal from "../../../../../utils/sweetalert2";
import CombineTableInfoModal from "./CombineTableInfoModal";

class AvailableFeatureModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverFeature: null,
      isShowOrderModal: false,
      isShowButtonFeature: true,
      isShowConbineInfoModal: false
    };
  }

  /**
   * Close modal
   */
  closeModal = () => {
    this.props.tableActions.deselectQRCodeTable();
  };

  /**
   * On select table feature
   */
  onSelectTableFeature = (feature) => {
    switch (feature) {
      case "SHOW_QR_CODE":
        this.props.showQRCode()
        this.props.onClose()
        break;
      case "COMBINE_TABLE_INFO":
      case "SEPERATE_TABLE":
        this.setState({
          isShowConbineInfoModal: true,
          isShowButtonFeature: false
        })
        break;
      default:
        break;
    }
  };

  onMouseEnterFeature = (feature) => {
    this.setState({
      hoverFeature: feature,
    });
  };

  onMouseLeaveFeature = () => {
    this.setState({
      hoverFeature: null,
    });
  };

  /**
   * Render feature buttons
   */
  renderFeatureButtons = () => {
    return TABLE_CONST.AVAILABLE_TABLE_FEATURE_KEY.map((feature, index) => {
      const Icon = IconSource[feature];
      return (
        <div
          key={index}
          className={Styles["feature-button"]}
          onMouseLeave={this.onMouseLeaveFeature.bind(this)}
          onMouseEnter={this.onMouseEnterFeature.bind(this, feature)}
          onClick={this.onSelectTableFeature.bind(this, feature)}
          style={{ margin: "15px 0" }}
        >
          <span>{this.props.trans(`table_list:table_feature.${feature}`)}</span>
          <div className={Styles["feature-icon"]}>
            <Icon color={this.state.hoverFeature === feature ? "#eee" : null} />
          </div>
        </div>
      );
    });
  };

  render() {
    const { trans } = this.props;
    return (
      <div
        className={`popup mfp-container mfp-s-ready mfp-inline-holder ${Styles["modal-container"]}`}
      >
        {this.state.isShowConbineInfoModal ? (
          <CombineTableInfoModal
            trans={trans}
            closeModal={this.closeModal.bind(this)}
          />
        ) : null}
        {this.state.isShowButtonFeature ? (
          <div
            className={`mfp-content ${Styles["modal-wrapper"]}`}
            style={{ width: "500px", height: "400px" }}
          >
            <div
              className={Styles["button-close"]}
              onClick={this.closeModal.bind(this)}
            ></div>
            <div className={Styles["modal-header-title"]}>
              <span>
                {this.props.selectedQRCodeTable
                  ? this.props.selectedQRCodeTable.name
                  : ""}
              </span>
            </div>
            <div
              className={`${Styles["modal-content-wrapper"]} ${Styles["modal-features"]}`}
              style={{
                padding: 0,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.renderFeatureButtons()}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[TableListReducerName],
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    tableActions: bindActionCreators({ ...actions }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailableFeatureModal);
