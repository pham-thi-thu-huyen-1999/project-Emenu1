import React, { Component } from "react";
import * as CONSTS from "../constants";
import {
  faPlusCircle,
  faTimesCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "../../../utils/sweetalert2";
export default class CardShiftList extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  showAlertCancelSubShift = (workShift, selectedDate) => {
    const t = this.props.t;

    Swal.fire({
      title: t("calendarManagement.swalTitle"),
      text: "",
      html:
        (
          <>
            <div>
              Hủy ca 3 làm thêm (Thứ 3 ngày 29 tháng 7)của
              nhân viên Nguyễn Văn A ?
          </div>
            <div>
              <i>{t("calendarManagement.reason")} Bận việc đột xuất nên không đi làm được
            {t("calendarManagement.thankYou")}</i>
            </div>
          </>
        )
      ,
      customClass: {
        content: 'text-align-left',
        confirmButton: 's-btn',
        cancelButton: 's-btn s2'
      },
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: t("calendarManagement.swalCancel"),
      confirmButtonText: t("calendarManagement.swalAgree"),
    }).then((result) => {
      if (result.isConfirmed === true) {
        this.props.deleteEmployee(workShift, selectedDate);
      }
    })
  }

  showOk = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'success',
      text: t("calendarManagement.swalUpdateSuccess"),
      title: t("calendarManagement.swalTitle")
    })
  }

  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'error',
      title: t("calendarManagement.swalTitle"),
      text: t("calendarManagement.swalUpdateFail"),
    })
  }
  render() {
    const { currentDay, dayOfShift, calendarDay, t } = this.props;
    return (
      <>
        {
          calendarDay ?
            (
              <>
                <ul className="card-work-shift-every-day">
                  {
                    calendarDay.shifts.map((workShift, index) => {
                      if ((currentDay <= dayOfShift) || (currentDay.getDate() === dayOfShift.getDate() && currentDay.getMonth() === dayOfShift.getMonth() && currentDay.getFullYear() === dayOfShift.getFullYear())) {
                        if (workShift.status_calendar === CONSTS.OFF) {
                          return (
                            <li className="main-shift-item" key={index} onClick={() => {
                              this.props.showPopupOffShiftInfo(CONSTS.NO_OVER_TIME_CANCEL_WORK_SHIFT, workShift, dayOfShift);
                            }}>
                              <span className="txt-line-through txt-italic">{workShift.name}</span>
                              <span className="btn-warning"><FontAwesomeIcon icon={faExclamationCircle} /></span>
                            </li>
                          )
                        } else if (workShift.status_calendar === CONSTS.WORK_PART_TIME) {
                          return (
                            <li key={index} className="part-time-work-shift" >
                              <span>{workShift.name}</span>
                              <span className="btn-delete"
                                onClick={() => {
                                  this.showAlertCancelSubShift(workShift, dayOfShift);
                                }}
                              >
                                <FontAwesomeIcon icon={faTimesCircle} />
                              </span>
                            </li>

                          )
                        } else if (workShift.status_calendar === CONSTS.WORK) {
                          return (
                            <li className="main-shift-item" key={index} onClick={() => {
                              this.props.showPopupAskForOff(workShift, dayOfShift);
                            }}>
                              <span className="txt-underline txt-italic">{workShift.name}</span>
                            </li>
                          )
                        }
                      } else {
                        if (workShift.status_calendar === CONSTS.OFF) {
                          return (
                            <li className="main-shift-item" key={index} onClick={() => {
                              this.props.showPopupOffShiftInfo(CONSTS.OVER_TIME_CANCEL_WORK_SHIFT);
                            }} >
                              <span className="txt-line-through txt-italic">{workShift.name}</span>
                              <span className="btn-warning"><FontAwesomeIcon icon={faExclamationCircle} /></span>
                            </li>

                          )
                        } else {
                          return (
                            <li key={index} >
                              {workShift.name}
                            </li>
                          )
                        }
                      }
                    })
                  }

                </ul>
                {
                  (currentDay <= dayOfShift) || (currentDay.getDate() === dayOfShift.getDate() && currentDay.getMonth() === dayOfShift.getMonth() && currentDay.getFullYear() === dayOfShift.getFullYear()) ?
                    (
                      <span
                        className="btn-add-work-shift"
                        onClick={() => {
                          this.props.showPopupAddShift(dayOfShift, calendarDay.shifts)
                        }}
                      >
                        <FontAwesomeIcon icon={faPlusCircle} />
                      </span>
                    ) : null

                }
              </>
            ) :
            (
              <>
                <ul className="card-work-shift-every-day">

                </ul>

              </>
            )
        }
      </>
    );

  }

}




