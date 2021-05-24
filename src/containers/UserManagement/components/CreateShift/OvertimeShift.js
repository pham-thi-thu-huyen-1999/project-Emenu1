import React from "react";
import { Button, Dialog, TableData } from "../../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faTimesCircle, faSearch, faPlusCircle, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import AddOTShift from "./PopupAdd/PopupAddOTShift";
import moment from "moment";
import Swal from '../../../../../src/utils/sweetalert2';

import DatePicker, { registerLocale } from "react-datepicker";
import languageDateVi from "date-fns/locale/vi";
import languageDateEn from "date-fns/locale/en-GB";
import languageDateJa from "date-fns/locale/ja";
import * as CONSTS from "./../../constants";
export default class OvertimeShift extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      showPopupAddOTShift: false
    }
  }

  onSearch = () => {
    const { date } = this.state;
    const overtime_at = moment(date).format("DD-MM-YYYY");
    this.props.actions.getListOverShift({
      user_id: this.props.userDetail.id,
      params: { overtime_at }
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
        const overtime_at = moment(item.overtime_at).format("DD-MM-YYYY")
        this.props.actions.deleteOTShiftById({
          overtime_shift_id: item.id,
          user_id: this.props.userDetail.id,
          overtime_at,
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
        const overtime_at = moment(item.overtime_at).format("DD-MM-YYYY")
        this.props.actions.updateOverShift({
          data: {
            status,
            description: ""
          },
          overtime_shift_id: item.id,
          user_id: this.props.userDetail.id,
          overtime_at,
          showSuccess: this.showUpdateSuccess,
          showErr: this.showUpdateErr
        })
      }
    })
  }

  openAddOTShift = () => {
    const overtime_at = moment(this.state.date).format("DD-MM-YYYY")
    this.setState({ showPopupAddOTShift: true })
    this.props.actions.getListOTChangeDay({
      user_id: this.props.userDetail.id, params: {
        overtime_at
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
    const { showPopupAddOTShift } = this.state
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
          text: ``,
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
          key: "overtime_at",
          render: (item) => {
            return moment(item.overtime_at).format('DD-MM-YYYY')
          },
          width: "20%"
        },
        {
          render: (item) => {
            return item.Shift.name
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
          key: "atc",
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
                <Button type="s2"
                  className="e-m-right-5"
                  onClick={e => this.clickItemDelete(item)}>
                  <FontAwesomeIcon icon={faTimesCircle} className="e-m-right-5" />
                  {t("user.createShift.delete")}
                </Button>
              </>
            )
          ]
        }
      ]
    }
    return (
      <div className="overtime-shift">
        <div className="select-day e-row e-flex item-center">
          <div className="choose-day e-flex e-col-6 item-center">
            <div className="input-date">
              <DatePicker
                className="date-selected"
                selected={this.state.date}
                onChange={date => this.setState({ date })}
                dateFormat="dd/MM/yyyy"
                locale="languageDate"
              />
              <FontAwesomeIcon className="icon-date" icon={faCalendarAlt} />
            </div>
            <div className="text-choose e-flex item-center">
              <Button onClick={this.onSearch}>
                <span className="e-m-right-5">
                  {t("user.createShift.search")}
                </span>
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </div>
          </div>
          <div className="e-col-6 e-flex content-end">
            <Button onClick={this.openAddOTShift}>
              <FontAwesomeIcon className="e-m-right-5" icon={faPlusCircle} />
              {t("user.createShift.add")}
            </Button>
          </div>
        </div>
        {
          this.props.listOverTimeShift.length > 0 ?
            <div className="tbl-calendar-work">
              <TableData
                option={TABLE_SETTING}
                dataSources={this.props.listOverTimeShift}
              >
              </TableData>
            </div>
            : <div className="no-data">{t("user.createShift.notFindData")}!</div>
        }
        <Dialog
          show={showPopupAddOTShift}
          close={() => this.setState({ showPopupAddOTShift: false })}
          innerClass="popup-add-check"
        >
          <AddOTShift
            userDetail={this.props.userDetail}
            hidePopupAdd={() => this.setState({ showPopupAddOTShift: false })}
            {...rest}
          />
        </Dialog>
      </div>
    )
  }
}