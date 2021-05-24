import React from "react";
import "../../styles.scss";
import { connect } from "react-redux";
import * as action from "../../actions";
import { bindActionCreators, compose } from "redux";
import { name } from "../../reducers";
import { withNamespaces } from "react-i18next";
import _ from "lodash";
import Loading from "../../../../components/common/Loading";
import { withRouter } from "react-router-dom";
import Button from "../../../../components/common/Button";
import moment from "moment";
import * as CONSTS from "../../consts";
import { faLessThan, faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES } from "../../../../consts/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardShift from "./CardShift";
import CardShiftList from "./CardShiftList";
import { get } from "../../../../services/localStorage";
import common from "../../../../utils/common";
const user_id = common.decodeToken(get("accessToken")).sub;
class CalendarStaffPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      selectedMonth: new Date(), // Use for month management
      workingCategory: CONSTS.WEEK,
      selectedDatesInWeek: this.getDatesInWeek(new Date(), null), // Use for week management
      calendarOfUserByMonth: [],
      calendarOfUserByWeek: [],
      selectedDatesInMonth: [],

      showShiftInfoWeek: false,
      atCheckInPage: props.atCheckInPage,
      currentDate: new Date(),
    };
    this.props.actions.getListShift();
    const data = {
      userId: user_id,
      fromDate: moment(this.state.selectedDatesInWeek[0]).format("DD-MM-YYYY"),
      toDate: moment(this.state.selectedDatesInWeek[6]).format("DD-MM-YYYY"),
    };
    this.props.actions.getCalendarOfUserByWeek(data);
  }

  componentDidMount() {
    this.setState({
      selectedDatesInMonth: this.getDatesInMonth(
        this.state.selectedMonth.getMonth(),
        this.state.selectedMonth.getFullYear()
      ),
    });
  }

  changeTime = (info) => {
    const { workingCategory } = this.state;
    if (workingCategory === CONSTS.WEEK) {
      this.changeSelectedDatesInWeek(info);
    } else {
      this.changeSelectedMonth(info);
    }
  };

  /**
   * Change selected dates in week For week management
   */
  changeSelectedDatesInWeek = (info) => {
    let { selectedDate, selectedDatesInWeek } = this.state;
    if (info === CONSTS.LESS_THAN) {
      selectedDate.setDate(selectedDate.getDate() - 7);
      selectedDatesInWeek = this.getDatesInWeek(selectedDate, CONSTS.LESS_THAN);
      this.props.actions.getCalendarOfUserByWeek({
        userId: user_id,
        fromDate: moment(new Date(selectedDatesInWeek[0])).format("DD-MM-YYYY"),
        toDate: moment(new Date(selectedDatesInWeek[6])).format("DD-MM-YYYY"),
      });
      this.setState({
        selectedDate,
        selectedDatesInWeek,
      });
    } else {
      selectedDate.setDate(selectedDate.getDate() + 7);
      selectedDatesInWeek = this.getDatesInWeek(
        selectedDate,
        CONSTS.GREATER_THAN
      );
      this.props.actions.getCalendarOfUserByWeek({
        userId: user_id,
        fromDate: moment(new Date(selectedDatesInWeek[0])).format("DD-MM-YYYY"),
        toDate: moment(new Date(selectedDatesInWeek[6])).format("DD-MM-YYYY"),
      });
      this.setState({
        selectedDate,
        selectedDatesInWeek,
      });
    }
  };

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
        selectedDatesInMonth: this.getDatesInMonth(
          selectedMonth.getMonth(),
          selectedMonth.getFullYear()
        ),
      });
    } else {
      selectedMonth.setMonth(selectedMonth.getMonth() + 1);
      this.setState({
        selectedMonth,
        selectedDatesInMonth: this.getDatesInMonth(
          selectedMonth.getMonth(),
          selectedMonth.getFullYear()
        ),
      });
    }
    this.props.actions.getCalendarOfUserByMonth({
      userId: user_id,
      fromDate: moment(
        new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1)
      ).format("DD-MM-YYYY"),
      toDate: moment(
        new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0)
      ).format("DD-MM-YYYY"),
    });
  };
  /**
   * Get Dates in Week from Sunday -> Saturday
   */
  getDatesInWeek = (current, info) => {
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
  };

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
    } while (previousDate.getDay() !== 0);
    days.unshift(new Date(previousDate));

    //get day of month + 1
    while (days.length < 42) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  onChangeType = (type) => {
    this.setState({
      workingCategory: type,
    });
    if (type === CONSTS.MONTH) {
      const { selectedMonth } = this.state;
      this.props.actions.getCalendarOfUserByMonth({
        userId: user_id,
        fromDate: moment(
          new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1)
        ).format("DD-MM-YYYY"),
        toDate: moment(
          new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0)
        ).format("DD-MM-YYYY"),
      });
    } else {
    }
  };

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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(nextProps.calendarOfUserByWeek) !==
        JSON.stringify(prevState.calendarOfUserByWeek) ||
      JSON.stringify(nextProps.calendarOfUserByMonth) !==
        JSON.stringify(prevState.calendarOfUserByMonth)
    ) {
      return {
        calendarOfUserByWeek: nextProps.calendarOfUserByWeek,
        calendarOfUserByMonth: nextProps.calendarOfUserByMonth,
      };
    }
    return null;
  }

  componentWillUnmount() {
    this.props.actions.setNoAtCheckInPage();
  }

  render() {
    const {
      workingCategory,
      selectedMonth,
      selectedDatesInWeek,
      calendarOfUserByMonth,
      calendarOfUserByWeek,
      selectedDatesInMonth,
      selectedDate,
      atCheckInPage,
      currentDate,
    } = this.state;
    const { ...rest } = this.props;
    const { t } = this.props;
    return (
      <main
        id={atCheckInPage ? "main-full-header" : "site-main"}
        className="check-in-out-management"
      >
        <section id="main-cont" className="full clear body-management">
          <Loading show={this.props.isLoading} />
          <aside
            className={
              atCheckInPage
                ? "contain-calendar contain-calendar-full-screen"
                : "contain-calendar full-p-height"
            }
          >
            <h3 className="calendar-text">
              {t("checkInOutManagement.calendar")}
            </h3>
            <div className="tool-bar">
              <div className="number-shift">
                {workingCategory === CONSTS.WEEK ? (
                  <>số ca / tuần</>
                ) : (
                  <>số ca / tháng</>
                )}
              </div>
              <div className="group-btn-category">
                <button
                  className={
                    workingCategory === CONSTS.WEEK
                      ? "btn btn_week btn--selected"
                      : "btn btn_week"
                  }
                  onClick={() => {
                    this.onChangeType(CONSTS.WEEK);
                  }}
                >
                  {t("calendarManagement.week")}
                </button>
                <button
                  className={
                    workingCategory === CONSTS.MONTH
                      ? "btn btn_month btn--selected"
                      : "btn btn_month"
                  }
                  onClick={() => {
                    this.onChangeType(CONSTS.MONTH);
                  }}
                >
                  {t("calendarManagement.month")}
                </button>
              </div>
              <div className="group-btn-change-date">
                <span
                  className="btn less-than-btn"
                  onClick={() => {
                    this.changeTime(CONSTS.LESS_THAN);
                  }}
                >
                  <FontAwesomeIcon icon={faLessThan} />
                </span>
                {workingCategory === CONSTS.MONTH ? (
                  <span className="month-text">
                    {t("calendarManagement.month")}{" "}
                    {selectedMonth.getMonth() + 1}
                  </span>
                ) : null}
                <span
                  className="btn greater-than-btn"
                  onClick={() => {
                    this.changeTime(CONSTS.GREATER_THAN);
                  }}
                >
                  <FontAwesomeIcon icon={faGreaterThan} />
                </span>
              </div>
            </div>
            <div
              className="calendar"
              style={{
                backgroundColor: `${
                  workingCategory === CONSTS.WEEK ? "#E3F2F6" : "#86B0BC"
                }`,
              }}
            >
              <div className="calendar__date">
                {workingCategory === CONSTS.WEEK ? (
                  selectedDatesInWeek ? (
                    selectedDatesInWeek.map((date, index) => {
                      return (
                        <div className="day-of-week-item" key={index}>
                          <div className="day-of-week-now">
                            {this.props.t("currentLang") === LANGUAGES.vietnam
                              ? CONSTS.DAYS_VN[date.getDay()]
                              : this.props.t("currentLang") ===
                                LANGUAGES.english
                              ? CONSTS.DAYS_EN[date.getDay()]
                              : CONSTS.DAYS_JP[date.getDay()]}
                          </div>
                          <div className="day-of-month-now">
                            {date.getDate()} - {date.getMonth() + 1}
                          </div>
                        </div>
                      );
                    })
                  ) : null
                ) : (
                  <div className="date-in-week-of-month">
                    {this.props.t("currentLang") === LANGUAGES.vietnam
                      ? CONSTS.DAYS_VN.map((date, index) => {
                          return (
                            <div key={index} className="flex-1">
                              {date}
                            </div>
                          );
                        })
                      : this.props.t("currentLang") === LANGUAGES.english
                      ? CONSTS.DAYS_EN.map((date, index) => {
                          return (
                            <div key={index} className="flex-1">
                              {date}
                            </div>
                          );
                        })
                      : CONSTS.DAYS_JP.map((date, index) => {
                          return (
                            <div key={index} className="flex-1">
                              {date}
                            </div>
                          );
                        })}
                  </div>
                )}
              </div>
              <div className="calendar__grid">
                {workingCategory === CONSTS.WEEK &&
                calendarOfUserByWeek &&
                calendarOfUserByWeek.length > 0 ? (
                  <>
                    {selectedDatesInWeek.map((date) => {
                      return calendarOfUserByWeek.map(
                        (calendarDay, calendarIndex) => {
                          let calendarDate = new Date(calendarDay.date_at);
                          
                          if (
                            calendarDate.getDate() ===
                            date.getDate()
                          ) {
                            return (
                              <div
                                key={calendarIndex}
                                className="card-work-shift-list"
                              >
                                {calendarDay.shifts.map(
                                  (workShift, indexShift) => {
                                    return (
                                      <CardShift
                                        key={indexShift}
                                        workShift={workShift}
                                        selectedDate={date}
                                        selectedDatesInWeek={
                                          selectedDatesInWeek
                                        }
                                        workingCategory={workingCategory}
                                        disabledDate={calendarDate < currentDate && !this.isSameDay(calendarDate, currentDate)}
                                        {...rest}
                                      ></CardShift>
                                    );
                                  }
                                )}
                              </div>
                            );
                          }
                        }
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
                {workingCategory === CONSTS.MONTH &&
                calendarOfUserByMonth &&
                calendarOfUserByMonth.length === 0 ? (
                  <div className="card-work-shift-calendar">
                    {selectedDatesInMonth.map((date, index) => {
                      if (date.getMonth() === selectedMonth.getMonth()) {
                        return (
                          <div
                            key={index}
                            className={
                              date.getDay() === 0
                                ? "card-work-shift-item bgc-white"
                                : "card-work-shift-item"
                            }
                          >
                            <div
                              className={
                                this.isSameDay(date, new Date())
                                  ? "day-in-month day-current"
                                  : "day-in-month"
                              }
                            >
                              {date.getDate()}
                            </div>
                            <CardShiftList
                              currentDay={new Date()}
                              dayOfShift={date}
                              calendarDay={CONSTS.EXAMPLE_CALENDAR_DAY}
                              {...rest}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={index}
                            className="card-work-shift-item--out"
                          >
                            <div className="day-in-month">{date.getDate()}</div>
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : workingCategory === CONSTS.MONTH &&
                  calendarOfUserByMonth &&
                  calendarOfUserByMonth.length !== 0 ? (
                  <div className="card-work-shift-calendar">
                    {selectedDatesInMonth.map((date, index) => {
                      if (date.getMonth() === selectedMonth.getMonth()) {
                        return calendarOfUserByMonth.map((calendarDay) => {
                          if (
                            new Date(calendarDay.date_at).getDate() ===
                            date.getDate()
                          ) {
                            return (
                              <div
                                key={calendarDay.date_at}
                                className={
                                  date.getDay() === 0
                                    ? "card-work-shift-item bgc-white"
                                    : "card-work-shift-item"
                                }
                              >
                                <div
                                  className={
                                    this.isSameDay(date, new Date())
                                      ? "day-in-month day-current"
                                      : "day-in-month"
                                  }
                                >
                                  {date.getDate()}
                                </div>
                                <CardShiftList
                                  currentDay={new Date()}
                                  dayOfShift={date}
                                  calendarDay={calendarDay}
                                  workingCategory={workingCategory}
                                  {...rest}
                                />
                              </div>
                            );
                          }
                        });
                      } else {
                        return (
                          <div
                            key={index}
                            className="card-work-shift-item--out"
                          >
                            <div className="day-in-month">{date.getDate()}</div>
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="btn-group">
              <Button
                type="s3"
                style={{ marginTop: "10px", fontSize: "1.125em" }}
                onClick={() => {
                  this.props.actions.setNoAtCheckInPage();
                  this.props.history.goBack("");
                }}
              >
                {t("checkInOutManagement.back")}
              </Button>
            </div>
          </aside>
        </section>
      </main>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state[name],
  };
};
const mapDispatchToProps = (dispatch) => {
  const actions = {
    ...action,
  };
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(CalendarStaffPage));
