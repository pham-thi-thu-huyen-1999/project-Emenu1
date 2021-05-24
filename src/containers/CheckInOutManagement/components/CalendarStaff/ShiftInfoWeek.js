import React, { Component } from "react";
import Swal from "../../../../utils/sweetalert2";
import * as CONSTS from "../../consts";
import { LANGUAGES } from "../../../../consts/constants";
import Dialog from "../../../../components/common/Dialog";
import Button from "../../../../components/common/Button";
import moment from "moment";
import { get } from "../../../../services/localStorage";
import common from "../../../../utils/common";
const user_id = common.decodeToken(get("accessToken")).sub;
export default class ShiftInfoWeek extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shift: props.shift,
      shiftStatus: props.shift.status_calendar,
      overTimeStatus: props.shift.status_overtimve_shift,
      takeLeaveStatus: props.shift.status_take_leave,
      replaceStatus: props.shift.status_replace_shift,
      employeeList: props.employeeList,
      employeeTotal: props.employeeList.length,
      workingCategory: props.workingCategory,
    };
    const data = {
      shift_id: this.props.shift.id,
      params: {
        date_at: moment(this.props.selectedDate).format("DD-MM-YYYY"),
      },
    };
    this.props.actions.getEmployeeOfShift(data);
  }

  renderStatusOfConcept = (id) => {
    let content = "";
    switch (id) {
      case CONSTS.ACCEPT:
        {
          content = <span className="txt-blue">Đã xác nhận</span>;
        }
        break;
      case CONSTS.WAITING:
        {
          content = <span className="txt-orange">Đợi xác nhận</span>;
        }
        break;
      case CONSTS.CANCEL:
        {
          content = <span className="txt-red">Không đồng ý</span>;
        }
        break;
    }
    return content;
  };

  renderBodyContent = () => {
    const {
      shiftStatus,
      employeeTotal,
      overTimeStatus,
      replaceStatus,
      takeLeaveStatus,
    } = this.state;
    const { showEmployeeList } = this.props;
    let bodyContent = "";
    switch (shiftStatus) {
      case CONSTS.WORK:
        {
          bodyContent = (
            <div className="number-emloyee-work" onClick={showEmployeeList}>
              Nhân viên làm việc: {employeeTotal}
            </div>
          );
        }
        break;
      case CONSTS.OVER_TIME:
        {
          bodyContent = (
            <>
              <div className="title">Làm thêm</div>
              <div>
                Trạng thái :{" "}
                <span>{this.renderStatusOfConcept(overTimeStatus)}</span>
              </div>
              <div className="number-emloyee-work" onClick={showEmployeeList}>
                Nhân viên làm việc: {employeeTotal}
              </div>
            </>
          );
        }
        break;
      case CONSTS.TAKE_LEAVE:
        {
          bodyContent = (
            <>
              <div className="title">Xin nghỉ phép</div>
              <div>Lý do : Bận việc xin nghỉ</div>
              <div>
                Trạng thái :{" "}
                <span>{this.renderStatusOfConcept(takeLeaveStatus)}</span>
              </div>
              <div className="number-emloyee-work" onClick={showEmployeeList}>
                Nhân viên làm việc: {employeeTotal}
              </div>
            </>
          );
        }
        break;
      case CONSTS.INSTEAD_WORK:
        {
          bodyContent = (
            <>
              <div className="title">Làm thay cho: Nguyễn Văn A</div>
              <div>
                Trạng thái :{" "}
                <span>{this.renderStatusOfConcept(replaceStatus)}</span>
              </div>
              <div className="number-emloyee-work" onClick={showEmployeeList}>
                Nhân viên làm việc: {employeeTotal}
              </div>
            </>
          );
        }
        break;
    }
    return bodyContent;
  };

  renderButtonOverTime = () => {
    let content = "";
    let { overTimeStatus } = this.state;
    let { t, disabledDate } = this.props;
    switch (overTimeStatus) {
      case CONSTS.ACCEPT:
        {
          content = (
            <>
              <Button
                type="s3"
                onClick={() => {
                  this.props.hide();
                }}
              >
                {t("calendarManagement.back")}
              </Button>
              &nbsp;&nbsp;
              {
                disabledDate ? null : <Button
                  className="btn-cancel-request"
                  onClick={() => {
                    this.props.showTakeLeave();
                  }}
                >
                  Xin nghỉ phép
              </Button>
              }
            </>
          );
        }
        break;
      case CONSTS.WAITING:
        {
          content = (
            <>
              <Button
                type="s3"
                onClick={() => {
                  this.props.hide();
                }}
              >
                {t("calendarManagement.back")}
              </Button>
              &nbsp;&nbsp;
              {
                disabledDate ? null :
                  <Button
                    className="btn-cancel-request"
                    onClick={() => {
                      this.onDeleteOverTimeForCalendar();
                    }}
                  >
                    Hủy làm thêm
              </Button>
              }
            </>
          );
        }
        break;
    }
    return content;
  };

  renderButtonTakeLeave = () => {
    let content = "";
    let { takeLeaveStatus } = this.state;
    let { t, disabledDate } = this.props;
    switch (takeLeaveStatus) {
      case CONSTS.ACCEPT:
        {
          content = (
            <>
              <Button
                type="s3"
                onClick={() => {
                  this.props.hide();
                }}
              >
                {t("calendarManagement.back")}
              </Button>
            </>
          );
        }
        break;
      case CONSTS.WAITING:
        {
          content = (
            <>
              <Button
                type="s3"
                onClick={() => {
                  this.props.hide();
                }}
              >
                {t("calendarManagement.back")}
              </Button>
              &nbsp;&nbsp;
              {
                disabledDate ? null : <Button
                  className="btn-cancel-request"
                  onClick={() => {
                    this.onDeleteTakeLeaveForCalendar();
                  }}
                >
                  Hủy nghỉ phép
              </Button>
              }
            </>
          );
        }
        break;
    }
    return content;
  };

  renderButtonReplaceWork = () => {
    let content = "";
    let { replaceStatus } = this.state;
    let { t, disabledDate } = this.props;
    switch (replaceStatus) {
      case CONSTS.ACCEPT:
        {
          content = (
            <>
              <Button
                type="s3"
                onClick={() => {
                  this.props.hide();
                }}
              >
                {t("calendarManagement.back")}
              </Button>
              &nbsp;&nbsp;
              {
                disabledDate ? null :
                <Button
                className="btn-cancel-request"
                onClick={() => {
                  this.props.showTakeLeave();
                }}
              >
                Xin nghỉ phép
              </Button>
              }
            </>
          );
        }
        break;
      case CONSTS.WAITING:
        {
          content = (
            <>
              <Button
                type="s3"
                onClick={() => {
                  this.props.hide();
                }}
              >
                {t("calendarManagement.back")}
              </Button>
              &nbsp;&nbsp;
              {
                disabledDate ? null : <Button
                className="btn-cancel-request"
                onClick={() => {
                  this.onDeleteReplaceShiftForCalendar();
                }}
              >
                Hủy làm thay
              </Button>
              }
            </>
          );
        }
        break;
    }
    return content;
  };

  renderGroupButton = () => {
    const { shiftStatus } = this.state;
    let { t, disabledDate } = this.props;
    let content = "";
    switch (shiftStatus) {
      case CONSTS.WORK:
        {
          content = (
            <>
              <Button
                type="s3"
                onClick={() => {
                  this.props.hide();
                }}
              >
                {t("calendarManagement.back")}
              </Button>
              &nbsp;&nbsp;
              {
                disabledDate ? null : <Button
                  className="btn-cancel-request"
                  onClick={() => {
                    this.props.showTakeLeave();
                  }}
                >
                  Xin nghỉ phép
              </Button>
              }
            </>
          );
        }
        break;
      case CONSTS.OVER_TIME:
        {
          content = this.renderButtonOverTime();
        }
        break;
      case CONSTS.TAKE_LEAVE:
        {
          content = this.renderButtonTakeLeave();
        }
        break;
      case CONSTS.INSTEAD_WORK:
        {
          content = this.renderButtonReplaceWork();
        }
        break;
    }
    return content;
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(nextProps.employeeList) !==
      JSON.stringify(prevState.employeeList)
    ) {
      return {
        employeeList: nextProps.employeeList,
        employeeTotal: nextProps.employeeList.length,
      };
    }
    return null;
  }

  onDeleteTakeLeaveForCalendar = () => {
    const { t, selectedDate } = this.props;
    const { shift, workingCategory } = this.state;
    Swal.fire({
      title: t("calendarManagement.swalTitle"),
      text: "Bạn có muốn hủy ca làm thêm này",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("calendarManagement.swalAgree"),
      cancelButtonText: t("calendarManagement.swalCancel"),
    }).then((result) => {
      if (result.value) {
        const data = {
          user_id: user_id,
          take_leave_id: shift.calendar_work_id ? shift.calendar_work_id : "",
        };
        if (workingCategory === CONSTS.WEEK) {
          const { selectedDatesInWeek } = this.props;
          this.props.actions.deleteTakeLeaveForCalendar({
            data,
            workingCategory,
            selectedDatesInWeek,
            user_id,
            showSuccess: this.showOk,
            showErr: this.showErr,
          });
        } else if (workingCategory === CONSTS.MONTH) {
          this.props.actions.deleteTakeLeaveForCalendar({
            data,
            workingCategory,
            selectedDate,
            user_id,
            showSuccess: this.showOk,
            showErr: this.showErr,
          });
        }
      }
    });
  };

  onDeleteOverTimeForCalendar = () => {
    const { t, selectedDate } = this.props;
    const { shift, workingCategory } = this.state;
    Swal.fire({
      title: t("calendarManagement.swalTitle"),
      text: "Bạn có muốn hủy ca làm thêm này",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("calendarManagement.swalAgree"),
      cancelButtonText: t("calendarManagement.swalCancel"),
    }).then((result) => {
      if (result.value) {
        //handle
        const data = {
          user_id: user_id,
          overtime_shift_id: shift.calendar_work_id
            ? shift.calendar_work_id
            : "",
        };
        if (workingCategory === CONSTS.WEEK) {
          const { selectedDatesInWeek } = this.props;
          this.props.actions.deleteOverTimeForCalendar({
            data,
            workingCategory,
            selectedDatesInWeek,
            user_id,
            showSuccess: this.showOk,
            showErr: this.showErr,
          });
        } else if (workingCategory === CONSTS.MONTH) {
          this.props.actions.deleteOverTimeForCalendar({
            data,
            workingCategory,
            selectedDate,
            user_id,
            showSuccess: this.showOk,
            showErr: this.showErr,
          });
        }
      }
    });
  };

  onDeleteReplaceShiftForCalendar = () => {
    const { t, selectedDate } = this.props;
    const { shift, workingCategory } = this.state;
    Swal.fire({
      title: t("calendarManagement.swalTitle"),
      text: "Bạn có muốn hủy ca làm thay này",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("calendarManagement.swalAgree"),
      cancelButtonText: t("calendarManagement.swalCancel"),
    }).then((result) => {
      if (result.value) {
        const data = {
          user_id: this.props.userInfo ? this.props.userInfo.sub : null,
          replace_shift_id: shift.calendar_work_id
            ? shift.calendar_work_id
            : "",
        };
        if (workingCategory === CONSTS.WEEK) {
          const { selectedDatesInWeek } = this.props;
          this.props.actions.deleteReplaceShiftForCalendar({
            data,
            workingCategory,
            selectedDatesInWeek,
            user_id,
            showSuccess: this.showOk,
            showErr: this.showErr,
          });
        } else if (workingCategory === CONSTS.MONTH) {
          this.props.actions.deleteReplaceShiftForCalendar({
            data,
            workingCategory,
            selectedDate,
            user_id,
            showSuccess: this.showOk,
            showErr: this.showErr,
          });
        }
      }
    });
  };
  showOk = () => {
    const t = this.props.t;
    Swal.fire({
      icon: "success",
      text: t("calendarManagement.swalUpdateSuccess"),
      title: t("calendarManagement.swalTitle"),
    });
    this.props.hide();
  };

  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      title: "",
      html: `<div class="alert-error"Hủy không thành công 
      <br/>Vui lòng kiểm tra lại</div>`,
      imageUrl: require("../../../../images/CheckInOut/grin-tears-regular.png"),
      imageAlt: "Custom image",
      showCancelButton: false,
      confirmButtonText: "Ok",
    }).then((result) => {

    });
    this.props.hide();
  };

  render() {
    const { hide, t, shift, selectedDate } = this.props;
    const { shiftStatus } = this.state;
    return (
      <Dialog
        show={true}
        close={() => hide()}
        innerClass="popup-shift-info-in-checkinout"
      >
        {shiftStatus !== null ? (
          <>
            <div className="header-info">
              <div className="work-time">
                <div className="shift-name">{shift.name}</div>
                <div>
                  ({shift.start_time} - {shift.end_time})
                </div>
              </div>
              <div className="content-reason e-row e-col-12 e-flex content-start">
                {this.props.t("currentLang") === LANGUAGES.vietnam
                  ? CONSTS.DAYS_VN[selectedDate.getDay()]
                  : this.props.t("currentLang") === LANGUAGES.english
                    ? CONSTS.DAYS_EN[selectedDate.getDay()]
                    : CONSTS.DAYS_JP[selectedDate.getDay()]}
                &nbsp;
                {t("calendarManagement.day")} {selectedDate.getDate()}&nbsp;
                {t("calendarManagement.month")} {selectedDate.getMonth() + 1}
              </div>
            </div>
            <div className="body-info">{this.renderBodyContent()}</div>
            <aside className="e-row e-col-12 e-flex content-center">
              {this.renderGroupButton()}
            </aside>
          </>
        ) : null}
      </Dialog>
    );
  }
}
