import React, { Component } from "react";
import Dialog from "../../../components/common/Dialog";
import { Input, Button, TableData } from "../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import * as CONSTS from "../constants";
import { LANGUAGES } from "../../../consts/constants";
export default class PopupWorkedEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searching: "",
      workShift: this.props.workShift,
      checkInOut: this.props.checkInOut,
      selectedDate: this.props.selectedDate,
      isFrist: false,
    }
  }

  /**
   * Search Employee by name
   */
  onSearch = () => {
    const { searching } = this.state;
    if (searching === '' || searching === null) {
      const checkInOut = this.props.checkInOut;
      this.setState({
        checkInOut
      });
    } else {
      let checkInOut = this.props.checkInOut.filter(employee => employee.User.full_name.toLowerCase().includes(searching.toLowerCase()));
      this.setState({
        checkInOut
      });
    }
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.checkInOut.length === 0 && nextProps.checkInOut.length !== 0 && prevState.isFrist === false) {
      return {
        checkInOut: [...nextProps.checkInOut],
        isFrist: true,
      }
    }
    return null;
  }

  componentWillUnmount() {
    this.setState({
      isFrist: false
    })
  }

  render() {
    const { t } = this.props;
    const { checkInOut, selectedDate, workShift } = this.state;

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
          text: t("calendarManagement.checkIn"),
          width: "25%",
        },
        {
          text: t("calendarManagement.checkOut"),
          width: "25%",
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
          render: (item) => {
            return item.User.full_name;
          },
        },
        {
          key: "check_in",
          width: "25%",
        },
        {
          key: "check_out",
          width: "25%",
        },
      ],
    };
    return (

      <>
        <Dialog
          show={true}
          close={() => {
            this.props.hide();
            this.props.actions.resetCheckInOut();
          }}
          innerClass="popup-worked-employee-list"
        >
          <div className="worked-employee-list">
            <h3 className="sec-tit text-center worked-employee__title">{t("calendarManagement.titlePopupWorkedEmployeeList")}</h3>
            <aside className="e-row e-flex item-center worked-employee__info">
              <div className="worked-employee-search">
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
              <div className="worked-employee-time">
                <div className="time-in-out">{workShift.name} ({workShift.start_time} - {workShift.end_time})</div>
                <div className="time-in-date">
                  {this.props.t("currentLang") === LANGUAGES.vietnam ? CONSTS.DAYS_VN[selectedDate.getDay()] : (this.props.t("currentLang") === LANGUAGES.english ? CONSTS.DAYS_EN[selectedDate.getDay()] : CONSTS.DAYS_JP[selectedDate.getDay()])}&nbsp;
                  {t("calendarManagement.day")} {selectedDate.getDate()}&nbsp;
                  {t("calendarManagement.month")} {selectedDate.getMonth() + 1}
                </div>
              </div>
              <div></div>
            </aside>
            <aside className="worked-employee__table">
              <TableData
                option={TABLE_SETTING}
                dataSources={checkInOut}
                textNotiNoData={t("employee.notiNodata")}
              />
            </aside>
          </div>
        </Dialog>
      </>

    )
  }

}




