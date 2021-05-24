import React, { Component } from "react";
import Swal from "../../../utils/sweetalert2";
import * as CONSTS from "../constants";
import { LANGUAGES } from "../../../consts/constants";
import Dialog from "../../../components/common/Dialog";
import Button from "../../../components/common/Button"
export default class PopupOffShiftInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  showConfirmCancelShift = () => {
    this.props.updateCancelOffForMonth();
    this.props.hide();
  }

  render() {
    const { hide, isOverTimeCancelWorkShift, t } = this.props;
    return (
      <Dialog
        show={true}
        close={() => this.props.hide()}
        innerClass="popup-off-work-shift-info"
      >
        <div className="off-work-shift-info__content e-row e-col-12">
          <div className="content-title e-row e-col-12 e-flex content-center">
            {t("calendarManagement.offInfomation")}
          </div>
          <div className="content-status e-row e-col-12 e-flex content-start">
            {t("calendarManagement.tookLeave_1")}
          </div>
          <div className="content-time e-row e-col-12 e-flex content-start">
            Ca hành chính (08:00 - 17:00)
              </div>
          <div className="content-reason e-row e-col-12 e-flex content-start">
            {t("calendarManagement.reason")} bận việc đột xuất nên không đi làm được
          </div>
          <div className="content-thank e-row e-col-12 e-flex content-start">
            {t("calendarManagement.thankYou")}
          </div>
        </div>
        <aside
          className="e-row e-col-12 e-flex content-center"
        >
          {
            isOverTimeCancelWorkShift ?
              (
                <Button type='s3' onClick={() => { this.props.hide(); }} >{t("calendarManagement.back")}</Button>
              ) :
              (
                <>
                  <Button type='s3' onClick={() => { this.props.hide(); }} >{t("calendarManagement.back")}</Button>
                  &nbsp;&nbsp;
                  <Button className="btn-cancel-request" onClick={() => {
                    this.showConfirmCancelShift();
                  }}>{t("calendarManagement.cancelLeave")}</Button>
                </>

              )
          }
        </aside>
      </Dialog>


    );
  }
}




