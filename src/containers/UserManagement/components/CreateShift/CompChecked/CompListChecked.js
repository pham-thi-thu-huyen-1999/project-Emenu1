import React from "react";
import { CheckBox } from "../../../../../components/common";
import PropTypes from "prop-types";
export default class CompListChecked extends React.Component {
  static propTypes = {
    onChange: PropTypes.func
  };
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { t } = this.props
    const { listShift, changeCheckedAll, changeCheckedShift, dataCheckedInit,
      listShiftChecked, checkedAll, noCalendar, listTakeLeaveByDay
    } = this.props;
    return (
      <><div className="item-shift">
        <CheckBox label={t("user.createShift.all")}
          checked={checkedAll}
          className={listTakeLeaveByDay.length === listShift.length
            ? "disable-default" : ""}
          disabled={listTakeLeaveByDay.length === listShift.length}
          onChange={checked => {
            changeCheckedAll(checked)
          }}
        />
      </div>
        {listShift.map((shift, index) => {
          const checked = listShiftChecked.includes(shift.id)
          const dataDisable = dataCheckedInit.includes(shift.id)
          return (
            <div key={index} className="item-shift">
              <CheckBox
                className={dataDisable ? "disable-default" : ""}
                checked={checked}
                disabled={dataDisable}
                label={shift.name}
                onChange={checked => changeCheckedShift(checked, shift.id)}
              />
              {noCalendar.includes(shift.id) ?
                <span className="e-m-left-5">({t("user.createShift.noCalendar")})</span>
                : ""}
            </div>
          )
        })}
      </>
    )
  }
}