import React from "react";
import { Button, Dialog, TableData } from "../../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt, faTimesCircle, faSearch,
  faPlusCircle, faPencilAlt, faHistory
} from "@fortawesome/free-solid-svg-icons";
import AddCheck from "./PopupCheck/PopupAddCheck";
import EditCheck from "./PopupCheck/PopupEditCheck";
import PopupHistory from "./PopupCheck/PopupHistoryCheck";
import Swal from '../../../../../src/utils/sweetalert2';
import moment from "moment";
import DatePicker, { registerLocale } from "react-datepicker";
import languageDateVi from "date-fns/locale/vi";
import languageDateEn from "date-fns/locale/en-GB";
import languageDateJa from "date-fns/locale/ja";

export default class CheckinCheckout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      showPopupAddCheck: false,
      showPopupEditCheck: false,
      showPopupHistory: false,
      itemEdit: {}
    }
  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("dishManagaments.addSuccess")}!`,
      showConfirmButton: true
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("dishManagaments.error")}!`,
      text: `${t("dishManagaments.requCheckAgain")}!`
    })
  }
  clickItemEdit = itemEdit => {
    this.setState({
      showPopupEditCheck: true,
      itemEdit
    })
  }
  clickItemDelete = item => {
    const { t } = this.props
    let check_in_out_at = moment(this.state.date).format("DD-MM-YYYY")
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
        this.props.actions.deleteCheckinOut({
          check_in_out_id: item.id,
          user_id: item.user_id,
          params: { check_in_out_at },
          showSuccess: this.showSuccess,
          showErr: this.showErr
        })
      }
    })
  }
  clickOpenHistory = item => {
    let check_in_out_at = moment(this.state.date).format("DD-MM-YYYY")
    this.props.actions.getListHistoryCheck({
      check_in_out_id: item.id,
      user_id: item.user_id,
      params: { check_in_out_at },
      callBack: () => this.setState({ showPopupHistory: true })
    });
  }
  onSearch = () => {
    let check_in_out_at = moment(this.state.date).format("DD-MM-YYYY")
    this.props.actions.getListCheckinOut({
      user_id: this.props.userDetail.id, params: {
        check_in_out_at
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
        registerLocale("languageDate",  languageDateVi);
        break;
      case "en-GB":
        registerLocale("languageDate",  languageDateEn);
        break;
      case "ja":
        registerLocale("languageDate",  languageDateJa);
        break;
      default:
        break;
      }
  }

  componentDidMount() {
    let check_in_out_at = moment(this.state.date).format("DD-MM-YYYY")
    this.props.actions.getListCheckinOut({
      user_id: this.props.userDetail.id,
      params: {
        check_in_out_at
      }
    })
    this.loadConfigDateLanguage()
  }
  render() {
    let historyDate = moment(this.state.date).format("DD-MM-YYYY")
    const { showPopupAddCheck, showPopupEditCheck, showPopupHistory } = this.state
    const { ...rest } = this.props;
    const { t } = this.props;
    let take_leave_at = moment(new Date()).format("DD-MM-YYYY");
    const TABLE_SETTING = {
      heads: [
        {
          text: `${t("user.createShift.stt")}`,
          width: "10%"
        },
        {
          text: `${t("user.createShift.workingDay")}`,
          width: "30%"
        },
        {
          text: "Check In",
          width: "30%"
        },
        {
          text: "Check Out",
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
          key: "check_in_out_at",
          width: "30%",
          render: item => {
            const check_in_out_at = moment(item.check_in_out_at).format("DD-MM-YYYY");
            return check_in_out_at;
          }
        },
        {
          key: 'check_in',
          width: "30%",
        },
        {
          key: 'check_out',
          width: "30%",
        },
        {
          key: 'acts',
          actions: [
            item => (
              <Button
                onClick={e => this.clickItemEdit(item)}
                className="e-m-right-5 s5"
              >
                <FontAwesomeIcon icon={faPencilAlt} className="e-m-right-5" />
                {t("user.createShift.edit")}
              </Button>
            ),
            item => (
              <Button
                onClick={e => this.clickItemDelete(item)}
                className="e-m-right-5 s2"
              >
                <FontAwesomeIcon icon={faTimesCircle} className="e-m-right-5" />
                {t("user.createShift.delete")}
              </Button>
            ),
            item => (
              <Button className="e-m-right-5"
                onClick={e => this.clickOpenHistory(item)}>
                <FontAwesomeIcon icon={faHistory} className="e-m-right-5" />
                {t("user.createShift.history")}
              </Button>
            )
          ]
        }
      ]
    }
    return (
      <div className="checkin-checkout">
        <div className="search-add select-day e-flex item-center ">
          <div className="search e-flex item-center">
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
            <div className="btn-search e-flex e-flex item-center">
              <Button
                onClick={this.onSearch}
              >{t("user.createShift.search")} <FontAwesomeIcon icon={faSearch} /> </Button>
            </div>
          </div>
          <div className="btn-add flex e-flex content-end">
            <Button className="e-m-right-5"
              onClick={() => {
                this.props.actions.getListShiftByDayTakeLeave({
                  user_id: this.props.userDetail.id,
                  params: {
                    take_leave_at
                  }, callBack: this.setState({ showPopupAddCheck: true })
                });
              }}>
              <FontAwesomeIcon icon={faPlusCircle} className="e-m-right-5" />
              {t("user.createShift.add")}
            </Button>
            <Button className="s5">{t("user.createShift.exportFile")}</Button>
          </div>
        </div>
        {
          this.props.listCheckinOut.length > 0 ?
            <div className="tbl-calendar-work">
              <TableData
                dataSources={this.props.listCheckinOut}
                option={TABLE_SETTING}
              />
            </div> : <div className="no-data">{t("user.createShift.notFindData")}</div>
        }
        <Dialog
          show={showPopupAddCheck}
          close={() => this.setState({ showPopupAddCheck: false })}
          innerClass="popup-add-check"
        >
          <AddCheck
            hidePopupAdd={() => this.setState({ showPopupAddCheck: false })}
            {...rest}
          />
        </Dialog>
        <Dialog
          show={showPopupEditCheck}
          close={() => this.setState({ showPopupEditCheck: false })}
          innerClass="popup-add-check"
        >
          <EditCheck
            itemEdit={this.state.itemEdit}
            hidePopupEdit={() => this.setState({ showPopupEditCheck: false })}
            {...rest}
          />
        </Dialog>
        <Dialog
          show={showPopupHistory}
          close={() => this.setState({ showPopupHistory: false })}
          title={`${t("user.createShift.historyDate")} ${historyDate}`}
          innerClass="popup-history"
        >
          <PopupHistory
            historyDate={historyDate}
            {...rest}
          />
        </Dialog>
      </div>
    )
  }
}