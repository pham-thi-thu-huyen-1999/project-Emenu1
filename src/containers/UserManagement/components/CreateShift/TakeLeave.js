import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faTimesCircle, faSearch, faPlusCircle, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Dialog, TableData } from "../../../../components/common";
import AddDayOff from "./PopupAdd/PopupAddDayOff";
import moment from "moment";
import Swal from '../../../../../src/utils/sweetalert2';
import DatePicker, { registerLocale } from "react-datepicker";
import languageDateVi from "date-fns/locale/vi";
import languageDateEn from "date-fns/locale/en-GB";
import languageDateJa from "date-fns/locale/ja";
import * as CONSTS from "./../../constants";
export default class TakeLeave extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPopupAdd: false,
      dateSearch: new Date(),
      listTakeLeave: this.props.listTakeLeave
    }
  }
  
  onSearch = () => {
    let take_leave_at = moment(this.state.dateSearch).format("DD-MM-YYYY")
    this.props.actions.getListTakeLeave({
      user_id: this.props.userDetail.id, params: {
        take_leave_at
      }
    });
  }
  /**
   * config language datepicker
   */
  loadConfigDateLanguage = () => {
    const { t } = this.props
    const endCode = t("user.languageDate")
    switch (endCode) {
      case "vi":
        registerLocale("languageDate", languageDateVi);
        break;
      case "en-GB":
        registerLocale("languageDate", languageDateEn);
        break;
      case "ja":
        registerLocale("languageDate", languageDateJa);
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    this.loadConfigDateLanguage()
    let take_leave_at = moment(this.state.dateSearch).format("DD-MM-YYYY")
    this.props.actions.getListTakeLeave({
      user_id: this.props.userDetail.id, params: {
        take_leave_at
      }
    });
  }

  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("user.createShift.deleteSuccess")}`,
      showConfirmButton: true
    })
  }

  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("user.createShift.deleteError")}`,
      text: `${t("user.createShift.reqCheckAgain")}`
    })
  }

  clickItemDelete = item => {
    const { t } = this.props
    Swal.fire({
      title: `${t("user.createShift.youSure")}?`,
      text: `${t("user.createShift.confirmDelete")}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("user.createShift.yes")}`,
      cancelButtonText: `${t("user.createShift.cancel")}`
    }).then((result) => {
      if (result.value) {
        let take_leave_at = moment(this.state.dateSearch).format("DD-MM-YYYY")
        this.props.actions.deleteTakeLeaveById({
          take_leave_id: item.id,
          user_id: this.props.userDetail.id,
          params: {
            take_leave_at
          },
          showSuccess: this.showSuccess,
          showErr: this.showErr
        })
      }
    })
  }

  clickItemUpdateStatus = (item, status) => {
    const { t } = this.props
    Swal.fire({
      title: `${t("user.createShift.youSure")}?`,
      text: `${t("user.createShift.confirmEdit")}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("user.createShift.yes")}`,
      cancelButtonText: `${t("user.createShift.cancel")}`
    }).then((result) => {
      if (result.value) {
        let take_leave_at = moment(this.state.dateSearch).format("DD-MM-YYYY")
        this.props.actions.deleteTakeLeaveById({
          data: {
            status,
            description: ""
          },
          take_leave_id: item.id,
          user_id: this.props.userDetail.id,
          params: {
            take_leave_at
          },
          showSuccess: this.showSuccess,
          showErr: this.showErr
        })
      }
    })
  }

  showUpdateSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("user.createShift.editSuccess")}`,
      showConfirmButton: true
    })
  }

  showUpdateErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("user.createShift.editError")}`,
      text: `${t("user.createShift.reqCheckAgain")}`
    })
  }

  render() {
    const { ...rest } = this.props;
    const { t } = this.props
    const { showPopupAdd } = this.state;
    let take_leave_at = moment(new Date()).format("DD-MM-YYYY")
    const TABLE_SETTING = {
      heads: [
        {
          text: `${t("user.createShift.stt")}`,
          width: "10%"
        },
        {
          text: `${t("user.createShift.workingDay")}`,
          width: "20%"
        },
        {
          text: `${t("user.createShift.shiftName")}`,
          width: "20%"
        },
        {
          text: `${t("user.createShift.status")}`,
          width: "20%"
        },
        {
          text: `${t("user.createShift.reasonOff")}`,
          width: "30%"
        }
      ],
      columns: [
        {
          key: 'id',
          render: (item, index) => (
            <span>{index + 1}</span>
          ),
          width: "10%"
        },
        {
          key: "take_leave_at",
          render: (item) => {
            const take_leave_at = moment(item.take_leave_at).format("DD-MM-YYYY");
            return take_leave_at
          },
          width: "20%"
        },
        {
          key: 'shiftName',
          render: (item) => {
            return item.Shift === null ? "" : item.Shift.name
          },
          width: "20%"
        },
        {
          render: (item) => {
            if (item.status === CONSTS.ACCEPT) {
              return <div className="status-accept">
                {t("user.createShift.acceptedStatus")}
              </div>;
            } else if (item.status === CONSTS.WAITING) {
              return <div className="status-waitting">
                {t("user.createShift.waittingStatus")}
              </div>;
            } else if (item.status === CONSTS.CANCEL) {
              return <div className="status-cancel">
                {t("user.createShift.canceledStatus")}
              </div>;
            } else {
              return "";
            }
          },
          width: "20%"
        },
        {
          key: 'description',
          width: "30%"
        },
        {
          actions: [
            (item) => (
              <>
                {
                  item.status === CONSTS.WAITING ?
                    (
                      <>
                        <Button type="s1"
                          className="e-m-right-5"
                          onClick={e => this.clickItemUpdateStatus(item, CONSTS.ACCEPT)}>
                          <FontAwesomeIcon icon={faCheck} className="e-m-right-5" />
                          {t("user.createShift.yes")}
                        </Button>
                        <Button type="s2"
                          className="e-m-right-5"
                          onClick={e => this.clickItemUpdateStatus(item, CONSTS.CANCEL)}>
                          <FontAwesomeIcon icon={faTimes} className="e-m-right-5" />
                          {t("user.createShift.canceledStatus")}
                        </Button>
                      </>
                    ) : null
                }
                <Button className="s-btn s2 delete-btn"
                  onClick={e => this.clickItemDelete(item)}
                ><FontAwesomeIcon icon={faTimesCircle} className="e-m-right-5" />
                  {t("user.createShift.delete")}</Button>
              </>
            )
          ]
        }
      ]
    }
    return (
      <>
        <div className="off-day">
          <div className="select-day e-row e-flex item-center">
            <div className="choose-day e-flex e-col-6 item-center">
              <div className="input-date">
                <DatePicker
                  className="date-selected"
                  selected={this.state.dateSearch}
                  onChange={dateSearch => this.setState({ dateSearch })}
                  dateFormat="dd/MM/yyyy"
                  locale="languageDate"
                />
                <FontAwesomeIcon className="icon-date" icon={faCalendarAlt} />
              </div>
              <div className="text-choose e-flex item-center">
                <Button onClick={this.onSearch}><span className="e-m-right-5">
                  {t("user.createShift.search")}</span><FontAwesomeIcon icon={faSearch} />
                </Button>
              </div>
            </div>
            <div className="e-col-6 e-flex content-end">
              <Button onClick={() => {
                this.props.actions.getListShiftByDayTakeLeave({
                  user_id: this.props.userDetail.id,
                  params: {
                    take_leave_at
                  }, callBack: this.setState({ showPopupAdd: true })
                });
              }
              }>
                <FontAwesomeIcon className="e-m-right-5" icon={faPlusCircle} />
                {t("user.createShift.add")}</Button>
            </div>
          </div>
          {this.props.listTakeLeave.length > 0 ?
            <div className="tbl-calendar-work">
              <TableData
                option={TABLE_SETTING}
                dataSources={this.props.listTakeLeave}
              >
              </TableData>
            </div> : <div className="no-data">{t("user.createShift.notFindData")}</div>
          }
        </div>
        <Dialog
          show={showPopupAdd}
          close={() => this.setState({ showPopupAdd: false })}
          innerClass="popup-add-check"
        >
          <AddDayOff
            userDetail={this.props.userDetail}
            hidePopupAddDayOff={() => this.setState({ showPopupAdd: false })}
            {...rest}
          />
        </Dialog>
      </>
    )
  }
}