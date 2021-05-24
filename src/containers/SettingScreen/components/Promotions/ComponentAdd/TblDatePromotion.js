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
      sDate: null,
      eDate: null
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
  checkDateTime = (start, end) =>{
    if(start === null || end === null ){
      return
    }
    if(end<start){
      return <span className="validation" style={{ display: "block", fontSize:14, textAlign:"center" }}> Ngày kết thúc lớn hơn ngày bắt đầu</span>
    }else{
      this.props.getValueDate(this.state.sDate, this.state.eDate)
    }
  }

  render() {
    return (
      <div className="wrapper">
        {this.checkDateTime(this.state.sDate, this.state.eDate)}
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
          <input type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label className="control-label">Theo ngày</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label className="control-label">Theo thứ</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label className="control-label">Theo giờ</label>
          <input type="text" className="form-control" />
        </div>
      </div>

    );
  }
}

export default TblDatePromotion;