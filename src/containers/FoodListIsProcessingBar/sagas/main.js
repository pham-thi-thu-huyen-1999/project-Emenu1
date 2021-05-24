import { call, put, takeEvery, delay, select } from "redux-saga/effects";
import * as actions from "../actions";
import apiArea from "../../../api/area";
import * as apiOrder from "../../../api/order";
import * as apiNofitication from "../../../api/notification";
import * as CONST from "./../constants"
import { name } from "./../reducers";
import * as apiUser from "../../../api/account";

/**
 * Get state from reducer
 */
const getState = (state) => state[name];

/**
 * Lấy danh sách khu vực
 */
function* handleGetAreaList(action) {
  try {
    const res = yield call(apiArea.getAreaListByPartner, action.payload);
    yield put(actions.getAreaListSuccess(res.data));
  } catch (err) {
    yield put(actions.getAreaListFail(err.reponse));
  }
}

/**
 * Lấy danh sách món ăn để hiển thị trong tab theo món
 */
function* handleGetOrderFoodList(action) {
  try {
    action.payload.data = { ...action.payload.data, isBar: true };
    // call get item
    const res = yield call(apiOrder.getOrderFoodList, action.payload);
    yield put(actions.getOrderFoodListSuccess(res.data));
  }
  catch (err) {
  }
}

/**
 * Lấy danh sách các order để hiển thị trong tab theo order/bàn
 */
function* handleGetOrderByTable(action) {
  try {
    action.payload.data = { ...action.payload.data, isBar: true };
    const res = yield call(apiOrder.getOrderGeneral, action.payload);
    yield put(actions.getOrderByTableSuccess(res.data));
    // lấy dữ liệu state từ reducer
    let state = yield select(getState);
    // lấy order_id từ mảng order trả về để get danh sách món ăn theo order_id này
    const data = {
      orderId: state.orderListAccourdingToTable[0] && state.orderListAccourdingToTable[0].id
    }
    if (data.orderId && action.payload.data.hasGetDishByOrder !== false) {
      yield put(actions.getDishByOrder({ data }));
    }
  } catch (err) {
  }
}

/**
 * Lấy danh sách món ăn theo order ( order_id )
 */
function* handleGetDishByOrder(action) {
  try {
    const res = yield call(apiOrder.getDishByOrder, action.payload);
    yield put(actions.getDishByOrderSuccess(res.data));
  } catch (err) {
    yield put(actions.getDishByOrderFail(err.reponse));
  }
}

/**
 * Cập nhật món ăn đã hết
 */
function* handleUpdateOrderItemIsOff(action) {
  try {
    // call api cập nhật món ăn đã hết
    yield call(apiOrder.updateOrderItemIsOff, action.payload);
    // lấy data notification từ dữ liệu gửi lên
    const data = action.payload.notificationData;
    // lấy ra màn hình đang hiển thị theo món hay order/bàn
    const typeTab = action.payload.typeTab ? action.payload.typeTab : "";
    // call api thêm notification
    yield call(apiNofitication.addNofitication, { data })
    if (typeTab === CONST.TAB_DISH) {
      yield put(actions.getOrderFoodList({ data: { ...action.payload.dataGet } }));
    } else if (typeTab === CONST.TAB_ORDER) {
      yield put(actions.getOrderFoodList({ data: { ...action.payload.dataGet } }));
    }
    yield put(actions.updateOrderItemIsOffSuccess(action.payload));
    let state = yield select(getState);
    let orderId = action.payload.data.order_id;
    let { hasReloadOrder, orderListAccourdingToTable } = state;
    if (hasReloadOrder) {
      orderId = orderListAccourdingToTable[0] && orderListAccourdingToTable[0].id
    }
    const dataGetDish = {
      orderId,
    }
    // Gọi hàm cập nhật lại order đang được chọn tại tab order/bàn
    yield put(actions.getDishByOrder({ data: dataGetDish }));
    action.payload.callback_success();
  } catch (err) {
    yield put(actions.updateOrderItemIsOffFail(err.reponse));
    action.payload.callback_fail();
  }
}

/**
 * Cập nhật món ăn đã nấu xong
 */
function* handleUpdateOrderItemIsCompleted(action) {
  try {
    // call api cập nhật món ăn đã nấu xong
    yield call(apiOrder.updateOrderItemIsCompleted, action.payload);
    // lấy data notification từ dữ liệu gửi lên
    const data = action.payload.notificationData;
    const typeTab = action.payload.typeTab ? action.payload.typeTab : "";
    // call api thêm notification
    yield call(apiNofitication.addNofitication, { data })
    if (typeTab === CONST.TAB_DISH) {
      yield put(actions.getOrderFoodList({ data: { ...action.payload.dataGet } }));
    } else if (typeTab === CONST.TAB_ORDER) {
      yield put(actions.getOrderFoodList({ data: { ...action.payload.dataGet } }));
    }
    yield put(actions.updateOrderItemIsCompletedSuccess(action.payload));
    let state = yield select(getState);
    let orderId = action.payload.data.order_id;
    let { hasReloadOrder, orderListAccourdingToTable } = state;
    if (hasReloadOrder) {
      orderId = orderListAccourdingToTable[0] && orderListAccourdingToTable[0].id
    }
    const dataGetDish = {
      orderId,
    }
    // Gọi hàm cập nhật lại order đang được chọn tại tab order/bàn
    yield put(actions.getDishByOrder({ data: dataGetDish }));
    action.payload.callback_success();
  } catch (err) {
    yield put(actions.updateOrderItemIsCompletedFail(err.response));
    action.payload.callback_fail();
  }
}

