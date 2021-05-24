import { call, put, takeEvery, select } from "redux-saga/effects";
import { fork, all } from "redux-saga/effects"
import * as actions from './actions';
import * as apiCombo from "../../api/comboItem";
import * as apiOrder from "../../api/order";
import * as apiCategoryItem from "../../api/categoryItem";
import * as apiPartnerSetting from "../../api/partnerSetting";
import * as apiNofitication from "../../api/notification";
import Swal from "../../utils/sweetalert2";

import {
  joinTable,
  getListTableByAreaId,
  getTableJoinInfo,
  updateEmptyTable,
  updateStatusTableEmpty,
  updateStatusTableUsed
} from '../../api/table';

import {getListNotifications} from '../../api/notification'

import {
  getOrder
} from '../../api/order';
import TABLE_CONST from "../TableList/pages/TableContants";

import { NOTI_ACTION_RELOAD_TABLE } from "../TableList/pages/TableContants";
import { TableListReducerName } from "./reducers";
/**
 * Get state from reducer
 */
 const getState = (state) => state[TableListReducerName];

function* handleGetListTable(action) {
  try {
    const data = yield call(getListTableByAreaId, action.payload);
    yield put(actions.getListTableSuccess(data.data));
  } catch (error) {
    yield put(actions.getListTableFailure(error));
  }
}

function* handleCombineTable(action) {
  try {
    const data = yield call(joinTable, action.payload);
    if (action.payload.onCombineSuccess) {
      action.payload.onCombineSuccess();
    }
    yield put(actions.combineTableSuccess(data.data));
  } catch (error) {
    if (action.payload.onCombineFailure) {
      action.payload.onCombineFailure();
    }
    yield put(actions.combineTableFailure(error));
  }
}

function* handleGetTableOrders(action) {
  try {
    if (action.payload.table_id) {
      const data = yield call(getOrder, action.payload);
      if (
        data.data &&
        data.data.data &&
        data.data.data.length === 0 &&
        action.payload.is_api_data
      ) {
        yield call(updateEmptyTable, { table_id: action.payload.table_id, status: TABLE_CONST.TABLE_STATUS_EMPTY });
      }
      yield put(actions.getTableOrdersSuccess({...data.data, ...action.payload}));
      if (action.payload.onClose && !data.data.data.length) {
        action.payload.onClose();
      }
    } else {
      yield put(actions.getTableOrdersSuccess(null));
    }
  } catch (error) {
    yield put(actions.getTableOrdersFailure(error));
  }
}

function* handleGetCombineTables(action) {
  try {
    const data = yield call(getTableJoinInfo, action.payload);
    yield put(actions.getCombinedTableSuccess(data.data));
  } catch (error) {
    yield put(actions.getCombinedTableFailure());
  }
}

function* handleGetItemComboList(action) {
  try {
    const res = yield call(apiCombo.getItemCombo, action.payload)
    yield put(actions.getItemComboListSuccess({ data: res.data, total_item: action.payload.total_item }))
  } catch (error) {
    yield put(actions.getItemComboListFail(error.response));
  }
}

function* handleGetComboList(action) {
  try {
    const res = yield call(apiCombo.getComboList, action.payload);
    yield put(actions.getComboListSuccess(res.data));
  } catch (error) {
    yield put(actions.getComboListFail(error.response));
  }
}

function* handleGetPartnerSetting(action) {
  try {
    const res = yield call(apiPartnerSetting.getPartnerSetting, action.payload);
    const resComboList = yield call(apiCombo.getComboList, action.payload);
    if (resComboList.data.data.length > 0) {
      //Goi get combo item list - first
      if (action.payload.comboDetail && action.payload.check === true) {
        //load lai data cho combo co gia
        yield put(actions.getComboItemList({ categoryName: "", comboName: "", comboDetail: action.payload.comboDetail, check: true }));
      } else if (action.payload.comboDetail && action.payload.check === false) {
        //load lai data cho combo khong gia
        yield put(actions.getComboItemList({ categoryName: "", comboName: "", comboDetail: action.payload.comboDetail, check: false }));
      }
      else {
        //load lai data cho truong hop khong co combo
        yield put(actions.getComboItemList({ categoryName: "", comboName: "", isLoadCombo: true })); // isLoadCombo: kiem tra ko cho load lai suat co gia
      }
    } else {
      yield put(actions.getOrderItem({ categoryName: "" }));
    }
    yield put(actions.getPartnerSettingSuccess(res.data));
  } catch (err) {
    yield put(actions.getPartnerSettingFail(err.response));
  }
}

function* handleGetComboItemListOnly(action) {
  try {
    const res = yield call(apiOrder.getComboItemListOnly, action.payload);
    yield put(actions.getComboItemListOnlySuccess(res.data));
  } catch (err) {
    yield put(actions.getComboItemListOnlyFail(err.response));
  }
}

