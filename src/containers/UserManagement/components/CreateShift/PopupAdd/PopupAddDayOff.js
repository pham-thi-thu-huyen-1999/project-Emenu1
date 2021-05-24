import React from "react";
import { Button, TextArea } from "../../../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import CompListChecked from "../CompChecked/CompListChecked";
import moment from "moment";
import Swal from '../../../../../../src/utils/sweetalert2';
import Validator from "../../../../../utils/validator";
import DatePicker, { registerLocale } from "react-datepicker";
import languageDateVi from "date-fns/locale/vi";
import languageDateEn from "date-fns/locale/en-GB";
import languageDateJa from "date-fns/locale/ja";
export default class AddDayOff extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      listShiftChecked: this.props.listTakeLeaveByDay,
      listTakeLeaveByDay: this.props.listTakeLeaveByDay,
      checkedAll: false,
      reason: "",
      dataCheckedInit: this.props.listTakeLeaveByDay,
      listTakeLeave: this.props.listTakeLeave,
      noCalendar: this.props.noCalendar,
      errors: {},
      isActiveSave: true
    }
    const rules = [
      {
        field: "reason",
        method: "isEmpty",
        validWhen: false,
        message: `${this.props.t("user.createShift.validDay")}`
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
        registerLocale("languageDate",  languageDateVi);
        break;
      case "en-GB":
        registerLocale("languageDate",  languageDateEn);
        break;
      case "ja":
        registerLocale("languageDate",  languageDateJa);
        break;
      default:
        break;
      }
  }

  componentDidMount() {
    this.loadConfigDateLanguage()
    if (this.state.listShiftChecked.length === this.props.listShift.length) {
      this.setState({
        checkedAll: true
      })
    } else {
      this.setState({
        checkedAll: false
      })
    }
  }
  /**
   * update array get from props
   * @param {*} nextProps
   * @param {*} prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.listTakeLeaveByDay)
      !== JSON.stringify(prevState.listTakeLeaveByDay)) {
      let checkedAll = false
      if (nextProps.listTakeLeaveByDay.length
        === nextProps.listShift.length) {
        checkedAll = true
      }
      return {
        listShiftChecked: nextProps.listTakeLeaveByDay,
        listTakeLeaveByDay: nextProps.listTakeLeaveByDay,
        checkedAll,
        dataCheckedInit: nextProps.listTakeLeaveByDay,
        noCalendar: nextProps.noCalendar
      }
    }
    return null;
  }
  /**
   * when checked all
   * @param {*} checked
   */
  changeCheckedAllTL = checked => {
    let newList = [];
    if (checked) {
      this.props.listShift.map((shift, index) => {
        newList[index] = shift.id;
      })
    } else {
      newList = this.state.dataCheckedInit
    }
    this.setState({
      listShiftChecked: newList
    })
  }
  /**
   * if checked all shift else
   */
  setCheckedAll = list => {
    if (list.length === this.props.listShift.length) {
      this.setState({
        checkedAll: true
      })
    } else {
      this.setState({
        checkedAll: false
      })
    }
  }
  /**
   * check item shift
   */
  changeCheckedItemShift = (checked, idShift) => {
    let { isActiveSave } = this.state;
    const { listTakeLeaveByDay } = this.props;
    let newList = [...this.state.listShiftChecked]
    if (checked) {
      newList = [...this.state.listShiftChecked, idShift]
    }
    else {
      newList = this.state.listShiftChecked.filter(item => item !== idShift)
    }
    this.setCheckedAll(newList)
    if (JSON.stringify(listTakeLeaveByDay)
      !== JSON.stringify(newList)) {
      isActiveSave = false;
    } else {
      isActiveSave = true;
    }
    this.setState({
      isActiveSave,
      listShiftChecked: newList
    })
  }
  /**
   * change day and call api
   */
  handleChange = date => {
    let take_leave_at = moment(date).format("DD-MM-YYYY")
    let { listShiftChecked, isActiveSave } = this.state;
    const { listTakeLeaveByDay } = this.props;
    if (JSON.stringify(listTakeLeaveByDay) !== JSON.stringify(listShiftChecked)) {
      isActiveSave = false;
    } else {
      isActiveSave = true;
    }
    this.props.actions.getListShiftByDayTakeLeave({
      user_id: this.props.userDetail.id, params: {
        take_leave_at
      },
      callBack: this.setState({
        listShiftChecked: this.props.listTakeLeaveByDay
      })
    })
    this.setState({
      isActiveSave
    })
  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("user.createShift.addSuccess")}`,
      showConfirmButton: true
    })
  }
  showErr = (text) => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("user.createShift.addError")}`,
      text
    })
  }
  /**
   * save list shift after choose
   */
  onSave = () => {
    const { t } = this.props
    const { dataCheckedInit, date } = this.state
    let newList = [...this.state.listShiftChecked]
    let index;
    for (var i = 0; i < dataCheckedInit.length; i++) {
      index = newList.indexOf(dataCheckedInit[i]);
      if (index > -1) {
        newList.splice(index, 1);
      }
    }
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
          let take_leave_at = moment(date).format("DD-MM-YYYY")
          let data = {
            user_id: this.props.userDetail.id,
            description: this.state.reason,
            shifts: newList,
            take_leave_at
          }
          this.props.actions.addDayTakeLeave({
            data,
            user_id: this.props.userDetail.id,
            params: {
              take_leave_at
            },
            showSuccess: this.showSuccess,
            showErr: this.showErr
          })
          this.props.hidePopupAddDayOff();
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state)
      })
    }
  }
  render() {
    const { ...rest } = this.props;
    const { t } = this.props;
    const { errors, isActiveSave } = this.state;
    return (
      <div className="comp-select-day">
        <h3 className="e-flex content-center">{t("user.createShift.add")}</h3>
        <div className="choose-day e-flex">
          <div className="text-choose e-flex item-center content-center">
            <span>{t("user.createShift.chooseDay")}</span>
          </div>
          <div className="input-date">
            <DatePicker
              className="date-selected"
              selected={this.state.date}
              onChange={(date) => { this.setState({ date }); this.handleChange(date) }}
              dateFormat="dd/MM/yyyy"
              locale="languageDate"
            />
            <FontAwesomeIcon className="icon-date" icon={faCalendarAlt} />
          </div>
        </div>
        <div className="e-flex lst-shift">
          <CompListChecked
            checkedAll={this.state.checkedAll}
            changeCheckedAll={this.changeCheckedAllTL}
            changeCheckedShift={this.changeCheckedItemShift}
            listShiftChecked={this.state.listShiftChecked}
            noCalendar={this.state.noCalendar}
            dataCheckedInit={this.state.dataCheckedInit}
            {...rest}
          />
        </div>
        <div className="reason e-flex">
          <div className="reason-off e-flex flex">
            <div className="input-reason">
              <TextArea placeholder={t("user.createShift.reason")}
                defaultValue={this.state.reason}
                onChange={e =>
                  this.setState({
                    reason: e.target.value
                  })
                }
              />
            </div>
            {errors.reason ?
              <div className="validation">
                {errors.reason}</div> : null}
          </div>
        </div>
        <div className="btn-list e-flex content-center">
          <Button className="s3 e-m-right-10" onClick={() => this.props.hidePopupAddDayOff()}>{t("user.createShift.cancel")}</Button>
          <Button
            disabled={isActiveSave}
            onClick={this.onSave}>
            {t("user.createShift.save")}
          </Button>
        </div>
      </div>
    )
  }
}