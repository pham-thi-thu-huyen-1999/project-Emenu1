import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { withNamespaces } from "react-i18next";
import { withRouter } from "react-router-dom";
import { name } from "./reducers";
import * as action from "./actions";
import { Main } from "./components";
import _ from 'lodash'

class TableArrangement extends Component {
  componentDidMount() {
    const areaId = this.props.match.params.areaId || null;
    this.props.actions.getAreaInfo(areaId);
    this.props.actions.getTableListByAreaId({ area_id: areaId });
    this.props.actions.getAreaIcon();
  }

  componentWillReceiveProps(nextProps) {
    // So sánh vùng nhớ của trước và sau props
    if(nextProps.areaInfo !== this.props.areaInfo){
      this.props.actions.getTableListArrangementById({ area_id: nextProps.areaInfo.id });
    }
  }
  componentDidUpdate() {}

  render() {
    const { ...rest } = this.props;
    return <Main {...rest} />;
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[name],
  };
};
const mapDispatchToProps = (dispatch) => {
  const actions = {
    ...action,
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(TableArrangement));