/**
 * Hàm cập nhật lại dữ liệu bar khi có notification liên quan đến dữ liệu bar
 */
function* handleUpdateKitchenBar(action) {
  try {
    const { data } = action.payload;
    // Lấy ra action của notification
    const actionOfNoti = data.action;
    // check xem action có nằm trong các action cần cập nhật dữ liệu không
    if (CONST.ACTION_UPDATE_KITCHENBAR.includes(actionOfNoti)) {
      if (CONST.UPDATE_ORDER_LIST.includes(actionOfNoti)) {
        let hasGetDishByOrder = CONST.UPDATE_DISH_LIST_ORDER.includes(actionOfNoti);
        let oldState = yield select(getState);
        if (!hasGetDishByOrder) {
          hasGetDishByOrder = oldState.orderListAccourdingToTable.length === 0
        }
        yield put(actions.getOrderByTable({ data: { hasGetDishByOrder } }));
        if (oldState.orderIdGetDish === data.order_id && actionOfNoti === CONST.NOTI_ACTION_STAFF_ORDER_ITEM) {
          yield put(actions.getDishByOrder({ data: { orderId: oldState.orderIdGetDish } }))
        }
      } else {
        const { is_bar } = data;
        if (is_bar !== undefined && JSON.parse(is_bar) === false) {
          return;
        }
        yield put(actions.updateOrderByNoti(action.payload));
      }
      let state = yield select(getState);
      let { hasReloadOrder, orderListAccourdingToTable } = yield state;
      if (hasReloadOrder) {
        let orderId = orderListAccourdingToTable[0] && orderListAccourdingToTable[0].id
        const dataGetDish = {
          orderId,
        }
        // Gọi hàm cập nhật lại order đang được chọn tại tab order/bàn
        yield put(actions.getDishByOrder({ data: dataGetDish }));
      }

      yield put(actions.showMessageByNoti({ show: true, notiData: {...action.payload.notification, action: actionOfNoti} }));
      yield put(actions.showMessageByNoti({ show: false, notiData: {...action.payload.notification, action: actionOfNoti} }));
      yield put(actions.getOrderFoodList({ data: { ...state.dataGetTabDish } }));
    }
  } catch (err) {
  }
}

/**
 * Cập nhật dữ liệu order khi đổi khu vực trong tab order/bàn
 */
function* handleSearchOrder(action) {
  try {
    // Cập nhật lại dữ liệu trong state của reducer
    yield put(actions.searchOrderSuccess(action.payload));
    // Lấy ra state từ reducer
    let state = yield select(getState);
    const data = {
      orderId: state.orderListAccourdingToTable[0] && state.orderListAccourdingToTable[0].id
    }
    // Cập nhật lại order được chọn khi bị đổi khu vực
    if (data.orderId) {
      yield put(actions.getDishByOrder({ data }));
    } else {
      yield put(action.getDishByOrderSuccess([]));
    }
  } catch (err) {
    yield put(actions.searchOrderFail(err.response));
  }
}

function* handleLoading(action) {
  try {
    yield delay(1000);
    yield put(actions.stopLoading(action.payload));
  } catch (err) {
  }
}

function* handleGetInfoStaff(action) {
  try {
    const res = yield call(apiUser.getAccountInfoStaff, action.payload);
    yield put(actions.getInfoStaffSuccess(res.data));
  } catch (err) {
    yield put(actions.getInfoStaffFail(err.response.data.error.internal_message));
  }
}

function* getAreaList() {
  yield takeEvery(actions.getAreaList, handleGetAreaList);
}

function* getOrderFoodList() {
  yield takeEvery(actions.getOrderFoodList, handleGetOrderFoodList);
}

function* getOrderByTable() {
  yield takeEvery(actions.getOrderByTable, handleGetOrderByTable);
}

function* getDishByOrder() {
  yield takeEvery(actions.getDishByOrder, handleGetDishByOrder);
}

function* updateOrderItemIsOff() {
  yield takeEvery(actions.updateOrderItemIsOff, handleUpdateOrderItemIsOff);
}

function* updateOrderItemIsCompleted() {
  yield takeEvery(actions.updateOrderItemIsCompleted, handleUpdateOrderItemIsCompleted);
}

function* searchOrder() {
  yield takeEvery(actions.searchOrder, handleSearchOrder);
}

function* startLoading() {
  yield takeEvery(actions.startLoading, handleLoading);
}

function* updateKitchenBar() {
  yield takeEvery(actions.updateKitchenBar, handleUpdateKitchenBar);
}

function* getInfoStaff() {
  yield takeEvery(actions.getInfoStaff, handleGetInfoStaff);
}

export default [
  getAreaList,
  getOrderFoodList,
  getOrderByTable,
  getDishByOrder,
  updateOrderItemIsOff,
  updateOrderItemIsCompleted,
  searchOrder,
  startLoading,
  updateKitchenBar,
  getInfoStaff,
];
