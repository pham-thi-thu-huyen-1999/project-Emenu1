import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "../actions";
import * as api from "../../../../../api/unitItem";

/**
 *
 * Call API get list item
 */
function* handleGetUnitItemList(action) {
  try {
    const res = yield call(api.getUnitItemList, action.payload);
    yield put(actions.getUnitItemListSuccess(res.data));
  } catch (error) {
    yield put(actions.getUnitItemListFail(error.response));
  }
}

/**
 *
 * Call API creat item
 */
function* handleCreateUnitItem(action) {
  try {
    yield call(api.createUnitItem, action.payload);
    const res = yield call(api.getUnitItemList, action.payload);
    yield put(actions.createUnitItemSuccess(res.data));
  } catch (error) {
    yield put(actions.createUnitItemFail(error.response));
  }
}

/**
 *
 * Call API edit item
 */
function* handleEditUnitItem(action) {

  try {
    const res = yield call(api.editUnitItem, action.payload)
    yield put(actions.editUnitItemSuccess(res.data))
  } catch (error) {
    yield put(actions.editUnitItemFail(error.response))
  }
}

/**
 *
 * Call API delete item
 */
function* handleDeleteItem(action) {
  try {
    const res = yield call(api.deleteUnitItem, action.payload);
    yield put(actions.deleteUnitItemSuccess(res.data));
  } catch (error) {
    yield put(actions.deleteUnitItemFail(error.response));
  }
}


function* GetUnitItemList() {
  yield takeEvery(actions.getUnitItemList, handleGetUnitItemList);
}

function* CreateUnitItem() {
  yield takeEvery(actions.createUnitItem, handleCreateUnitItem);
}

function* EditUnitItem() {
  yield takeEvery(actions.editUnitItem, handleEditUnitItem);
}

function* DeleteUnitItem() {
  yield takeEvery(actions.deleteUnitItem, handleDeleteItem);
}

export default [GetUnitItemList, CreateUnitItem, EditUnitItem, DeleteUnitItem];
