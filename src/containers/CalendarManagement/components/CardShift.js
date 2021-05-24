import React, { Component } from "react";
import * as CONSTS from "../constants";
import moment from "moment";
export default class CardShift extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { selectedDate, workShift, t } = this.props;
    return (
      <div className="card-work-shift">
        <div className="card-work-shift__title">
          <div className="title-name">
            {workShift.name}
          </div>
          <div className="title-total-employee">
            <span><img src={require("../../../images/employee.png")} alt="" /></span>&nbsp;
            <span>{workShift.total_staff}</span>
          </div>
        </div>
        <div className="card-work-shift__info">
          <div className="card-work-shift__info-item">
            <div>
              {t("calendarManagement.in")}
            </div>
            <div>
              {workShift.start_time}
            </div>
          </div>
          <div className="card-work-shift__info-item">
            <div>
              {t("calendarManagement.out")}
            </div>
            <div>
              {workShift.end_time}
            </div>
          </div>
          <div className="card-work-shift__info-item">
            <div>
              {t("calendarManagement.numberWorking")}
            </div>
            <div
              className={workShift.total_staff_work !== CONSTS.ZERO ? "info-item-link--selected" : "info-item-link"}
              onClick={workShift.total_staff_work !== CONSTS.ZERO ? () => {
                this.props.showPopupWorkedEmployee(selectedDate, workShift)
                this.props.actions.getCheckInOut({
                  shiftId: workShift.id,
                  checkInOutAt: moment(new Date(selectedDate)).format("DD-MM-YYYY"),
                })
              } : () => { }}
            >
              {
                workShift.total_staff_work !== CONSTS.ZERO ?
                  (
                    <img src={require("../../../images/employee-working.png")} />
                  ) :
                  (
                    <img src={require("../../../images/no-employee-off.png")} />
                  )
              }
               &nbsp;
              {workShift.total_staff_work}
            </div>
          </div>
          <div className="card-work-shift__info-item">
            <div>
              {t("calendarManagement.numberOff")}
            </div>
            <div
              className={workShift.total_staff_take_leave !== CONSTS.ZERO ? "info-item-link--selected" : "info-item-link"}
              onClick={workShift.total_staff_take_leave !== CONSTS.ZERO ? () => {
                this.props.showPopupOffEmployee(selectedDate, workShift);
                this.props.actions.getCheckInOut({
                  shiftId: workShift.id,
                  checkInOutAt: moment(new Date(selectedDate)).format("DD-MM-YYYY"),
                });
              } : () => { }}>
              {
                workShift.total_staff_take_leave !== CONSTS.ZERO ?
                  (
                    <img src={require("../../../images/employee-off.png")} />
                  ) :
                  (
                    <img src={require("../../../images/no-employee-off.png")} />
                  )
              }
              &nbsp;
             {workShift.total_staff_take_leave}
            </div>
          </div>
        </div>
      </div>
    );

  }

}




