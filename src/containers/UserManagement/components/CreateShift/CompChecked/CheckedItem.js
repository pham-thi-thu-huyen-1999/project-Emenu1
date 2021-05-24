import React from "react";
import { CheckBox } from "../../../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

export default class CheckedItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false
    }
  }
  onChange = checked => {
    this.setState({ checked })
    this.props.onChangeCheck(checked)
  }
  render() {
    const { shift } = this.props
    return (
      <div className="item-shift">
        <CheckBox
          checked={this.state.checked}
          label={shift.name}
          onChange={checked => this.onChange(checked)}
        />
      </div>
    )
  }
}