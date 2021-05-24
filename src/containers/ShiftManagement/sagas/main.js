import { call, put, takeEvery } from "redux-saga/effects";
import * as apiShift from "../../../api/shift";
import * as actions from "../actions"

function* handleGetListShift(action) {
  try {
    const res = yield call(apiShift.getListShift, action.payload)
    yield put(actions.getListShiftSuccess(res.data))
  } catch (error) {
    return error;
  }
}
function* handleAddShift(action) {
  try {
    const res = yield call(apiShift.createShift, action.payload)
    yield put(actions.addShiftSuccess(res.data))
    yield action.payload.addSuccess()
  } catch (error) {
    yield put(actions.addShiftFail(error))
    yield action.payload.addError()
  }
}
function* handleEditShift(action) {
  try {
    const res = yield call(apiShift.editShift, action.payload)
    yield put(actions.editShiftSuccess(res.data))
    yield action.payload.editSuccess()
  } catch (error) {
    yield put(actions.editShiftFail(error))
    yield action.payload.editError()
  }
}

function* handleDeleteShift(action) {
  try {
    yield call(apiShift.deleteShift, action.payload)
    yield put(actions.getListShift())
    yield action.payload.deltSuccess()
  } catch (error) {
    yield action.payload.deltError()
    return error
  }
}
function* listShift() {
  yield takeEvery(actions.getListShift, handleGetListShift)
}

function* addShift() {
  yield takeEvery(actions.addShift, handleAddShift)
}

function* editShift() {
  yield takeEvery(actions.editShift, handleEditShift)
}

function* deleteShift() {
  yield takeEvery(actions.deleteShift, handleDeleteShift)
}
export default [
  listShift,
  addShift,
  editShift,
  deleteShift
]