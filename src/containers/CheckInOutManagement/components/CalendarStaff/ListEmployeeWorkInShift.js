import React, { Component } from "react";
import * as CONSTS from "../../consts";
import { LANGUAGES } from "../../../../consts/constants";
import Dialog from "../../../../components/common/Dialog";
import Button from "../../../../components/common/Button";
import moment from "moment";
export default class ListEmployeeWorkInShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeList: [],
    };
    const data = {
      shift_id: this.props.shift.id,
      params: {
        date_at: moment(this.props.selectedDate).format("DD-MM-YYYY"),
      },
    };
    this.props.actions.getEmployeeOfShift(data);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(nextProps.employeeList) !==
        JSON.stringify(prevState.employeeList)
    ) {
      return {
        employeeList: nextProps.employeeList
      };
    }
    return null;
  }

  render() {
    const { hide, t, shift, selectedDate } = this.props;
    const { employeeList } = this.state;
    return (
      <Dialog
        show={true}
        close={() => hide()}
        innerClass="popup-employee-list-in-checkinout"
      >
        <div className="title">Danh sách nhân viên {shift.name}</div>
        <div className="time">
          {this.props.t("currentLang") === LANGUAGES.vietnam
            ? CONSTS.DAYS_VN[selectedDate.getDay()]
            : this.props.t("currentLang") === LANGUAGES.english
            ? CONSTS.DAYS_EN[selectedDate.getDay()]
            : CONSTS.DAYS_JP[selectedDate.getDay()]}
          &nbsp;
          {t("calendarManagement.day")} {selectedDate.getDate()}&nbsp;
          {t("calendarManagement.month")} {selectedDate.getMonth() + 1}
        </div>
        <div className="body-content">
          {employeeList.length !== 0 ? employeeList.map((employee, index) => {
            return (
              <div key={index} className="employee">
                {index + 1}.{employee.full_name}
              </div>
            );
          }) : null}
        </div>
        <aside className="e-row e-col-12 e-flex content-center">
          <Button
            type="s3"
            onClick={() => {
              this.props.hide();
            }}
          >
            {t("calendarManagement.back")}
          </Button>
        </aside>
      </Dialog>
    );
  }
}
