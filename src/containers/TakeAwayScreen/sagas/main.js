import { call, put, takeEvery } from "redux-saga/effects";
// import { push } from "connected-react-router";
import * as actions from "../actions";

import * as apiOrder from "../../../api/order";
import * as apiCategoryItem from "../../../api/categoryItem";
import * as apiItem from "../../../api/item";
import * as apiAccount from "../../../api/account";
import * as apiPartner from "../../../api/partner";
import * as apiNoti from "../../../api/notification";
import Swal from "../../../utils/sweetalert2";

import * as apiBill from "../../../api/bill";

function* handleGetItemList(action) {
  try {
    const res = yield call(apiItem.getItemList, action.payload);
    yield put(actions.getItemListSuccess(res.data));
  } catch (err) {
    yield put(actions.getItemListFail(err.response));
  }
}

function* handleGetOrderForm(action) {
  try {
    const res = yield call(apiOrder.getOrderForm, action.payload);
    console.log("Saga search", action.payload.isSearch);
    yield put(actions.getOrderFormSuccess({...res.data, check: action.payload.isSearch}));
  } catch (err) {
    yield put(actions.getOrderFormFail(err.response));
  }
}

function* handleGetCategoryItemList(action) {
  try {
    const res = yield call(apiCategoryItem.getCategoryItemList, action.payload);
    yield put(actions.getCategoryItemListSuccess(res.data));
  } catch (err) {
    yield put(actions.getCategoryItemListFail(err.response));
  }
}
/**
 * get list all combo
 * @param {*} action
 */
function* handleGetComboItemList(action) {
  try {
    let arrayTemp = [];
    const res = yield call(apiOrder.getComboItemList, action.payload);
    const combo_item_id = res.data.data[0].id;
    const resComboById = yield call(apiOrder.getComboById, { combo_item_id });
    let comboFalse = [];

    for (let k = 0; k < res.data.data.length; k++) {
      if (res.data.data[k].is_price === false) {
        comboFalse.push(res.data.data[k]);
      }
    }

    for (let i = 0; i < resComboById.data.data.length; i++) {
      for (let j = 0; j < resComboById.data.data[i].items.length; j++) {
        arrayTemp.push(resComboById.data.data[i].items[j]);
      }
    }
    // my code
    let dataByComboId = [];
    if (action.payload.categoryName !== "") {
      for (let i = 0; i < resComboById.data.data.length; i++) {
        if (resComboById.data.data[i].category_name === action.payload.categoryName) {
          dataByComboId.push(resComboById.data.data[i]);
        }
      }
    } else {
      dataByComboId = [...resComboById.data.data];
    }
    arrayTemp = { ...res.data, arrayTemp, comboFalse, dataByComboId, comboItemDetail: res.data.data[0] }
    yield put(actions.getComboItemListSuccess(arrayTemp));
  } catch (err) {
    yield put(actions.getComboItemListFail(err.response));
  }
}

function* handleGetPartnerSetting(action) {
  try {
    const res = yield call(apiOrder.getPartnerSetting, action.payload);
    const resComboList = yield call(apiOrder.getComboItemList, action.payload);
    let comboFalse = [];
    for (let k = 0; k < resComboList.data.data.length; k++) {
      if (resComboList.data.data[k].is_price === false) {
        comboFalse.push(resComboList.data.data[k]);
      }
    }
    if (comboFalse.length > 0) {
      yield put(actions.getComboItemList({ categoryName: "", comboName: "" }));
    } else {
      yield put(actions.getOrderItem({ categoryName: "" }));
    }
    yield put(actions.getPartnerSettingSuccess(res.data));
  } catch (err) {
    yield put(actions.getPartnerSettingFail(err.response));
  }
}

function* handleGetOrderItemById(action) {
  try {
    const res = yield call(apiOrder.getOrderItemById, action.payload);
    yield put(actions.getOrderItemByIdSuccess(res.data));
  } catch (err) {
    yield put(actions.getOrderItemByIdFail(err.response));
  }
}

function* handlePaymentOrder(action) {
  try {
    yield call(apiOrder.paymentOrder, action.payload);
    const res = yield call(apiOrder.getOrderForm, { page: 1, limit: 10 });
    yield put(actions.paymentOrderSuccess(res.data));
    /* try {
      const res1 = yield call(apiOrder.getOrderItemById, { id: res.data.data.order_id })
      yield put(actions.getOrderItemByIdSuccess(res1.data))
    } catch (err1) {
      yield put(actions.getOrderItemByIdFail(err1.response))
    } */
    /*  Swal.fire({
       icon: "success",
       title: "Thông Báo",
       text: "Thu tiền thành công",
     }); */
    action.payload.call_back_success();
  } catch (err) {
    yield put(actions.paymentOrderFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Thông báo",
      text: "Thanh toán thất bại ! " + err.response.data.error.internal_message,
    });
  }
}

