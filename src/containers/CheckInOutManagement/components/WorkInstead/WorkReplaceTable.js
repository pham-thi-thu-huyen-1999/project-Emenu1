import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, TableData } from "../../../../components/common";
import Swal from "../../../../utils/sweetalert2";
import * as CONSTS from "../../consts";
import moment from "moment";

export default class WorkReplaceTable extends Component {
  state = {
    replaceList: this.props.replaceList,
    pageReplace: this.props.pageReplace,
  };

  /**
   * Remove non-official employees for Month
   */
  onDeleteReplaceShift = (shift) => {
    const t = this.props.t;
    Swal.fire({
      title: t("calendarManagement.swalTitle"),
      text: "Bạn có muốn hủy ca làm thay này",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("calendarManagement.swalAgree"),
      cancelButtonText: t("calendarManagement.swalCancel"),
    }).then((result) => {
      if (result.value) {
        const data = {
          user_id: this.props.userInfo ? this.props.userInfo.sub : null,
          replace_shift_id: shift.id ? shift.id : "",
          replace_at: moment().format("DD-MM-YYYY"),
        };
        this.props.actions.deleteReplaceShift({
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

  loadMore = () => {
    const { pageReplace } = this.state;
    const { limitPageReplace } = this.props;
    {
      if (pageReplace <= limitPageReplace) {
        const replace_at = moment(new Date()).format("DD-MM-YYYY");
        const { userInfo } = this.props;
        this.props.actions.getReplaceShift({
          user_id: userInfo ? userInfo.sub : "",
          params: {
            replace_at,
            is_by_date: false,
            page_size: CONSTS.LIMIT,
            index: (pageReplace - 1) * CONSTS.LIMIT,
          },
        });
      }
    }
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(nextProps.replaceList) !==
        JSON.stringify(prevState.replaceList) ||
      nextProps.pageReplace !== prevState.pageReplace
    ) {
      return {
        replaceList: nextProps.replaceList,
        pageReplace: nextProps.pageReplace,
      };
    }
    return null;
  }

  render() {
    const { t } = this.props;
    const { replaceList } = this.state;
    const TABLE_SETTING = {
      heads: [
        {
          text: t("checkInOutManagement.num"),
          width: "5%",
        },
        {
          text: t("checkInOutManagement.dateReplace"),
          width: "20%",
        },
        {
          text: t("checkInOutManagement.replaceShift"),
          width: "20%",
        },
        {
          text: t("checkInOutManagement.replaceFor"),
          width: "20%",
        },
        {
          text: t("checkInOutManagement.status"),
          width: "35%",
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
          key: "replace_at",
          width: "20%",
          render: (shift, index) => {
            return moment(shift.replace_at ? shift.replace_at : "").format(
              "DD-MM-YYYY"
            );
          },
        },
        {
          key: "name",
          width: "20%",
          render: (shift, index) => {
            return shift.Shift ? shift.Shift.name : "";
          },
        },
        {
          key: "ReplaceUser",
          width: "20%",
          render: (shift, index) => {
            return shift.ReplaceUser ? shift.ReplaceUser.full_name : "";
          },
        },
        {
          key: "status",
          width: "35%",
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
                      onClick={(e) => this.onDeleteReplaceShift(shift)}
                    >
                      <div className="margin-bottom-20">
                        <FontAwesomeIcon icon={faTimesCircle} />
                        <span style={{ marginLeft: "5px" }}>
                          {t("checkInOutManagement.cancelReplace")}
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
            dataSources={replaceList}
            onMore={this.loadMore}
            textNotiNoData="Không có dữ liệu"
          ></TableData>
        </aside>
      </>
    );
  }
}
