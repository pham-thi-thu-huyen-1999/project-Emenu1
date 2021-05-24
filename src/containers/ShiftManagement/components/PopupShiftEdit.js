import React from "react";
import { Input, Button } from "../../../components/common";
import TimeField from "react-simple-timefield";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import Validator from "../../../utils/validator";
import Swal from '../../../../src/utils/sweetalert2';
export default class PopupEditShift extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.shiftEdit.name,
      timeStart: this.props.shiftEdit.start_time,
      timeEnd: this.props.shiftEdit.end_time,
      errors: {}
    }
    const rules = [
      {
        method: "isEmpty",
        field: "name",
        validWhen: false,
        message: `${this.props.t("shiftTranslas:validName")}!`
      }
    ]
    this.validator = new Validator(rules)
  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("shiftTranslas:editSuccess")}!`,
      showConfirmButton: true,
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("shiftTranslas:editError")}!`,
      text: `${t("shiftTranslas:reqCheckAgain")}!`
    })
  }
  saveEditShift = () => {
    const { name, timeStart, timeEnd } = this.state
    const { shiftEdit, t } = this.props
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        title: `${t("shiftTranslas:youSure")}!`,
        text: `${t("shiftTranslas:confirmEdit")}!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${t("shiftTranslas:yesEdit")}!`,
        cancelButtonText: `${t("shiftTranslas:cancel")}`
      }).then((result) => {
        if (result.value) {
          let data = {
            shift_id: shiftEdit.id,
            name,
            start_time: timeStart,
            end_time: timeEnd
          }
          this.props.actions.editShift({ data, editSuccess: this.showSuccess, editError: this.showErr })
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
    const { t } = this.props;
    const { timeStart, timeEnd, name, errors } = this.state;
    return (
      <div className="popup-add-shift">
        <h3 className="title-add">{t("shiftTranslas:titleEdit")}</h3>
        <div className="e-form">
          <div className="field-name name e-row">
            <label className="e-form-label e-col-3">
              {t("shiftTranslas:headNameShift")}
            </label>
            <div className="e-col-9">
              <Input
                value={name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
              {errors.name ?
                <div className="validation">{errors.name}</div> : ""
              }
            </div>
          </div>
          <div className="field-name e-row">
            <label className="e-form-label e-col-3">
              {t("shiftTranslas:headTimeStart")}
            </label>
            <div className="e-form-input e-col-9">
              <span className="icon-date">
                <FontAwesomeIcon icon={faClock} />
              </span>
              <TimeField
                className="input-date"
                value={timeStart}
                onChange={e => this.setState({ timeStart: e.target.value })}
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
                value={timeEnd}
                onChange={e => this.setState({ timeEnd: e.target.value })}
              />
            </div>
          </div>
          <div className="btn-ls e-flex content-end item-center">
            <Button className="s3 e-m-right-5" onClick={() => this.props.hide()}>
              {t("shiftTranslas:cancel")}
            </Button>
            <Button onClick={this.saveEditShift}>{t("shiftTranslas:save")}</Button>
          </div>
        </div>
      </div>
    )
  }
}