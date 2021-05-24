import React from "react";
import { InputDate, InputTime } from "../../../components/common";
import DatePicker from "react-datepicker";
import TimeField from "react-simple-timefield";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import CheckDayList from "./CheckDay";
import { TimePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';

export default class EditDateApplyPromotion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fromDate: props.fromDate,
      toDate: props.toDate,
      fromHours: props.fromHours,
      toHours: props.toHours,
      days: props.days,
      checked: false,
      isCheckedAll: false,
      errors: props.errors
    }
  }
  /**
   * chage date from
   * @param {} date
   */
  changeFromDate = (date) => {
    this.setState({ fromDate: date })
    this.props.changeFromDate(date)
  }
  /**
   * change date to
   * @param {} date
   */
  changeToDate = (date) => {
    this.setState({ toDate: date })
    this.props.changeToDate(date)
  }
  render() {
    const { fromDate, toDate, fromHours, toHours, days } = this.state
    const { ...rest } = this.props
    const { changeFromHours, changeToHours, t, onChangeDay, errors } = this.props

    return (
      <div>
        <div className="time-date">
          <div className="e-flex">
            <div className="item-center title e-flex item-center">
              <span className="text-name">{t("promotions.byDate")}</span>
            </div>
            <div className="date-from e-flex item-center">
              <span className="e-flex item-center text-name">{t("promotions.from")}</span>
              <InputDate
                className="input-date flex"
                selected={fromDate}
                minDate={fromDate}
                onChange={date => this.changeFromDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="date-from e-flex item-center">
              <span className="e-flex item-center text-name">{t("promotions.to")}</span>
              <InputDate
                className="input-date"
                selected={toDate}
                onChange={date => this.changeToDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
          {errors.toDate ?
            <div className="validation e-flex content-center e-m-bottom-10">
              {t("promotions.validDate")}
            </div>
            : ""
          }
        </div>
        <div className="time-date e-flex">
          <div className="e-flex item-center title">
            <span className="text-name">{t("promotions.byHours")}</span>
          </div>
          <div className="e-flex date-from from-time">
            <span className="e-flex item-center text-name">{t("promotions.from")}</span>
            {/* <InputTime
              className="time flex"
              defaultValue={fromHours}
              onChange={changeFromHours}
            /> */}
            <TimePicker
              className="time flex"
              onChange={changeFromHours}
              defaultValue={moment(fromHours, 'HH:mm:ss')}
              placeholder={t("promotions.selectTime")}
            />
          </div>
          <div className="e-flex date-from from-time">
            <span className="e-flex item-center text-name">{t("promotions.to")}</span>
            <TimePicker
              className="time flex"
              onChange={changeToHours}
              defaultValue={moment(toHours, 'HH:mm:ss')}
              placeholder={t("promotions.selectTime")}
            />
          </div>
          <div className="e-col-4"></div>
          <div>
            <span></span>
          </div>
        </div>
        <div className="time-date e-flex">
          <div className="e-flex item-center title-things">
            <span className="text-name">{t("promotions.byDay")}</span>
          </div>
          <div className="list-days e-flex flex">
            <CheckDayList
              days={days}
              onChangeDay={onChangeDay}
              {...rest}
            />
          </div>
        </div>
      </div>
    )
  }
}