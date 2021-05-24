import React, { Component } from "react";
import PropTypes from "prop-types";
import InputType from "./InputType";

class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked,
    };
  }
  /**
   * Emit event on change
   */
  onChange = (event) => {
    this.setState({ checked: event.target.checked });
    this.props.onChange(event.target.checked);
  };
  /**
   * Update state on prop change value
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.checked !== nextProps.checked) {
      this.setState({ checked: nextProps.checked });
    }
  }
  /**
   * Render
   */
  render() {
    const { name, label, type, className, style, span, disabled } = this.props;
    const { checked } = this.state;
    let nice = "nice-chkbox";
    let pl = "pl ";
    if (type) {
      nice = "nice-chkboxslt";
      pl += type;
    }

    return (
      <span style={style} className={`chkbox ${className || ""}`}

      >
        <label className={nice}>
          <InputType
            type="checkbox"
            id={name}
            name={name}
            checked={checked}
            onChange={this.onChange}
            disabled={disabled}
          />
          <span className={pl} style={span}></span>

        </label>
        {label ? (
          <label
            style={{ marginLeft: 5, cursor: "pointer" }}
            htmlFor={name}
            className="txt blue"
          >
            {label}
          </label>
        ) : (
            ""
          )}
      </span>
    );
  }
}

CheckBox.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default CheckBox;
