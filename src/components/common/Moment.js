import React from "react"
import Moment from 'react-moment';
import 'moment/locale/vi';

class Time extends React.Component {
  render() {
    const { date, format } = this.props
    return (
      <Moment
        format={format}
      >
        {date}
      </Moment>
    )
  }
}

export default Time;