function* handlDeliveryConfirm(action) {
  try {
    yield call(apiOrder.deliveryConfirm, action.payload)
    const res = yield call(apiOrder.getOrderForm, { page: 1, limit: 10 });
    yield put(actions.paymentOrderSuccess(res.data));
    Swal.fire({
      icon: "success",
      title: "Thông Báo",
      text: "Xác nhận giao hàng thành công",
    });

  } catch (error) {
    yield put(actions.paymentOrderFail(error.response));
    Swal.fire({
      icon: "error",
      title: "Thông báo",
      text: "Xác nhận giao hàng thất bại",
    });
  }
}

function* handleOrder(action) {
  try {
    let temp = [];
    const res = yield call(apiOrder.createOrder, action.payload);
    action.payload.notificationData.body_data.order_id = res.data.data.order_id;
    yield call(apiNoti.addNofitication, {data: action.payload.notificationData});
    temp.push({ order_id: res.data.data.order_id });
    const res2 = yield call(apiOrder.getOrderForm, { page: 1, limit: 10 });
    temp.push({ data: res2.data.data })
    yield put(actions.createOrderSuccess(temp));
    try {
      const res1 = yield call(apiOrder.getOrderItemById, { id: res.data.data.order_id })
      yield put(actions.getOrderItemByIdSuccess(res1.data))
    } catch (err1) {
      yield put(actions.getOrderItemByIdFail(err1.response))
    }

    if (action.payload.isChecked !== true) {
      Swal.fire({
        icon: "success",
        title: "Thông Báo",
        text: "Lưu Order thành công",
      });
    }
  } catch (err) {
    yield put(actions.createOrderFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Thông báo",
      text: "Lưu order thất bại! " + err.response.data.error.internal_message,
    });
  }
}

function* handleGetComboItemById(action) {
  try {
    const resCombo = yield call(apiOrder.getComboItemList, action.payload);
    const combo_item_id = resCombo.data.data[0].id;
    let comboFalse = [];

    for (let k = 0; k < resCombo.data.data.length; k++) {
      if (resCombo.data.data[k].is_price === false) {
        comboFalse.push(resCombo.data.data[k]);
      }
    }
    let res = {};
    if (!action.payload.combo_item_id) {
      res = yield call(apiOrder.getComboById, { combo_item_id: combo_item_id, categoryName: action.payload.categoryName })
    } else {
      res = yield call(apiOrder.getComboById, action.payload)
    }
    let arrayTemp = [];
    if (action.payload.categoryName !== "") {
      for (let i = 0; i < res.data.data.length; i++) {
        if (res.data.data[i].category_name === action.payload.categoryName) {
          arrayTemp.push(res.data.data[i]);
        }
      }
    } else {
      arrayTemp = [...res.data.data];
    }
    yield put(actions.getComboByIdSuccess(arrayTemp))

  } catch (error) {
    yield put(actions.getComboByIdFail(error.response))
  }
}

function* handleDeleteOrder(action) {
  try {
    yield call(apiOrder.cancelOrder, action.payload);
    const res = yield call(apiOrder.getOrderForm, { page: 1, limit: 10 })
    yield put(actions.deleteOrderSuccess(res.data));
    Swal.fire({
      icon: "success",
      title: "Thông báo",
      text: "Hủy đơn hàng thành công",
      showConfirmButton: true,
    });
  } catch (err) {
    yield put(actions.deleteOrderFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Thông báo",
      text: "Hủy đơn hàng thất bại!" + err.response.data.err.internal_message,
    });
  }
}

function* handleGetAccountInfo(action) {
  try {
    const res = yield call(apiAccount.getAccountInfo, action.payload);
    const res1 = yield call(apiPartner.getPartnerById, action.payload);
    yield put(actions.getAccountInfoSuccess(res.data));
    yield put(actions.getPartnerByIdSuccess(res1.data))
  } catch (err) {
    yield put(actions.getAccountInfoFail(err.response));
    yield put(actions.getPartnerByIdFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Thông Báo",
      text: "Lấy thông tin tài khoản thất bại!",
    });

  }
}

function* handleGetOrderItem(action) {
  try {
    let arrayTemp = [];
    const res = yield call(apiOrder.getOrderItem, action.payload);
    if (action.payload.categoryName === "") {
      for (let i = 0; i < res.data.data.length; i++) {
        for (let j = 0; j < res.data.data[i].items.length; j++) {
          arrayTemp.push(res.data.data[i].items[j]);
        }
      }
    } else {
      for (let i = 0; i < res.data.data.length; i++) {
        if (res.data.data[i].category_item_name === action.payload.categoryName) {
          for (let j = 0; j < res.data.data[i].items.length; j++) {
            arrayTemp.push(res.data.data[i].items[j]);
          }
        }
      }
    }
    yield put(actions.getOrderItemSuccess(arrayTemp));
  } catch (err) {
    yield put(actions.getOrderItemFail(err.response));
  }
}

