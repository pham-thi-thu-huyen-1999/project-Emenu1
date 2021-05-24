import React from "react";
import { Input, Button } from "../../../components/common";
import TimeField from "react-simple-timefield";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import Validator from "../../../utils/validator";
import Swal from '../../../../src/utils/sweetalert2';

import moment from "moment"
export default class PopupAddShift extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shiftName: "",
      timeStart: moment().format('HH:mm'),
      timeEnd: moment().format('HH:mm'),
      errors: {}
    }
    const rules = [
      {
        method: "isEmpty",
        field: "shiftName",
        validWhen: false,
        message: `${this.props.t("shiftTranslas:validName")}`
      }
    ]
    this.validator = new Validator(rules)
  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("shiftTranslas:addSuccess")}`,
      showConfirmButton: true,
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("shiftTranslas:addError")}`,
      text: `${t("shiftTranslas:reqCheckAgain")}`
    })
  }
  saveAddShift = () => {
    const { shiftName, timeStart, timeEnd } = this.state
    const { t } = this.props
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        title: `${t("shiftTranslas:youSure")}`,
        text: `${t("shiftTranslas:confirmAdd")}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${t("shiftTranslas:yesAdd")}`,
        cancelButtonText: `${t("shiftTranslas:cancel")}`
      }).then((result) => {
        if (result.value) {
          let data = {
            name: shiftName,
            start_time: timeStart,
            end_time: timeEnd
          }
          this.props.actions.addShift({ data, addSuccess: this.showSuccess, addError: this.showErr })
          this.props.hide()
        }
      })
    }
    else {
      this.setState({
        errors: this.validator.validate(this.state)
      })
    }
  }
  render() {
    const { t } = this.props
    const { errors } = this.state
    return (
      <div className="popup-add-shift">
        <h3 className="title-add">{t("shiftTranslas:titleAdd")}</h3>
        <div className="e-form">
          <div className="field-name name e-row">
            <label className="e-form-label e-col-3">
              {t("shiftTranslas:headNameShift")}
            </label>
            <div className="e-col-9">
              <Input
                onChange={(e) => this.setState({ shiftName: e.target.value })}
              />
              {errors.shiftName ?
                <div className="validation">{errors.shiftName}</div> : ""
              }
            </div>
          </div>
          <div className="field-date field-name e-row">
            <label className="e-form-label e-col-3">
              {t("shiftTranslas:headTimeStart")}
            </label>
            <div className="e-form-input e-col-9">
              <span className="icon-date">
                <FontAwesomeIcon icon={faClock} />
              </span>
              <TimeField
                className="input-date"
                value={this.state.timeStart}
                onChange={event => this.setState({ timeStart: event.target.value })}
              />
            </div>
          </div>
          <div className="field-name e-row">
            <label className="e-form-label e-col-3">
              {t("shiftTranslas:headTimeEnd")}
            </label>
            <div className="e-form-input e-col-9">
              <span className="icon-date">
                <FontAwesomeIcon icon={faClock} />
              </span>
              <TimeField
                className="input-date"
                value={this.state.timeEnd}
                onChange={event => this.setState({ timeEnd: event.target.value })}
              />
            </div>
          </div>
          <div className="btn-ls e-flex content-end item-center">
            <Button className="s3 e-m-right-5" onClick={() => this.props.hide()}>
              {t("shiftTranslas:cancel")}
            </Button>
            <Button onClick={this.saveAddShift}>{t("shiftTranslas:save")}</Button>
          </div>
        </div>
      </div>
    )
  }
}