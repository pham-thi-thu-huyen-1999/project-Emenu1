import React from "react";
import Button from "../../../components/common/Button";
import { Input, Nodata } from "../../../components/common/index";
import SelectBox from "../../../components/common/SelectBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSearch, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Dialog from "../../../components/common/Dialog";
import PopupAddBookingTable from "./PopupAddBookingTable";
import BookingTableItem from "./BookingTableItem";
import PopupHandling from "./PopupHandlingBookingTable";
import Loading from "../../../components/common/Loading";
import { InputDate } from "../../../components/common";
import moment from "moment";
var day = new Date();
class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPopupAddBookingTable: false,
      showPopupHandling: false,
      showPopupEditBooking: false,
      booking: {},
      searchStatus: "",
      searchName: "",
      searchNumberPhone: "",
      listTables: [],
      indexArea: -1,
      optionsStatusBooking: [
        {
          key: 0,
          text: `${this.props.t("Tất cả")}`
        },
        {
          key: 1,
          text: `${this.props.t("bookingTables.waitingConfirmation")}`
        },
        {
          key: 2,
          text: `${this.props.t("bookingTables.confirmed")}`
        },
        {
          key: 3,
          text: `${this.props.t("bookingTables.arrangedTheTable")}`
        },
        {
          key: 4,
          text: `${this.props.t("bookingTables.cancelled")}`
        },
        {
          key: 5,
          text: `${this.props.t("bookingTables.cancelCustomer")}`
        },
        {
          key: 6,
          text: `${this.props.t("bookingTables.atTheTable")}`
        }
      ],
      fromDate: day.setDate(day.getDate()),
      toDate: day.setDate(day.getDate() + 7)
    }
  }
  /**
   * handling booked table
   */
  handlingBooking = (booking) => {
    this.setState({
      showPopupHandling: true,
      booking
    })
  }
  /**
   * show handling booking
   */
  showBookingDetail = () => {
    const { showPopupHandling } = this.state
    return Object.keys(this.props.bookingDetail).length !== 0 && showPopupHandling
  }
  /**
   * show popupSelectTble
   * update state
   */
  selectTable = () => {
    this.setState({
      showPopupSelectTable: true
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let tables = []
    nextProps.tableListByStatus.forEach(area => {
      if (prevState.indexArea === -1) {
        tables = tables.concat(area.tables)
      } else {
        if (area.area_id === nextProps.areaList[prevState.indexArea].id) {
          tables = tables.concat(area.tables)
        }
      }
    });
    if (tables !== prevState.listTables) {
      return {
        listTables: tables
      }
    }
  }
  /**
   * close popup handling booking
   */
  closePopupHandling = () => {
    this.setState({ showPopupHandling: false });
    this.props.actions.resetBookingDetail();
  }
  searchBooking = () => {
    const params = {};
    const { fromDate, toDate } = this.state;
    if (this.state.searchStatus) {
      params.status = this.state.searchStatus
    }
    if (this.state.searchName) {
      params.guest_name = this.state.searchName
    }
    if (this.state.searchNumberPhone) {
      params.phone_number = this.state.searchNumberPhone
    }
    if (fromDate) {
      params.from_date = this.dayFormat(fromDate, "DD-MM-YYYY")
    }
    if (toDate) {
      params.to_date = this.dayFormat(toDate, "DD-MM-YYYY")
    }
    this.props.actions.getListBookingTable(params)
    return params
  }
  onLoadMore = () => {
    const { indexList, total, listBooking } = this.props;
    if (indexList < total) {
      this.props.actions.getListBookingTable({
        index: this.props.indexList,
        page_size: 11
      })
    }
  }
  onScroll = (e) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target;
    if (scrollTop + clientHeight === scrollHeight) {
      this.onLoadMore();
    }
  }
  dayFormat = (day, format) => {
    let resultDate = moment(new Date(day)).format(format);
    return resultDate;
  }
  render() {
    const { showPopupAddBookingTable,
      booking, optionsStatusBooking,
      fromDate, toDate } = this.state;
    const { ...rest } = this.props;
    const { t, isLoading } = this.props;
    return (
      <div className="booking-main">
        <Loading show={isLoading} />
        <div className="containner-booking-table">
          <h2 className="title-lst-booking">{t("bookingTables.listTablesBooked")}</h2>
          <div className="search-booking-table">
            <div className="list-field-search e-flex">
              <div className="field-search search-status">
                <SelectBox
                  dataSource={optionsStatusBooking}
                  blank={t("bookingTables.status")}
                  onChange={searchStatus => this.setState({ searchStatus })}
                >
                  <div className="icon-dow">
                    <FontAwesomeIcon icon={faAngleDown} />
                  </div>
                </SelectBox>
              </div>
              <div className="field-search search-name">
                <Input placeholder={t("bookingTables.name")}
                  onChange={(event) => this.setState({ searchName: event.target.value })}
                />
              </div>
              <div className="field-search search-phone">
                <Input placeholder={t("bookingTables.phone")}
                  onChange={(event) => this.setState({ searchNumberPhone: event.target.value })}
                />
              </div>
              <div className="field-search search btn-search e-flex content-end item-end flex">
                <Button onClick={this.searchBooking} className="e-m-right-10">
                  <span className="e-m-right-5">{t("bookingTables.search")}</span>
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
                <Button
                  onClick={() => this.setState({ showPopupAddBookingTable: true })}
                >
                  <FontAwesomeIcon
                    className="e-m-right-5"
                    icon={faPlusCircle}
                  />
                  <span>{t("bookingTables.add")}</span>
                </Button>
              </div>
            </div>
            <div className="search-date">
              <div className="search-fromdate filter-date">
                <span>Từ ngày</span>
                <InputDate
                  className="input-date flex"
                  selected={fromDate}
                  // minDate={fromDate}
                  onChange={date => this.setState({ fromDate: date })}
                  dateFormat="dd/MM/yyyy"
                /></div>
              <div className="search-todate filter-date">
                <span>Đến ngày</span>
                <InputDate
                  className="input-date flex"
                  selected={toDate}
                  // minDate={fromDate}
                  onChange={date => this.setState({ toDate: date })}
                  dateFormat="dd/MM/yyyy"
                /></div>
            </div>
          </div>
          <div
            className="list-booking-table e-m-top-10 content-center"
            onScroll={this.onScroll}
          >
            {
              this.props.listBooking.length > 0 ?
                <div className="e-flex flex">
                  {
                    this.props.listBooking.map((itemBooking, index) => (
                      <BookingTableItem
                        key={index}
                        bookingTable={itemBooking}
                        handlingBooking={this.handlingBooking}
                        {...rest}
                      />
                    ))
                  }
                </div>
                : <Nodata textNodata={t("bookingTables.notiNodata")} />
            }
          </div>
        </div>
        <Dialog
          title={t("bookingTables.addBookingTable")}
          show={showPopupAddBookingTable}
          close={() => this.setState({ showPopupAddBookingTable: false })}
          innerClass="popup-booking"
        >
          <PopupAddBookingTable
            hide={() => this.setState({ showPopupAddBookingTable: false })}
            {...rest}
          />
        </Dialog>
        <Dialog
          show={this.showBookingDetail()}
          close={this.closePopupHandling}
          innerClass="popup-booking"
        >
          <PopupHandling
            booking={booking}
            bookingById={this.props.bookingDetail}
            selectTable={this.selectTable}
            hide={() => this.setState({ showPopupHandling: false })}
            {...rest}
          />
        </Dialog>
      </div>
    )
  }
}
export default Main