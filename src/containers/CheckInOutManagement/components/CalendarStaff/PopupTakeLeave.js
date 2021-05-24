import React, { Component } from "react";
import { TextArea } from "../../../../components/common";
import Swal from "../../../../utils/sweetalert2";
import * as CONSTS from "../../consts";
import { LANGUAGES } from "../../../../consts/constants";
import Dialog from "../../../../components/common/Dialog";
import moment from "moment";
import Button from "../../../../components/common/Button";
import { get } from "../../../../services/localStorage";
import common from "../../../../utils/common";
const user_id = common.decodeToken(get("accessToken")).sub;
export default class PopupTakeLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEmployee: this.props.selectedEmployeeInDayManagement,
      selectedShift: this.props.selectedShift,
      selectedDate: this.props.selectedDate,
      selectedBtn: this.props.selectedBtn,
      workingCategory: this.props.workingCategory,
      descReason: "",
    };
  }

  /**
   * Registration request for employee leave
   */
  addTakeLeave = () => {
    const { t } = this.props;
    Swal.fire({
      title: `${t("user.createShift.youSure")}?`,
      text: `Bạn có chắc chắn muốn nghỉ ca này`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${t("user.createShift.yes")}`,
      cancelButtonText: `${t("user.createShift.cancel")}`,
    }).then((result) => {
      if (result.value) {
        const {
          selectedDate,
          selectedShift,
          descReason,
          workingCategory,
        } = this.state;
        let take_leave_at = moment(selectedDate).format("DD-MM-YYYY");
        let shifts = [];
        shifts.push(selectedShift.id);
        const data = {
          user_id: user_id,
          take_leave_at,
          description: descReason ? descReason : "",
          shifts,
        };
        if (workingCategory === CONSTS.WEEK) {
          const { selectedDatesInWeek } = this.props;

          this.props.actions.addTakeLeaveForCalendar({
            data,
            workingCategory,
            selectedDatesInWeek,
            user_id,
            showSuccess: this.showOk,
            showErr: this.showError,
          });
        } else if (workingCategory === CONSTS.MONTH) {

          this.props.actions.addTakeLeaveForCalendar({
            data,
            workingCategory,
            selectedDate,
            user_id,
            showSuccess: this.showOk,
            showErr: this.showError,
          });
        }
      }
    });
  };

  showOk = () => {
    const t = this.props.t;
    Swal.fire({
      icon: "success",
      text: t("calendarManagement.swalUpdateSuccess"),
      title: t("calendarManagement.swalTitle"),
    });
    this.props.hide();
  };

  showError = () => {
    const t = this.props.t;
    Swal.fire({
      icon: "error",
      title: t("calendarManagement.swalTitle"),
      text: t("calendarManagement.swalUpdateFail"),
    });
  };

  render() {
    const { hide, t } = this.props;
    const { descReason, selectedDate } = this.state;
    return (
      <Dialog
        show={true}
        close={() => hide()}
        innerClass="popup-take-leave-in-checkinout"
      >
        <div className="e-row e-col-12">
          <div className="e-row e-col-12 e-flex content-center title">
            ĐĂNG KÍ NGHỈ PHÉP
          </div>
          <div className="e-row e-col-12 e-flex content-center e-m-bottom-15">
            (
            {this.props.t("currentLang") === LANGUAGES.vietnam
              ? CONSTS.DAYS_VN[selectedDate.getDay()]
              : this.props.t("currentLang") === LANGUAGES.english
              ? CONSTS.DAYS_EN[selectedDate.getDay()]
              : CONSTS.DAYS_JP[selectedDate.getDay()]}
            &nbsp;
            {t("calendarManagement.day")} {selectedDate.getDate()}&nbsp;
            {t("calendarManagement.month")} {selectedDate.getMonth() + 1})
          </div>
          <div className="e-row e-col-12 e-flex content-start">
            <TextArea
              name="Mô tả"
              rows={8}
              value={descReason}
              placeholder={t("calendarManagement.reason")}
              onChange={(e) => this.setState({ descReason: e.target.value })}
            />
          </div>
        </div>
        <aside className="e-row e-col-12 e-flex content-center e-m-top-20">
          <Button
            type="s3"
            onClick={() => {
              this.props.hide();
            }}
          >
            Trở về
          </Button>
          &nbsp;&nbsp;
          <Button onClick={this.addTakeLeave}>
            {t("calendarManagement.add")}
          </Button>
        </aside>
      </Dialog>
    );
  }
}
