import React, { Component } from "react";
import Loading from "../../../components/common/Loading";
import "./style.scss";
import DatePickerByDay from "./DatePickerByDay";
import {
  faBars,
  faLessThan,
  faGreaterThan
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as CONSTS from "./../constants";
import { LANGUAGES } from "../../../consts/constants";
import SlickEmployeeDay from "./SlickEmployeeDay";
import PopupAskForOff from "./PopoupAskForOff";
import PopupAddEmployee from "./PopoupAddEmployee";
import Swal from "../../../utils/sweetalert2";
import CardShift from "./CardShift";
import PopupWorkedEmployee from "./PopupWorkedEmployee";
import PopupOffEmployee from "./PopupOffEmployee";
import SlickEmployeeMonth from "./SlickEmployeeMonth";
import CardShiftList from "./CardShiftList";
import PopupAddShift from "./PopoupAddShift";
import PopupOffShiftInfo from "./PopupOffShiftInfo";
import PopupSlickEmployee from "./PopupSlickEmployee";
import moment from "moment";
import Button from "../../../components/common/Button";
import { exportCalendar } from "../../../api/excel";
import common from "../../../utils/common";
import { get } from "../../../services/localStorage";
const infoToken = common.decodeToken(get("accessToken"));
export default class Main extends Component {
  state = {
    showSideBar: true,
    selectedBtn: CONSTS.DAY, // btn Management  Day, Week Or Month => default Day

    selectedDate: new Date(), // Use for day or week management
    selectedDatesInWeek: [], // Use for week management

    selectedMonth: new Date(), // Use for month management
    selectedDatesInMonth: [], // Use for month management

    // Number shift per day => For day management
    numberShifts: 0,
    employeeWorkListInDay: [],
    calendar: 0, // Calendar for day

    calendarWeek: [],  // Calendar for Week
    calendarOfUser: [],  // Calendar for Month

    showPopupAskForOff: false,
    showPopupAddEmployee: false,
    showPopupWorkedEmployee: false,
    showPopupOffEmployee: false,
    showPopupAddShift: false,
    showPopupOffShiftInfo: false,
    showPopupSlickEmployee: false,

    selectedShiftInDay: null,
    selectedShiftIdInWeek: null, // Use for week management
    selectedShiftForPopupSlick: null,
    selectedListShiftInMonth: null,

    selectedEmployeeInDayManagement: null,
    selectedEmployeeInMonthManagement: null,

    isOverTimeCancelWorkShift: false,

    employeeList: this.props.accountList,
    totalShift: this.props.totalShift,
    hasUpdateTotalShift: false,
    disabledDate: true,
  };

  /**
   * Get dates for week management && Get dates for month management
   */
  componentDidMount = () => {
    this.props.actions.getAccountList();
    this.setState({
      selectedDatesInWeek: this.getDates(this.state.selectedDate, null),
      selectedDatesInMonth: this.getDatesInMonth(this.state.selectedMonth.getMonth(), this.state.selectedMonth.getFullYear())
    })
    let currentDate = new Date();
    this.props.actions.getCalendarWeek({
      fromDate: moment(currentDate.setDate(currentDate.getDate() - currentDate.getDay())).format("DD-MM-YYYY"),
      toDate: moment(currentDate.setDate(currentDate.getDate() + 6)).format("DD-MM-YYYY"),
    });
  }

  /**
   * show side bar
   */
  onShowSideBar = () => {
    this.setState({
      showSideBar: !this.state.showSideBar
    })
  }

  /**
   * Change type management ( day || week || month)
   */
  onChangeType = (type) => {
    this.setState({
      selectedBtn: type,
      selectedDate: new Date(),
      selectedShiftIdInWeek: null,
    })
    this.props.actions.getCalendar({
      fromDate: moment(new Date()).format("DD-MM-YYYY"),
      toDate: moment(new Date()).format("DD-MM-YYYY"),
    });
    let { selectedDatesInWeek } = this.state;
    this.props.actions.getCalendarWeek({
      fromDate: moment(new Date(selectedDatesInWeek[0])).format("DD-MM-YYYY"),
      toDate: moment(new Date(selectedDatesInWeek[selectedDatesInWeek.length - 1])).format("DD-MM-YYYY"),
    });
  }

  /**
   * Change selected date
   */
  onChangeDate = (date) => {
    this.setState({
      selectedDate: date
    })
    this.props.actions.getCalendar({
      fromDate: moment(new Date(date)).format("DD-MM-YYYY"),
      toDate: moment(new Date(date)).format("DD-MM-YYYY"),
    });
  }

  /**
   * Get Dates in Week from Sunday -> Saturday
   */
  getDates = (current, info) => {
    // clone object date
    let currentTemp = new Date(current);
    var week = [];
    // Starting Monday not Sunday
    currentTemp.setDate(currentTemp.getDate() - currentTemp.getDay());
    for (var i = 0; i < 7; i++) {
      week.push(new Date(currentTemp));
      currentTemp.setDate(currentTemp.getDate() + 1);
    }
    return week;
  }

  /**
   * Change selected dates in week For week management
   */
  changeSelectedDatesInWeek = (info) => {
    let { selectedDate, selectedDatesInWeek } = this.state;

    if (info === CONSTS.LESS_THAN) {
      selectedDate.setDate(selectedDate.getDate() - 7);
      selectedDatesInWeek = this.getDates(selectedDate, CONSTS.LESS_THAN);
      this.props.actions.getCalendarWeek({
        fromDate: moment(new Date(selectedDatesInWeek[0])).format("DD-MM-YYYY"),
        toDate: moment(new Date(selectedDatesInWeek[6])).format("DD-MM-YYYY"),
      });
      this.setState({
        selectedDate,
        selectedDatesInWeek,
        calendarWeek: [],
      })
    } else {
      selectedDate.setDate(selectedDate.getDate() + 7);
      selectedDatesInWeek = this.getDates(selectedDate, CONSTS.GREATER_THAN);
      this.props.actions.getCalendarWeek({
        fromDate: moment(new Date(selectedDatesInWeek[0])).format("DD-MM-YYYY"),
        toDate: moment(new Date(selectedDatesInWeek[6])).format("DD-MM-YYYY"),
      });
      this.setState({
        selectedDate,
        selectedDatesInWeek,
        calendarWeek: [],
      })
    }
  }

  /**
   * Show popup ask for off
   */
  onShowPopupAskForOff = (selectedShiftInDay, employee) => {
    this.setState({
      showPopupAskForOff: true,
      selectedEmployeeInDayManagement: employee,
      selectedShiftInDay: selectedShiftInDay,
    })
  }

  /**
   * Show popup ask for off month
   */
  onShowPopupAskForOffMonth = (selectedShiftInDay, selectedDate) => {
    this.setState({
      showPopupAskForOff: true,
      selectedShiftInDay: selectedShiftInDay,
      selectedEmployeeInDayManagement: this.state.selectedEmployeeInMonthManagement,
      selectedDate: selectedDate,
    })
  }

  /**
   * Show popup add employee to work shift
   */
  onShowPopupAddEmployee = (selectedShiftInDay) => {
    this.setState({
      showPopupAddEmployee: true,
      selectedShiftInDay: selectedShiftInDay,
    })
  }

  /**
   * Show popup list of worked employee
   */
  onShowPopupWorkedEmployee = (selectedDate, workShiftId) => {
    this.setState({
      showPopupWorkedEmployee: true,
      selectedDate,
      selectedShiftIdInWeek: workShiftId,
    })
  }

  /**
   * Show pupup list of off employee
   */
  onShowPopupOffEmployee = (selectedDate, workShiftId) => {
    this.setState({
      showPopupOffEmployee: true,
      selectedDate,
      selectedShiftIdInWeek: workShiftId,
    })
  }

  /**
   * Show pupup add shift
   */
  onShowPopupAddShift = (selectedDate, selectedListShiftInMonth) => {
    this.setState({
      showPopupAddShift: true,
      selectedDate,
      selectedListShiftInMonth,
    })
  }

  /**
   * Show pupup off shift info
   */
  onShowPopupOffShiftInfo = (overtime, selectedShiftInDay, selectedDate) => {
    this.setState({
      showPopupOffShiftInfo: true,
      isOverTimeCancelWorkShift: overtime === CONSTS.OVER_TIME_CANCEL_WORK_SHIFT,
      selectedShiftInDay,
      selectedDate
    })
  }

  /**
   * Show pupup slick employee
   */
  onshowPopupSlickEmployee = (workShift, disabledDate) => {
    this.setState({
      showPopupSlickEmployee: true,
      selectedShiftForPopupSlick: workShift,
      disabledDate,
    })
  }

  /**
   * Update request for employee leave
   */
  onUpdateEmployeeForBreak = () => {
    const { selectedDate } = this.state;
    this.props.actions.getCalendar({
      fromDate: moment(new Date(selectedDate)).format("DD-MM-YYYY"),
      toDate: moment(new Date(selectedDate)).format("DD-MM-YYYY"),
    });
    this.setState({
      calendar: [{ "date_at": "" }],
    })
  }

  /**
  * Cancel the employee's request for leave
  */
  onUpdateCancelOff = (selectedShiftInDay, idEmloyee) => {
    const t = this.props.t;

    Swal.fire({
      title: t("calendarManagement.swalTitle"),
      text: t("calendarManagement.swalCancelEmployeeForBreak"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("calendarManagement.swalAgree"),
      cancelButtonText: t("calendarManagement.swalCancel"),
    }).then((result) => {
      if (result.value) {
        let { selectedDate, selectedBtn } = this.state;
        const data = {
          user_id: idEmloyee,
          shift_id: selectedShiftInDay,
          take_leave_at: moment(new Date(selectedDate)).format("DD-MM-YYYY"),
        }
        this.props.actions.updateCancelTakeLeave({
          data,
          selectedBtn,
          callback_success: this.showOk,
          callback_fail: this.showErr
        });
        this.setState({
          calendar: [{ "date_at": "" }],
        })
      }
    })
  }


  /**
  * Cancel the employee's request for leave Month
  */
  onUpdateCancelOffForMonth = () => {
    const t = this.props.t;

    Swal.fire({
      title: t("calendarManagement.swalTitle"),
      text: t("calendarManagement.swalCancelEmployeeForBreak"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("calendarManagement.swalAgree"),
      cancelButtonText: t("calendarManagement.swalCancel"),
    }).then((result) => {
      if (result.value) {
        let { selectedBtn, selectedDate, selectedShiftInDay, selectedEmployeeInMonthManagement } = this.state;
        const data = {
          user_id: selectedEmployeeInMonthManagement.user_id,
          shift_id: selectedShiftInDay.id,
          take_leave_at: moment(new Date(selectedDate)).format("DD-MM-YYYY"),
        }
        this.props.actions.updateCancelTakeLeave({
          data,
          selectedBtn,
          selectedDate,
          callback_success: this.showOk,
          callback_fail: this.showErr
        });
      }
    })
  }

  /**
   * Remove non-official employees
   */
  onDeleteEmployee = (selectedShiftInDay, idEmloyee) => {
    const t = this.props.t;
    const { selectedBtn } = this.state;
    Swal.fire({
      title: t("calendarManagement.swalTitle"),
      text: t("calendarManagement.swalDeleteEmployee"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("calendarManagement.swalAgree"),
      cancelButtonText: t("calendarManagement.swalCancel"),
    }).then((result) => {
      if (result.value) {
        let { selectedDate } = this.state;
        const data = {
          user_id: idEmloyee,
          shift_id: selectedShiftInDay,
          overtime_at: moment(new Date(selectedDate)).format("DD-MM-YYYY"),
        }
        this.props.actions.deleteEmployeeToShift({
          data,
          selectedBtn,
          callback_success: this.showOk,
          callback_fail: this.showErr
        });
        this.setState({
          calendar: [{ date_at: "" }],
        })
      }
    })

  }

  /**
   * Remove non-official employees for Month
   */
  onDeleteEmployeeForMonth = (selectedShiftInDay, idEmloyee, selectedDate) => {
    const t = this.props.t;
    const { selectedBtn } = this.state;
    const data = {
      user_id: idEmloyee,
      shift_id: selectedShiftInDay.id,
      overtime_at: moment(new Date(selectedDate)).format("DD-MM-YYYY"),
    }
    this.props.actions.deleteEmployeeToShift({
      data,
      selectedBtn,
      selectedDate,
      callback_success: this.showOk,
      callback_fail: this.showErr
    });
    this.setState({
      calendar: [{ date_at: "" }],
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

  /**
   * Change employee for month management
   */
  onChangeSelectedEmployeeInMonthManagement = employee => {
    this.setState({
      selectedEmployeeInMonthManagement: employee
    })
    const { selectedMonth } = this.state;
    const data = {
      userId: employee.user_id,
      fromDate: moment(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1)).format("DD-MM-YYYY"),
      toDate: moment(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0)).format("DD-MM-YYYY"),
    }
    this.props.actions.getCalendarOfUser(data);

  }

  /**
  * Change month for month management
  */
  changeSelectedMonth = (info) => {
    let { selectedMonth } = this.state;
    selectedMonth.setDate(1);

    if (info === CONSTS.LESS_THAN) {
      selectedMonth.setMonth(selectedMonth.getMonth() - 1);

      this.setState({
        selectedMonth,
        selectedDatesInMonth: this.getDatesInMonth(selectedMonth.getMonth(), selectedMonth.getFullYear())
      })
      this.props.actions.getTotalShift({
        month: selectedMonth.getMonth() + 1,
        year: selectedMonth.getFullYear()
      });
    } else {
      selectedMonth.setMonth(selectedMonth.getMonth() + 1);
      this.setState({
        selectedMonth,
        selectedDatesInMonth: this.getDatesInMonth(selectedMonth.getMonth(), selectedMonth.getFullYear())
      })
      this.props.actions.getTotalShift({
        month: selectedMonth.getMonth() + 1,
        year: selectedMonth.getFullYear()
      });
    }
  }

  /**
  * Get dates in month for month management
  */
  getDatesInMonth = (month, year) => {
    let date = new Date(year, month, 1);
    let previousDate = new Date(year, month, 1);

    let days = [];
    //get day of month
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    //get day of month - 1
    previousDate.setDate(previousDate.getDate() - 1);
    do {
      days.unshift(new Date(previousDate));
      previousDate.setDate(previousDate.getDate() - 1);
    } while (previousDate.getDay() !== 0)
    days.unshift(new Date(previousDate));

    //get day of month + 1
    while (days.length < 42) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  }

  /**
  * Export Shifts of All employee
  */
  exportShift = async () => {
    let partner_id = infoToken.partner_id;
    let user_id = infoToken.sub;
    const { selectedMonth } = this.state;
    let date_at = moment(selectedMonth).format("DD-MM-YYYY");
    try {
      const params = {
        user_id,
        partner_id,
        date_at,
      }
      const response = await exportCalendar({ params });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "export.xlsx"); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.updateFlag && nextProps.updateFlag === true && nextProps.calendar[0]) {
      nextProps.actions.noUpdateUI();
      if (prevState.selectedBtn === CONSTS.DAY) {
        let selectedShiftForPopupSlick = null;
        if (prevState.selectedShiftForPopupSlick) {
          selectedShiftForPopupSlick = nextProps.calendar[0].shifts.filter((workShift) => {
            if (workShift.id === prevState.selectedShiftForPopupSlick.id) {
              return workShift;
            }
          })[0];
        }
        return {
          numberShifts: nextProps.calendar[0].shifts.length,
          employeeWorkListInDay: [...nextProps.calendar[0].shifts],
          calendar: nextProps.calendar,
          selectedShiftForPopupSlick
        }
      } else if (prevState.selectedBtn === CONSTS.WEEK && nextProps.calendar[0] && nextProps.calendarWeek && nextProps.updateFlag === true) {
        let selectedShiftIdInWeek = prevState.selectedShiftIdInWeek;
        if (prevState.selectedShiftIdInWeek) {
          let currentDate = new Date(prevState.selectedDate).getDate();
          let listShifts = nextProps.calendarWeek.filter(calendarDay => {
            if (new Date(calendarDay.date_at).getDate() === currentDate) {
              return calendarDay;
            }
          })[0].shifts;
          selectedShiftIdInWeek = listShifts.filter(shift => {
            if (shift.id === prevState.selectedShiftIdInWeek.id) {
              return shift;
            }
          })[0]
        }
        return {
          calendarWeek: [...nextProps.calendarWeek],
          selectedShiftIdInWeek
        };
      } else if (prevState.selectedBtn === CONSTS.MONTH && nextProps.calendarOfUser && nextProps.updateFlag === true) {
        return {
          calendarOfUser: [...nextProps.calendarOfUser],
          totalShift: [...nextProps.totalShift],
          hasUpdateTotalShift: true,
        }
      } else if (nextProps.totalShift.length !== 0) {
        return {
          totalShift: [...nextProps.totalShift],
          hasUpdateTotalShift: true,
        }
      }
      return null;
    }
    return null;
  }

  isSameDay = (firstDate, secondDate) => {
    if (
      firstDate.getDate() === secondDate.getDate() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getFullYear() === secondDate.getFullYear()
    ) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { ...rest } = this.props;
    const { t } = this.props;
    const {
      showSideBar,
      selectedBtn,
      selectedDate,
      selectedMonth,
      numberShifts,
      showPopupAskForOff,
      showPopupAddEmployee,
      showPopupWorkedEmployee,
      showPopupOffEmployee,
      showPopupAddShift,
      showPopupOffShiftInfo,
      showPopupSlickEmployee,
      employeeWorkListInDay,
      selectedEmployeeInDayManagement,
      selectedShiftInDay,
      selectedDatesInWeek,
      selectedShiftIdInWeek,
      selectedListShiftInMonth,
      selectedEmployeeInMonthManagement,
      selectedDatesInMonth,
      isOverTimeCancelWorkShift,
      calendarWeek,
      selectedShiftForPopupSlick,
      calendarOfUser,
      totalShift,
      hasUpdateTotalShift,
      disabledDate
    } = this.state;

    return (
      <main id="site-main" className="nofooter">
        <div id="primary" className="no-footer p-management clear">
          <section id="main-cont" className="full clear">
            <Loading show={this.props.isLoading} />
            <aside className="view-table">
              <div className="view-table-cell">
                <div id="manage-calendar" className="popup-box inner-box">

                  <aside className="e-row e-col-12 manage-calendar__title">
                    <span className="flex-1"></span>
                    <h3 className="flex-1 main-lbl text-center">
                      {t("calendarManagement.title")}
                    </h3>

                    {
                      selectedBtn === CONSTS.MONTH ?
                        (
                          <span className="flex-1 e-flex content-center item-center flex-no-wrap ">
                            <button className="export-check-in-out">
                              {t("calendarManagement.exportCheckInOut")}
                            </button>
                            <button className="export-shift-list" onClick={this.exportShift}>
                              {t("calendarManagement.exportEmployeeList")}
                            </button>
                          </span>
                        )
                        : (
                          <span className="flex-1"></span>
                        )
                    }

                  </aside>

                  <aside className="manage-calendar__content top-acts e-row e-col-12 e-flex" >

                    <div className={showSideBar && selectedBtn === CONSTS.DAY ? "manage-calendar__content-date w-auto e-p-left-10 e-p-right-10" : showSideBar && selectedBtn === CONSTS.MONTH ? "manage-calendar__content-date e-col-2 " : "manage-calendar__content-date hide"}>
                      {
                        selectedBtn === CONSTS.DAY ?
                          (
                            <DatePickerByDay
                              onChangeDate={(date) => { this.onChangeDate(date) }}
                              startDate={selectedDate}

                            >

                            </DatePickerByDay>
                          )
                          :
                          (
                            <SlickEmployeeMonth {...rest}
                              changeSelectedEmployeeInMonthManagement={(employee) => {
                                this.onChangeSelectedEmployeeInMonthManagement(employee);
                              }}
                              selectedEmployeeInMonthManagement={selectedEmployeeInMonthManagement}
                              employeeList={totalShift}
                              hasUpdateTotalShift={hasUpdateTotalShift}
                              updateFinish={() => {
                                this.setState({
                                  hasUpdateTotalShift: false,
                                })
                              }}
                              {...rest}

                            />

                          )



                      }

                    </div>

                    <div className={showSideBar && selectedBtn === CONSTS.DAY ? "manage-calendar__content-time-table flex-1 m-w-0" : showSideBar && selectedBtn === CONSTS.MONTH ? "manage-calendar__content-time-table e-col-10" : "manage-calendar__content-time-table e-col-12"}>
                      <div className="time-table__tool e-col-12 e-row e-flex">
                        {
                          selectedBtn === CONSTS.DAY ?
                            (
                              <a className="hamburger hamburger-day" onClick={() => { this.onShowSideBar() }}>
                                <FontAwesomeIcon icon={faBars} />
                              </a>
                            )
                            :
                            selectedBtn === CONSTS.WEEK ?
                              (
                                <span className="instead-hamburger"></span>
                              ) :
                              (
                                <a className="hamburger hamburger-month" onClick={() => { this.onShowSideBar() }}>
                                  <FontAwesomeIcon icon={faBars} />
                                  <span className="employee-name">
                                    {
                                      selectedEmployeeInMonthManagement !== null ?
                                        (
                                          selectedEmployeeInMonthManagement.full_name
                                        ) : null
                                    }
                                  </span>
                                </a>
                              )
                        }

                        <div className="group-btn-time ">
                          <button className={selectedBtn === CONSTS.DAY ? "btn btn_day btn--selected" : "btn btn_day"}
                            onClick={() => { this.onChangeType(CONSTS.DAY) }}
                          >
                            {t("calendarManagement.day")}
                          </button>
                          <button className={selectedBtn === CONSTS.WEEK ? "btn btn_week btn--selected" : "btn btn_week"}
                            onClick={() => { this.onChangeType(CONSTS.WEEK) }}
                          >
                            {t("calendarManagement.week")}
                          </button>
                          <button className={selectedBtn === CONSTS.MONTH ? "btn btn_month btn--selected" : "btn btn_month"}
                            onClick={() => { this.onChangeType(CONSTS.MONTH) }}
                          >
                            {t("calendarManagement.month")}
                          </button>
                        </div>
                        {
                          selectedBtn === CONSTS.WEEK ?
                            (
                              <div className="group-btn-export ">
                                <span className="e-m-right-15">
                                  <Button className="export-btn"onClick={() => {}}>{t("calendarManagement.exportExcel")}</Button>
                                </span>
                                <span className="btn less-than-btn" onClick={() => {
                                  this.changeSelectedDatesInWeek(CONSTS.LESS_THAN)
                                }}>
                                  <FontAwesomeIcon icon={faLessThan} />
                                </span>

                                <span className="btn greater-than-btn" onClick={() => {
                                  this.changeSelectedDatesInWeek(CONSTS.GREATER_THAN)
                                }}>
                                  <FontAwesomeIcon icon={faGreaterThan} />
                                </span>

                              </div>
                            ) :
                            selectedBtn === CONSTS.MONTH ?
                              (
                                <div className="group-btn-export group-btn-export-month">
                                  <span className="e-m-right-15">
                                    <Button className="export-btn" onClick={() => {}}>{t("calendarManagement.exportExcel")}</Button>
                                  </span>
                                  <span className="btn less-than-btn" onClick={() => {
                                    this.changeSelectedMonth(CONSTS.LESS_THAN);
                                  }}>
                                    <FontAwesomeIcon icon={faLessThan} />
                                  </span>
                                  <span className="month-text">{t("calendarManagement.month")} {selectedMonth.getMonth() + 1}</span>
                                  <span className="btn greater-than-btn" onClick={() => {
                                    this.changeSelectedMonth(CONSTS.GREATER_THAN);
                                  }}>
                                    <FontAwesomeIcon icon={faGreaterThan} />
                                  </span>

                                </div>
                              )
                              :
                              (
                                <div className="group-btn-export group-btn-export-day">
                                  <Button className="export-btn" onClick={() => {}}>{t("calendarManagement.exportExcel")}</Button>
                                </div>

                              )
                        }
                      </div>


                      <div className="manage-calendar__content-time-now e-col-12 e-flex"
                        style={{
                          alignItems: `${selectedBtn === CONSTS.DAY ? "flex-start" : selectedBtn === CONSTS.WEEK ? "center" : null}`,
                          padding: `${selectedBtn === CONSTS.DAY ? "0px 0px 0px 5px" : selectedBtn === CONSTS.WEEK ? "0px 12.5px" : "0px"}`
                        }}
                      >
                        {
                          selectedBtn === CONSTS.DAY ?
                            (
                              <>
                                <div className="day-of-week-now">
                                  {this.props.t("currentLang") === LANGUAGES.vietnam ? CONSTS.DAYS_VN[selectedDate.getDay()] : (this.props.t("currentLang") === LANGUAGES.english ? CONSTS.DAYS_EN[selectedDate.getDay()] : CONSTS.DAYS_JP[selectedDate.getDay()])}
                                </div>
                                <div className="day-of-month-now">
                                  {t("calendarManagement.day")} {selectedDate.getDate()}
                                </div>
                              </>
                            ) : null
                        }
                        {
                          selectedBtn === CONSTS.WEEK ?
                            selectedDatesInWeek.map((date, index) => {
                              return (
                                <div className="day-of-week-item" key={index}>
                                  <div className="day-of-week-now">
                                    {this.props.t("currentLang") === LANGUAGES.vietnam ? CONSTS.DAYS_VN[date.getDay()] : (this.props.t("currentLang") === LANGUAGES.english ? CONSTS.DAYS_EN[date.getDay()] : CONSTS.DAYS_JP[date.getDay()])}
                                  </div>
                                  <div className="day-of-month-now">
                                    {date.getDate()} - {date.getMonth() + 1}
                                  </div>
                                </div>
                              )
                            })
                            : null
                        }
                        {
                          selectedBtn === CONSTS.MONTH ?
                            (
                              <div className="date-in-week-of-month">
                                {
                                  this.props.t("currentLang") === LANGUAGES.vietnam ?

                                    CONSTS.DAYS_VN.map((date, index) => {
                                      return (
                                        <div key={index} className="flex-1">
                                          {date}
                                        </div>
                                      )
                                    })
                                    : this.props.t("currentLang") === LANGUAGES.english ?

                                      CONSTS.DAYS_EN.map((date, index) => {
                                        return (
                                          <div key={index} className="flex-1">
                                            {date}
                                          </div>
                                        )
                                      })

                                      :

                                      CONSTS.DAYS_JP.map((date, index) => {
                                        return (
                                          <div key={index} className="flex-1">
                                            {date}
                                          </div>
                                        )
                                      })
                                }
                              </div>

                            )


                            : null
                        }
                      </div>


                      <div className="manage-calendar__content-time-grid e-col-12 e-row"
                        style={{
                          padding: `${selectedBtn === CONSTS.MONTH ? "0px" : "10px 0px  10px 10px"}`
                        }}

                      >
                        {
                          selectedBtn === CONSTS.DAY ?
                            (
                              <>
                                {
                                  CONSTS.TIME_GRID.map((time, index) => {
                                    return (
                                      <div key={index} className="wrap-time-line">
                                        <p className="time-line">
                                          {time}
                                        </p>
                                        <span
                                          className="time-line-black"
                                          style={{
                                            width: `${numberShifts * CONSTS.WIDTH_MAX + CONSTS.DISTANCE_LEFT_PARENT_WITH_FIRST_WORK_SHIFT + (numberShifts - 1) * CONSTS.DISTANCE_BETWEEN_TWO_WORK_SHIFTS}px`,

                                            minWidth: `2000px`
                                          }}
                                        >
                                        </span>
                                      </div>
                                    )

                                  })
                                }
                                {
                                  employeeWorkListInDay.length > 0 ?
                                    (
                                      employeeWorkListInDay.map((workShift, index) => {
                                        return (
                                          <SlickEmployeeDay key={index}
                                            workShift={workShift}
                                            numericalOrder={index}
                                            deleteEmployee={(selectedShiftInDay, idEmployee) => {
                                              this.onDeleteEmployee(selectedShiftInDay, idEmployee)
                                            }}
                                            updateCancelOff={(selectedShiftInDay, idEmployee) => {
                                              this.onUpdateCancelOff(selectedShiftInDay, idEmployee)
                                            }}
                                            showPopupAskForOff={(selectedShiftInDay, Employee) => {
                                              this.onShowPopupAskForOff(selectedShiftInDay, Employee)
                                            }}
                                            showPopupAddEmployee={(selectedShiftInDay) => {
                                              this.onShowPopupAddEmployee(selectedShiftInDay)
                                            }}
                                            showPopupSlickEmployee={(workShift, disabledDate) => {
                                              this.onshowPopupSlickEmployee(workShift,disabledDate);
                                            }}
                                            disabledDate={
                                              selectedDate < new Date() && !this.isSameDay(selectedDate, new Date())
                                            }
                                            {...rest}
                                          >
                                          </SlickEmployeeDay>
                                        )
                                      })
                                    ) : null
                                }
                                <div className="show-right-parent"
                                  style={{
                                    width: `${numberShifts * CONSTS.WIDTH_WORK_SHIFT + CONSTS.DISTANCE_LEFT_PARENT_WITH_FIRST_WORK_SHIFT + (numberShifts - 1) * CONSTS.DISTANCE_BETWEEN_TWO_WORK_SHIFTS + CONSTS.DISTANCE_BETWEEN_LAST_WORK_SHIFT_WITH_RIGHT_PARENT}px`
                                  }}
                                >

                                </div>
                              </>
                            ) : null
                        }
                        {

                          selectedBtn === CONSTS.WEEK && calendarWeek.length !== 0 ?
                            (
                              <>
                                {
                                  calendarWeek.map((workShiftList, dateIndex) => {

                                    return (
                                      <div key={dateIndex} className="card-work-shift-list">
                                        {
                                          workShiftList.shifts.map((workShift, index) => {
                                            return (
                                              <CardShift key={index}
                                                workShiftList={index}
                                                workShift={workShift}
                                                selectedDate={selectedDatesInWeek[dateIndex]}
                                                showPopupWorkedEmployee={(selectedDate, workShiftId) => {
                                                  this.onShowPopupWorkedEmployee(selectedDate, workShiftId)
                                                }}
                                                showPopupOffEmployee={(selectedDate, workShiftId) => {
                                                  this.onShowPopupOffEmployee(selectedDate, workShiftId)
                                                }}
                                                {...rest}
                                              >

                                              </CardShift>
                                            )
                                          })
                                        }
                                      </div>
                                    )
                                  })
                                }
                              </>
                            )
                            : null

                        }
                        {
                          selectedBtn === CONSTS.MONTH && calendarOfUser.length === 0 ?
                            (
                              <div className="card-work-shift-calendar">
                                {
                                  selectedDatesInMonth.map((date, index) => {
                                    if (date.getMonth() === selectedMonth.getMonth()) {
                                      return (
                                        <div key={index} className={date.getDay() === 0 ? "card-work-shift-item bgc-white" : "card-work-shift-item"}
                                        >
                                          <div className="day-in-month">
                                            {date.getDate()}

                                          </div>
                                          <CardShiftList
                                            {...rest}
                                          />
                                        </div>
                                      )
                                    } else {
                                      return (
                                        <div key={index} className="card-work-shift-item--out">
                                          <div className="day-in-month">
                                            {date.getDate()}
                                          </div>
                                        </div>
                                      )
                                    }
                                  })
                                }
                              </div>
                            ) : selectedBtn === CONSTS.MONTH && calendarOfUser.length !== 0 ?
                              (
                                <div className="card-work-shift-calendar">
                                  {
                                    selectedDatesInMonth.map((date, index) => {
                                      if (date.getMonth() === selectedMonth.getMonth()) {
                                        return calendarOfUser.map(calendarDay => {
                                          if (new Date(calendarDay.date_at).getDate() === date.getDate()) {
                                            return (
                                              <div key={calendarDay.date_at} className={date.getDay() === 0 ? "card-work-shift-item bgc-white" : "card-work-shift-item"}
                                              >
                                                <div className={date.getDate() === new Date().getDate() ? "day-in-month day-current" : "day-in-month"}>
                                                  {date.getDate()}
                                                </div>
                                                <CardShiftList
                                                  currentDay={new Date()}
                                                  dayOfShift={date}
                                                  calendarDay={calendarDay}
                                                  showPopupAddShift={(selectedDate, selectedListShiftInMonth) => {
                                                    this.onShowPopupAddShift(selectedDate, selectedListShiftInMonth);
                                                  }}

                                                  showPopupOffShiftInfo={(overtime, selectedShiftInDay, selectedDate) => {
                                                    this.onShowPopupOffShiftInfo(overtime, selectedShiftInDay, selectedDate);
                                                  }}

                                                  deleteEmployee={(selectedShiftInDay, selectedDate) => {
                                                    this.onDeleteEmployeeForMonth(selectedShiftInDay, selectedEmployeeInMonthManagement.user_id, selectedDate)
                                                  }}

                                                  showPopupAskForOff={(selectedShiftInDay, selectedDate) => {
                                                    this.onShowPopupAskForOffMonth(selectedShiftInDay, selectedDate)
                                                  }}
                                                  {...rest}
                                                />
                                              </div>
                                            )
                                          }
                                        })
                                      } else {
                                        return (
                                          <div key={index} className="card-work-shift-item--out">
                                            <div className="day-in-month">
                                              {date.getDate()}
                                            </div>
                                          </div>
                                        )
                                      }
                                    })
                                  }
                                </div>

                              ) : null
                        }
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </aside>
          </section>
        </div>
        {
          showPopupAskForOff ?
            (
              <PopupAskForOff
                {...rest}
                hide={() => {
                  this.setState({
                    showPopupAskForOff: false
                  })
                }}
                selectedBtn={selectedBtn}
                selectedDatesInWeek={selectedDatesInWeek}
                selectedDate={selectedDate}
                selectedEmployeeInDayManagement={selectedEmployeeInDayManagement}
                selectedShiftInDay={selectedShiftInDay}
                updateEmployeeForBreak={() => {
                  this.onUpdateEmployeeForBreak()
                }}
              >
              </PopupAskForOff>
            ) : null
        }
        {
          showPopupAddEmployee ?
            (
              <PopupAddEmployee
                {...rest}
                hide={() => {
                  this.setState({
                    showPopupAddEmployee: false
                  })
                }}
                selectedDate={selectedDate}
                workShift={selectedShiftInDay}
              />
            ) : null
        }
        {
          showPopupWorkedEmployee ?
            (
              <PopupWorkedEmployee
                {...rest}
                hide={() => {
                  this.setState({
                    showPopupWorkedEmployee: false
                  })
                }}
                workShift={selectedShiftIdInWeek}
                selectedDate={selectedDate}
                showPopupAskForOff={(selectedShiftInDay, Employee) => {
                  this.onShowPopupAskForOff(selectedShiftInDay, Employee)
                }}
              />
            ) : null
        }
        {
          showPopupOffEmployee ?
            (
              <PopupOffEmployee
                {...rest}
                workShift={selectedShiftIdInWeek}
                selectedDate={selectedDate}
                hide={() => {
                  this.setState({
                    showPopupOffEmployee: false
                  })
                }}
              />
            ) : null
        }

        {
          showPopupAddShift ?
            (
              <PopupAddShift
                {...rest}
                selectedDate={selectedDate}
                employee={selectedEmployeeInMonthManagement}
                selectedListShiftInMonth={selectedListShiftInMonth}
                hide={() => {
                  this.setState({
                    showPopupAddShift: false
                  })
                }}
              />
            ) : null
        }

        {
          showPopupOffShiftInfo ?
            (
              <PopupOffShiftInfo
                {...rest}
                selectedDate={selectedDate}
                isOverTimeCancelWorkShift={isOverTimeCancelWorkShift}
                updateCancelOffForMonth={() => {
                  this.onUpdateCancelOffForMonth();
                }}
                hide={() => {
                  this.setState({
                    showPopupOffShiftInfo: false
                  })
                }}
              />
            ) : null
        }
        {
          showPopupSlickEmployee ?
            (
              <PopupSlickEmployee
                {...rest}
                workShift={selectedShiftForPopupSlick}
                disabledDate={disabledDate}
                hide={() => {
                  this.setState({
                    showPopupSlickEmployee: false
                  })
                }}
                deleteEmployee={(selectedShiftInDay, idEmployee) => {
                  this.onDeleteEmployee(selectedShiftInDay, idEmployee)
                }}
                updateCancelOff={(selectedShiftInDay, idEmployee) => {
                  this.onUpdateCancelOff(selectedShiftInDay, idEmployee)
                }}
                showPopupAskForOff={(selectedShiftInDay, Employee) => {
                  this.onShowPopupAskForOff(selectedShiftInDay, Employee)
                }}
                showPopupAddEmployee={(selectedShiftInDay) => {
                  this.onShowPopupAddEmployee(selectedShiftInDay)
                }}
                showPopupSlickEmployee={(workShift) => {
                  this.onshowPopupSlickEmployee(workShift);
                }}
              />
            ) : null
        }
      </main >
    );
  }
}
