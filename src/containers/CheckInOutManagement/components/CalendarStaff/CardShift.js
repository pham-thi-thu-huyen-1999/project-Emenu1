import React, { Component } from "react";
import * as CONSTS from "./../../consts";
import moment from "moment";
import ShiftInfoWeek from "./ShiftInfoWeek";
import ListEmployeeWorkInShift from "./ListEmployeeWorkInShift";
import PopupTakeLeave from "./PopupTakeLeave";
export default class CardShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showShiftInfoWeek: false,
      showListEmployeeWorkInShift: false,
    };
  }

  renderStatusOfNormalShift = (id) => {
    let content = "";
    switch (id) {
      case CONSTS.WORK:
        {
          content = "";
        }
        break;
      case CONSTS.OVER_TIME:
        {
          content = <div>Làm thêm</div>;
        }
        break;
      case CONSTS.TAKE_LEAVE:
        {
          content = <div>Xin nghỉ phép</div>;
        }
        break;
      case CONSTS.INSTEAD_WORK:
        {
          content = (
            <>
              <div>Làm thay cho</div>
              <div>Nguyễn Văn A</div>
            </>
          );
        }
        break;
    }
    return content;
  };

  renderStatusOfConcept = (id) => {
    let content = "";
    switch (id) {
      case CONSTS.ACCEPT:
        {
          content = <div className="txt-blue">Đã xác nhận</div>;
        }
        break;
      case CONSTS.WAITING:
        {
          content = <div className="txt-orange">Đợi xác nhận</div>;
        }
        break;
      case CONSTS.CANCEL:
        {
          content = <div className="txt-red">Không đồng ý</div>;
        }
        break;
    }
    return content;
  };

  showShiftInfo = () => {
    this.setState({
      showShiftInfoWeek: true,
    });
  };

  showEmployeeList = () => {
    this.setState({
      showListEmployeeWorkInShift: true,
      showShiftInfoWeek: false,
    });
  };

  showTakeLeave = () => {
    this.setState({
      showPopupTakeLeave: true,
      showShiftInfoWeek: false,
    });
  };

  render() {
    const {
      selectedDate,
      workShift,
      t,
      workingCategory,
      selectedDatesInWeek,
      disabledDate,
    } = this.props;
    const { ...rest } = this.props;
    const {
      showShiftInfoWeek,
      showListEmployeeWorkInShift,
      showPopupTakeLeave,
    } = this.state;
    return (
      <>
        <div
          className="card-work-shift"
          onClick={() => {
            this.showShiftInfo();
          }}
        >
          <div className="card-work-shift__title">
            <div className="title-name">{workShift.name}</div>
            <div className="title-total-employee">
              <span>
                <img
                  src={require("../../../../images/CheckInOut/name_shift_week.png")}
                  alt=""
                />
              </span>
              &nbsp;
              <span>{workShift.total_staff}</span>
            </div>
          </div>
          <div className="card-work-shift__info">
            <div className="card-work-shift__info-item">
              <div>{t("calendarManagement.in")}</div>
              <div>{workShift.start_time}</div>
            </div>
            <div className="card-work-shift__info-item">
              <div>{t("calendarManagement.out")}</div>
              <div>{workShift.end_time}</div>
            </div>
            <div className="card-work-shift__info-item">
              {this.renderStatusOfNormalShift(workShift.status_calendar)}
            </div>
            <div className="card-work-shift__info-item">
              {this.renderStatusOfConcept(workShift.status_overtimve_shift)}
              {this.renderStatusOfConcept(workShift.status_take_leave)}
              {this.renderStatusOfConcept(workShift.status_replace_shift)}
              <div></div>
            </div>
          </div>
        </div>
        {showShiftInfoWeek ? (
          <ShiftInfoWeek
            {...rest}
            shift={workShift}
            selectedDate={selectedDate}
            showEmployeeList={this.showEmployeeList}
            showTakeLeave={this.showTakeLeave}
            selectedDatesInWeek={selectedDatesInWeek}
            workingCategory={workingCategory}
            disabledDate={disabledDate}
            hide={() => {
              this.setState({
                showShiftInfoWeek: false,
              });
            }}
          />
        ) : null}

        {showListEmployeeWorkInShift ? (
          <ListEmployeeWorkInShift
            {...rest}
            shift={workShift}
            selectedDate={selectedDate}
            hide={() => {
              this.setState({
                showListEmployeeWorkInShift: false,
              });
            }}
          />
        ) : null}
        {showPopupTakeLeave ? (
          <PopupTakeLeave
            {...rest}
            selectedShift={workShift}
            selectedDate={selectedDate}
            selectedDatesInWeek={selectedDatesInWeek}
            workingCategory={workingCategory}
            hide={() => {
              this.setState({
                showPopupTakeLeave: false,
              });
            }}
          />
        ) : null}
      </>
    );
  }
}
