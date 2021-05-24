import { call, put, takeEvery } from "redux-saga/effects";
import * as apiBookingTable from "../../../api/bookingTable";
import * as apiOrder from "../../../api/order";
import apiArea from "../../../api/area";
import * as actions from "../actions"
import { addNofitication } from "../../../api/notification";
import common from '../../../utils/common';
import { get } from "../../../services/localStorage";

function* handleGetListBookingTable(action) {
  try {
    const res = yield call(apiBookingTable.getListBooking, action.payload)
    yield put(actions.getListBookingTableSuccess(res.data))
  } catch (error) {
    yield put(actions.getListBookingTableFail(error))
  }
}

function* handleGetBookingById(action) {
  try {
    const res = yield call(apiBookingTable.getBookingById, action.payload)
    yield put(actions.getBookingByIdSuccess(res))
  } catch (error) {
    yield put(actions.getBookingByIdFail(error))
  }
}

function* handleAddBookingTable(action) {
  try {
    const res = yield call(apiBookingTable.createBookingTable, action.payload)
    yield put(actions.addBookingTableSuccess(res.data))
    let infoToken = common.decodeToken(get('accessToken'));
    const dataPushNoti = {
      "title": "Đặt bàn",
      "content": `Vừa có 1 yêu cầu cầu đặt bàn`,
      "action": "reservation",
      "type_notification": "1",
      "link": "",
      "body_data": {
        action: "reservation",
        booking_id: res.data.data && res.data.data.id,
      },
      "topic": `partner_${infoToken.partner_id}`,
      "list_user": [
        ""
      ],
      "is_push_noti": "1"
    }
    yield call(addNofitication, { data: dataPushNoti })
    yield action.payload.call_Success();
  } catch (error) {
    console.log(error);
    yield action.payload.call_Error();
    yield put(actions.addBookingTableFail(error))
  }
}

function* handleEditBookingTable(action) {
  try {
    const res = yield call(apiBookingTable.updateBooking, action.payload)
    yield put(actions.editBookingTableSuccess(res.data))
    yield actions.getListBookingTable()
    yield action.payload.call_Success();
  } catch (error) {
    yield action.payload.call_Error();
    yield put(actions.editBookingTableFail(error))
  }
}

function* handleGetListTableStatus(action) {
  try {
    const res = yield call(apiOrder.getTableStatus, action.payload)
    yield put(actions.getListTableStatusSuccess(res.data))
    yield action.payload.callBack();
  } catch (error) {
    yield put(actions.getListTableStatusFail(error))
  }
}

function* handleGetListArea(action) {
  try {
    const res = yield call(apiArea.getAreaList, action.payload)
    yield put(actions.getListAreaSuccess(res.data))
  } catch (error) {
    yield put(actions.getListAreaFail(error))
  }
}
/**
 * sort table for booking
 * @param {*} action
 */
function* handleSortTableBooking(action) {
  try {
    yield call(apiBookingTable.postTableBooking, action.payload)
    yield actions.getListBookingTable()
  } catch (error) {
    console.log("error", error)
  }
}

function* updateStatusBooking(action) {
  try {
    const data = yield call(apiBookingTable.updateStatusBooking, action.payload)
    yield put(actions.updateStatusBookingSuccess(data))
    yield action.payload.showSuccess()
  } catch (error) {
    console.log("error", error)
  }
}


/**
 * get list table of this booking
 * @param {*} action
 */
function* handleGetListTableBooking(action) {
  try {
    const res = yield call(apiBookingTable.getListTableOfBooking, action.payload)
    yield put(actions.getListTableBookingSuccess(res.data))
  } catch (error) {
    yield put(actions.getListTableBookingFail(error))
  }
}
/**
 * get list area by parner_id
 * @param {*} action
 */
function* handleGetListAreaByParnerId(action) {
  try {
    const res = yield call(apiArea.getAreaListByParnerId, action.payload)
    yield put(actions.getListAreaByParnerIdSuccess(res.data))
  } catch (error) {
    yield put(actions.getListAreaByParnerIdFail(error))
  }
}

/**
 * Cập nhật booking table khi có notification
 */

function* handleUpdateBookingTableByNoti(action) {
  try {
    const booking_id = action.payload?.data?.booking_id;
    if (booking_id) {
      const res = yield call(apiBookingTable.getBookingById, { booking_id: booking_id })
      yield put(actions.updateListBooking({ data: res.data?.data, booking_id: booking_id }));
    }
  } catch (error) {
  }
}


function* getListBooking() {
  yield takeEvery(actions.getListBookingTable, handleGetListBookingTable)
}
function* getBookingById() {
  yield takeEvery(actions.getBookingById, handleGetBookingById)
}
function* addBooking() {
  yield takeEvery(actions.addBookingTable, handleAddBookingTable)
}
function* editBooking() {
  yield takeEvery(actions.editBookingTable, handleEditBookingTable)
}
function* getTableStatus() {
  yield takeEvery(actions.getListTableStatus, handleGetListTableStatus)
}
function* getListArea() {
  yield takeEvery(actions.getListArea, handleGetListArea)
}
function* updateStatus() {
  yield takeEvery(actions.updateStatusBooking, updateStatusBooking)
}
function* sortTableBooking() {
  yield takeEvery(actions.sortTableBooking, handleSortTableBooking)
}
function* getTableBooking() {
  yield takeEvery(actions.getListTableBooking, handleGetListTableBooking)
}
function* getListAreaByParnerId() {
  yield takeEvery(actions.getListAreaByParnerId, handleGetListAreaByParnerId)
}
function* updateBookingTableByNoti() {
  yield takeEvery(actions.updateBookingTableById, handleUpdateBookingTableByNoti)
}
export default [
  getListBooking,
  addBooking,
  getBookingById,
  editBooking,
  getTableStatus,
  getListArea,
  updateStatus,
  sortTableBooking,
  getTableBooking,
  getListAreaByParnerId,
  updateBookingTableByNoti,
]