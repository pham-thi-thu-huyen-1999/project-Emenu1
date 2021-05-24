import React, { Component } from "react";
import Swal from "../../../utils/sweetalert2";
import * as CONSTS from "../constants";
import Dialog from "../../../components/common/Dialog";
import Button from "../../../components/common/Button";
import Slider from "react-slick";
import {
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default class PopupSlickEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedShiftIdInDay: this.props.workShift.id,
      indexSlide: 0,
    };
  }

  previous = () => {
    this.slider.slickPrev();
  };

  next = () => {
    this.slider.slickNext();
  };

  /**
  * Delete employee
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
  render() {
    const { hide, t, workShift, disabledDate } = this.props;
    const { indexSlide } = this.state;
    const employeeList = workShift ? this.props.workShift.users : [];
    let settings = {
      infinite: false,
      slidesToShow: 6,
      slidesPerRow: 2,
      vertical: true,
      draggable: false,
      arrows: false,
      totalOnOnePage: 12,
      afterChange: current => this.setState({ indexSlide: current })
    }
    return (
      <Dialog
        show={true}
        close={() => this.props.hide()}
        innerClass="popup-show-employee"
      >
        <div className="popup-show-employee__content e-row e-col-12">
          <div className="title e-row e-col-12 e-flex content-center">
            DANH SÁCH NHÂN VIÊN CA LÀM THÊM
          </div>
          <div className="e-row e-col-12 e-flex">
            <div className="employee">

              <div className="managed-employee-list">
                <div className="slider slick-initialized slick-slider slick-vertical">
                  {employeeList.length <= settings.slidesToShow ? null : (
                    <button
                      className={`slick-arrow slick-prev arrow-up ${indexSlide <= 0 ? "slick-disabled" : null
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
                                  disabledDate ?
                                    <div className="status-calendar">Xin nghỉ</div> :
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
                        className={`slick-arrow slick-next arrow-down ${indexSlide * 2 + settings.totalOnOnePage >= employeeList.length ? "slick-disabled" : null
                          }`}
                        style={{ display: "block", bottom: "40%", right: "0", left: "unset" }}
                        onClick={this.next}
                      ></button>
                    ) : null}
                  </div>

                </div>

              </div>
            </div>
          </div>


        </div>
        <aside
          className="e-row e-col-12 e-flex content-center"
        >
          <Button onClick={() => { this.props.hide(); }} >Ok</Button>
        </aside>
      </Dialog>


    );
  }
}