function* handleGetCheckVoucher(action) {
  try {
    const res = yield call(apiOrder.getCheckVoucher, action.payload)
    yield put(actions.getCheckVoucherSuccess(res.data));
  } catch (err) {
    yield put(actions.getCheckVoucherFail(err.response));
  }
}

function* handleGetBillInfoById(action) {
  try {
    const res = yield call(apiBill.getBillList, action.payload);
    let bill_id = "";
    for (let i = 0; i < res.data.data.length; i++) {
      if (res.data.data[i].order_no === action.payload.order_no) {
        bill_id = res.data.data[i].id;
      }
    }
    const res1 = yield call(apiBill.getBillInfoById, { bill_id })
    yield put(actions.getBillInfoByIdSuccess(res1.data));
  } catch (err) {
    yield put(actions.getBillInfoByIdFail(err.response));
  }
}

function* handleRollbackOrder(action) {
  try {
    try {
      yield call(apiOrder.rollbackOrder, action.payload);
      const res = yield call(apiOrder.getOrderForm, { page: 1, limit: 10 })
      yield put(actions.getOrderFormSuccess(res.data));
      yield Swal.fire({
        icon: "success",
        title: "Thông báo",
        text: "Khôi phục order thành công!",
        showConfirmButton: true,
      });
      //action.payload.callback_success();
    } catch (err) {
      yield put(actions.getOrderFormFail(err.response));
      //action.payload.callback_fail();
      yield Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: "Khôi phục order thất bại!" + err.response.data.err.internal_message,
      });
    }
  } catch(error)
  {

  }
}

function* handleCancelBill(action) {
  try {
    yield call(apiBill.cancelBill, action.payload);
    const res = yield call(apiOrder.getOrderForm, { page: 1, limit: 10 })
    yield put(actions.getOrderFormSuccess(res.data));
    Swal.fire({
      icon: "success",
      title: "Thông báo",
      text: "Hủy đơn hàng đã thành toán thành công",
      showConfirmButton: true,
    });
  } catch (err) {
    yield put(actions.getOrderFormFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Thông báo",
      text: "Hủy đơn hàng đã thanh toán thất bại!" + err.response.data.err.internal_message,
    });
  }
}


function* getCheckVoucher() {
  yield takeEvery(actions.getCheckVoucher, handleGetCheckVoucher);
}

function* getOrderItem() {
  yield takeEvery(actions.getOrderItem, handleGetOrderItem);
}

function* getComboById() {
  yield takeEvery(actions.getComboById, handleGetComboItemById);
}

function* getAccountInfo() {
  yield takeEvery(actions.getAccountInfo, handleGetAccountInfo);
}

function* paymentOrder() {
  yield takeEvery(actions.paymentOrder, handlePaymentOrder);
}

function* deliveryConfirm() {
  yield takeEvery(actions.deliveryConfirm, handlDeliveryConfirm);
}

function* getCategoryItemList() {
  yield takeEvery(actions.getCategoryItemList, handleGetCategoryItemList);
}

function* getComboItemList() {
  yield takeEvery(actions.getComboItemList, handleGetComboItemList);
}

function* getPartnerSetting() {
  yield takeEvery(actions.getPartnerSetting, handleGetPartnerSetting);
}


function* getOrderItemById() {
  yield takeEvery(actions.getOrderItemById, handleGetOrderItemById);
}

function* getItemList() {
  yield takeEvery(actions.getItemList, handleGetItemList);
}

function* getOrderForm() {
  yield takeEvery(actions.getOrderForm, handleGetOrderForm);
}

function* createOrder() {
  yield takeEvery(actions.createOrder, handleOrder);
}

function* deleteOrder() {
  yield takeEvery(actions.deleteOrder, handleDeleteOrder);
}

function* getBillInfoById() {
  yield takeEvery(actions.getBillInfoById, handleGetBillInfoById);
}

function* cancelBill() {
  yield takeEvery(actions.cancelBill, handleCancelBill);
}

function* rollbackOrder() {
  yield takeEvery(actions.rollbackOrder, handleRollbackOrder);
}

export default [
  getCheckVoucher,
  getOrderItem,
  getAccountInfo,
  deliveryConfirm,
  paymentOrder,
  getComboById,
  getComboItemList,
  getPartnerSetting,
  getCategoryItemList,
  getItemList,
  getOrderForm,
  createOrder,
  deleteOrder,
  getOrderItemById,
  getBillInfoById,
  cancelBill,
  rollbackOrder
];
