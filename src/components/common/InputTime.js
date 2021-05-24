import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from '@material-ui/core';

export default class InputDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: props.defaultValue,
      time: props.value
    };
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    defaultValue: PropTypes.any
  };

  /**
   * Emit event on change
   */
  onTimeChange = e => {
    this.setState({ time: e.target.value })
    this.props.onChange(e.target.value);
  }

  render() {
    const { className, inputProps, defaultValue } = this.props;
    const { time } = this.state;
    return (
      <div className="emenu-input-time flex">
        <div className="inner-input-time" htmlFor="time">
          <TextField
            id="time"
            type="time"
            inputProps={inputProps}
            defaultValue={defaultValue}
            onChange={this.onTimeChange}
            className={className}
          />
        </div>
      </div>
    );
  }
}
InputDate.defaultProps = {
  inputProps: { step: 500 },
  defaultValue: "00:00"
}
