import React from "react";
import { Button } from "../../../../components/common";
import RowCheckDay from "./RowCheckDay";
import Swal from '../../../../../src/utils/sweetalert2';

export default class MainShift extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      checkedAll: false,
      days: this.props.listDayWeek,
      newDays: this.props.listShiftWeekday,
      listShiftWeekday: this.props.listShiftWeekday,
      listShift: this.props.listShift
    }
  }
  onChangeShift = (checked, idShift, dayId) => {
    let newDays = [...this.state.newDays]
    if (checked) {
      let dayIndex = 0
      let newDay = {}
      newDays.map((day, index) => {
        let newLst = [...day.WeekdayShifts]
        if (day.id === dayId) {
          dayIndex = index;
          newLst = [...newLst, { Shift: { id: idShift } }]
          newDay = { ...day, WeekdayShifts: newLst }
          return newDay
        }
      })
      newDays[dayIndex] = { ...newDay }
      this.setState({ newDays })
    } else {
      let indexDay = -1;
      let newDay = {}
      newDays.map((day, index) => {
        if (day.id === dayId) {
          indexDay = index
          let listNewShift = [...day.WeekdayShifts]
          listNewShift = listNewShift.filter(item => item.Shift.id !== idShift)
          newDay = { ...day, WeekdayShifts: listNewShift }
          return newDay
        }
      })
      newDays[indexDay] = { ...newDay }
      this.setState({
        newDays
      })
    }
  }
  onCheckedAll = (checked, idDay) => {
    const { listShift } = this.state
    let newDays = [...this.state.newDays]
    if (checked) {
      let newDay = {}
      let dayIndex = 0
      newDays.map((day, index) => {
        let newLst = [];
        if (day.id === idDay) {
          dayIndex = index;
          let newObj = {}
          newLst = listShift.map((shift, index) => {
            newObj = { Shift: { id: shift.id } }
            return newObj
          })
          newDay = { ...day, WeekdayShifts: [...newLst] }
          return { ...newDay }
        }
      })
      newDays[dayIndex] = { ...newDay }
      this.setState({ newDays })
    } else {
      let indexDay = 0
      let newDay = {}
      newDays.map((day, index) => {
        let newListShift = []
        if (day.id === idDay) {
          indexDay = index
          newListShift = []
          newDay = { ...day, WeekdayShifts: newListShift }
          return newDay
        }
      })
      newDays[indexDay] = { ...newDay }
      this.setState({ newDays })
    }
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
  onSave = () => {
    const { t } = this.props;
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
        let data = []
        this.state.newDays.map(day => {
          let shifts = []
          shifts = day.WeekdayShifts.map(item => {
            let id = item.Shift.id
            return id
          })
          data.push(
            {
              weekday_id: day.id,
              user_id: this.props.userDetail.id,
              shifts
            }
          )
          return data
        })
        this.props.actions.addShiftForStaff({
          data,
          showSuccess: this.showSuccess,
          showErr: this.showErr
        })
        this.props.hide();
      }
    })
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.listShiftWeekday) !== JSON.stringify(prevState.listShiftWeekday)) {
      return {
        newDays: nextProps.listShiftWeekday,
        listShiftWeekday: nextProps.listShiftWeekday
      }
    }
    return null
  }
  render() {
    const { newDays } = this.state
    const { ...rest } = this.props
    const { t } = this.props
    return (
      <div className="main-shift">
        <div className="tbl-main-shift">
          {
            newDays.map((day, index) => {
              return (
                <RowCheckDay
                  key={index}
                  day={day}
                  shifts={day.WeekdayShifts}
                  onChangeShift={this.onChangeShift}
                  onCheckedAll={this.onCheckedAll}
                  {...rest}
                />
              )
            })
          }
        </div>
        <div className="lst-btn e-flex content-end">
          <Button className="s3 e-m-right-10" onClick={() => this.props.hide()}>{t("user.createShift.back")}</Button>
          <Button onClick={this.onSave}>{t("user.createShift.save")}</Button>
        </div>
      </div>
    )
  }
}