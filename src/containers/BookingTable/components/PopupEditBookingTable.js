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
import { addNofitication } from "../../../api/notification";

export default class EditBookingTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameGuest: this.props.bookingEdit.guest_name,
      phoneNumber: this.props.bookingEdit.phone_number,
      newDate: this.props.bookingEdit.check_in ? new Date(this.props.bookingEdit.check_in) : Date.now(),
      newTime: this.props.bookingEdit.check_in ? moment(this.props.bookingEdit.check_in).format('HH:mm') : moment().format('HH:mm'),
      numberCustomer: this.props.bookingEdit.total_guest_number,
      typeTable: this.props.bookingEdit.table_type,
      note: this.props.bookingEdit.description,
      bookingEdit: this.props.bookingEdit,
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
      icon: "success",
      title: `${t("dishManagaments.editSuccess")}!`,
      showConfirmButton: true,
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: "error",
      title: `${t("dishManagaments.error")}!`,
      text: `${t("dishManagaments.requCheckAgain")}!`
    })
  }

  /**
   * edit booking table
   */
  saveBooking = () => {
    const { t } = this.props
    const { nameGuest, phoneNumber, newDate,
      newTime, numberCustomer, typeTable, note, bookingEdit } = this.state
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      let infoToken = common.decodeToken(get('accessToken'));
      Swal.fire({
        title: `${t("bookingTables.sure")}`,
        text: `${t("bookingTables.textValidEdit")}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: `${t("bookingTables.yes")}`,
        cancelButtonText: `${t("bookingTables.no")}`,
      }).then(async (result) => {
        if (result.value) {
          const checkIn = `${moment(newDate).format("YYYY-MM-DD")} ${newTime}`;
          const data = {
            guest_name: nameGuest,
            phone_number: phoneNumber,
            check_in: moment(checkIn).format(),
            total_guest_number: numberCustomer,
            table_type: typeTable,
            description: note
          }
          const dataPushNoti = {
            "title": "Đặt bàn",
            "content": `Vừa có 1 yêu cầu chỉnh sửa thông tin đặt bàn`,
            "action": "reservation",
            "type_notification": "1",
            "link": "",
            "body_data": {
              "booking_id": bookingEdit.id,
              action: "reservation"
            },
            "topic": `partner_${infoToken.partner_id}`,
            "list_user": [
              ""
            ],
            "is_push_noti": "1"
          }
          this.props.actions.editBookingTable({
            data,
            booking_id: this.props.bookingEdit.id,
            call_Success: this.showSuccess,
            call_Error: this.showErr
          })
          await addNofitication({ data: dataPushNoti })
          this.props.hidePopupEdit();
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
    const { typeTable, errors, bookingEdit } = this.state
    return (
      <>
        <div className="title-edit-booking e-flex content-center item-center">
          <h1 className="title-edit">{t("bookingTables.status")}: </h1>
          {
            bookingEdit.status === 1 || !bookingEdit.status ?
              <span style={{ color: "#f17a39" }}>{t("bookingTables.waitingConfirmation")}</span>
              : bookingEdit.status === 2 ?
                <span style={{ color: "rgb(40, 152, 250)" }}>{t("bookingTables.confirmed")}</span>
                : bookingEdit.status === 3 ?
                  <span style={{ color: "#4bd159" }}>{t("bookingTables.arrangedTheTable")}</span>
                  : bookingEdit.status === 4 ?
                    <span style={{ color: "red" }}>{t("bookingTables.cancelled")}</span>
                    : bookingEdit.status === 5 ?
                      <span style={{ color: "red" }}>{t("bookingTables.cancelCustomer")}</span>
                      : bookingEdit.status === 6 ?
                        <span style={{ color: "#4bd159" }}>{t("bookingTables.atTheTable")}</span>
                        : null
          }
        </div>
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
                <Input
                  type="number"
                  defaultValue={this.state.phoneNumber}
                  onChange={e => this.setState({ phoneNumber: e.target.value })}
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
              </div>
            </div>
          </div>
          <div className="total-people e-row e-form-field">
            <div className="total e-col-6 e-row">
              <span className="e-col-4 e-form-label flex e-flex item-center">{t("bookingTables.amount")}</span>
              <div className="input-count e-col-8 e-row">
                <div className="e-m-right-10">
                  <NumberRange
                    max={10}
                    defaultValue={this.state.numberCustomer}
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
                defaultValue={this.props.bookingEdit.description}
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
      </>

    )
  }
}