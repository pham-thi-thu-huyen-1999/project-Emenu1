import { call, put, takeEvery, all } from "redux-saga/effects";
import * as actions from "../actions";
import * as api from "../../../api/notification";
import * as apiOrder from "../../../api/order";
import * as CONSTS from "./../constants";
function* handleGetNotifications(action) {
  try {
    const res = yield call(api.getNotifications, action.payload);
    yield put(actions.getNotificationsSuccess({
      data: res.data,
      index: action.payload.index
    }));
  } catch (error) {
    yield put(actions.getNotificationsFailure(error.response));
  }
}
/**
 * get total noti unread
 * @param {*} action
 */
function* handleTotaNotiUnread(action) {
  try {
    const res = yield call(api.getTotalNotiUnread, action.payload);
    yield put(actions.getListNotiUnreadSuccess(res.data));
  } catch (error) { }
}

/**
 * Handle of subcriber to topic
 */
function* handleSubcriberToTopic(action) {
  try {
    const res = yield call(api.subcriberToTopic, action.payload);
    yield put(actions.subcriberToTopicSuccess(res.data));
  } catch (error) {
    yield put(actions.subcriberToTopicFailure(error.response));
  }
}

function* handleChangeStatus(action) {
  try {
    const res = yield call(api.updateActionStatus, action.payload);
    yield put(actions.changeActionStatusSuccess(res.data));
    yield put(actions.getNotifications({ index: 0,
       topic: action.payload.topic }))
    // yield action.payload.updateSuccess()
  } catch (error) {
    // yield action.payload.updateFail();
    yield put(actions.changeActionStatusFail(error.response));
  }
}
/**
 * action update status request_into_table
 * @param {*} action
 */
function* handleCreateOrder(action) {
  try {
    yield call(apiOrder.createOrder,
      { data: { order: action.payload.order, order_items: [] } }
    )
    // yield action.payload.updateSuccess()
  } catch (error) { }
}
/**
 * update status readed
 * @param {*} action
 */
function* handleChangeStatusReaded(action) {
  try {
    yield all(action.payload.lstNotisUpdateStatus.map(noti => {
      return call(api.updateStatusRead, {
        notification_id: noti.id,
        status: action.payload.status
      });
    }));
    yield actions.getNotifications({ index: 0, topic: action.payload.topic })
  } catch (error) {
    // yield action.payload.updateFail();
  }
}

/**
 * cancel noti
 */
function* handleCancelNoti(action) {
  try {
    yield call(api.deleteNoti, action.payload);
    yield actions.getNotifications({ index: 0, topic: action.payload.topic })
  } catch (error) {
    // yield action.payload.updateFail();
  }
}

/**
 * Cập nhật số lượng noti trên button của header
 */
 function* handleUpdateHeaderByNoti(action) {
  try {
    const { data } = action.payload;
    // Lấy ra action của notification
    const actionOfNoti = data.action;
    const path_name = window.location.pathname;
    const order_id = data.order_id;
    if (CONSTS.NOTIS_FOR_BOOK_TABLE.includes(actionOfNoti) &&
      path_name !== CONSTS.URL_BOOK_TABLE) {
      yield put(actions.updateQuantityNoti({
        data: {
          type: CONSTS.BOOK_TABLE,
          quantity: 1
      }}));
    }
    if (CONSTS.NOTIS_FOR_TAKE_AWAY.includes(actionOfNoti) &&
      path_name !== CONSTS.URL_TAKE_AWAY) {
      let quantityTemp = data.is_takeaway ? 1 : 0;
      yield put(actions.updateQuantityNoti({
        data: {
          type: CONSTS.TAKE_AWAY,
          quantity: quantityTemp
      }}));
    }
    if (CONSTS.NOTIS_FOR_KITCHEN.includes(actionOfNoti) &&
      path_name !== CONSTS.URL_KITCHEN) {
      yield put(actions.updateQuantityNoti({
        data: {
          type: CONSTS.KITCHEN,
          quantity: 1
      }}));
    }
    if (CONSTS.NOTIS_FOR_BAR.includes(actionOfNoti) &&
      path_name !== CONSTS.URL_BAR) {
      yield put(actions.updateQuantityNoti({
        data: {
          type: CONSTS.BAR,
          quantity: 1
      }}));
    }
  } catch (error) {
  }
}

/**
 * Get notification
 */
function* getNotifications() {
  yield takeEvery(actions.getNotifications, handleGetNotifications);
}

/**
 * Subcriber to topic
 */
function* subcriberToTopic() {
  yield takeEvery(actions.subcriberToTopic, handleSubcriberToTopic);
}

function* updateStatus() {
  yield takeEvery(actions.changeActionStatus, handleChangeStatus);
}

function* createOrderForm() {
  yield takeEvery(actions.createOrder, handleCreateOrder);
}

function* updateStatusRead() {
  yield takeEvery(actions.updateStatusNoti, handleChangeStatusReaded);
}

function* getTotalNotiUnread() {
  yield takeEvery(actions.getListNotiUnread, handleTotaNotiUnread)
}

function* cancelNoti() {
  yield takeEvery(actions.deleteNotification, handleCancelNoti)
}

function* updateHeaderByNoti() {
  yield takeEvery(actions.updateHeaderByNoti, handleUpdateHeaderByNoti)
}

export default [
  getNotifications,
  subcriberToTopic,
  updateStatus,
  createOrderForm,
  updateStatusRead,
  getTotalNotiUnread,
  cancelNoti,
  updateHeaderByNoti,
];
