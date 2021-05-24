import React from "react";
import { Button } from "../../../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import CheckedAddOTShift from "../CompChecked/CompCheckedAddOTShift";
import moment from "moment";
import Swal from '../../../../../../src/utils/sweetalert2';
import Validator from "../../../../../utils/validator";
import DatePicker, { registerLocale } from "react-datepicker";
import languageDateVi from "date-fns/locale/vi";
import languageDateEn from "date-fns/locale/en-GB";
import languageDateJa from "date-fns/locale/ja";
export default class AddOTShift extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      listChecked: this.props.listCheckedOTShift,
      errors: {},
      listcheckedInit: this.props.listCheckedOTShift,
      isActiveSave: true
    }
    const rules = [
      {
        field: "date",
        method: date => {
          if (date < Date.now()) {
            return false
          }
          return true
        },
        validWhen: true,
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

  componentDidMount(){
    this.loadConfigDateLanguage()
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
  onSave = () => {
    const { t } = this.props;
    let { date, listcheckedInit } = this.state;
    let newList = [...this.state.listChecked];
    let index;
    for (var i = 0; i < listcheckedInit.length; i++) {
      index = newList.indexOf(listcheckedInit[i]);
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
          let overtime_at = moment(date).format("DD-MM-YYYY")
          let shifts = [...newList]
          const { userDetail } = this.props
          let data = {
            user_id: userDetail.id,
            overtime_at,
            shifts
          }
          this.props.actions.addOTShiftForStaff({
            data,
            showSuccess: this.showSuccess,
            showErr: this.showErr
          })
          this.props.hidePopupAdd();
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state)
      })
    }
  }
  /**
   * get api show list day
   * checked day selected
   * check disable event save
   */
  changeDay = day => {
    const overtime_at = moment(day).format("DD-MM-YYYY");
    let { listcheckedInit, listChecked } = this.state;
    const { listCheckedOTShift } = this.props;
    this.props.actions.getListOTChangeDay({
      user_id: this.props.userDetail.id,
      params: {
        overtime_at
      }
    })
    let isActiveSave = true;
    if (JSON.stringify(listCheckedOTShift)
      !== JSON.stringify(listcheckedInit)) {
      isActiveSave = false;
    } else {
      isActiveSave = true;
    }
    this.setState({
      isActiveSave,
      listChecked
    })
  }
  /**
   * when click checked
   * @param {*} listChecked
   * @param {*} listcheckedInit
   */
  onChangeShift = (listChecked, listcheckedInit) => {
    let isActiveSave = true;
    if (JSON.stringify(listChecked) !== JSON.stringify(listcheckedInit)) {
      isActiveSave = false;
    } else {
      isActiveSave = true;
    }
    this.setState({
      isActiveSave,
      listChecked,
      listcheckedInit
    })
  }
  render() {
    const { ...rest } = this.props;
    const { t } = this.props;
    const { isActiveSave, errors } = this.state;
    return (
      <div className="comp-select-day">
        <h3 className="e-flex content-center">{t("user.createShift.add")}</h3>
        <div className="choose-day">
          <div className="choose-content e-flex">
            <div className="text-choose e-flex item-center">
              <span>{t("user.createShift.chooseDay")}</span>
            </div>
            <div className="input-date">
              <DatePicker
                className="date-selected"
                selected={this.state.date}
                minDate={new Date()}
                onChange={date => {
                  this.setState({ date });
                  this.changeDay(date)
                }}
                dateFormat="dd/MM/yyyy"
                locale="languageDate"
              />
              <FontAwesomeIcon className="icon-date" icon={faCalendarAlt} />
            </div>
          </div>
          {errors.date ? <div className="validation">{errors.date}</div> : null}
        </div>
        <div className="e-flex lst-shift">
          <CheckedAddOTShift
            onChangeShift={this.onChangeShift}
            {...rest}
          />
        </div>
        <div className="btn-list e-flex content-center">
          <Button className="s3 e-m-right-10" onClick={() => this.props.hidePopupAdd()}>{t("user.createShift.cancel")}</Button>
          <Button
            onClick={this.onSave}
            disabled={isActiveSave}
          >
            {t("user.createShift.save")}</Button>
        </div>
      </div>
    )
  }
}