import React, { Component } from "react";
import DatePicker from "react-datepicker";

export default class DatePickerByDay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: this.props.startDate
    };
  }
  /**
   * Update startDate and selectedDate
   */
  setDate = date => {
    const value = new Date(date);
    this.setState({
      startDate: date
    })
    this.props.onChangeDate(value);
  }
  /**
   * Update startDate
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.startDate !== prevState.startDate) {
      return { startDate: nextProps.startDate };
    }
    else return null;
  }


  render() {
    const { startDate } = this.state;
    return (
      <DatePicker
        className="react-datepicker"
        selected={startDate}
        onChange={date => { this.setDate(date) }}
        dayClassName={date =>
          date !== startDate ? "random" : undefined
        }
        inline
      />
    );

  }

}




