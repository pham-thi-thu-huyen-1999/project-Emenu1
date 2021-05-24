import React, { Component } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

export default class InputDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: props.defaultValue,
      selected: props.selected
    };
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string,
  };

  /**
   * Emit event on change
   */
  onChange = (selected) => {
    this.setState({ selected })
    this.props.onChange(selected);
  }

  render() {
    const { style, className, type, dateFormat } = this.props;
    const { selected } = this.state;
    return (
      <div className="emenu-input-date">
        <DatePicker
          className={`inner-input-date flex ${className}`}
          selected={selected}
          onChange={this.onChange}
          style={style}
          type={type}
          dateFormat={dateFormat}
        />
        <FontAwesomeIcon className="icon-date" icon={faCalendarAlt} />
      </div>
    );
  }
}
