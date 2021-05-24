import React, { Component } from "react";
import Dialog from "../../../components/common/Dialog";
import { Input, Button, TableData } from "../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import * as CONSTS from "../constants";
import { LANGUAGES } from "../../../consts/constants";
export default class PopupOffEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searching: "",
      workShift: this.props.workShift,
      employeeOffWorkList: this.props.workShift.users.filter((user) => {
        if (user.status_calendar === CONSTS.OFF) {
          return user;
        }
      }),
      selectedDate: this.props.selectedDate,
    }
  }

  /**
   * Search Employee by name
   */
  onSearch = () => {
    const { searching } = this.state;
    if (searching === '' || searching === null) {
      const employeeOffWorkList = this.props.workShift.users;
      this.setState({
        employeeOffWorkList
      });
    } else {
      const employeeOffWorkList = this.props.workShift.users.filter(employee => employee.full_name.toLowerCase().includes(searching.toLowerCase()));
      this.setState({
        employeeOffWorkList
      });
    }
  }

  render() {
    const { t } = this.props;
    const { employeeOffWorkList, searching, selectedDate, workShift } = this.state;
    const TABLE_SETTING = {
      heads: [
        {
          text: t("calendarManagement.no"),
          width: "10%",
        },
        {
          text: t("calendarManagement.employeeName"),
          width: "30%",
        },
        {
          text: t("calendarManagement.reason"),
          width: "60%"
        },
      ],
      columns: [
        {
          key: "id",
          width: "10%",
          render: (item, index) => {
            return index + 1;
          },
        },
        {
          key: "full_name",
          width: "30%",
        },
        {
          key: "reason",
          width: "60%",
        }
      ],
    };
    return (

      <>
        <Dialog
          show={true}
          close={() => this.props.hide()}
          innerClass="popup-off-employee-list"
        >
          <div className="off-employee-list">
            <h3 className="sec-tit text-center">{t("calendarManagement.titlePopupListOfEmployeeOffWork")}</h3>
            <aside className="e-row e-flex off-employee__info">
              <div className="off-employee-search">
                <Input

                  placeholder={t("calendarManagement.searchName")}
                  onChange={e => {
                    this.setState({ searching: e.target.value });
                  }}
                  className="search-text"
                />
                <Button onClick={this.onSearch}>
                  {t("calendarManagement.search")}{" "}
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{
                      fontSize: 20,
                      verticalAlign: "middle",
                      marginLeft: "5px",
                    }}
                  />
                </Button>
              </div>
              <div className="off-employee-time">
                <div className="time-in-out">{workShift.name} ({workShift.start_time} - {workShift.end_time})</div>
                <div className="time-in-date">
                  {this.props.t("currentLang") === LANGUAGES.vietnam ? CONSTS.DAYS_VN[selectedDate.getDay()] : (this.props.t("currentLang") === LANGUAGES.english ? CONSTS.DAYS_EN[selectedDate.getDay()] : CONSTS.DAYS_JP[selectedDate.getDay()])}&nbsp;
                  {t("calendarManagement.day")} {selectedDate.getDate()}&nbsp;
                  {t("calendarManagement.month")} {selectedDate.getMonth() + 1}
                </div>
              </div>
              <div></div>
            </aside>
            <aside className="off-employee-list__table">
              <TableData
                option={TABLE_SETTING}
                dataSources={employeeOffWorkList}
                textNotiNoData={t("employee.notiNodata")}
              />

            </aside>
          </div>
        </Dialog>
      </>

    )
  }

}




