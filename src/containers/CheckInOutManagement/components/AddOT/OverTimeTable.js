import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, TableData } from "../../../../components/common";
import Swal from "../../../../utils/sweetalert2";
import * as CONSTS from "../../consts";
import moment from "moment";

export default class OverTimeTable extends Component {
  state = {
    overTimeList: this.props.overTimeList,
    pageOverTime: this.props.pageOverTime,
  };

  /**
   * Remove non-official employees for Month
   */
  onDeleteOTShift = (shift) => {
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
        const data = {
          user_id: this.props.userInfo ? this.props.userInfo.sub : null,
          shift_id: shift.Shift ? shift.Shift.id : "",
          overtime_at: moment(shift.overtime_at).format("DD-MM-YYYY"),
        };
        this.props.actions.deleteOverTimeShift({
          data,
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
      html: `<div class="alert-error">${t("checkInOutManagement.cancelError")}. 
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
      JSON.stringify(nextProps.overTimeList) !==
        JSON.stringify(prevState.overTimeList) ||
      nextProps.pageOverTime !== prevState.pageOverTime
    ) {
      return {
        overTimeList: nextProps.overTimeList,
        pageOverTime: nextProps.pageOverTime,
      };
    }
    return null;
  }

  loadMore = () => {
    const { pageOverTime } = this.state;
    const { limitPageOverTime } = this.props;
    {
      if (pageOverTime <= limitPageOverTime) {
        const overtime_at = moment(new Date()).format("DD-MM-YYYY");
        const { userInfo } = this.props;
        this.props.actions.getOverTimeShift({
          user_id: userInfo ? userInfo.sub : "",
          params: {
            overtime_at,
            is_by_date: false,
            page_size: CONSTS.LIMIT,
            index: (pageOverTime - 1) * CONSTS.LIMIT,
          },
        });
      }
    }
  };

  render() {
    const { t } = this.props;
    const { overTimeList } = this.state;
    const TABLE_SETTING = {
      heads: [
        {
          text: t("checkInOutManagement.num"),
          width: "5%",
        },
        {
          text: t("checkInOutManagement.dateOverTime"),
          width: "25%",
        },
        {
          text: t("checkInOutManagement.shiftOverTime"),
          width: "25%",
        },
        {
          text: t("checkInOutManagement.status"),
          width: "45%",
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
          key: "overtime_at",
          width: "25%",
          render: (shift, index) => {
            return moment(shift.overtime_at ? shift.overtime_at : "").format(
              "DD-MM-YYYY"
            );
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
          key: "status",
          width: "45%",
          render: (shift, index) => {
            if (shift.status) {
              if (shift.status === CONSTS.ACCEPT) {
                return <div className="txt-accepted">{ t("checkInOutManagement.accept")}</div>;
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
                      onClick={(e) => this.onDeleteOTShift(shift)}
                    >
                      <div className="margin-bottom-20">
                        <FontAwesomeIcon icon={faTimesCircle} />
                        <span style={{ marginLeft: "5px" }}>
                          {t("checkInOutManagement.cancelOverTime")}
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
        <aside className="set-scrolling-tbl grey70 overtime-tbl">
          <TableData
            option={TABLE_SETTING}
            dataSources={overTimeList}
            onMore={this.loadMore}
            textNotiNoData="Không có dữ liệu"
          ></TableData>
        </aside>
      </>
    );
  }
}
