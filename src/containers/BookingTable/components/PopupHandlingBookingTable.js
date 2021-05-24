import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/common/Button";
import ButtonSquare from "../../../components/common/ButtonSquare";
import moment from "moment";
import Swal from '../../../../src/utils/sweetalert2';
import QRcode from "../../../components/common/QRcode";
import Dialog from "../../../components/common/Dialog";
import PopupEditBookingTable from "./PopupEditBookingTable";
import PopupSelectTable from "./PopupSelectTable";
import { STATUS_BOOKING } from "../../../consts/settings/bookingTable";

export default class HandlingBookingTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      booking: this.props.booking,
      bookingById: this.props.bookingById,
      listTableBooking: this.props.listTableBooking,
      showPopupEditBooking: false,
      showPopupSelectTable: false,
      nameArea: ""
    }
  }

  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: "success",
      title: `${t("bookingTables.updateSuccess")}`,
      showConfirmButton: true,
    })
  }

  updateStatus = async (id, status) => {
    const data = {
      status: status,
      note_update_status: ""
    }
    const { t } = this.props
    if (status === STATUS_BOOKING.CONFIRM) {
      Swal.fire({
        title: `${t("bookingTables.sure")}`,
        text: `${t("bookingTables.validConfirmBooking")}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: `${t("bookingTables.yes")}`,
        cancelButtonText: `${t("bookingTables.no")}`,
      }).then(async (result) => {
        if (result.value) {
          this.props.actions.updateStatusBooking({
            data,
            booking_id: id,
            showSuccess: Swal.fire({
              icon: "success",
              title: `${t("bookingTables.confirmSucess")}`,
              showConfirmButton: true,
            })
          })
          this.props.actions.resetBookingDetail();
        }
      })
    }
    else if (status === STATUS_BOOKING.CANCEL) {
      Swal.fire({
        icon: "info",
        title: `${t("bookingTables.sure")}`,
        text: `${t("bookingTables.validCancelBooking")}`,
        input: "textarea",
        inputPlaceholder: `${t("bookingTables.reaSonCancel")}`,
        cancelButtonText: `${t("bookingTables.cancel")}`,
        confirmButtonText: `${t("bookingTables.agree")}`,
        showConfirmButton: true,
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Vui lòng nhập lý do hủy!'
          }
        }
      }).then(async (result) => {
        if (result && result.isConfirmed && result.value !== "") {
          this.props.actions.updateStatusBooking({
            data: {
              status: status,
              note_update_status: result.value
            },
            booking_id: id,
            showSuccess: this.showSuccess
          })
          this.props.actions.resetBookingDetail();
          this.props.hide();
        }
      })
    }
    else if (status === STATUS_BOOKING.AT_TABLE) {
      Swal.fire({
        title: `${t("bookingTables.sure")}`,
        text: `${t("bookingTables.validGuestAtTable")}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: `${t("bookingTables.agree")}`,
        cancelButtonText: `${t("bookingTables.cancel")}`,
      }).then(async (result) => {
        if (result.value) {
          this.props.actions.updateStatusBooking({
            data,
            booking_id: id,
            showSuccess: Swal.fire({
              icon: "success",
              title: `${t("bookingTables.confirmSucess")}`,
              showConfirmButton: true,
            })
          })
          this.props.hide()
          this.props.actions.resetBookingDetail();
        }
      })
    }
    else {
      this.props.actions.updateStatusBooking({
        data,
        booking_id: id,
        showSuccess: this.showSuccess
      })
      this.props.actions.resetBookingDetail();
    }
  }

  showQR = () => {
    Swal.fire({
      showConfirmButton: true,
      confirmButtonText: 'Ok',
      html: (
        <>
          <p>Xác nhận vào bàn</p>
          <QRcode value={'text-QR-code'} />
        </>
      )
    })
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.bookingById !== nextState.bookingById) {
      this.setState({
        bookingById: nextProps.bookingById
      })
    }
  }
  listTable = () => {
    const { listTableBooking } = this.state
    let tmp = [];
    listTableBooking.map((table) => {
      tmp.push(table.name)
    })
    return tmp.join(", ")
  }
  chooseTable = () => {
    const area_id = this.props.areaListDetails[0].id
    this.props.actions.getListTableStatus({
      table_status: 0, area_id,
      callBack: () => this.setState({
        showPopupSelectTable: true,
        nameArea: this.props.areaListDetails[0].name
      })
    })
  }
  formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return match[1] + ' ' + match[2] + ' ' + match[3]
    }
    return null
  }
  render() {
    const { ...rest } = this.props
    const { t } = this.props
    const { bookingById, showPopupEditBooking, showPopupSelectTable, listTableBooking } = this.state
    return (
      <>
        <div className="handling-booking">
          <div className="status-title e-flex content-center">
            <span className="title-name e-m-right-10">{t("bookingTables.status")}:</span>
            <div className="title-status">
              {
                bookingById.status === STATUS_BOOKING.WAITING_CONFIRM || !bookingById.status ?
                  <span style={{ color: "#f17a39" }}>{t("bookingTables.waitingConfirmation")}</span>
                  : bookingById.status === STATUS_BOOKING.CONFIRM ?
                    <span style={{ color: "rgb(40, 152, 250)" }}>{t("bookingTables.confirmed")}</span>
                    : bookingById.status === STATUS_BOOKING.SELECT_TABLE ?
                      <span style={{ color: "#4bd159" }}>{t("bookingTables.arrangedTheTable")}</span>
                      : bookingById.status === STATUS_BOOKING.CANCEL ?
                        <span style={{ color: "red" }}>{t("bookingTables.cancelled")}</span>
                        : bookingById.status === STATUS_BOOKING.GUEST_CANCEL ?
                          <span style={{ color: "red" }}>{t("bookingTables.cancelCustomer")}</span>
                          : bookingById.status === STATUS_BOOKING.AT_TABLE ?
                            <span style={{ color: "#4bd159" }}>{t("bookingTables.atTheTable")}</span>
                            : null
              }
            </div>
            <div className="btn-edit-booking e-flex content-end">
              <Button type="s1"
                disabled={bookingById.status === STATUS_BOOKING.AT_TABLE
                  || bookingById.status === STATUS_BOOKING.CANCEL}
                onClick={() => this.setState({ showPopupEditBooking: true })}
              >
                <FontAwesomeIcon icon={faPencilAlt} className="e-m-right-5" />{t("bookingTables.edit")}
              </Button>
            </div>
          </div>
          <div className="content-handling">
            <div className="content-text">
              <div className="row-info e-flex">
                <span className="title-handling">{t("bookingTables.firstAndLastName")}</span>
                <span className="content name-guest">{bookingById.guest_name}</span>
                <span className="title-handling">{t("bookingTables.phone")}</span>
                <span className="">{this.formatPhoneNumber(bookingById.phone_number)}</span>
              </div>
              <div className="row-info e-flex">
                <span className="title-handling">{t("bookingTables.date")}</span>
                <span className="content ">{moment(bookingById.check_in).format("MM-DD-YYYY")}</span>
                <span className="title-handling">{t("bookingTables.time")}</span>
                <span className="">{moment(bookingById.check_in).format("HH:mm:ss")}</span>
              </div>
              <div className="row-info e-flex">
                <span className="title-handling">{t("bookingTables.amount")}</span>
                <span className="content">{bookingById.total_guest_number}</span>
                <span className="title-handling">{t("bookingTables.type")}</span>
                <span className="">
                  {bookingById.table_type === 2 ? `${t("bookingTables.vip")}` : `${t("bookingTables.normal")}`}
                </span>
              </div>
              <div className="row-info e-flex">
                <div className="title-handling">{t("bookingTables.listTable")}</div>
                <div className="list-tables">
                  {
                    listTableBooking.length > 0 ? this.listTable(listTableBooking)
                      : <div>{t("bookingTables.notSelectedTable")}</div>
                  }
                </div>
              </div>
              <div className="row-info e-flex">
                <span className="title-handling">{t("bookingTables.note")}</span>
                <span className="">{bookingById.description === "" ? "N/A" : bookingById.description}</span>
              </div>
            </div>
            <div className="btn-handle e-flex content-center">
              {/* {LST_BTN_HANDLE.map(status => {
                return(
                  <div className="btn-status">
                  <ButtonSquare square
                    disabled={bookingById.status === STATUS_BOOKING.CONFIRM
                      || bookingById.status === STATUS_BOOKING.AT_TABLE
                      || bookingById.status === STATUS_BOOKING.CANCEL
                      || bookingById.status === STATUS_BOOKING.SELECT_TABLE
                    }
                    onClick={() => this.updateStatus(bookingById.id, STATUS_BOOKING.CONFIRM)}>
                    {t("bookingTables.confirm")}</ButtonSquare>
                </div>
                )
              })} */}
              {bookingById.status === STATUS_BOOKING.WAITING_CONFIRM
                || bookingById.status === STATUS_BOOKING.GUEST_CANCEL ?
                <div className="btn-status">
                  <ButtonSquare square
                    disabled={bookingById.status === STATUS_BOOKING.CONFIRM
                      || bookingById.status === STATUS_BOOKING.AT_TABLE
                      || bookingById.status === STATUS_BOOKING.CANCEL
                      || bookingById.status === STATUS_BOOKING.SELECT_TABLE
                    }
                    onClick={() => this.updateStatus(bookingById.id, STATUS_BOOKING.CONFIRM)}>
                    {t("bookingTables.confirm")}</ButtonSquare>
                </div> : ""}
              {bookingById.status === STATUS_BOOKING.WAITING_CONFIRM
                || bookingById.status === STATUS_BOOKING.CONFIRM
                || bookingById.status === STATUS_BOOKING.SELECT_TABLE ?
                <div className="btn-status">
                  <ButtonSquare square type="s2"
                    disabled={bookingById.status === STATUS_BOOKING.CONFIRM
                      || bookingById.status === STATUS_BOOKING.AT_TABLE
                      || bookingById.status === STATUS_BOOKING.CANCEL}
                    onClick={() => this.updateStatus(bookingById.id, STATUS_BOOKING.CANCEL)}>
                    {t("bookingTables.statusCancelBooking")}
                  </ButtonSquare>
                </div> : ""}
              {
                bookingById.status === STATUS_BOOKING.SELECT_TABLE
                  ? <div className="btn-status">
                    <ButtonSquare square
                      disabled={bookingById.status === STATUS_BOOKING.AT_TABLE || bookingById.status === STATUS_BOOKING.CANCEL}
                      onClick={() => this.updateStatus(bookingById.id, STATUS_BOOKING.AT_TABLE)}>
                      {t("bookingTables.guestAtTheTable")}
                    </ButtonSquare>
                  </div> : ""
              }
              {/* <div className="btn-status"  >
                <ButtonSquare square
                  disabled={bookingById.status === STATUS_BOOKING.WAITING_CONFIRM
                    || bookingById.status === STATUS_BOOKING.AT_TABLE
                    || bookingById.status === STATUS_BOOKING.CANCEL
                    || listTableBooking.length <= 0
                  }
                  onClick={() => this.showQR(bookingById.id, STATUS_BOOKING.GUEST_CANCEL)}>
                  {t("bookingTables.showQR")}
                </ButtonSquare>
              </div> */}
              {bookingById.status === STATUS_BOOKING.CONFIRM
                || bookingById.status === STATUS_BOOKING.SELECT_TABLE ?
                <div className="btn-status">
                  <ButtonSquare square
                    type="s5"
                    disabled={bookingById.status === STATUS_BOOKING.WAITING_CONFIRM || bookingById.status === STATUS_BOOKING.AT_TABLE || bookingById.status === STATUS_BOOKING.CANCEL}
                    onClick={this.chooseTable}
                  >
                    <span>{t("bookingTables.selectTable")}</span>
                  </ButtonSquare>
                </div> : ""
              }
            </div>
          </div>
        </div>
        <Dialog
          show={showPopupEditBooking}
          close={() => this.setState({ showPopupEditBooking: false })}
          innerClass="popup-booking"
        >
          <PopupEditBookingTable
            bookingEdit={bookingById}
            hidePopupEdit={() => this.setState({ showPopupEditBooking: false })}
            {...rest}
          />
        </Dialog>
        <Dialog
          innerClass={"header-list-table popup-booking"}
          show={showPopupSelectTable}
          close={() => this.setState({ showPopupSelectTable: false })}
        >
          <PopupSelectTable
            chooseTable={tablesLst =>
              this.updateStatus(bookingById.id, tablesLst.length > 0 ?
                STATUS_BOOKING.SELECT_TABLE : STATUS_BOOKING.WAITING_CONFIRM)}
            booking={bookingById}
            hidePopupTable={() => this.setState({ showPopupSelectTable: false })}
            nameArea={this.state.nameArea}
            {...rest}
          />
        </Dialog>
      </>

    )
  }
}