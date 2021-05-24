import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export default class OrderItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    const { orderItem, selectedOrderId, t } = this.props;
    return (
       <span className="slick-slide order-item-kitchen" onClick={this.props.onSelectOrder}>
        <div className={selectedOrderId !== orderItem.id ? `order-item__title flex-view flex-view--space-around` :
          `order-item__title order-item__title--selected`
        }
        >
          <span className="order-item__title__name">
            {orderItem && orderItem.table && orderItem.table.name ? this.props.t("foodProcessing.table_") + orderItem.table.name : t("foodProcessing.Takeaway") + orderItem.order_no}

            {/* {
              orderItem.order_no
            } */}
          </span>
          <span className="order-item__title__minute">
            {/* <span style={{ verticalAlign: "text-bottom" }}>10 Phút &nbsp;</span> */}
            <span className="clock-icon">
              <FontAwesomeIcon icon={faClock} />
            </span>
          </span>
        </div>


        <ul className="order-item__body">
          <li className="report-line">
            <span className="report-line__title">{t("foodProcessing.numberDish")}</span>
            <span>
              <span className="number color--blue">{orderItem.total_item}</span>
              <span>{t("foodProcessing.nameOfUnitDish")}</span>
            </span>
          </li>
          <li className="report-line">
            <span className="report-line__title">{t("foodProcessing.finish")}</span>
            <span >
              <span className="number color--blue">{orderItem.total_item_completed}</span>
              <span>{t("foodProcessing.nameOfUnitDish")}</span>
            </span>
          </li>
          <li className="report-line">
            <span className="report-line__title">{t("foodProcessing.numberWaiting")}</span>
            <span >
              <span className="number color--blue">{orderItem.total_item_waiting}</span>
              <span>{t("foodProcessing.nameOfUnitDish")}</span>
            </span>
          </li>
          <li className="report-line">
            <span className="report-line__title">{t("foodProcessing.numberCancel")}</span>
            <span >
              <span className="number color--orange">{orderItem.total_item_cancel}</span>
              <span>{t("foodProcessing.nameOfUnitDish")}</span>
            </span>
          </li>
          <li className="report-line">
            <span className="report-line__title">{t("foodProcessing.numberNoFood")}</span>
            <span >
              <span className="number color--orange">{orderItem.total_item_off}</span>
              <span>{t("foodProcessing.nameOfUnitDish")}</span>
            </span>
          </li>
        </ul>

      </span>
      
    )
  }
}