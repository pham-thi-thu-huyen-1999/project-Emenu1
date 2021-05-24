import React, { Component } from "react";
import * as CONSTS from "../../consts";
import Swal from "../../../../utils/sweetalert2";
import ShiftInfoWeek from "./ShiftInfoWeek";
import ListEmployeeWorkInShift from "./ListEmployeeWorkInShift";
import PopupTakeLeave from "./PopupTakeLeave";
export default class CardShiftList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showShiftInfoMonth: false,
      showListEmployeeWorkInShift: false,
      showPopupTakeLeave: false,
      workShift: null,
      selectedDate: props.calendarDay
        ? new Date(props.calendarDay.date_at)
        : null,
    };
  }

  showShiftInfo = (shift) => {
    this.setState({
      showShiftInfoMonth: true,
      workShift: shift,
    });
  };

  showEmployeeList = () => {
    this.setState({
      showListEmployeeWorkInShift: true,
      showShiftInfoMonth: false,
    });
  };

  showTakeLeave = () => {
    this.setState({
      showPopupTakeLeave: true,
      showShiftInfoMonth: false,
    });
  };

  render() {
    const { currentDay, dayOfShift, calendarDay,selectedDatesInMonth,workingCategory, t } = this.props;
    const {
      showShiftInfoMonth,
      showListEmployeeWorkInShift,
      showPopupTakeLeave,
      workShift,
      selectedDate,
    } = this.state;
    const { ...rest } = this.props;
    return (
      <>
        {calendarDay ? (
          <>
            <ul className="card-work-shift-every-day">
              {calendarDay.shifts.map((workShift, index) => {
                if (
                  currentDay <= dayOfShift ||
                  (currentDay.getDate() === dayOfShift.getDate() &&
                    currentDay.getMonth() === dayOfShift.getMonth() &&
                    currentDay.getFullYear() === dayOfShift.getFullYear())
                ) {
                  if (workShift.status_calendar === CONSTS.TAKE_LEAVE) {
                    return (
                      <li
                        className="main-shift-item"
                        key={index}
                        onClick={() => {
                          this.showShiftInfo(workShift);
                        }}
                      >
                        <span className="txt-line-through txt-italic">
                          {workShift.name}
                        </span>
                        <span className="label-status">Xin nghỉ phép</span>
                      </li>
                    );
                  } else if (workShift.status_calendar === CONSTS.OVER_TIME) {
                    return (
                      <li
                        key={index}
                        className="main-shift-item"
                        onClick={() => {
                          this.showShiftInfo(workShift);
                        }}
                      >
                        <span className="txt-underline txt-italic">
                          {workShift.name}
                        </span>
                        <span className="label-status">Làm thêm</span>
                      </li>
                    );
                  } else if (workShift.status_calendar === CONSTS.WORK) {
                    return (
                      <li
                        className="main-shift-item"
                        key={index}
                        onClick={() => {
                          this.showShiftInfo(workShift);
                        }}
                      >
                        <span className="txt-underline txt-italic">
                          {workShift.name}
                        </span>                        
                      </li>
                    );
                  } else if (workShift.status_calendar === CONSTS.INSTEAD_WORK) {
                    return (
                      <li
                        className="main-shift-item"
                        key={index}
                        onClick={() => {
                          this.showShiftInfo(workShift);
                        }}
                      >
                        <span className="txt-underline txt-italic">
                          {workShift.name}
                        </span>
                        <span className="label-status">Làm thay</span>
                      </li>
                    );
                  }
                } else {
                  if (workShift.status_calendar === CONSTS.TAKE_LEAVE) {
                    return (
                      <li
                        className="main-shift-item"
                        key={index}
                        onClick={() => {}}
                      >
                        <span className="txt-line-through txt-italic">
                          {workShift.name}
                        </span>
                      </li>
                    );
                  } else {
                    return <li key={index}>{workShift.name}</li>;
                  }
                }
              })}
            </ul>
          </>
        ) : (
          <>
            <ul className="card-work-shift-every-day"></ul>
          </>
        )}
        {showShiftInfoMonth ? (
          <ShiftInfoWeek
            {...rest}
            shift={workShift}
            selectedDate={selectedDate}
            showEmployeeList={this.showEmployeeList}
            showTakeLeave={this.showTakeLeave}
            selectedDatesInMonth={selectedDatesInMonth}
            workingCategory={workingCategory}
            hide={() => {
              this.setState({
                showShiftInfoMonth: false,
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
            selectedDatesInMonth={selectedDatesInMonth}
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
