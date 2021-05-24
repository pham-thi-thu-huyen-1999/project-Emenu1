import React, { Component } from "react";
import { CheckBox } from "../../../components/common";
import Swal from "../../../utils/sweetalert2";
import * as CONSTS from "../constants";
import Dialog from "../../../components/common/Dialog";
import moment from "moment";
import { LANGUAGES } from "../../../consts/constants";
import Button from "../../../components/common/Button";

export default class PopoupAddShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workShiftList: this.props.listShifts,
      selected: [],
    };
  }

  /**
   * Check or Un_Check Employee
   */
  HandleClickEmployee = (id) => {
    let { selected } = this.state;
    const indexOfId = selected.indexOf(id);

    if (indexOfId === -1) {
      selected = selected.concat(id);
    } else {
      selected.splice(indexOfId, 1);
    }

    this.setState({ selected });
  };

  /**
   * Add Employee to work shift
   */
  showAlert = () => {
    const { t, selectedDate, employee, selectedListShiftInMonth } = this.props;
    const { workShiftList, selected } = this.state;
    const data = {
      "user_id": employee.user_id,
      "overtime_at": moment(new Date(selectedDate)).format("DD-MM-YYYY").toString(),
      "shifts": []
    }
    Swal.fire({
      title: t("calendarManagement.swalTitle"),
      text: t("calendarManagement.swalAddEmployeeForWorkShift"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("calendarManagement.swalAgree"),
      cancelButtonText: t("calendarManagement.swalCancel"),
    }).then((result) => {
      if (result.value) {
        let workShiftListTemp = [];
        selectedListShiftInMonth.filter(workShift => {
          if (workShift.status_calendar === CONSTS.WORK_PART_TIME) {
            workShiftListTemp.push(workShift.id);
          }
        })
        workShiftList.filter(workShift => {
          if (selected.indexOf(workShift.id) !== -1) {
            workShiftListTemp.push(workShift.id);
          }
        })
        data.shifts = [...workShiftListTemp];
        this.props.actions.addOverTimeShift({
          data,
          selectedDate,
          callback_success: this.showOk,
          callback_fail: this.showErr
        })
        this.props.hide();
      }
    })
  }

  showOk = () => {
    const t = this.props.t;
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
    const { hide, selectedDate, t } = this.props;
    const { workShiftList, selected } = this.state;
    return (
      <Dialog
        show={true}
        close={() => this.props.hide()}
        innerClass="popup-add-work-shift"
      >
        <div className="day-title e-flex content-left item-center">
          {this.props.t("currentLang") === LANGUAGES.vietnam ? CONSTS.DAYS_VN[selectedDate.getDay()] : (this.props.t("currentLang") === LANGUAGES.english ? CONSTS.DAYS_EN[selectedDate.getDay()] : CONSTS.DAYS_JP[selectedDate.getDay()])}&nbsp;
            {t("calendarManagement.day")} {selectedDate.getDate()}&nbsp;
            {t("calendarManagement.month")} {selectedDate.getMonth() + 1}
        </div>
        <h2
          className="main-lbl text-center popup-add-work-shift__title"
        >
          {t("calendarManagement.titleAddEmployeeForWorkShift")}
        </h2>
        <div className="popup-add-work-shift__content e-row e-col-12 e-flex item-center">

          {workShiftList.map((workShift, index) => (
            <div className="e-col-4 employee-name" key={index}>
              <CheckBox
                name={workShift.id}
                label={workShift.name}
                checked={selected.indexOf(workShift.id) !== -1}
                onChange={() => this.HandleClickEmployee(workShift.id)}
              />
              <br /> <br />
            </div>
          ))}

        </div>
        <aside
          className="e-row e-col-12 e-flex content-center"
        >
          <Button onClick={this.showAlert}>{t("calendarManagement.add")}</Button>
        </aside>
      </Dialog>


    );
  }
}




