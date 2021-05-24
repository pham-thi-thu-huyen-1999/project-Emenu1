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
    const { order, selectedArea, closePopup } = this.props;
    const { reasonCancelOrder } = this.state;
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      //const data = await cancelOrder({ data: { order_id: order.id, reason: reasonCancelOrder } })
      this.props.actions.deleteOrder({ data: { order_id: order.id, reason: reasonCancelOrder } });
      this.props.changePage();
      /* if (data) { */
        /* Swal.fire({
          icon: "success",
          title: this.props.trans("table_list:modal_swal.done"),
          text: this.props.trans("table_list:modal_swal.cancel_order_success_message"),
          showConfirmButton: true,
        }) */
        const dataPushNoti = {
          "title": "Hủy order",
          "content": `Hóa đơn mang về vừa thực hiện hủy order`,
          "action": "cancel_order",
          "type_notification": "1",
          "link": "",
          "body_data": {
            "table_id": "",
            "order_id": order.id,
            action: "cancel_order"
          },
          "topic": `area_${selectedArea.id}`,
          "list_user": [
            ""
          ],
          "is_push_noti": "1"
        }
        console.log("data noti delete", dataPushNoti)
        await addNofitication({data: dataPushNoti})
      /* } */
      // call api push noti
      closePopup();
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
)(withNamespaces()(CompPopupCancel));