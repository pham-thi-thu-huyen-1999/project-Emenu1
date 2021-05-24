import React from "react";
import { CheckBox } from "../../../../components/common";
import CheckedShift from "./CheckedShift";

export default class RowCheckDay extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shifts: this.props.listShift,
      checkedAll: false,
      checked: false,
      shiftChecked: [],
      day: this.props.day
    }
  }
  checkedAll = () => {
    let { day } = this.state
    if (day.WeekdayShifts.length === this.state.shifts.length) {
      this.setState({ checkedAll: true })
    } else {
      this.setState({ checkedAll: false })
    }
  }
  onCheckedAll = (checked, idDay) => {
    this.props.onCheckedAll(checked, idDay)
  }
  onChangeShift = (checked, idShift, dayId) => {
    this.props.onChangeShift(checked, idShift, dayId)
    this.checkedAll();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.day) !== JSON.stringify(prevState.day)) {
      let checkedAll = false
      if (nextProps.day.WeekdayShifts.length === prevState.shifts.length) {
        checkedAll = true
      }
      return {
        day: nextProps.day,
        checkedAll
      }
    }
    return null
  }
  componentDidMount() {
    if (this.props.day.WeekdayShifts.length === this.state.shifts.length) {
      this.setState({ checkedAll: true })
    } else {
      this.setState({ checkedAll: false })
    }
  }
  render() {
    const { day, shifts } = this.props
    const { t } = this.props
    let lstShift = []
    for (let i in shifts) {
      lstShift[i] = shifts[i].Shift.id
    }
    return (
      <div className="row-tbl e-flex">
        <div className="day-name e-flex item-center">{day.name}</div>
        <div className="check-all">
          <CheckBox
            label={t("user.createShift.all")}
            checked={this.state.checkedAll}
            onChange={checked => this.setState({ checkedAll: checked }, this.onCheckedAll(checked, day.id))} />
        </div>
        <div className="flex list-shift e-flex">
          {
            this.state.shifts.map((shift, index) => {
              return (
                <CheckedShift
                  key={index}
                  dayKey={day.key}
                  checked={lstShift.includes(shift.id)}
                  shift={shift}
                  onChangeShift={(checked, keyShift) => this.onChangeShift(checked, shift.id, day.id)}
                />
              )
            })
          }
        </div>
      </div>
    )
  }
}