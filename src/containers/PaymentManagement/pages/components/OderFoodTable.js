import React, { Component } from "react";
import { TableData, CheckBox, NumberRange } from "../../../../components/common";
import _ from "lodash";
import utilsFormat from "../../../../utils/formats";
import moment from "moment";
import Styles from "../PaymentManagement.module.scss";

class OderFoodTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lstOrderFoods: this.props.lstOrderFoods,
      valueQty: 1,
      dataSelectedamount: [],
      foodList: this.props.foodList
    }
  }

  componentWillReceiveProps(prevProps, prevState) {
    if (JSON.stringify(prevProps.lstOrderFoods)
      !== JSON.stringify(this.state.lstOrderFoods)) {
      this.setState({
        lstOrderFoods: prevProps.lstOrderFoods
      })
    }
    return null
  }
  /**
   * Calculate elasped time
   */
  timePassed = (fromTime) => {
    let diff = moment().diff(moment(fromTime));
    let minute = Math.ceil(moment.duration(diff).as("minutes"));
    return minute;
  }
  onSelectFood = (checked, item) => {
    this.props.onChangeCheckFood(checked, item)
  }
  /**
   * change qty food
   */
  onChangeQtyFood = (valueQty, item) => {
    this.setState({ valueQty })
    this.props.onChangeQtyFood(valueQty, item)
  }
  render() {
    const { trans, isCheckPayByItem,
      unit_price, partnerSetting,
      foodList, lstFoodStart } = this.props;
    const { lstOrderFoods } = this.state;
    let lstNewData = []
    for (let i in lstOrderFoods) {
      lstNewData = [...lstNewData, lstOrderFoods[i].id]
    }
    const TABLE_SETTING = {
      heads: isCheckPayByItem ? [
        {
          width: '5%',
          text: trans("payment:payment_order.no"),
        },
        {
          width: '5%',
          overflow: false
        },
        {
          width: `15%`,
          text: trans("payment:payment_order.food_name"),
          overflow: false
        },
        {
          width: '10%',
          text: trans("payment:payment_order.order_time"),
          overflow: false
        },
        {
          width: '7%',
          text: trans("Số lượng còn lại"),
          overflow: false
        },
        {
          width: '12%',
          text: trans("payment:payment_order.quantity"),
        },
        {
          width: '10%',
          text: trans("Đơn giá"),
        },
        {
          width: '8%',
          text: trans("payment:payment_order.is_bring_home"),
        },
        {
          width: '10%',
          text: trans("payment:payment_order.price"),
        }, {
          width: '10%',
          text: trans("payment:payment_order.status"),
        }] : [{
          width: '5%',
          text: trans("payment:payment_order.no"),
        },
        {
          width: `15%`,
          text: trans("payment:payment_order.food_name"),
          overflow: false
        },
        {
          width: "15%",
          text: trans("payment:payment_order.order_time"),
          overflow: false
        },
        {
          width: '12%',
          text: trans("payment:payment_order.quantity"),
        },
        {
          width: '10%',
          text: trans("Đơn giá"),
        },
        {
          width: '10%',
          text: trans("payment:payment_order.is_bring_home"),
        },
        {
          width: '10%',
          text: trans("payment:payment_order.price"),
        }, {
          width: '10%',
          text: trans("payment:payment_order.status"),
        }],
      columns: isCheckPayByItem ? [
        {
          key: "id",
          width: '5%',
          render: (item, index) => {
            return index + 1;
          },
        },
        {
          key: "",
          width: '5%',
          render: (item) => {
            return (
              <>{isCheckPayByItem
                ? <CheckBox onChange={(e) => this.onSelectFood(e, item)}
                  checked={lstNewData.includes(item.id)}
                />
                : ""}
              </>
            )
          }
        },
        {
          key: "item_name",
          width: `15%`,
        },
        {
          key: "created_at",
          width: '10%',
          render: (item, index) => {
            return (
              this.timePassed(item.created_at) +
              " " +
              this.props.trans("table_list:food_list.minute_ago")
            );
          },
        },
        {
          key: "",
          width: '7%',
          render: (item, index) => {
            let quantityInStock = 0;
            if (lstFoodStart[index].id === item.id) {
              quantityInStock = lstFoodStart[index].qty - item.qty_completed
            }
            return isCheckPayByItem ? quantityInStock : null
          }
        },
        {
          key: "qty",
          width: '12%',
          render: (item) => {
            return isCheckPayByItem && lstNewData.includes(item.id) ?
              <NumberRange
                max={item.qty - item.qty_completed} defaultValue={item.qty}
                min={1}
                onChange={(value) => this.onChangeQtyFood(value, item)} />
              : item.qty
          }
        },
        {
          key: "price",
          width: '10%',
          render: (item, index) => {
            return <span>{utilsFormat.moneyFormat(item.price)} <span className={Styles["unit-vnd"]} style={{ color: "#f44336" }}>{unit_price}</span></span>;
          },
        },
        {
          key: "is_takeaway",
          width: '8%',
          render: (item, index) => {
            if (item.is_takeaway) {
              return (
                <span
                  style={{ color: "#2699FB" }}
                  className="icon-checkmark"
                ></span>
              );
            }
          },
        },
        {
          key: "price",
          width: '10%',
          render: (item, index) => {
            const price = item.price * item.qty
            return <span>{utilsFormat.moneyFormat(price)} <span style={{ color: "#f44336" }}>{unit_price}</span></span>;
          },
        },
        {
          key: "order_item_status",
          width: '10%',
          render: (item, index) => {
            if (item.order_item_status) {
              return this.props.trans("table_list:item_statuses." + item.order_item_status.id)
            }
          }
        }] : [{
          key: "id",
          width: '5%',
          render: (item, index) => {
            return index + 1;
          },
        },
        {
          key: "item_name",
          width: `15%`,
        },
        {
          key: "created_at",
          width: "15%",
          render: (item, index) => {
            return (
              this.timePassed(item.created_at) +
              " " +
              this.props.trans("table_list:food_list.minute_ago")
            );
          },
        },
        {
          key: "qty",
          width: '12%',
          render: (item) => {
            return isCheckPayByItem && lstNewData.includes(item.id) ?
              <NumberRange
                max={item.qty} defaultValue={0 || item.qty}
                min={1}
                onChange={(value) => this.onChangeQtyFood(value, item)} />
              : item.qty
          }
        },
        {
          key: "price",
          width: '10%',
          render: (item, index) => {
            return <span>{utilsFormat.moneyFormat(item.price - item.discount_value)}
              <span className={Styles["unit-vnd"]}
                style={{ color: "#f44336" }}>
                {unit_price}</span></span>;
          },
        },
        {
          key: "is_takeaway",
          width: '10%',
          render: (item, index) => {
            if (item.is_takeaway) {
              return (
                <span
                  style={{ color: "#2699FB" }}
                  className="icon-checkmark"
                ></span>
              );
            }
          },
        },
        {
          key: "price",
          width: '10%',
          render: (item, index) => {
            const price = item.price * item.qty
            return <span>{utilsFormat.moneyFormat(price)} <span style={{ color: "#f44336" }}>{unit_price}</span></span>;
          },
        },
        {
          key: "order_item_status",
          width: '10%',
          render: (item, index) => {
            if (item.order_item_status) {
              return this.props.trans("table_list:item_statuses." + item.order_item_status.id)
            }
          }
        }],
    };
    return (
      <div className={Styles["content-lst-food"]}>
        <TableData
          option={TABLE_SETTING}
          dataSources={foodList}
          scrollable={false}
          // maxHeight={'360px'}
          textNotiNoData={this.props.trans("dishManagament.notiNodata")}
        />
      </div>
    );
  }
}

export default OderFoodTable;
