import React from "react";
import Cleave from "cleave.js/react";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";

class CleaveInput extends React.Component {
  onChange = (event) => {
    this.props.setValue(event.target.rawValue);
  };

  render() {
    const { value, className, options, disabled } = this.props;
    return (
      <Cleave
        value={value || value === 0 ? value : ""}
        options={
          options || {
            numeral: true,
            numeralThousandsGroupStyle: "thousand"
          }
        }
        onChange={this.onChange}
        className={className ? `${className} input-cleave` : "input-cleave"}
        disabled={disabled ? disabled : false}
      />
    );
  }
}

export default CleaveInput;
