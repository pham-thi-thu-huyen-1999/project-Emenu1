import React from "react";
import { Button, TextArea, RadioList } from "../../../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import TimeField from "react-simple-timefield";
import moment from "moment";
import Swal from '../../../../../../src/utils/sweetalert2';
import CompListRadioCheckinout from "../CompChecked/CompListRadioCheckinout";
import Validator from "../../../../../utils/validator";
import DatePicker, { registerLocale } from "react-datepicker";
import languageDateVi from "date-fns/locale/vi";
import languageDateEn from "date-fns/locale/en-GB";
import languageDateJa from "date-fns/locale/ja";
export default class AddCheck extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      newTime: moment().format('HH:mm'),
      typeCheck: true,
      reason: "",
      timeCheckin: JSON.stringify(this.props.listShift) !== JSON.stringify([])
        ? this.props.listShift[0].start_time : "",
      timeCheckout: JSON.stringify(this.props.listShift) !== JSON.stringify([])
      ? this.props.listShift[0].end_time : "",
      selected: 0,
      shiftId: JSON.stringify(this.props.listShift) !== JSON.stringify([]) ? this.props.listShift[0].id : "",
      listShift: this.props.listShift,
      errors: {},
      listTakeLeaveByDay: this.props.listTakeLeaveByDay // list shift off
    }
    const rules = [
      {
        field: "reason",
        method: "isEmpty",
        validWhen: false,
        message: `Vui lòng nhập lý do`
      }
    ]
    this.validator = new Validator(rules)
  }
  /**
 * config language datepicker
 */
  loadConfigDateLanguage = () => {
    const { t } = this.props
    const endCode = t("user.languageDate")
    switch (endCode) {
      case "vi":
        registerLocale("languageDate", languageDateVi);
        break;
      case "en-GB":
        registerLocale("languageDate", languageDateEn);
        break;
      case "ja":
        registerLocale("languageDate", languageDateJa);
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    this.loadConfigDateLanguage()
  }

  onChange = (e) => {
    this.setState({ typeCheck: !e.target.value })
  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("user.createShift.addSuccess")}`,
      showConfirmButton: true
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("user.createShift.addError")}`,
      text: `${t("user.createShift.reqCheckAgain")}`
    })
  }
  onSaveCheck = () => {
    const { t } = this.props;
    const { timeCheckin, timeCheckout, reason, shiftId } = this.state;
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        title: `${t("user.createShift.youSure")}?`,
        text: `${t("user.createShift.confirmAdd")}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${t("user.createShift.yes")}`,
        cancelButtonText: `${t("user.createShift.cancel")}`
      }).then((result) => {
        if (result.value) {
          let check_in_out_at = moment(this.state.date).format("DD-MM-YYYY")
          const data = {
            user_id: this.props.userDetail.id,
            check_in_out_at,
            check_in: timeCheckin,
            check_out: timeCheckout,
            description: reason,
            shift_id: shiftId
          }
          this.props.actions.addCheckinOut({
            data,
            showSuccess: this.showSuccess,
            showErr: this.showErr,
            user_id: this.props.userDetail.id,
            params: {
              check_in_out_at
            }
          });
          this.props.hidePopupAdd();
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state)
      })
    }
  }
  onChangeCheckinOut = (selected, item) => {
    this.setState({
      selected,
      timeCheckin: item.start_time,
      timeCheckout: item.end_time,
      shiftId: item.id
    })
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.listTakeLeaveByDay)
      !== JSON.stringify(prevState.listTakeLeaveByDay)) {
      return {
        listTakeLeaveByDay: nextProps.listTakeLeaveByDay
      }
    }
    return null;
  }
  /**
   * change day
   * @param {*} date
   */
  onChangeDay = date => {
    let take_leave_at = moment(date).format("DD-MM-YYYY");
    const { listShift } = this.state;
    this.setState({ date })
    this.props.actions.getListShiftByDayTakeLeave({
      user_id: this.props.userDetail.id, params: {
        take_leave_at
      },
      callBack: this.setState({
        listShift
      })
    })
  }
  disableShift = () => {

  }
  listShift = () => {
    let listShiftNew = this.props.listShift.map(shift => {
      if (this.checkListDisable(shift)) {
        return {
          ...shift,
          disabled: true
        }
      }
      return shift
    })
    return [...listShiftNew, {
      id: null,
      name: 'Not shift'
    }];
  }

  checkListDisable = (shift) => {
    const { listTakeLeaveByDay } = this.state;
    let check = false;
    for (let shiftId of listTakeLeaveByDay) {
      if (shift.id === shiftId) {
        check = true;
        break;
      }
    }
    return check;
  }

  render() {
    const { t, listShift } = this.props;
    const dateInit = new Date();
    let lstData = [];
    listShift.map((item, index) => {
      lstData[index] = item.id
    })
    const { selected, errors } = this.state;
    return (
      <div className="comp-add-check">
        <h3 className="title-edit">{t("user.createShift.add")}</h3>
        <div className="check-day e-flex">
          <span className="text-name e-flex item-center">
            {t("user.createShift.chooseDay")}</span>
          <div className="input-select">
            <div className="input-date">
              <DatePicker
                className="date-selected"
                selected={this.state.date}
                maxDate={dateInit}
                onChange={this.onChangeDay}
                dateFormat="dd/MM/yyyy"
                locale="languageDate"
              />
              <FontAwesomeIcon className="icon-date" icon={faCalendarAlt} />
            </div>
          </div>
        </div>
        <div className="select-shift e-flex">
          <RadioList
            className="item-shift"
            dataSource={this.listShift()}
            name="shift"
            map={{ key: "id", text: "name" }}
            onChange={this.onChangeCheckinOut}
            selected={selected}
          />
        </div>
        <div className="e-flex check e-m-bottom-10">
          <div className="e-flex check-in flex">
            <label className="label-check e-flex item-center">Check in</label>
            <div className="input-date">
              <TimeField
                className="date-selected"
                value={this.state.timeCheckin}
                onChange={event => this.setState({ timeCheckin: event.target.value })}
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
                value={this.state.timeCheckout}
                onChange={event => this.setState({ timeCheckout: event.target.value })}
              />
              <span className="icon-date">
                <FontAwesomeIcon icon={faClock} />
              </span>
            </div>
          </div>
        </div>
        <div className="reason e-flex">
          <div className="input-reason">
            <TextArea placeholder={t("user.createShift.reason")}
              onChange={e => this.setState({ reason: e.target.value })} />
          </div>
          {errors.reason ?
            <div className="validation">
              {errors.reason}</div> : null}
        </div>
        <div className="btn-save e-flex content-center">
          <Button className="s3 e-m-right-10" onClick={() => this.props.hidePopupAdd()}>{t("user.createShift.back")}</Button>
          <Button onClick={this.onSaveCheck}>
            {t("user.createShift.save")}</Button>
        </div>
      </div>
    )
  }
}