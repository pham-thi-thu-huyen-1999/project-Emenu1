import React, { Component } from "react";
import Styles from "./../scss/TableList.module.scss";
import TableGridContainer from "./components/TableGridContainer";
import { withNamespaces } from "react-i18next";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import * as actions from "../actions";
import { TableListReducerName } from "../reducers";
import * as areaActions from "../../AreaManagement/actions";
import { AreaReducerName } from "../../AreaManagement/reducers";
import _, { result } from "lodash";
import AreaListDetailModal from "./components/AreaListDetailModal";
import CombineTablePanel from "./components/CombineTablePanel";
import QRCodeModal from "./components/TableFeature/QRCodeModal";
import TableFeatureModal from "./components/TableFeature/TableFeatureModal";
import AvailableFeatureModal from "./components/TableFeature/AvailableFeatureModal";
import { getAccountInfoStaff } from "../../../api/account";
import { doTableStatistics } from "../../../api/table";
import common from "../../../utils/common";
import { get, save } from "../../../services/localStorage";
import { faCompress, faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AREA_CONST from "../../AreaManagement/pages/AreaConstants";
import moment from "moment";
import { TEMP_CONTRACT, OmenuUrl, OmenuPhoneNumber, OmenuEmail, OmenuUrlName } from "../../../consts/settings/partnerContract";
import Swal from "../../../utils/sweetalert2";
import defaultResImg from "../../../images/logo-omenu.png";
import emenuWelcome from "../../../images/emenu-welcome.png";
import CallStaffTableList from "./components/CallStaffTableList"

class TableList extends Component {
  isSupportModalOpenning = false
  countDidUpdate = 0
  constructor(props) {
    super(props);
    this.state = {
      areaRatios: AREA_CONST.AREA_RATIOS,
      isShowScrollLeft: false,
      isShowScrollRight: false,
      isShowScrollButton: false,
      isShowAreaModal: false,
      newAreaWidth: 0,
      newAreaHeight: 0,
      selectedArea: null,
      isFullScreen: false,
      isCombineTableModeOn: false,
      isShowQRCodeModal: false,
      isShowEmptyFeatureModal: false,
      isShowFeatureModal: false,
      staffAreas: [],
      partnerId: null,
      isShowSupportModal: false
    };
    this.mainContent = React.createRef();
    this.tablistWrapper = React.createRef();
    this.tablelistHeader = React.createRef();
  }

  async componentDidMount() {
    await this.getStaffInfo();
    await doTableStatistics({ partner_id: this.state.partnerId });
    this.props.areaActions.getListAreaByPartnerId({
      partner_id: this.state.partnerId,
    });
    await this.props.tableActions.getPartnerSetting({ categoryName: "", comboName: "" });
    await this.props.tableActions.getComboItemListOnly();
    const partner_Info = this.props.partner_Info;
    if (!partner_Info) {
      window.location = '/login';
    }
    this.setState({
      isShowSupportModal: partner_Info.contract_type_id === TEMP_CONTRACT || moment.utc(new Date()).isAfter(new Date(partner_Info.contract_end_time)) ? true : false
    })
    window.addEventListener("resize", this.onResize);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      listAreaByPartner,
      selectedQRCodeTable,
      selectedInUseTable,
      selectedArea
    } = this.props;
    if (
      prevProps.listAreaByPartner !== listAreaByPartner &&
      !_.isEmpty(listAreaByPartner)
    ) {
      const { staffAreas } = prevState;
      const targetAreaId =
        staffAreas && staffAreas.length > 0 ? staffAreas[0].area_id : null;
      let targetArea = listAreaByPartner.find(
        (area) => area.id === targetAreaId
      );
      if (selectedArea) {
        targetArea = selectedArea;
      } else {
        targetArea = listAreaByPartner[0];
      }
      this.selectArea(targetArea);
    }
    if (!this.state.isShowSupportModal) {
      if (prevProps.selectedQRCodeTable !== selectedQRCodeTable) {
        if (!_.isEmpty(selectedQRCodeTable)) {
          if (!selectedQRCodeTable.is_table_join) {
            this.setState({
              isShowQRCodeModal: true,
            });
          } else {
            this.setState({
              isShowEmptyFeatureModal: true,
            });
          }
        } else {
          this.setState({
            isShowEmptyFeatureModal: false,
          });
        }
      }

      if (prevProps.selectedInUseTable !== selectedInUseTable) {
        if (!_.isEmpty(selectedInUseTable)) {
          this.setState({
            isShowFeatureModal: true,
          });
        } else {
          this.setState({
            isShowFeatureModal: false,
          });
        }
      }
    }
    else if (this.state.isShowSupportModal && ((prevProps.selectedQRCodeTable !== null && prevProps.selectedQRCodeTable === selectedQRCodeTable) || (prevProps.selectedInUseTable !== null && prevProps.selectedInUseTable === selectedInUseTable))) {
      if (this.state === prevState) this.countDidUpdate += 1
      if (this.state.isShowAreaModal === prevState.isShowAreaModal && this.state.selectedArea === prevState.selectedArea && this.countDidUpdate === 1 && !this.isSupportModalOpenning) {
        this.showSupportModal();
        this.isSupportModalOpenning = true
      } else this.isSupportModalOpenning = false
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  /**
   * On resize
   */
  onResize = _.debounce(() => {
    this.setAreaWidth()
  }, 200)

  /**
   * Get staff info
   */
  getStaffInfo = async () => {
    try {
      let infoToken = common.decodeToken(get("accessToken"));
      const data = await getAccountInfoStaff({ id: infoToken.sub });
      this.setState({
        staffAreas: data.data.data ? data.data.data.UserAreas : [],
        partnerId: infoToken.partner_id,
      });
    } catch (error) { }
  };

  /**
   * Select area
   */
  selectArea = (area) => {
    if (this.state.selectedArea !== null && this.state.selectedArea !== area) {
      this.isSupportModalOpenning = true
      this.countDidUpdate = -1
    }
    this.setState(
      {
        selectedArea: area,
      },
      () => {
        this.setAreaWidth();
      }
    );
    this.props.tableActions.getListTable({ area_id: area.id });
    this.props.areaActions.selectArea({ area: area });
    save("area-id", area.id);
    if (this.state.isShowScrollButton) {
      this.setState({
        isShowScrollButton: false,
        isShowScrollLeft: false,
        isShowScrollRight: false,
      });
    }
    this.tablistWrapper.current.scrollLeft = 0;
  };

  /**
   * Set dynamic width area
   */
  setAreaWidth = () => {
    const newAreaHeight = this.tablistWrapper.current.clientHeight;
    const areaWidth =
      newAreaHeight *
      this.state.areaRatios[
      this.state.selectedArea ? this.state.selectedArea.ratio : 8
      ];
    if (this.tablelistHeader.current) {
      this.tablelistHeader.current.style.maxWidth = areaWidth + "px";
    }
    this.setState({
      newAreaWidth: areaWidth,
      newAreaHeight: newAreaHeight,
    });
    if (areaWidth > this.mainContent.current.clientWidth) {
      this.setState({
        isShowScrollButton: true,
        isShowScrollRight: true,
      });
    } else {
      this.setState({
        isShowScrollButton: false
      });
    }
  };

  /**
   * Scroll right
   */
  scrollRight = () => {
    this.tablistWrapper.current.scrollTo(
      this.tablistWrapper.current.scrollLeft + this.state.newAreaHeight,
      0
    );
    this.handleScroll(
      this.tablistWrapper.current.scrollLeft + this.state.newAreaHeight
    );
  };

  /**
   * Scroll left
   */
  scrollLeft = () => {
    this.tablistWrapper.current.scrollTo(
      this.tablistWrapper.current.scrollLeft - this.state.newAreaHeight,
      0
    );
    this.handleScroll(
      this.tablistWrapper.current.scrollLeft - this.state.newAreaHeight
    );
  };

  /**
   * Handle show hide navigate button when scroll
   */
  handleScroll = (scrollLeft) => {
    const { scrollWidth, clientWidth } = this.tablistWrapper.current;
    if (scrollLeft < scrollWidth - clientWidth) {
      this.setState({
        isShowScrollRight: true,
      });
    } else {
      this.setState({
        isShowScrollRight: false,
      });
    }
    if (scrollLeft > 0) {
      this.setState({
        isShowScrollLeft: true,
      });
    } else {
      this.setState({
        isShowScrollLeft: false,
      });
    }
  };

  /**
   * Render scroll left
   */
  renderScrollLeft = () => {
    return (
      <span
        className={`icon-hand-left ${Styles["icon-hand-custom"]} ${Styles["left"]}`}
        onClick={this.scrollLeft}
      >
        <span className="path1"></span>
        <span className="path2"></span>
      </span>
    );
  };

  /**
   * Render scroll right
   */
  renderScrollRight = () => {
    return (
      <span
        onClick={this.scrollRight}
        className={`icon-hand-right ${Styles["icon-hand-custom"]} ${Styles["right"]}`}
      >
        <span className="path1"></span>
        <span className="path2"></span>
      </span>
    );
  };

  /**
   * Toggle navigate button
   */
  toggleNavigateButtons = () => {
    this.setState({
      isShowScrollButton: !this.state.isShowScrollButton,
    });
    const {
      scrollWidth,
      scrollLeft,
      clientWidth,
    } = this.tablistWrapper.current;
    if (clientWidth < scrollWidth) {
      if (scrollLeft < scrollWidth - clientWidth) {
        this.setState({
          isShowScrollRight: true,
        });
      }
      if (scrollLeft > 0) {
        this.setState({
          isShowScrollLeft: true,
        });
      }
    }
  };

  /**
   * Show area modal selection
   */
  toggleAreaModalSelection = () => {
    this.setState({
      isShowAreaModal: !this.state.isShowAreaModal
    });
  };

  /**
   * Show support modal
   */
  showSupportModal = () => {
    return Swal.fire({
      showConfirmButton: true,
      confirmButtonText: 'Ok',
      width: '800px',
      html: (
        <>
          <div className="supportModal">
            <div className="left_spModal">
              <img src={emenuWelcome} /> {/* defaultUserLogo */}
            </div>
            <div className="right_spModal">
              <div><img src={defaultResImg} /></div>
              <p className="note">Nhà hàng chưa đăng ký chức năng này.</p>
              <p className="note">Vui lòng liên hệ <span className="note_5">{OmenuPhoneNumber}</span> và <span className="note_5">{OmenuEmail}</span></p>
              <p className="note note_1">Hoặc</p>
              <p className="note">Chi tiết xem tại <a className="OmenuURL" href={OmenuUrl} target="blank"><i>{OmenuUrlName}</i></a></p>
              <p className="note_2">Để được hướng dẫn cụ thể!</p>
              <p className="note_3">Xin cảm ơn!</p>
            </div>
          </div>
        </>
      )
    }).then(result => {
      if (result.isConfirmed || result.isDismissed) {
        this.isSupportModalOpenning = false
        this.countDidUpdate = 0
      }
    })
  }

  /**
   * Toggle full screen mode
   */
  toggleFullScreenMode = () => {
    this.setState(
      {
        isFullScreen: !this.state.isFullScreen,
      },
      () => {
        if (this.state.isFullScreen) {
          this.mainContent.current.style.zIndex = 3;
        } else {
          setTimeout(() => {
            this.mainContent.current.style.zIndex = "unset";
          }, 500);
        }
        setTimeout(() => {
          this.setAreaWidth();
        }, 500);
      }
    );
  };
  /**
   * Show support modal
   */
  showSupportModal = () => {
    return Swal.fire({
      showConfirmButton: true,
      confirmButtonText: 'Ok',
      width: '800px',
      html: (
        <>
          <div className="supportModal">
            <div className="left_spModal">
              <img src={emenuWelcome} />
            </div>
            <div className="right_spModal">
              <div><img src={defaultResImg} /></div>
              <p className="note">Nhà hàng chưa đăng ký chức năng này.</p>
              <p className="note">Vui lòng liên hệ <span className="note_5">{OmenuPhoneNumber}</span> và <span className="note_5">{OmenuEmail}</span></p>
              <p className="note note_1">Hoặc</p>
              <p className="note">Chi tiết xem tại <a className="OmenuURL" href={OmenuUrl} target="blank"><i>{OmenuUrlName}</i></a></p>
              <p className="note_2">Để được hướng dẫn cụ thể!</p>
              <p className="note_3">Xin cảm ơn!</p>
            </div>
          </div>
        </>
      )
    }).then(result => {
      if (result.isConfirmed || result.isDismissed) {
        this.isSupportModalOpenning = false
        this.countDidUpdate = 0
      }
    })
  }

  /**
   * Open combine table mode
   */
  openCombineTableMode = () => {
    if (this.state.isShowSupportModal) {
      this.showSupportModal()
    }
    else this.setState(
      {
        isCombineTableModeOn: true,
      },
      () => {
        this.setAreaWidth();
      }
    );
  };

  /**
   * Close combine table mode
   */
  closeCombineTableMode = () => {
    this.setState(
      {
        isCombineTableModeOn: false,
      },
      () => {
        this.setAreaWidth();
      }
    );
  };

  render() {
    const trans = this.props.t;
    const { ...rest } = this.props;
    const { selectedArea } = this.state;
    const { listAreaByPartner } = this.props
    return (
      <main
        id="site-main"
        className={`nofooter ${Styles["site-main-content"]}${this.state.isCombineTableModeOn ? ` ${Styles["combine-table"]}` : ""
          }${this.state.isFullScreen ? ` ${Styles["full-screen"]}` : ""
          }`}
        style={{ position: "relative" }}
        ref={this.mainContent}
      >
        <div
          className={`${Styles["e-main-content"]}`}
        >
          <div
            ref={this.tablelistHeader}
            className={Styles["table-list-header"]}
          >
            <div className={Styles["table-header-left"]}>
              {listAreaByPartner.length > 1 ?
                <><span
                  onClick={this.toggleAreaModalSelection.bind(this)}
                  className={`icon-list ${Styles["icon-list-custom"]}`}
                >
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </span>
                  <span className={Styles["area-name"]}>
                    {this.state.selectedArea ? this.state.selectedArea.name : null}
                  </span></>
                : ""}
              {
                this.state.isShowSupportModal ? "" :
                  (<span
                    onClick={this.toggleNavigateButtons.bind(this)}
                    className={`${this.state.isShowScrollButton
                      ? "icon-eye-blocked " + Styles["active"]
                      : "icon-eye"
                      } ${Styles["icon-eye-blocked-custom"]}`}
                  ></span>)
              }
            </div>
            <div className={Styles["table-header-right"]}>
              {
                this.state.isShowSupportModal ? "" :
                  (
                    <span
                      className={`icon-question ${Styles["icon-question-custom"]}`}
                    >
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </span>
                  )
              }
              <button
                onClick={this.openCombineTableMode.bind(this)}
                className={`${Styles["button"]} ${Styles["cancel"]} ${this.state.isShowSupportModal ? Styles["disabled-combine"] : ""}`}
                type="button"
              >
                {trans("table_list:combine_table")}
              </button>
              {/* <span
                className={`icon-call-staff ${Styles["icon-call-staff-custom"]}`}
              >
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
              </span> */}
              <FontAwesomeIcon
                onClick={this.toggleFullScreenMode}
                icon={this.state.isFullScreen ? faCompress : faExpand}
                style={{ fontSize: "20px" }}
                color={"#FFFFFF"}
              />
            </div>
          </div>
          <div
            ref={this.tablistWrapper}
            className={Styles["table-list-wrapper"]}
          >
            <TableGridContainer
              areaNumber={this.props.listAreaByPartner.length}
              trans={trans}
              newWidth={this.state.newAreaWidth}
              newHeight={this.state.newAreaHeight}
              areaRatio={
                this.state.selectedArea
                  ? this.state.areaRatios[this.state.selectedArea.ratio]
                  : 1
              }
              resolutionRatio={
                this.state.selectedArea && this.state.selectedArea.height
                  ? this.state.newAreaHeight / this.state.selectedArea.height
                  : 1
              }
              listTable={this.props.listTable}
              isCombineTableModeOn={this.state.isCombineTableModeOn}
              partner_Info={this.props.partner_Info}
              selectedArea={this.state.selectedArea}
              {...rest}
            />
          </div>
          {this.state.isShowScrollRight && this.state.isShowScrollButton
            ? this.renderScrollRight()
            : null}
          {this.state.isShowScrollLeft && this.state.isShowScrollButton
            ? this.renderScrollLeft()
            : null}
          {this.state.isShowAreaModal ? (
            <AreaListDetailModal
              selectArea={this.selectArea}
              listArea={this.props.listAreaByPartner}
              trans={this.props.t}
              toggleAreaModalSelection={this.toggleAreaModalSelection}
              selectedArea={
                this.state.selectedArea ? this.state.selectedArea : null
              }
            />
          ) : null}
          {this.state.isShowQRCodeModal ? (
            <QRCodeModal
              trans={this.props.t}
              onClose={() => this.setState({ isShowQRCodeModal: false })}
            />
          ) : null}
          {this.state.isShowEmptyFeatureModal ? (
            <AvailableFeatureModal
              trans={this.props.t}
              onClose={() => this.setState({ isShowEmptyFeatureModal: false })}
              showQRCode={() => this.setState({ isShowQRCodeModal: true })}
            />
          ) : null}
          {this.state.isShowFeatureModal ? (
            <TableFeatureModal
              selectedArea={this.state.selectedArea}
              trans={this.props.t}
              onClose={() => this.setState({ isShowFeatureModal: false })}
              openCombineMode={() =>
                this.setState({ isCombineTableModeOn: true })
              }
              {...rest}
            />
          ) : null}
        </div>
        <CombineTablePanel
          toggleCombineTableMode={this.closeCombineTableMode}
          trans={trans}
          selectedArea={this.state.selectedArea}
        />
        {this.props.listAreaByPartner.length === 0 ? <div className={`${Styles["none-areas"]}`}>
          {trans("table_list:none_areas")}
        </div> : null}
        <CallStaffTableList callStaffNotifications={this.props.callStaffNotifications}></CallStaffTableList>
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[TableListReducerName],
    ...state[AreaReducerName],
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    tableActions: bindActionCreators({ ...actions }, dispatch),
    areaActions: bindActionCreators({ ...areaActions }, dispatch),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(TableList));
