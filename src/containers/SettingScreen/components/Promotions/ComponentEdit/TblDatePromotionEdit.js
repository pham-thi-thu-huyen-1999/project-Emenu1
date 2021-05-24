import React, { Component } from 'react';
import DateStart from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";

class TblDatePromotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sDate: this.props.startDate,
      eDate: this.props.endDate
    }
  }
  handleChangeStart = date => {
    this.setState({
      sDate: date
    });
  };

  handleChangeEnd = date => {
    this.setState({
      eDate: date
    });
  };

  render() {
    return (
      <div className="wrapper">
        <div className="flex-box row-1">
          <div className="form-group custom-group">
            <label className="control-label">Thời gian</label>
            <DateStart className="form-control"
              selected={this.state.sDate}
              onChange={this.handleChangeStart}
              dateFormat="d / MM / yyyy "
              minDate={new Date()}
            />
            <span className="icon">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <FontAwesomeIcon icon={faClock} />
            </span>

          </div>
          <div className="form-group custom-group">
            <label style={{ width: 80, textAlign: 'center' }} className="control-label">Đến</label>
            <DateStart className="form-control"
              selected={this.state.eDate}
              onChange={this.handleChangeEnd}
              dateFormat="d / MM / yyyy "
              minDate={new Date()}
            />
            <span className="icon">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <FontAwesomeIcon icon={faClock} />
            </span>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label">Theo tháng</label>
          <input type="text" className="form-control" value="" />
        </div>
        <div className="form-group">
          <label className="control-label">Theo ngày</label>
          <input type="text" className="form-control" value="" />
        </div>
        <div className="form-group">
          <label className="control-label">Theo thứ</label>
          <input type="text" className="form-control" value="" />
        </div>
        <div className="form-group">
          <label className="control-label">Theo giờ</label>
          <input type="text" className="form-control" value="" />
        </div>
      </div>

    );
  }
}

export default TblDatePromotion;