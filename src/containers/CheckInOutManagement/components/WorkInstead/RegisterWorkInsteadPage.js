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
import Button from "../../../../components/common/Button";
import SlickEmployee from "./SlickEmployee";
import moment from "moment";
import * as CONSTS from "./../../consts";
import { CheckBox } from "../../../../components/common";
import Swal from "../../../../utils/sweetalert2";
import WorkReplaceTable from "./WorkReplaceTable";
class RegisterWorkInsteadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      selectedEmployee: null,
      employeeList: this.props.accountList,
      calendarOfUser: null,
      showWorkReplaceTable: false,
      listChecked: [],
      atCheckInPage: props.atCheckInPage,
    };
    this.props.actions.getAccountList();
    this.props.actions.getUserInfo();
    this.props.actions.resetCalendarOfUser();
  }

  setSelectedDate = (date) => {
    this.setState({
      selectedDate: date,
      listChecked: [],
    });
    const { selectedEmployee } = this.state;
    if (selectedEmployee !== null) {
      const data = {
        userId: selectedEmployee.id,
        fromDate: moment(date).format("DD-MM-YYYY"),
        toDate: moment(date).format("DD-MM-YYYY"),
      };
      this.props.actions.getCalendarOfUser(data);
    }
  };

  changeEmployee = (employee) => {
    this.setState({
      selectedEmployee: employee,
    });
    const { selectedDate } = this.state;
    if (selectedDate !== null) {
      const data = {
        userId: employee.id,
        fromDate: moment(selectedDate).format("DD-MM-YYYY"),
        toDate: moment(selectedDate).format("DD-MM-YYYY"),
      };
      this.props.actions.getCalendarOfUser(data);
    }
  };

  onToggleWorkReplaceTable = () => {
    this.setState({
      showWorkReplaceTable: !this.state.showWorkReplaceTable,
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
    this.onToggleWorkReplaceTable();
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
    const { selectedEmployee, listChecked } = this.state;
    if (selectedEmployee === null) {
      Swal.fire({
        title: `Cảnh báo`,
        text: `Bạn chưa chọn nhân viên cần làm thay`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `${t("user.createShift.yes")}`,
        cancelButtonText: `${t("user.createShift.cancel")}`,
      });
      return;
    }
    if (listChecked && listChecked.length === 0) {
      Swal.fire({
        title: `Cảnh báo`,
        text: `Bạn chưa chọn ca cần làm thay`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `${t("user.createShift.yes")}`,
        cancelButtonText: `${t("user.createShift.cancel")}`,
      });
      return;
    }
    Swal.fire({
      title: `${t("user.createShift.youSure")}?`,
      text: `Gửi yêu cầu làm thay cho ${selectedEmployee.full_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${t("user.createShift.yes")}`,
      cancelButtonText: `${t("user.createShift.cancel")}`,
    }).then((result) => {
      if (result.value) {
        const { selectedDate } = this.state;
        let replace_at = moment(selectedDate).format("DD-MM-YYYY");
        let shifts = [...this.state.listChecked];
        const { userInfo } = this.props;
        const data = {
          user_id: userInfo ? userInfo.sub : "",
          replace_user_id: selectedEmployee.id,
          replace_at,
          description: "",
          shifts,
        };
        this.props.actions.addReplaceShift({
          data,
          showSuccess: this.showSuccess,
          showErr: this.showErr,
        });
      }
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      (nextProps.accountList.length > 0 &&
        prevState.employeeList.length === 0) ||
      JSON.stringify(prevState.calendarOfUser) !==
        JSON.stringify(nextProps.calendarOfUser)
    ) {
      return {
        employeeList: nextProps.accountList,
        calendarOfUser: nextProps.calendarOfUser,
      };
    }
    return null;
  }

  componentWillUnmount() {
    this.props.actions.setNoAtCheckInPage();
  }

  render() {
    const {
      selectedDate,
      employeeList,
      selectedEmployee,
      calendarOfUser,
      showWorkReplaceTable,
      atCheckInPage,
    } = this.state;
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
                    ? "popup-box popup-box--no-pad full-p-width full-p-height e-row add-ot-shift no-border-radius"
                    : "popup-box popup-box--no-pad w-94 h-90 e-row add-ot-shift "
                }
              >
                {showWorkReplaceTable ? (
                  <div className="contain-replace-tbl">
                    <h3 className="main-lbl text-center text-upper">
                      {t("checkInOutManagement.listReplace")}
                    </h3>
                    <div className="contain-overtime-table">
                      <WorkReplaceTable {...rest} />
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
                          this.onToggleWorkReplaceTable();
                        }}
                      >
                        {t("checkInOutManagement.registerReplace")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <aside
                      className={
                        atCheckInPage
                          ? "e-col-3 full-p-height employee no-border-radius"
                          : "e-col-3 full-p-height employee"
                      }
                    >
                      {
                        <SlickEmployee
                          changeEmployee={(employee) => {
                            this.changeEmployee(employee);
                          }}
                          selectedEmployee={selectedEmployee}
                          employeeList={employeeList}
                          {...rest}
                        />
                      }
                    </aside>
                    <aside
                      className={
                        atCheckInPage
                          ? "e-col-9 shift-contain no-border-radius"
                          : "e-col-9 shift-contain"
                      }
                    >
                      <h3 className="main-lbl text-center text-upper">
                        {t("checkInOutManagement.registerReplace")}
                      </h3>
                      <div className="add-shift-group">
                        <div className="form-group">
                          <label className="control-label">
                            {t("checkInOutManagement.dateReplace")}
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
                          {calendarOfUser &&
                          calendarOfUser[0] &&
                          calendarOfUser[0].shifts &&
                          calendarOfUser[0].shifts.length > 0 ? (
                            <div className="has-shift">
                              <div className="text-select-shift">
                                {t("checkInOutManagement.chooseReplaceShift")}
                              </div>
                              <div className="group-checkbox-shift">
                                {calendarOfUser[0].shifts.map(
                                  (shift, index) => {
                                    let checked = this.state.listChecked.includes(
                                      shift.id
                                    );
                                    if (
                                      shift.status_calendar &&
                                      shift.status_calendar === CONSTS.WORK
                                    ) {
                                      return (
                                        <div
                                          key={shift.id}
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
                                    } else {
                                      return null;
                                    }
                                  }
                                )}
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
                    </aside>
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
)(withNamespaces()(RegisterWorkInsteadPage));
