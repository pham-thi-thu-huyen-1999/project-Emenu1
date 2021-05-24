import React, { Component } from "react";
import DateStart from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import TimeField from "react-simple-timefield";

import { CheckBox } from "../../../../components/common";
class TblDatePromotion extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  onChangeDay = (e, i) => {
    let { days, setDays } = this.props;
    days[i][Object.keys(days[i])[0]] = e;
    setDays(days);
  };

  render() {
    const {
      startDate,
      endDate,
      setStartDate,
      setEndDate,
      startTime,
      endTime,
      setStartTime,
      setEndTime,
      days,
    } = this.props;

    return (
      <div className="wrapper">
        {startDate < endDate ||
        startDate === null ||
        endDate === null ? null : (
          <span
            className="validation"
            style={{ display: "block", fontSize: 14, textAlign: "center" }}
          >
            Ngày kết thúc lớn hơn ngày bắt đầu
          </span>
        )}

        <div className="flex-box row-1">
          <div className="form-group custom-group">
            <label className="control-label">Thời gian</label>
            <DateStart
              className="form-control"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="d / MM / yyyy "
              minDate={new Date()}
            />
            <span className="icon">
              <FontAwesomeIcon icon={faCalendarAlt} />
            </span>
          </div>
          <div className="form-group custom-group">
            <label
              style={{ width: 80, textAlign: "center" }}
              className="control-label"
            >
              Đến
            </label>
            <DateStart
              className="form-control"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="d / MM / yyyy "
              minDate={new Date()}
            />
            <span className="icon">
              <FontAwesomeIcon icon={faCalendarAlt} />
            </span>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: -15 }}>
          <label className="control-label" style={{ marginBottom: "auto" }}>
            Theo thứ
          </label>
          <div className="cs-flex cs-wrap">
            {days.map((day, i) => (
              <CheckBox
                key={i}
                style={{ minWidth: 200, marginBottom: 20 }}
                name={Object.keys(day)[0]}
                label={Object.keys(day)[0]}
                checked={day[Object.keys(day)[0]]}
                onChange={(e) => this.onChangeDay(e, i)}
              />
            ))}
          </div>
        </div>
        <div className="flex-box row-1">
          <div className="form-group custom-group">
            <div className="form-group custom-group">
              <label className="control-label">Theo giờ</label>

              <TimeField
                value={startTime}
                onChange={(event, value) => {
                  setStartTime(value);
                }}
                input={<input type="text" className="form-control" />}
              />
              <span className="icon">
                <FontAwesomeIcon icon={faClock} />
              </span>
            </div>
          </div>
          <div className="form-group custom-group">
            <label
              style={{ width: 80, textAlign: "center" }}
              className="control-label"
            >
              Đến
            </label>
            <TimeField
              value={endTime}
              onChange={(event, value) => {
                setEndTime(value);
              }}
              input={<input type="text" className="form-control" />}
            />
            <span className="icon">
              <FontAwesomeIcon icon={faClock} />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default TblDatePromotion;
