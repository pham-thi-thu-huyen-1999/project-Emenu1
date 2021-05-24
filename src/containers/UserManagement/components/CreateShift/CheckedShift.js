import React from "react";
import { CheckBox, Button } from "../../../../components/common";

export default class CheckedShift extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: props.checked
    }
  }
  onChange = (checked, idShift, typeShift) => {
    this.setState({ checked })
    this.props.onChangeShift(checked, idShift, typeShift)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.state.checked) {
      this.setState({ checked: nextProps.checked })
    }
  }
  render() {
    const { shift, dayKey } = this.props;
    const { checked } = this.state;
    return (
      <div className="e-p-5 flex">
        <CheckBox label={shift.name}
          checked={checked}
          onChange={checked => this.onChange(checked, shift.id, dayKey)}
        />
      </div>
    )
  }
}