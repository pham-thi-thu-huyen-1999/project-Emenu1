import React, { Component } from "react";
import { TextArea } from "../../../components/common";
import Swal from "../../../utils/sweetalert2";
import * as CONSTS from "../constants";
import { LANGUAGES } from "../../../consts/constants";
import Dialog from "../../../components/common/Dialog";
import moment from "moment";
import Button from "../../../components/common/Button";
export default class PopoupAskForOff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEmployee: this.props.selectedEmployeeInDayManagement,
      selectedShiftInDay: this.props.selectedShiftInDay,
      selectedDate: this.props.selectedDate,
      selectedBtn: this.props.selectedBtn,
      descReason: "",
    };
  }

  /**
   * Registration request for employee leave
   */
  showAlert = () => {
    const { t, selectedDatesInWeek } = this.props;
    const { selectedEmployee, selectedShiftInDay, selectedDate, selectedBtn, descReason } = this.state;
    const data = {
      "user_id": selectedBtn === CONSTS.MONTH ? selectedEmployee.user_id : selectedEmployee.id,
      "take_leave_at": moment(new Date(selectedDate)).format("DD-MM-YYYY").toString(),
      "description": descReason,
      "shifts": [
        selectedShiftInDay.id
      ]
    }
    Swal.fire({
      title: t("calendarManagement.swalTitle"),
      text: t("calendarManagement.swalEmployeeForBreak"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("calendarManagement.swalAgree"),
      cancelButtonText: t("calendarManagement.swalCancel"),
    }).then((result) => {
      if (result.value) {
        if (selectedBtn === CONSTS.DAY) {
          this.props.actions.updateTakeLeave({
            data,
            selectedBtn,
            callback_success: this.showOk,
            callback_fail: this.showErr
          });
        } else if (selectedBtn === CONSTS.WEEK) {
          this.props.actions.updateTakeLeave({
            data,
            selectedBtn,
            selectedDatesInWeek,
            callback_success: this.showOk,
            callback_fail: this.showErr
          });
        } else if (selectedBtn === CONSTS.MONTH) {
          this.props.actions.updateTakeLeave({
            data,
            selectedBtn,
            selectedDate,
            callback_success: this.showOk,
            callback_fail: this.showErr
          });
        }

        this.props.hide();
      }
    })
  }

  showOk = () => {
    const t = this.props.t;
    this.props.updateEmployeeForBreak();
    Swal.fire({
      icon: 'success',
      text: t("calendarManagement.swalUpdateSuccess"),
      title: t("calendarManagement.swalTitle")
    })
  }

  showErr = () => {
    const t = this.props.t;

    Swal.fire({
      icon: 'error',
      title: t("calendarManagement.swalTitle"),
      text: t("calendarManagement.swalUpdateFail"),
    })
  }

  render() {
    const { hide, t, selectedShiftInDay, calendar } = this.props;
    const { descReason, selectedDate, selectedEmployee } = this.state;
    return (
      <Dialog
        show={true}
        close={() => this.props.hide()}
        innerClass="popup-ask-for-break"
      >
        <div className="popup-ask-for-break__content e-row e-col-12">
          <div className="e-row e-col-12 e-flex">
            {this.props.t("currentLang") === LANGUAGES.vietnam ? CONSTS.DAYS_VN[selectedDate.getDay()] : (this.props.t("currentLang") === LANGUAGES.english ? CONSTS.DAYS_EN[selectedDate.getDay()] : CONSTS.DAYS_JP[selectedDate.getDay()])}&nbsp;
            {t("calendarManagement.day")} {selectedDate.getDate()}&nbsp;
            {t("calendarManagement.month")} {selectedDate.getMonth() + 1}
          </div>
          <div className="e-row e-col-12 e-flex content-center">
            {selectedShiftInDay.name}
          </div>
          <div className="e-row e-col-12 e-flex content-center">
            {
              `${selectedShiftInDay.start_time} - ${selectedShiftInDay.end_time}`
            }
              </div>
          <div className="e-row e-col-12 e-flex content-center">
            {t("calendarManagement.takeLeave")}
          </div>
          <div className="e-row e-col-12 e-flex content-start">
            {t("calendarManagement.employee")} {selectedEmployee.full_name}
          </div>
          <div className="e-row e-col-12 e-flex content-start">
            <TextArea
              name="Mô tả"
              rows={8}
              value={descReason}
              placeholder={t("calendarManagement.reason")}
              onChange={(e) =>
                this.setState({ descReason: e.target.value })
              }
            />
          </div>


        </div>
        <aside
          className="e-row e-col-12 e-flex content-center e-m-top-20"
        >
            <Button onClick={this.showAlert}>{t("calendarManagement.add")}</Button>
        </aside>
      </Dialog>


    );
  }
}




