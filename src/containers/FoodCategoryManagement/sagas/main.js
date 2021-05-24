import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "../actions";
import * as apiCategoryItem from "../../../api/categoryItem";

function* handleGetCategoryItemList(action) {
  try {
    const res = yield call(apiCategoryItem.getCategoryItemList, action.payload);
    yield put(actions.getCategoryItemListSuccess(res.data));
  } catch (err) {
    yield put(actions.getCategoryItemListFail(err.response));
  }
}

function* handleCreateCategoryItem(action) {
  try {
    const res = yield call(apiCategoryItem.createCategoryItem, action.payload);
    yield put(actions.createCategoryItemSuccess(action.payload));
    yield put(actions.getCategoryItemList())
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.createCategoryItemFail(err.response));
    yield action.payload.callback_fail();
  }
}

function* handleDeleteCategoryItem(action) {
  try {
    yield call(apiCategoryItem.deleteCategoryItem, action.payload);
    yield put(actions.deleteCategoryItemSuccess(action.payload));
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.deleteCategoryItemFail(err.response));
    yield action.payload.callback_fail();
  }
}

function* handleEditCategoryItem(action) {
  try {
    const res = yield call(apiCategoryItem.editCategoryItem, action.payload);
    yield put(actions.editCategoryItemSuccess(res.data));
    yield put(actions.getCategoryItemList())
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.editCategoryItemFail(err.response));
    yield action.payload.callback_fail();
  }
}

//////////////////////////////////////////////////////
// attach to Watcher

function* getCategoryItemList() {
  yield takeEvery(actions.getCategoryItemList, handleGetCategoryItemList);
}

function* createCategoryItem() {
  yield takeEvery(actions.createCategoryItem, handleCreateCategoryItem);
}

function* deleteCategoryItem() {
  yield takeEvery(actions.deleteCategoryItem, handleDeleteCategoryItem);
}

function* editCategoryItem() {
  yield takeEvery(actions.editCategoryItem, handleEditCategoryItem);
}

export default [
  getCategoryItemList,
  editCategoryItem,
  createCategoryItem,
  deleteCategoryItem,
];
