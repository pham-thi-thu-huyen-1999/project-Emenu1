import React from "react";
import { Button, TextArea } from "../../../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import TimeField from "react-simple-timefield";
import moment from "moment";
import Swal from '../../../../../../src/utils/sweetalert2';
export default class EditCheck extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: moment(this.props.itemEdit.check_in_out_at).format("DD-MM-YYYY"),
      newTime: moment().format('HH:mm'),
      itemEdit: this.props.itemEdit,
      timeCheckIn: this.props.itemEdit.check_in,
      timeCheckOut: this.props.itemEdit.check_out,
      reason: this.props.itemEdit.description
    }
  }

  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("user.createShift.editSuccess")}`,
      showConfirmButton: true
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("user.createShift.editError")}`,
      text: `${t("user.createShift.reqCheckAgain")}!`
    })
  }
  onSave = () => {
    const { t } = this.props
    const { timeCheckIn, timeCheckOut, reason } = this.state;
    Swal.fire({
      title: `${t("user.createShift.youSure")}?`,
      text: `${t("user.createShift.confirmEdit")}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("user.createShift.yes")}`,
      cancelButtonText: `${t("user.createShift.cancel")}`
    }).then((result) => {
      if (result.value) {
        const data = {
          user_id: this.props.userDetail.id,
          check_in_out_at: this.state.date,
          check_in: timeCheckIn,
          check_out: timeCheckOut,
          description: reason
        }
        this.props.actions.editCheckinOut({
          data,
          check_in_out_id: this.props.itemEdit.id,
          showSuccess: this.showSuccess,
          showErr: this.showErr,
          user_id: this.props.userDetail.id,
          params: {
            check_in_out_at: this.state.date
          }
        });
        this.props.hidePopupEdit();
      }
    })
  }
  render() {
    const { itemEdit, t } = this.props;
    return (
      <div className="comp-add-check">
        <h3 className="title-edit">{t("user.createShift.edit")}</h3>
        <div className="check-day e-flex">
          <span className="text-name e-flex item-center">{t("user.createShift.date")}</span>
          <div className="e-flex input-select">
            <span>{this.state.date}</span>
          </div>
        </div>
        <div className="e-flex check e-m-bottom-10">
          <div className="e-flex check-in flex">
            <label className="label-check e-flex item-center">Check in</label>
            <div className="input-date">
              <TimeField
                className="date-selected"
                value={this.state.timeCheckIn}
                onChange={event => this.setState({ timeCheckIn: event.target.value })}
              />
              <span className="icon-date">
                <FontAwesomeIcon icon={faClock} />
              </span>
            </div>
          </div>
          <div className="e-flex check-out">
            <label className="label-check e-flex item-center content-center">Check Out</label>
            <div className="input-date">
              <TimeField
                className="date-selected"
                value={itemEdit.check_out}
                onChange={event => this.setState({ timeCheckOut: event.target.value })}
              />
              <span className="icon-date">
                <FontAwesomeIcon icon={faClock} />
              </span>
            </div>
          </div>
        </div>
        <div className="reason e-flex">
          <div className="input-reason">
            <TextArea
              placeholder={t("user.createShift.reason")}
              defaultValue={itemEdit.description}
              onChange={e => this.setState({ reason: e.target.value })}
            />
          </div>
        </div>
        <div className="btn-save e-flex content-center">
          <Button className="s3 e-m-right-10" onClick={() => this.props.hidePopupEdit()}>{t("user.createShift.back")}</Button>
          <Button onClick={this.onSave}>{t("user.createShift.save")}</Button>
        </div>
      </div>
    )
  }
}