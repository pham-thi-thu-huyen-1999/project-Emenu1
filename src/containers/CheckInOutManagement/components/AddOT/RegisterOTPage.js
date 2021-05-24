import React from "react";
import "../../styles.scss";
import { connect } from "react-redux";
import * as action from "../../actions";
import { bindActionCreators, compose } from "redux";
import { name } from "../../reducers";
import { withNamespaces } from "react-i18next";
import _ from "lodash";
import Loading from "../../../../components/common/Loading";
import DateStart from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router-dom";
import { CheckBox } from "../../../../components/common";
import Swal from "../../../../../src/utils/sweetalert2";
import Button from "../../../../components/common/Button";
import moment from "moment";
import OverTimeTable from "./OverTimeTable";
class RegisterOTPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      listShifts: this.props.listShifts,
      showOverTimeTable: false,
      listChecked: [],
      atCheckInPage: props.atCheckInPage,
    };
    this.props.actions.getUserInfo();
    this.props.actions.getListShift();
  }

  setSelectedDate = (date) => {
    this.setState({
      selectedDate: date,
      listChecked: [],
    });
  };

  onToggleOverTimeTable = () => {
    this.setState({
      showOverTimeTable: !this.state.showOverTimeTable,
    });
  };

  onChange = (checked, idShift) => {
    let listChecked = [...this.state.listChecked];
    if (checked) {
      listChecked = [...listChecked, idShift];
    } else {
      listChecked = this.state.listChecked.filter((item) => item !== idShift);
    }
    this.setState({ listChecked });
  };

  showSuccess = () => {
    const { t } = this.props;
    Swal.fire({
      icon: "success",
      title: `${t("user.createShift.addSuccess")}`,
      showConfirmButton: true,
    });
    this.onToggleOverTimeTable();
  };
  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      title: "",
      html: `<div class="alert-error">${t(
        "checkInOutManagement.registerError"
      )}. 
      <br/>${t("checkInOutManagement.pleaseCheckAgain")}</div>`,
      imageUrl: require("../../../../images/CheckInOut/grin-tears-regular.png"),
      imageAlt: "Custom image",
      showCancelButton: false,
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.value) {
      }
    });
  };
  onSave = () => {
    const { t } = this.props;
    Swal.fire({
      title: `${t("user.createShift.youSure")}?`,
      text: `${t("user.createShift.confirmAdd")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${t("user.createShift.yes")}`,
      cancelButtonText: `${t("user.createShift.cancel")}`,
    }).then((result) => {
      if (result.value) {
        const { selectedDate } = this.state;
        let overtime_at = moment(selectedDate).format("DD-MM-YYYY");
        let shifts = [...this.state.listChecked];
        const { userInfo } = this.props;
        let data = {
          user_id: userInfo ? userInfo.sub : "",
          overtime_at,
          shifts,
        };
        this.props.actions.addOverTimeShift({
          data,
          showSuccess: this.showSuccess,
          showErr: this.showErr,
        });
      }
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(prevState.listShifts) !==
      JSON.stringify(nextProps.listShifts)
    ) {
      return {
        listShifts: nextProps.listShifts,
      };
    }
    return null;
  }
  componentWillUnmount() {
    this.props.actions.setNoAtCheckInPage();
  }

  render() {
    const { selectedDate, listShifts, showOverTimeTable, atCheckInPage } = this.state;
    const { ...rest } = this.props;
    const { t } = this.props;
    return (
      <main
        id={atCheckInPage ? "main-full-header" : "site-main"}
        className="check-in-out-management"
      >
        <section id="main-cont" className="full clear body-management">
          <Loading show={this.props.isLoading} />
          <aside className="full-p-width full-p-height">
            <div className="full-p-height e-flex item-center">
              <div
                className={
                  atCheckInPage
                    ? "popup-box wrap-box-management add-ot-shift wrap-box-full-screen"
                    : "popup-box wrap-box-management add-ot-shift"
                }
              >
                {showOverTimeTable ? (
                  <>
                    <h3 className="main-lbl text-center text-upper">
                      {t("checkInOutManagement.listOverTime")}
                    </h3>
                    <div className="contain-overtime-table">
                      <OverTimeTable {...rest}></OverTimeTable>
                    </div>
                    <div className="btn-group">
                      <Button
                        type="s3"
                        style={{ marginRight: "10px", fontSize: "1.125em" }}
                        onClick={() => {
                          this.props.history.goBack("");
                        }}
                      >
                        {t("checkInOutManagement.back")}
                      </Button>
                      <Button
                        style={{ marginLeft: "10px", fontSize: "1.125em" }}
                        onClick={() => {
                          this.onToggleOverTimeTable();
                        }}
                      >
                        {t("checkInOutManagement.registerOverTime")}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="main-lbl text-center text-upper">
                      {t("checkInOutManagement.registerOverTime")}
                    </h3>
                    <div className="add-shift-group">
                      <div className="form-group">
                        <label className="control-label">
                          {t("checkInOutManagement.dateOverTime")}
                        </label>
                        <div className="select-date">
                          <DateStart
                            className="form-control"
                            selected={selectedDate}
                            onChange={(date) => this.setSelectedDate(date)}
                            dateFormat="dd / MM / yyyy "
                            minDate={new Date()}
                          />
                          <span className="icon-calendar">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                          </span>
                        </div>
                      </div>
                      <div className="shift-group">
                        {listShifts && listShifts.length > 0 ? (
                          <div className="has-shift">
                            <div className="text-select-shift">
                              {t("checkInOutManagement.chooseShift")}
                            </div>
                            <div className="group-checkbox-shift">
                              {listShifts.map((shift, index) => {
                                let checked = this.state.listChecked.includes(
                                  shift.id
                                );
                                return (
                                  <div
                                    key={index}
                                    className="checbox-item-shift"
                                  >
                                    <CheckBox
                                      checked={checked}
                                      label={`  ${shift.name}   -    Từ   ${shift.start_time}   Đến   ${shift.end_time}`}
                                      onChange={(checked) =>
                                        this.onChange(checked, shift.id)
                                      }
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="no-shift">
                            <img
                              alt=""
                              className="ohazo-logo"
                              src={require("./../../../../images/ohazo_logo.png")}
                            ></img>

                            <div className="no-shift__text">
                              {t("checkInOutManagement.noShift")}
                            </div>
                            <div className="no-shift__text">
                              {t(
                                "checkInOutManagement.pleaseChooseAnotherDate"
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="btn-group">
                      <Button
                        type="s3"
                        style={{ marginRight: "10px", fontSize: "1.125em" }}
                        onClick={() => {
                          this.props.actions.setNoAtCheckInPage();
                          this.props.history.goBack("");
                        }}
                      >
                        {t("checkInOutManagement.back")}
                      </Button>
                      <Button
                        style={{ marginLeft: "10px", fontSize: "1.125em" }}
                        onClick={() => {
                          this.onSave();
                        }}
                      >
                        {t("checkInOutManagement.register")}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </section>
      </main>
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
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(RegisterOTPage));
