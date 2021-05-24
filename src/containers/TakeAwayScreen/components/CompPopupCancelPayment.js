import React from "react";
import { SelectBox, TextArea, Button } from '../../../components/common/index';
import { cancelBill } from '../../../api/bill';
import {
  cancelOrder
} from '../../../api/order';
import {
  addNofitication
} from '../../../api/notification';
// import {
//   getOrderForm
// } from '../../../api/order';
import Swal from "../../../utils/sweetalert2";
import Validator from "../../../utils/validator";
import * as action from "../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { name } from "../reducers";

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
    const { order_id, lstBillByOrderId,
       trans,
       selectedArea,
        selectedInUseTable, selectedTableOrders } = this.props;
    const { reasonCancelPayment } = this.state;
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      if (order_id /* && lstBillByOrderId.length > 0 */) {
        this.props.actions.deleteOrder({ data: { order_id: order_id, reason: reasonCancelPayment } });
        this.props.changePage();
        const dataPushNoti = {
          "title": "Hủy order",
          "content": `Hóa đơn mang về vừa thực hiện hủy order đã được thanh toán`,
          "action": "cancel_order",
          "type_notification": "1",
          "link": "",
          "body_data": {
            "table_id": "",
            "order_id": order_id,
            action: "cancel_order"
          },
          "topic": `area_${selectedArea.id}`,
          "list_user": [
            ""
          ],
          "is_push_noti": "1"
        }
        console.log("data noti delete", dataPushNoti)
        await addNofitication({ data: dataPushNoti })
        /* if (data) {
          Swal.fire({
            icon: "success",
            title: trans("table_list:modal_swal.done"),
            text: trans("table_list:modal_swal.cancel_payment_success_message"),
            showConfirmButton: true,
          }) */
          /* const dataPushNoti = {
            "title": "Hủy thanh toán",
            "content": `Hóa đơn mang về vừa thực hiện hủy thanh toán`,
            "action": "cancel_payment",
            "type_notification": "1",
            "link": "",
            "body_data": {
              "table_id": "",
              "order_id": selectedTableOrders ? `${selectedTableOrders.id}` : "",
              action: "cancel_payment"
            },
            "topic": `area_${selectedArea.id}`,
            "list_user": [
              ""
            ],
            "is_push_noti": "1"
          }
          console.log("data noti delete 1", dataPushNoti)
          await addNofitication({data: dataPushNoti}); */
          //await getOrderForm({ page: 1, limit: 100 });
          //await this.props.getOrderForm();
        /* } */
      } else {
        Swal.fire({
          icon: "error",
          title: trans("Thông báo"),
          text: trans("Order chưa có thanh toán"),
          showConfirmButton: true,
        })
      }
      this.props.closePopup();
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
          <Button onClick={this.props.closePopup} className="e-m-right-5 s3">{trans("checkInOutManagement.noAccept")}</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[name],
  };
};
const mapDispatchToProps = (dispatch) => {
  const actions = {
    ...action,
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(CompPopupCancelPayment));
// export { CompPopupCancel, CompPopupCancelPayment }