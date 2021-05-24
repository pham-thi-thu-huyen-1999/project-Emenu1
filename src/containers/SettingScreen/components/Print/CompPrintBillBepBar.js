import React from "react";
import "./compPrintBillBepBar.scss";
export default class CompPrintBillBepBar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      /* orderDetail: this.props.orderDetailTemp, */
    }
  }

  render() {
    const { isCheckBox, infoPartner, userInfo, t, orderDetail, infoAreaSelected } = this.props;
    /* const { orderDetail } = this.state; */
    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date + ' ' + time;
    return (
      <div className={`e-m-top-${isCheckBox && isCheckBox.leTren}
       e-m-left-${isCheckBox && isCheckBox.leTrai}
       e-m-bottom-${isCheckBox && isCheckBox.leDuoi}
       e-m-right-${isCheckBox && isCheckBox.lePhai}`}>
         {orderDetail ? <div className="PDFContentSCSS-bill-printer-setting-bep-bar">
        <div className="container-print-provisi">
          <div className="title-content-bill">
            <h5>{t("settingPrint.processDishes")}</h5>
            <div className="e-flex content-center">
              <img src={require("../../../../images/line-black.png")} />
            </div>
            <div className="content-bill">
              <div className="info-table-order">
                <div className="table-name-staff-left">
                  {isCheckBox && isCheckBox.isShowDateOrder === true ? <div>{t("settingPrint.ordered")}: 20:00</div> : null}
                  <div>{t("settingPrint.date")}: {dateTime}</div>
                </div>
                <div className="order-date-right">
                  {isCheckBox && isCheckBox.isShowTableNumber === true ? <div>{t("foodProcessing.tableNumber")} {orderDetail.table.name}</div> : null}
                  {isCheckBox && isCheckBox.isShowQuantityCustomer === true ? <div>{t("settingPrint.qntCustomer")}: 10</div> : null}
                </div>
                <div>
                  {isCheckBox && isCheckBox.isShowStaffWaiter === true ? <div>{t("settingPrint.serve")}: {orderDetail.order_users.length > 0
                    ? orderDetail.order_users[0].user.full_name : "Master"}</div> : null}
                </div>
              </div>
              <div className="table-bill">
                <div className="header-bill e-row">
                  <div className="e-col-6 ">{t("requestPayment.name")}</div>
                  <div className="e-col-3 content-center">{t("requestPayment.amount")}</div>
                  <div className="e-col-3 ">{t("setting.unit")}</div>
                </div>
                {orderDetail.order_items && orderDetail.order_items.length > 0 ?
                  orderDetail.order_items.map((item, index) => (
                    <div className="row-item e-row" key={index}>
                      <div className="e-col-6 ">{item.item_name}</div>
                      <div className="e-col-3 ">{item.qty}</div>
                      <div className="e-col-3 ">{item.unit_item}</div>
                    </div>
                  )) : <div>{t("requestPayment.noDish")}</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div> :
        <div className="no-data-table e-p-50 e-flex content-center item-center">
          <div>
            <img src={require("../../../../images/no-data.png")} />
            <div className="text">
              <span>{t("requestPayment.noDataOrder")}</span>
            </div>
          </div>
        </div>
      }
      </div>
    )
  }
}