function* handleGetComboItemList(action) {
  try {
    const res = yield call(apiOrder.getComboItemList, action.payload);

    let comboFalse = [];

    let arrayTemp = [];

    if (action.payload.isLoadCombo !== true) {
      if (action.payload.comboDetail && action.payload.check === true) //khi dang ky combo co gia, check: xem la suat co gia hay suat ko gia
      {
        comboFalse.push(action.payload.comboDetail);
      } else {
        for (let k = 0; k < res.data.data.length; k++) {
          if (res.data.data[k].is_price === false) {
            comboFalse.push(res.data.data[k]);
          }
        }
      }

      //Lay gia tri ban dau khi moi vao man hinh danh sach mon voi category la ""
      try {
        const res1 = yield call(apiOrder.getComboById, { combo_item_id: (action.payload.comboDetail ? action.payload.comboDetail.id : comboFalse[0].id) })
        let arrayTempItem = [];
        arrayTempItem = [...res1.data.data];
        yield put(actions.getComboByIdSuccess(arrayTempItem));
      } catch (error) {
        yield put(actions.getComboByIdFail(error.response));
      }
    }

    arrayTemp = { ...res.data, comboFalse }
    yield put(actions.getComboItemListSuccess(arrayTemp));
  } catch (err) {
    yield put(actions.getComboItemListFail(err.response));
  }
}


