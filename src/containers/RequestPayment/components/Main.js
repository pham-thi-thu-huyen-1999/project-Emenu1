import React from "react";
import { SelectBox, Input, Button } from "../../../components/common/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { save } from "../../../services/localStorage";
import { LIMITREQPAYMENT, PAGEINIT, STATUS } from "../consts";
import Time from "../../../components/common/Moment";
export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameSearch: "",
      searchStatus: null,
      lstStatus: [
        {
          key: 1,
          text: `${this.props.t("requestPayment.handling")}`
        },
        {
          key: 2,
          text: `${this.props.t("requestPayment.sentBill")}`
        },
        {
          key: 3,
          text: `${this.props.t("requestPayment.handleDone")}`
        },
        {
          key: 4,
          text: `${this.props.t("requestPayment.guestCancelReq")}`
        },
        {
          key: 5,
          text: `${this.props.t("requestPayment.reportWroongFood")}`
        },
        {
          key: 6,
          text: `${this.props.t("requestPayment.reportBillWrong")}`
        }
      ],
      listRequestPayment: this.props.listRequestPayment,
      listAllData: this.props.listRequestPayment
    }
  }
  /**
   * detail request payment
   * @param {*} item
   */
  chagePageDetailReqPay = (item) => {
    save("itemReqPayment", item);
    const reqPaymentId = item.id
    this.props.history.push(`/request-payment/${reqPaymentId}/request-detail`);
  }
  onScroll = e => {
    const { scrollHeight, clientHeight, scrollTop } = e.target;
    const { page, pageCount } = this.props;
    if (clientHeight + scrollTop === scrollHeight) {
      if (page <= pageCount) {
        this.props.actions.getListReqPayment({
          page, limit: LIMITREQPAYMENT
        })
      }
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.listRequestPayment) !== JSON.stringify(prevState.listRequestPayment)) {
      return {
        listRequestPayment: nextProps.listRequestPayment,
        listAllData: nextProps.listRequestPayment
      }
    }
    return null
  }
  testSearch = (array, search_term) => {
    let matched_terms = [];
    search_term = search_term.toLowerCase();
    array.forEach(item => {
      if (item.order.table.name.toLowerCase().indexOf(search_term) !== -1) {
        matched_terms.push(item);
      }
    })
  }

  changeName = e => {
    let { listAllData } = this.state;
    const dataSearch = e.target.value;
    listAllData = this.state.listRequestPayment.filter(item => {
      return item.order.table.name.toLowerCase().indexOf(dataSearch.toLowerCase()) !== -1;
    });
    this.setState({ nameSearch: dataSearch, listAllData })
  }
  onSearch = () => {
    let { searchStatus, nameSearch } = this.state;
    const params = {}
    if (searchStatus) {
      params.status = searchStatus
    }
    if (nameSearch) {
      params.nameSearch = nameSearch
    }
    this.props.actions.getListReqPayment({ params, page: PAGEINIT });
    return params;
  }
  render() {
    const { lstStatus, listAllData } = this.state;
    const { t, lng } = this.props;
    return (
      <div className="payment-request">
        <div className="container-payment-req">
          <h2 className="title-payment-req">
            {t("requestPayment.titleLstReqPayment")}
          </h2>
          <div className="search-req-payment e-flex item-center">
            <div className="search-status">
              <SelectBox
                dataSource={lstStatus}
                blank={t("requestPayment.paymentStatus")}
                onChange={searchStatus => this.setState({ searchStatus })}
              >
                <div className="icon-dow">
                  <FontAwesomeIcon icon={faAngleDown} />
                </div>
              </SelectBox>
            </div>
            <div className="search-name">
              <Input
                placeholder={t("requestPayment.name")}
                onChange={this.changeName}
              />
            </div>
            <div className="btn-search e-flex item-center">
              <Button onClick={this.onSearch}>{t("requestPayment.search")}</Button>
            </div>
          </div>
          {listAllData.length > 0 ?
            <div
              className="list-req-payment"
              onScroll={this.onScroll}
            >
              <div className="e-flex flex">
                {
                  listAllData.map((item, index) => (
                    <div key={index}
                      className="payment-req-item"
                      onClick={() => this.chagePageDetailReqPay(item)}
                    >
                      <div className="item" >
                        <div className="content-name">
                          <span>{item.order.table.name}</span>
                        </div>
                        <div className="content-detail">
                          <div className="content-info">
                            <div className="time-req content">
                              <span className="title-time title">{t("requestPayment.timeSendReq")}</span>
                              <span
                                className="flex e-flex text item-start content-end"
                              ><Time format="HH:mm" date={item.created_at} /></span>
                            </div>
                            <div className="type-payment content ">
                              <span className="title-type title">
                                {t("requestPayment.paymentType")}
                              </span>
                              <span className="flex e-flex text item-center content-end">
                                {lng === "vi" ?
                                  item.payment_type.name_vn : lng === "en" ? item.payment_type.name_en : item.payment_type.name_jp}
                              </span>
                              {item.is_vat_invoice ? <div className="note">({t("requestPayment.getRedBill")} )</div> : ""}
                            </div>
                            <div className="status-payment content e-flex">
                              <span className="title-status title">{t("requestPayment.status")}</span>
                              <span className="flex e-flex text
                                item-center content-end status"
                                style={{
                                  color: item.payment_request_status_id === STATUS.WAITING_HANDLE ? "#3aa0fa"
                                    : item.payment_request_status_id === STATUS.SEND_BILL ? "#FF9800"
                                      : item.payment_request_status_id === STATUS.COMPLETED_HANDLED ?
                                        "rgb(75, 209, 89)" : "#fb443c"
                                }}
                              >
                                {
                                  lng === "vi" ?
                                    item.payment_request_status.name_vn : lng === "en" ?
                                      item.payment_request_status.name_en : item.payment_request_status.name_jp
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div> :
            <div className="no-data">
              <div>
                <img src={require("../../../images/no-data.png")} />
                <div className="text"><span>{t("requestPayment.noReqPayment")}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}