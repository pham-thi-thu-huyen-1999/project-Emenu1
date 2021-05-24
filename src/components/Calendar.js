import React, { Component } from "react";
import iconCalendar from "../images/CheckInOut/logo_header_calendar.png";
import { history } from "../App";

class Calendar extends Component {
  clickCalendar = () => {
    history.push("/personal-calendar");
  };
  render() {
    return (
      <div className="calendar-button-group" onClick={this.clickCalendar}>
        <div className="calendar-icon-container">
          <img className="calendar-icon" src={iconCalendar} alt="logout" />
        </div>
        <span>Quản lý lịch làm việc</span>
      </div>
    );
  }
}

export default Calendar;