//Lay item khi khong co combo
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
        if (res.data.data[i].name === action.payload.categoryName) {
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

function* handleGetCategoryItemList(action) {
  try {
    const res = yield call(apiCategoryItem.getCategoryItemList, action.payload);
    yield put(actions.getCategoryItemListSuccess(res.data));
  } catch (err) {
    yield put(actions.getCategoryItemListFail(err.response));
  }
}

//Lay item khi click vao combo
function* handleGetComboItemById(action) {
  try {
    const res = yield call(apiOrder.getComboById, action.payload)
    let arrayTemp = [];
    if (action.payload.categoryName !== "") {
      for (let i = 0; i < res.data.data.length; i++) {
        if (res.data.data[i].name === action.payload.categoryName) {
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


/*
  + create Order
*/
function* handleOrder(action) {
  try {
    let temp = [];
    const res = yield call(apiOrder.createOrder, action.payload);
    temp.push({ order_id: res.data.data.order_id });
    yield put(actions.createOrderSuccess(temp));
    const data = action.payload.notificationData;
    yield call(apiNofitication.addNofitication, { data });
    //yield action.payload.call_back_success();

  } catch (err) {
    yield put(actions.createOrderFail(err.response));
    //yield action.payload.callback_fail(err.response);
  }
}



function* handleGetNotifications(action) {
  try {
    const data = yield call(getListNotifications, action.payload);
    yield put(actions.getNotificationsListSuccess(data));
  } catch (error) {
    yield put(actions.getNotificationsListFailure());
  }
}

/**
 * Add food into order by order id
 */
function* handlePostOrderById(action) {
  try {
    const res = yield call(apiOrder.postOrderItemById, action.payload);
    yield put(actions.postOrderItemByIdSuccess(res.data));
    const data = action.payload.notificationData;
    yield call(apiNofitication.addNofitication, { data });
    yield action.payload.call_back_success();
  } catch (err) {
    yield put(actions.postOrderItemByIdFail(err.response));
    yield action.payload.call_back_fail();
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

/**
 * Add food cho suat da dang ky roi
 */
function* handlePostOrderComboById(action) {
  try {
    const res = yield call(apiOrder.postOrderItemComboById, action.payload);
    yield put(actions.postOrderItemComboByIdSuccess(res.data));
    const data = action.payload.notificationData;
    yield call(apiNofitication.addNofitication, { data });
    yield action.payload.call_back_success();
  } catch (err) {
    yield put(actions.postOrderItemComboByIdFail(err.response));
    yield action.payload.call_back_fail();
  }
}
function* handleUpdateStatusTable(action) {
  try {
    const USED = 1;
    let data = {}
    if (action.payload.status === USED) {
      data = yield call(updateStatusTableEmpty, action.payload);
    } else {
      data = yield call(updateStatusTableUsed, action.payload);
    }
    yield put(actions.getListTable({ area_id: action.payload.area_id }))
    yield put(actions.updateStatusTableSuccess(data.data));
    yield action.payload.updateStatusTblEmptySuccess();
  } catch (error) {
    yield action.payload.updateStatusTblEmptyFail()
    yield put(actions.updateStatusTableFailure());
  }
}

/**
 * Hàm cập nhật lại icon notification khi có notificatin
 */
function* handleUpdateIconTableByNoti(action) {
  try {
    const { data } = action.payload;
    // Lấy ra action của notification
    const actionOfNoti = data.action;
    let state = yield select(getState);
    let area_id = state.areaId;
    if (NOTI_ACTION_RELOAD_TABLE.includes(actionOfNoti) && area_id) {
      yield put(actions.getListTable({area_id}));
    }
  } catch (err) {
  }
}

function* handleGetNotis(action) {
  try {
    const res = yield call(apiNofitication.getListNotiByParams, action.payload);
    yield put(actions.getNotisSuccess(res.data));
  } catch (error) {
    yield put(actions.getNotisFail(error.response));
  }
}

// function* handleChangeStatus(action) {
//   try {
//     const res = yield call(apiNofitication.updateActionStatus, action.payload);
//     yield put(actions.getNotis({
//       data: {
//         index: 0,
//         page_size: -1,
//       }
//     }));
//     console.log("a", action.payload);
//     // yield action.payload.updateSuccess()
//   } catch (error) {
//     yield action.payload.updateFail();
//   }
// }
/**
 * action update status request_into_table
 * @param {*} action
 */
function* handleCreateOrder(action) {
  try {
    yield call(apiOrder.createOrder,
      { data: { order: action.payload.order, order_items: [] } }
    )
    yield action.payload.updateSuccess()
  } catch (error) { }
}
/**
 * update status readed
 * @param {*} action
 */
// function* handleChangeStatusReaded(action) {
//   try {
//     yield call(apiNofitication.updateStatusRead, action.payload);
//     yield put(actions.getNotis({
//       data: {
//         index: 0,
//         page_size: -1,
//       }
//     }));
//     console.log("bb", action.payload);
//   } catch (error) {
//     // yield action.payload.updateFail();
//   }
// }

// Watch actions
function* getComboById() {
  yield takeEvery(actions.getComboById, handleGetComboItemById);
}

function* getListTable() {
  yield takeEvery(actions.getListTable, handleGetListTable)
}

function* combineTable() {
  yield takeEvery(actions.combineTable, handleCombineTable)
}

function* getTableOrders() {
  yield takeEvery(actions.getTableOrders, handleGetTableOrders)
}

function* getCombinedTable() {
  yield takeEvery(actions.getCombinedTable, handleGetCombineTables)
}

function* getItemCombo() {
  yield takeEvery(actions.getItemComboList, handleGetItemComboList);
}

function* getComboList() {
  yield takeEvery(actions.getComboList, handleGetComboList);
}

function* getPartnerSetting() {
  yield takeEvery(actions.getPartnerSetting, handleGetPartnerSetting);
}

function* getComboItemList() {
  yield takeEvery(actions.getComboItemList, handleGetComboItemList);
}

function* getOrderItem() {
  yield takeEvery(actions.getOrderItem, handleGetOrderItem);
}

function* getCategoryItemList() {
  yield takeEvery(actions.getCategoryItemList, handleGetCategoryItemList);
}

function* createOrder() {
  yield takeEvery(actions.createOrder, handleOrder);
}

function* getNotificationsList() {
  yield takeEvery(actions.getNotificationsList, handleGetNotifications)
}

function* postOrderById() {
  yield takeEvery(actions.postOrderItemById, handlePostOrderById);
}

function* getOrderItemById() {
  yield takeEvery(actions.getOrderItemById, handleGetOrderItemById);
}

function* postOrderComboById() {
  yield takeEvery(actions.postOrderItemComboById, handlePostOrderComboById);
}
function* updateStatus() {
  yield takeEvery(actions.updateStatusTable, handleUpdateStatusTable)
}

function* getComboItemListOnly() {
  yield takeEvery(actions.getComboItemListOnly, handleGetComboItemListOnly);
}

function* updateIconTableByNoti() {
  yield takeEvery(actions.updateIconTableByNoti, handleUpdateIconTableByNoti);
}

function* getNotifications() {
  yield takeEvery(actions.getNotis, handleGetNotis);
}

// function* updateStatusNoti() {
//   yield takeEvery(actions.changeActionStatus, handleChangeStatus);
// }

function* createOrderForm() {
  yield takeEvery(actions.createOrderByNoti, handleCreateOrder);
}

// function* updateStatusRead() {
//   yield takeEvery(actions.updateStatusNoti, handleChangeStatusReaded);
// }

const sagas = [
  getListTable,
  combineTable,
  getTableOrders,
  getCombinedTable,
  getItemCombo,
  getComboList,
  getPartnerSetting,
  getComboItemList,
  getOrderItem,
  getCategoryItemList,
  getComboById,
  createOrder,
  getNotificationsList,
  postOrderById,
  getOrderItemById,
  postOrderComboById,
  updateStatus,
  getComboItemListOnly,
  updateIconTableByNoti,
  getNotifications,
  // createOrderForm,
  // updateStatusRead,
  // updateStatusNoti,
];

export default function* rootSaga() {
  yield all([...sagas.map(saga => fork(saga))])
}