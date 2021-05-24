import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneAlt, faSmokingBan, faClock, faUsers,
  faCommentDots, faCalendarAlt, faSync
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/common/Button";
import Time from "../../../components/common/Moment";
import { STATUS_BOOKING } from "../../../consts/settings/bookingTable"
export default class ItemBookingTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checkIn: this.props.bookingTable.check_in,
      isShowTextComment: false
    }
  }
  /**
   * open popupHandling booking table
   * @param {*} booking
   */
  openPopupHandling = async (booking) => {
    await this.props.actions.getListTableBooking({ booking_id: booking.id })
    await this.props.actions.getBookingById({ booking_id: booking.id })
    this.props.handlingBooking(booking)
  }

  render() {
    const { t, bookingTable } = this.props
    const { isShowTextComment } = this.state
    return (
      <div className="item-booking-table">
        <div className="item-booking e-border-gray">
          <div className="title-name content-center item-center">
            <div className="name-guest">
              <span>{bookingTable.guest_name}</span>
            </div>
            {
              bookingTable.phone_number ? <div className="phone">
                <FontAwesomeIcon icon={faPhoneAlt} />
                <span>{bookingTable.phone_number}</span>
              </div> : ""
            }

          </div>
          <div className="content-item">
            <ul className="lst-info">
              <li>
                <FontAwesomeIcon className="icon-inf" icon={faCalendarAlt} />
                <span>
                  <Time format="DD-MM-YYYY" date={bookingTable.check_in} />
                </span>
              </li>
              <li>
                <FontAwesomeIcon className="icon-inf" icon={faClock} />
                <span><Time format="HH:mm:ss" date={bookingTable.check_in} /></span>
              </li>
              <li>
                <FontAwesomeIcon className="icon-inf" icon={faUsers} /><span>{bookingTable.total_guest_number} {t("bookingTables.people")}</span>
              </li>
              <li>
                <FontAwesomeIcon className="icon-inf" icon={faSmokingBan} />
                {
                  bookingTable.is_smoking ? `${t("bookingTables.smoking")}` : `${t("bookingTables.noSmoking")}`
                }
              </li>
              <li className="status e-flex content-center">
                {
                  bookingTable.status === STATUS_BOOKING.WAITING_CONFIRM || !bookingTable.status ?
                    <span className="inf-status" style={{ color: "#f17a39" }}>{t("bookingTables.waitingConfirmation")}</span>
                    : bookingTable.status === STATUS_BOOKING.CONFIRM ?
                      <span className="inf-status" style={{ color: "#2898fa" }}>{t("bookingTables.confirmed")}</span>
                      : bookingTable.status === STATUS_BOOKING.SELECT_TABLE ?
                        <span className="inf-status" style={{ color: "#4bd159" }}>{t("bookingTables.arrangedTheTable")}</span>
                        : bookingTable.status === STATUS_BOOKING.CANCEL ?
                          <span className="inf-status" style={{ color: "red" }}>{t("bookingTables.cancelled")}</span>
                          : bookingTable.status === STATUS_BOOKING.GUEST_CANCEL ?
                            <span className="inf-status" style={{ color: "red" }}>{t("bookingTables.cancelCustomer")}</span>
                            : bookingTable.status === STATUS_BOOKING.AT_TABLE ?
                              <span className="inf-status" style={{ color: "#4bd159" }}>{t("bookingTables.atTheTable")}</span> : null
                }
                {
                  bookingTable.status === STATUS_BOOKING.CANCEL ?
                    <div className="show-comment">
                      <div className="show-comment-cancel" onClick={() => this.setState({ isShowTextComment: !isShowTextComment })}>
                        <FontAwesomeIcon style={{ color: "#f17a39" }} icon={faCommentDots} />
                      </div>
                      {
                        isShowTextComment ?
                          <div className="show-comment-text">
                            <div className="text-comment">
                              <span>
                                {bookingTable.note_update_status}
                              </span>
                            </div>
                          </div> : ""
                      }
                    </div>
                    : ""
                }
              </li>
            </ul>
            <div className="btn e-flex content-center">
              <div className="btn-handling">
                <Button
                  onClick={() => this.openPopupHandling(bookingTable)}
                >
                  <FontAwesomeIcon icon={faSync} />
                  <span>{t("bookingTables.handling")}</span>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
