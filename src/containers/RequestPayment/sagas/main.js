import { takeEvery, call, put } from "redux-saga/effects";
import * as actions from "../actions";
import * as apiPaymentReq from "../../../api/requestPayment";
import * as apiOrder from "../../../api/order";
import * as apiNoti from "../../../api/notification";

function* getListRequestPayment(action) {
  try {
    const res = yield call(apiPaymentReq.getListReqPayment, action.payload)
    yield put(actions.getListReqPaymentSuccess({
      data: res.data, page: action.payload.page,
      params: action.payload.params ? action.payload.params : {}
    }))
  } catch (error) {
    return error
  }
}
/**
 * send provisi vote
 * @param {*} action
 */
function* sendProvisiVote(action) {
  try {
    const res = yield call(apiPaymentReq.saveProvisionalVotes, action.payload)
    const body_data = JSON.stringify(res.data.data)
    const dataPushNoti = {
      title: "Phiếu tạm tính",
      content: "Nhân viên gửi phiếu tạm tính",
      action: "send_bill_temp",
      type_notification: "1",
      link: "",
      body_data,
      partner_id: "",
      table_id: "",
      area_id: "",
      topic: "",
      list_user_push_noti: [""]
    }
    yield call(apiNoti.addNofitication, { data: dataPushNoti });
    action.payload.sendSuccess();
  } catch (error) {
    return error
  }
}
/**
 * list request payment detail by order_id
 * @param {*} action
 */
function* getListDetailProvisiVotes(action) {
  try {
    const res = yield call(apiPaymentReq.getDetailReqPaymentById, action.payload);
    const resOrderById = yield call(apiOrder.getOrderItemById, { id: action.payload.order_id })
    yield put(actions.getDetailReqPaymentSuccess({ resReqdetail: res.data, resOrderId: resOrderById.data }))
  } catch (error) {
    return error
  }
}

function* getOrderDetailsById(action) {
  try {
    const res = yield call(apiOrder.getOrderItemById, action.payload)
    yield put(actions.getOrderItemByIdSuccess(res.data))
  } catch (error) {
    return error
  }
}

function* getInfoDetailProvisiVote(action) {
  try {
    const res = yield call(apiPaymentReq.getDetailProvisionalVotes, action.payload)
    yield put(actions.getInfoDetailProvisiVoteSuccess(res.data))
  } catch (error) {
    return error
  }
}

function* updateStatusFoodOrdered(action) {
  try {
    yield call(apiPaymentReq.updateStatusItemOfOrder, action.payload)
    yield put(actions.getOrderItemById({ id: action.payload.order_id }))
  } catch (error) {
    return error
  }
}

function* updateAmountItemOrdered(action) {
  try {
    yield call(apiPaymentReq.updateAmountItemOfOrder, action.payload)
    yield put(actions.getOrderItemById({ id: action.payload.order_id }))
    action.payload.updateSuccess("Cập nhật số lượng món thành công")
  } catch (error) {
    return error
  }
}
/**
 * cancel food ordered
 * @param {} action
 */
function* cancelFoodOrder(action) {
  try {
    yield call(apiPaymentReq.updateAmountItemOfOrder, action.payload)
    action.payload.updateSuccess("Hủy món thành công!")
  } catch (error) {
    return error
  }
}

function* getListReqPayment() {
  yield takeEvery(actions.getListReqPayment, getListRequestPayment)
}

function* saveProvisiVote() {
  yield takeEvery(actions.sendProvisiVote, sendProvisiVote)
}

function* getListDetailProvisis() {
  yield takeEvery(actions.getDetailReqPayment, getListDetailProvisiVotes)
}

function* getOrderDetails() {
  yield takeEvery(actions.getOrderItemById, getOrderDetailsById)
}
function* getDetailProvisi() {
  yield takeEvery(actions.getInfoDetailProvisiVote, getInfoDetailProvisiVote)
}

function* updateStatusOrderFood() {
  yield takeEvery(actions.updateStatusFoodOrdered, updateStatusFoodOrdered)
}

function* updateAmountItem() {
  yield takeEvery(actions.updateAmountItem, updateAmountItemOrdered)
}

function* cancelItemOrdered() {
  yield takeEvery(actions.cancelFoodOrdered, cancelFoodOrder)
}
export default [
  getListReqPayment,
  saveProvisiVote,
  getListDetailProvisis,
  getOrderDetails,
  getDetailProvisi,
  updateStatusOrderFood,
  updateAmountItem,
  cancelItemOrdered
]