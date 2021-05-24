import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: props.defaultValue || "",
      innerValue: props.value || ""
    }
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.defaultValue !== prevState.defaultValue) {
      return {
        defaultValue: nextProps.defaultValue
      };
    }
    return null;
  }

  componentDidMount() {
    this.updateFormat();
  }

  /**
   * Emit event on change
   */
  onChange = (event) => {
    const { target: { value } } = event;
    const number = value.replace(/,/g, '');

    if (this.modeNumber()) {
      if (!_.isNaN(Number(number))) {
        this.setState({ innerValue: number });
        this.props.onChange({
          target: {
            value: number
          }
        });
        this.input.value = number;
      }
    } else {
      this.setState({ innerValue: value });
      this.props.onChange({
        target: { value }
      });
    }
    this.updateFormat();
  }

  /**
   * Check mode number
   */
  modeNumber = () => {
    return !_.isUndefined(this.props.number);
  }

  /**
   * Get string with regex format
   */
  formatNumber = (value) => {
    if (this.modeNumber()) {
      const { number } = this.props;
      const regex = _.isRegExp(number) ? number : /\B(?=(\d{3})+(?!\d))/g;
      return Number(value).toString().replace(regex, ",") || 0;
    } else {
      return value;
    }
  }

  /**
   * Update format
   */
  updateFormat = () => {
    if (this.modeNumber()) {
      const { innerValue } = this.state;
      this.input.value = this.formatNumber(innerValue);
    }
  }

  /**
  * Called when Input on Focus event
  */
  onFocus = () => {
    if (this.modeNumber()) {
      const { innerValue } = this.state;
      this.input.value = innerValue;
    }
  }

  /**
   * Render component
   */
  render() {
    const { placeholder, style, className, type, disabled, value } = this.props;
    const { defaultValue } = this.state;
    return (
      <input
        className={`emenu-input ${className || ''}`}
        value={this.formatNumber(value)}
        type={type}
        style={style}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        ref={e => this.input = e}
        onChange={this.onChange}
      />
    );
  }
}
