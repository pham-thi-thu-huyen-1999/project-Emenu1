import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, TableData } from "../../../../components/common";
import Swal from "../../../../utils/sweetalert2";
import * as CONSTS from "../../consts";
import moment from "moment";

export default class TakeLeaveTable extends Component {
  state = {
    takeLeaveList: this.props.takeLeaveList,
    pageTakeLeave: this.props.pageTakeLeave,
  };

  /**
   * Remove non-official employees for Month
   */
  onDeleteTakeLeaveShift = (takeLeaveShift) => {
    const t = this.props.t;
    Swal.fire({
      title: t("calendarManagement.swalTitle"),
      text: "Bạn có muốn hủy ca làm thêm này",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("calendarManagement.swalAgree"),
      cancelButtonText: t("calendarManagement.swalCancel"),
    }).then((result) => {
      if (result.value) {
        const take_leave_at = moment(new Date()).format("DD-MM-YYYY");
        const { userInfo } = this.props;
        this.props.actions.deleteTakeLeaveShift({
          take_leave_id: takeLeaveShift.id,
          user_id: userInfo ? userInfo.sub : "",
          take_leave_at,
          showSuccess: this.showOk,
          showErr: this.showErr,
        });
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
  };

  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      title: "",
      html: `<div class="alert-error">${t(
        "checkInOutManagement.cancelError"
      )}. 
      <br/>${t("checkInOutManagement.pleaseCheckAgain")}</div>`,
      imageUrl: require("../../../../images/CheckInOut/grin-tears-regular.png"),
      imageAlt: "Custom image",
      showCancelButton: false,
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.value) {
      }
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(nextProps.takeLeaveList) !==
        JSON.stringify(prevState.takeLeaveList) ||
      nextProps.pageTakeLeave !== prevState.pageTakeLeave
    ) {
      return {
        takeLeaveList: nextProps.takeLeaveList,
        pageTakeLeave: nextProps.pageTakeLeave,
      };
    }
    return null;
  }

  loadMore = () => {
    const { pageTakeLeave } = this.state;
    const { limitPageTakeLeave } = this.props;
    {
      if (pageTakeLeave <= limitPageTakeLeave) {
        const take_leave_at = moment(new Date()).format("DD-MM-YYYY");
        const { userInfo } = this.props;
        this.props.actions.getTakeLeaveShift({
          user_id: userInfo ? userInfo.sub : "",
          params: {
            take_leave_at,
            is_by_date: false,
            page_size: CONSTS.LIMIT,
            index: (pageTakeLeave - 1) * CONSTS.LIMIT,
          },
        });
      }
    }
  };
  render() {
    const { t } = this.props;
    const { takeLeaveList } = this.state;
    const TABLE_SETTING = {
      heads: [
        {
          text: t("checkInOutManagement.num"),
          width: "5%",
        },
        {
          text: t("checkInOutManagement.dateTakeLeave"),
          width: "15%",
        },
        {
          text: t("checkInOutManagement.shiftTakeLeave"),
          width: "25%",
        },
        {
          text: t("checkInOutManagement.reason"),
          width: "25%",
        },
        {
          text: t("checkInOutManagement.status"),
          width: "30%",
        },
      ],
      columns: [
        {
          key: "id",
          width: "5%",
          render: (shift, index) => {
            return index + 1;
          },
        },
        {
          key: "take_leave_at",
          width: "15%",
          render: (shift, index) => {
            return moment(
              shift.take_leave_at ? shift.take_leave_at : ""
            ).format("DD-MM-YYYY");
          },
        },
        {
          key: "name",
          width: "25%",
          render: (shift, index) => {
            return shift.Shift ? shift.Shift.name : "";
          },
        },
        {
          key: "description",
          width: "25%",
          render: (shift, index) => {
            return shift.description ? shift.description : "";
          },
        },
        {
          key: "status",
          width: "30%",
          render: (shift, index) => {
            if (shift.status) {
              if (shift.status === CONSTS.ACCEPT) {
                return (
                  <div className="txt-accepted">
                    {t("checkInOutManagement.accept")}
                  </div>
                );
              } else if (shift.status === CONSTS.WAITING) {
                return (
                  <div className="wrap-waiting-status">
                    <div className="txt-waiting">
                      {t("checkInOutManagement.waiting")}
                    </div>
                    <Button
                      /* className="s-btn s2 delete-btn height-width-btn" */
                      className="height-width-btn"
                      type="s2"
                      onClick={(e) => this.onDeleteTakeLeaveShift(shift)}
                    >
                      <div className="margin-bottom-20">
                        <FontAwesomeIcon icon={faTimesCircle} />
                        <span style={{ marginLeft: "5px" }}>
                          {t("checkInOutManagement.cancelTakeLeave")}
                        </span>
                      </div>
                    </Button>
                  </div>
                );
              } else if (shift.status === CONSTS.CANCEL) {
                return (
                  <div className="txt-cancel">
                    {t("checkInOutManagement.noAccept")}
                  </div>
                );
              }
              return "";
            } else {
              return "";
            }
          },
        },
      ],
    };
    return (
      <>
        <aside className="set-scrolling-tbl grey70 take-leave-tbl">
          <TableData
            option={TABLE_SETTING}
            dataSources={takeLeaveList}
            onMore={() => {
              this.loadMore();
            }}
          ></TableData>
        </aside>
      </>
    );
  }
}
