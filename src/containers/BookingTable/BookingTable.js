import React from "react";
import { Main } from "./components";
import "./styles.scss";
import { connect } from "react-redux"
import * as action from "./actions";
import { bindActionCreators } from "redux";
import { name } from "./reducers";
import { withNamespaces } from "react-i18next";
import moment from "moment";
class BookingTable extends React.Component {
  componentDidMount() {
    const date = new Date();
    const fromDate = moment(date.setDate(date.getDate())).format("DD-MM-YYYY")
    const toDate = moment(date.setDate(date.getDate() + 7)).format("DD-MM-YYYY")
    this.props.actions.getListBookingTable({
      index: 0, page_size: 20,
      from_date: fromDate, to_date: toDate
    })
    this.props.actions.getListArea();
    this.props.actions.getListAreaByParnerId();
  }
  render() {
    const {
      ...rest
    } = this.props;
    return (
      <Main {
        ...rest
      } />
    )
  }
}
const mapStateToProps = state => {
  return {
    ...state[name]
  }
}
const mapDispatchToProps = dispatch => {
  const actions = {
    ...action
  }
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(BookingTable))
