import React from "react";
import "../styles.scss";
import { connect } from "react-redux";
import * as action from "../actions";
import { bindActionCreators, compose } from "redux";
import { name } from "../reducers";
import { withNamespaces } from "react-i18next";
import CircleItem from "./CircleItem";
import moment from "moment";
import * as CONSTS from "../consts";
import Loading from "../../../components/common/Loading";
import { withRouter } from "react-router-dom";
class PersonalCalendarPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFunctionId: null,
      selectedDate: moment(),
    };
    this.props.actions.getListShift();
  }

  changeFunctionItem = (itemId) => {
    if (itemId === CONSTS.CODE_ADD_OT) {
      this.props.history.push("/add-ot-shift");
    } else if (itemId === CONSTS.CODE_WORK_INSTEAD) {
      this.props.history.push("/work-instead");
    } else if (itemId === CONSTS.CODE_SHOW_CALENDAR) {
      this.props.history.push("/calendar-staff");
    } else if (itemId === CONSTS.CODE_TAKE_LEAVE) {
      this.props.history.push("/take-leave");
    }
    this.setState({
      selectedFunctionId: itemId,
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  render() {
    const { selectedFunctionId } = this.state;
    const { ...rest } = this.props;
    const { t } = this.props;
    return (
      <main id="site-main" className="check-in-out-management">
        <section id="main-cont" className="full clear body-management">
          <Loading show={this.props.isLoading} />
          <aside className="full-p-width full-p-height">
            <div className="full-p-height e-flex item-center">
              <div className="popup-box wrap-box-management">
                <h3 className="main-lbl text-center text-upper">
                  {t("checkInOutManagement.titleCalendarManagement")}
                </h3>
                <div className="function-list">
                  {CONSTS.funtionCalendarList.map((item, index) => {
                    return (
                      <CircleItem
                        key={index}
                        item={item}
                        selectedId={selectedFunctionId}
                        onChangeSelectedItem={() => {
                          this.changeFunctionItem(item.id);
                        }}
                      ></CircleItem>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    );
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
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(PersonalCalendarPage));
