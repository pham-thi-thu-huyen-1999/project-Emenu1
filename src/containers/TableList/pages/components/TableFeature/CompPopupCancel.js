import React from "react";
import { SelectBox, TextArea, Button } from '../../../../../components/common/index';
import { cancelBill } from '../../../../../api/bill';
import {
  cancelOrder
} from '../../../../../api/order';
import {
  addNofitication
} from '../../../../../api/notification';
import Swal from 'sweetalert2';
import Validator from "../../../../../utils/validator";
class CompPopupCancel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 1,
      reasonCancelOrder: "",
      errors: ""
    }
    const rules = [
      {
        field: "reasonCancelOrder",
        method: "isEmpty",
        validWhen: false,
        message: this.props.trans("table_list:modal_swal.valid_select_reason_cancel"),
      },
    ];
    this.validator = new Validator(rules);
  }
  onChangeReasonCancel = (selected, item) => {
    this.setState({
      selected,
      reasonCancelOrder: selected === 4 ? "" : item.text
    })
  }
  onCancelOrder = async () => {
    const { order, selectedArea } = this.props;
    const { reasonCancelOrder } = this.state;
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      const data = await cancelOrder({ data: { order_id: order.id, reason: reasonCancelOrder } })
      if (data) {
        Swal.fire({
          icon: "success",
          title: this.props.trans("table_list:modal_swal.done"),
          text: this.props.trans("table_list:modal_swal.cancel_order_success_message"),
          showConfirmButton: true,
        })
        const dataPushNoti = {
          "title": "Hủy order",
          "content": `Bàn ${order.table.name} vừa thực hiện hủy order`,
          "action": "cancel_order",
          "type_notification": "1",
          "link": "",
          "body_data": {
            "table_id": order.table.id,
            "order_id": order.id,
            action: "cancel_order"
          },
          "topic": `area_${selectedArea.id}`,
          "list_user": [
            ""
          ],
          "is_push_noti": "1"
        }
        await addNofitication({data: dataPushNoti})
      }
      // call api push noti
      this.props.close();
    } else {
      this.setState({
        errors: this.validator.validate(this.state),
      });
    }
  }
  render() {
    const { selected, errors } = this.state;
    const { trans } = this.props;

    return (
      <div className="content-cancel-order-payment">
        <h3>{trans("table_list:modal_swal.sure")}</h3>
        <div className="ques-confirm-cancel">{trans("table_list:modal_swal.cancel_order_message")}?</div>
        <SelectBox dataSource={[
          {
            key: 1,
            text: 'Khách hàng không đến'
          },
          {
            key: 2,
            text: 'Khách về do đợi lâu'
          },
          {
            key: 3,
            text: 'Khách không hài lòng'
          },
          {
            key: 4,
            text: 'Khác'
          }
        ]} blank={trans("table_list:modal_swal.select_reason_cancel")}
          onChange={this.onChangeReasonCancel}>
        </SelectBox>
        {errors.reasonCancelOrder ? (
          <div className="validation">{errors.reasonCancelOrder}</div>
        ) : null}
        {selected === 4 ?
          <div className="e-m-top-10"><TextArea
            placeholder={trans("table_list:modal_swal.enter_reason_cancel")}
            rows={5}
            onChange={data => this.setState({ reasonCancelOrder: data.target.value })}
          ></TextArea></div> : ""}
        <div className="lst-btn">
          <Button onClick={this.onCancelOrder} className="e-m-right-5">{trans("table_list:modal_swal.ok")}</Button>
          <Button onClick={this.props.close} className="e-m-right-5 s3">{trans("table_list:modal_swal.cancel")}</Button>
        </div>
      </div>
    )
  }
}
class CompPopupCancelPayment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 1,
      reasonCancelPayment: "",
      errors: ""
    }
    const rules = [
      {
        field: "reasonCancelPayment",
        method: "isEmpty",
        validWhen: false,
        message: this.props.trans("table_list:modal_swal.valid_select_reason_cancel"),
      },
    ];
    this.validator = new Validator(rules);
  }
  onChangeReasonCancel = (selected, item) => {
    this.setState({
      selected,
      reasonCancelPayment: selected === 4 ? "" : item.text
    })
  }
  onCancelPayment = async () => {
    const { order, lstBillByOrderId,
       trans,
       selectedArea,
        selectedInUseTable, selectedTableOrders } = this.props;
    const { reasonCancelPayment } = this.state;
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      if (lstBillByOrderId && lstBillByOrderId.length > 0) {
        const data = await cancelBill({ bill_id: lstBillByOrderId[0].id, reason: reasonCancelPayment })
        if (data) {
          Swal.fire({
            icon: "success",
            title: trans("table_list:modal_swal.done"),
            text: trans("table_list:modal_swal.cancel_payment_success_message"),
            showConfirmButton: true,
          })
          const dataPushNoti = {
            "title": "Hủy thanh toán",
            "content": `${selectedInUseTable ? selectedInUseTable.name : null} vừa thực hiện hủy thanh toán`,
            "action": "cancel_payment",
            "type_notification": "1",
            "link": "",
            "body_data": {
              "table_id": selectedInUseTable ? selectedInUseTable.id : "",
              "order_id": selectedTableOrders ? `${selectedTableOrders[0].id}` : "",
              action: "cancel_payment"
            },
            "topic": `area_${selectedArea.id}`,
            "list_user": [
              ""
            ],
            "is_push_noti": "1"
          }
          await addNofitication({data: dataPushNoti})
        }
      } else {
        Swal.fire({
          icon: "error",
          title: trans("Thông báo"),
          text: trans("Order chưa có thanh toán"),
          showConfirmButton: true,
        })
      }
      this.props.close();
    } else {
      this.setState({
        errors: this.validator.validate(this.state),
      });
    }
  }
  render() {
    const { selected, errors } = this.state;
    const { trans } = this.props;
    return (
      <div className="content-cancel-order-payment">
        <h3>{trans("table_list:modal_swal.sure")}</h3>
        <div className="ques-confirm-cancel">{trans("table_list:modal_swal.cancel_payment_message")}</div>
        <SelectBox dataSource={[
          {
            key: 1,
            text: 'Ghi sai order'
          },
          {
            key: 2,
            text: 'Khách hàng đổi/trả món'
          },
          {
            key: 3,
            text: 'Thu ngân tính tiền sai'
          },
          {
            key: 4,
            text: 'Khác'
          }
        ]} blank={trans("table_list:modal_swal.select_reason_cancel")}
          onChange={this.onChangeReasonCancel}>
        </SelectBox>
        {errors.reasonCancelPayment ? (
          <div className="validation">{errors.reasonCancelPayment}</div>
        ) : null}
        {selected === 4 ?
          <div className="e-m-top-10"><TextArea
            placeholder={trans("table_list:modal_swal.enter_reason_cancel")}
            rows={5}
            onChange={data => this.setState({ reasonCancelPayment: data.target.value })}
          ></TextArea></div> : ""}
        <div className="lst-btn">
          <Button onClick={this.onCancelPayment} className="e-m-right-5">{trans("table_list:modal_swal.ok")}</Button>
          <Button onClick={this.props.close} className="e-m-right-5 s3">{trans("table_list:modal_swal.cancel")}</Button>
        </div>
      </div>
    )
  }
}


export { CompPopupCancel, CompPopupCancelPayment }