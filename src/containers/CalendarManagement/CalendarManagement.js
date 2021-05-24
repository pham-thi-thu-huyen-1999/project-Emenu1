import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { name } from "./reducers";
import * as action from "./actions";
import { Header } from "../../components";
import { Main } from "./components";
import bgEmenu from "../../images/bg-emenu.png";

import { withNamespaces } from "react-i18next";
import moment from "moment";

class CalendarManagement extends Component {

  componentDidMount() {
    this.props.actions.getCalendar({
      fromDate: moment(new Date()).format("DD-MM-YYYY"),
      toDate: moment(new Date()).format("DD-MM-YYYY"),
    });
    this.props.actions.getListShift();
    this.props.actions.getTotalShift({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    });
  }

  render() {
    const { ...rest } = this.props;
    return (
      <div
        id="page-wrapper"
        className="use-bg"
        data-bg="images/body-bg.jpg"
        style={{ backgroundImage: `url(${bgEmenu})` }}
      >
        <Header />
        <Main {...rest} />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    ...state[name]
  };
};
const mapDispatchToProps = dispatch => {
  const actions = {
    ...action
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(CalendarManagement));
