import React from "react";
import Input from "../../../components/common/Input";
import RadioInput from "../../../components/common/RadioList";
import Textarea from "../../../components/common/TextArea";
import Button from "../../../components/common/Button";
import NumberRange from "../../../components/common/NumberRange"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import TimeField from "react-simple-timefield";
import moment from 'moment';
import Validator from "../../../utils/validator";
import Swal from '../../../../src/utils/sweetalert2';
import common from '../../../utils/common';
import { get } from "../../../services/localStorage";
import Cleave from 'cleave.js/react';
import "cleave.js/dist/addons/cleave-phone.vn";

export default class AddBookingTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameGuest: "",
      phoneNumber: "",
      newDate: Date.now(),
      newTime: moment().format('HH:mm'),
      numberCustomer: 0,
      typeTable: 1,
      note: "",
      errors: {},
      validDate: "",
    }
    const rules = [
      {
        field: "nameGuest",
        method: "isEmpty",
        validWhen: false,
        message: `${this.props.t("bookingTables.validName")}`
      },
      {
        field: "phoneNumber",
        method: "isEmpty",
        validWhen: false,
        message: `${this.props.t("bookingTables.validNumber")}`
      },
      {
        field: "phoneNumber",
        method: "isNumeric",
        validWhen: true,
        message: `${this.props.t("bookingTables.validNumber1")}`
      },
      {
        field: "newDate",
        method: newDate => {
          if (newDate < Date.now()) {
            return false
          }
          return true
        },
        validWhen: true,
        message: `${this.props.t("bookingTables.validName")}`
      }
    ]
    this.validator = new Validator(rules)

  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("dishManagaments.addSuccess")}!`,
      showConfirmButton: true,
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("dishManagaments.error")}!`,
      text: `${t("dishManagaments.requCheckAgain")}!`
    })
  }
  /**
   * add booking table
   */
  saveBooking = () => {
    const { t } = this.props
    const { nameGuest,
      phoneNumber, newDate,
      newTime, numberCustomer,
      typeTable, note } = this.state
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      let checkIn = `${moment(newDate).format("YYYY-MM-DD")} ${newTime}`;
      let infoToken = common.decodeToken(get('accessToken'));
      Swal.fire({
        title: `${t("bookingTables.sure")}`,
        text: `${t("bookingTables.textValidAdd")}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: `${t("bookingTables.yes")}`,
        cancelButtonText: `${t("bookingTables.no")}`,
      }).then(async (result) => {
        if (result.value) {
          const data = {
            guest_name: nameGuest,
            phone_number: phoneNumber,
            check_in: moment(checkIn),
            total_guest_number: numberCustomer,
            table_type: typeTable,
            description: note,
            partner_id: infoToken.partner_id,
            status: 2
          }
          this.props.actions.addBookingTable({
            data,
            call_Success: this.showSuccess,
            call_Error: this.showErr
          })
          this.props.hide();
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state)
      })
    }
  }
  render() {
    const { t } = this.props
    const { typeTable, errors } = this.state;
    return (
      <div className="form-add-booking-table e-form">
        <div className="name-phone e-row e-form-field">
          <div className="name e-col-6 e-row">
            <span className="e-col-4 e-form-label flex e-flex item-center">{t("bookingTables.firstAndLastName")}</span>
            <div className="input-name e-col-8">
              <Input
                name="nameGuest"
                defaultValue={this.state.nameGuest}
                onChange={e => this.setState({ nameGuest: e.target.value })}
              />
              {errors.nameGuest ?
                <div className="validation">{errors.nameGuest}</div>
                : ""
              }
            </div>
          </div>
          <div className="phone e-col-6 e-row">
            <span className="e-col-4 e-form-label flex e-flex item-center content-center">{t("bookingTables.phone")}</span>
            <div className="input-phone e-col-8">
              <Cleave
                className="phone-format"
                options={{ phone: true, phoneRegionCode: "VN" }}
                onChange={(event) => this.setState({
                  phoneNumber: event.target.rawValue
                })}
              />
              {errors.phoneNumber ?
                <div className="validation">{errors.phoneNumber}</div>
                : ""
              }
            </div>
          </div>
        </div>
        <div className="field-datetime e-row e-form-field">
          <div className="date-time e-col-6 e-row">
            <span className="e-col-4 e-form-label flex e-flex item-center">{t("bookingTables.date")}</span>
            <div className="input-date-time e-col-8">
              <div className="input-text">
                <span className="icon-date">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </span>
                <DatePicker
                  className="input-date"
                  selected={this.state.newDate}
                  onChange={date => this.setState({ newDate: date })}
                />
              </div>
              {errors.newDate ?
                <div className="validation">{t("bookingTables.validDate")}</div>
                : ""
              }
            </div>
          </div>
          <div className="phone e-col-6 e-row">
            <span className="e-col-4 e-form-label flex e-flex item-center content-center">{t("bookingTables.time")}</span>
            <div className="input-date-time e-col-8">
              <div className="input-text">
                <span className="icon-date">
                  <FontAwesomeIcon icon={faClock} />
                </span>
                <TimeField
                  className="input-date"
                  value={this.state.newTime}
                  onChange={event => this.setState({ newTime: event.target.value })}
                />
              </div>
              {errors.newTime ?
                <div className="validation">{t("bookingTables.validTime")}</div>
                : ""
              }
            </div>
          </div>
        </div>
        <div className="total-people e-row e-form-field">
          <div className="total e-col-6 e-row">
            <span className="e-col-4 e-form-label flex e-flex item-center">{t("bookingTables.amount")}</span>
            <div className="input-count e-col-8 e-row">
              <div className="e-m-right-10">
                <NumberRange
                  defaultValue={this.state.numberCustomer}
                  max={10}
                  onChange={amount => this.setState({ numberCustomer: amount })}
                />
              </div>
            </div>
          </div>
          <div className="phone e-col-6 e-row">
            <span className="e-col-4 e-form-label flex e-flex item-center content-center">{t("bookingTables.typeTable")}</span>
            <div className="input-type e-col-8 e-flex item-center">
              <RadioInput
                name="type"
                dataSource={[
                  { key: 2, text: `${t("bookingTables.vip")}` },
                  { key: 1, text: `${t("bookingTables.normal")}` }
                ]}
                onChange={typeTable => this.setState({ typeTable })}
                selected={typeTable}
              />
            </div>
          </div>
        </div>
        <div className="e-row">
          <div className="e-col-2 e-form-label">
            <span>{t("bookingTables.note")}</span>
          </div>
          <div className="e-col-10 input-note">
            <Textarea
              onChange={e => this.setState({ note: e.target.value })}
            />
          </div>
        </div>
        <div className="btn-save-add e-flex content-end">
          <Button onClick={this.saveBooking}>
            {t("bookingTables.save")}
          </Button>
        </div>
      </div>
    )
  }
}