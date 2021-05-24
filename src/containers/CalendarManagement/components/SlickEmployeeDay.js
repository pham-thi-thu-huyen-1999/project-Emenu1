import React, { Component } from "react";
import Slider from "react-slick";
import {
  faBars,
  faPlusCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as CONSTS from "../constants";
import _ from 'lodash';
class SlickEmployeeDay extends Component {
  state = {
    selectedShiftIdInDay: this.props.workShift.id,
    slickIndex: 0,
    indexSlide: 0,
  };

  next = () => {
    this.slider.slickNext();
  };

  /**
   * Remove non-official employees
   */
  deleteEmployee = (id) => {
    const { selectedShiftIdInDay } = this.state;

    this.props.deleteEmployee(selectedShiftIdInDay, id);
  }

  /**
  * Cancel the employee's request for leave
  */
  updateCancelOff = (id) => {
    const { selectedShiftIdInDay } = this.state;

    this.props.updateCancelOff(selectedShiftIdInDay, id);
  }

  previous = () => {
    this.slider.slickPrev();
  };
  render() {

    const { indexSlide, selectedShiftIdInDay } = this.state;
    let { numericalOrder, t, workShift, disabledDate } = this.props;
    let startTime = workShift.start_time;
    let endTime = workShift.end_time;
    let employeeList = workShift.users;
    startTime = _.parseInt(_.split(startTime, ":", 1));
    endTime = _.parseInt(_.split(endTime, ":", 1));
    let slidesToShow = 0;
    if (endTime >= startTime) {
      slidesToShow = endTime - startTime - 1;
    } else {
      slidesToShow = (24 - startTime) + (endTime - 0) - 1;
    }
    let settings = {
      infinite: false,
      slidesToShow,
      slidesToScroll: 1,
      vertical: true,
      draggable: false,
      arrows: false,
      afterChange: current => this.setState({ indexSlide: current })
    }
    let top = startTime * CONSTS.DISTANCE_BETWEEN_TWO_ROW + CONSTS.DISTANCE_FIRST_ROW_WITH_TOP_PARENT;
    let left = (CONSTS.DISTANCE_LEFT_PARENT_WITH_FIRST_WORK_SHIFT + numericalOrder * CONSTS.WIDTH_WORK_SHIFT) + (numericalOrder * CONSTS.DISTANCE_BETWEEN_TWO_WORK_SHIFTS);
    let height = 0;
    if (slidesToShow <= 0) {
      slidesToShow = 1;
      height = slidesToShow * CONSTS.DISTANCE_BETWEEN_TWO_ROW;
    } else {
      height = (endTime - startTime) * CONSTS.DISTANCE_BETWEEN_TWO_ROW;
    }
    return (

      slidesToShow > 2 ?
        (
          <div className="employee"
            style={{
              top,
              left,
              height,
            }}
          >

            <div className="managed-employee-list">

              <div className="managed-employee-list__title">
                <div className="name-work-shift">
                  {workShift.name}
                </div>
                {
                  disabledDate ? null : <div className="btn-add-employee" onClick={() => this.props.showPopupAddEmployee(workShift)}>
                  <FontAwesomeIcon icon={faPlusCircle} />
                </div>
                }
              </div>
              <div className="slider slick-initialized slick-slider slick-vertical">
                {employeeList.length <= settings.slidesToShow ? null : (
                  <button
                    className={`slick-arrow slick-prev arrow-up ${
                      indexSlide <= 0 ? "slick-disabled" : null
                      }`}
                    style={{ display: "block", top: "30%", right: "0", left: "unset" }}
                    onClick={this.previous}
                  ></button>
                )}

                <div className="slick-list draggable" style={{ height: `${settings.slidesToShow * CONSTS.DISTANCE_BETWEEN_TWO_ROW}px` }}>
                  <div
                    className="slick-track"
                    style={{
                      opacity: 1,
                      transform: "translate3d(0px, 0px, 0px)",
                      height: `${settings.slidesToShow * CONSTS.DISTANCE_BETWEEN_TWO_ROW}px`
                    }}
                  >
                    {employeeList.length === 0 ? (
                      <div style={{ textAlign: "center" }}>

                      </div>
                    ) : null}
                    <Slider ref={c => (this.slider = c)} {...settings}>
                      {employeeList.map((employee, index) => (
                        <div key={index} className="employee-card e-row">
                          <div className="employee-card-info__name">
                            {employee.full_name}
                            <span className="info-breaked">
                              {
                                employee.status_calendar === 3 ? t("calendarManagement.tookLeave") : null
                              }
                            </span>
                          </div>
                          {

                            employee.status_calendar === 3 ?
                              (
                                disabledDate ? <div className="status-calendar">xin nghỉ</div> :
                                <div className="btn-break btn-cancel-break" onClick={() => {
                                  this.updateCancelOff(employee.id)
                                }}>
                                  {t("calendarManagement.cancelLeave")}
                                </div>

                              ) : employee.status_calendar === 1 ?
                                (
                                  disabledDate ? null :
                                  <div className="btn-break" onClick={() => this.props.showPopupAskForOff(workShift, employee)}>
                                    {t("calendarManagement.registrationBreak")}
                                  </div>
                                ) :
                                (
                                  disabledDate ? <div className="status-calendar">Làm thêm</div> :
                                  <div className="btn-delete" onClick={() => {
                                    this.deleteEmployee(employee.id)
                                  }}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                  </div>
                                )

                          }
                        </div>
                      ))}
                    </Slider>
                  </div>

                  {employeeList.length > settings.slidesToShow ? (
                    <button
                      className={`slick-arrow slick-next arrow-down ${
                        indexSlide + settings.slidesToShow >= employeeList.length ? "slick-disabled" : null
                        }`}
                      style={{ display: "block", bottom: "40%", right: "0", left: "unset" }}
                      onClick={this.next}
                    ></button>
                  ) : null}
                </div>

              </div>

            </div>
          </div>

        )
        :
        (
          <div className="employee"
            style={{
              top,
              left,
              height,
            }}
          >

            <div className="managed-employee-list">

              <div className="managed-employee-list__title">
                <div className="name-work-shift">
                  {workShift.name}
                </div>
                <div className="group-action">
                  <span className="btn-show-employee" onClick={() => this.props.showPopupSlickEmployee(workShift, disabledDate)}>
                    <FontAwesomeIcon icon={faBars} />
                  </span>
                  {
                    disabledDate ? null : <span className="btn-add-employee" onClick={() => this.props.showPopupAddEmployee(workShift)}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </span>
                  }
                </div>
              </div>
            </div>
          </div>
        )


    );
  }
}

export default SlickEmployeeDay;
