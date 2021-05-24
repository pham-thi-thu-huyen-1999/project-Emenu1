import { call, put, takeEvery } from "redux-saga/effects";
// import { push } from "connected-react-router";
import * as actions from "../actions";

import * as apiItem from "../../../api/item";
import * as apiUnitItem from "../../../api/unitItem";
import * as apiCategoryItem from "../../../api/categoryItem";
import * as apiUploadFile from "../../../api/uploadFile";
import * as apipartnerSetting from "../../../api/partnerSetting";
import * as apiAddon from "../../../api/addon";

function* handleGetItemListBySearchAdvanced(action) {
  try {
    let temp = {};
    const res = yield call(apiItem.getItemListBySearchAdvanced, action.payload);
    temp = {
      data: res.data.data,
      page: action.payload.page,
      total: res.data.total
    };
    yield put(actions.getItemListBySearchAdvancedSuccess(temp));
  } catch (err) {
    yield put(actions.getItemListBySearchAdvancedFail(err.response));
  }
}

function* handleDeleteItem(action) {
  try {
    yield call(apiItem.deleteItem, action.payload);
    yield put(actions.deleteItemSuccess(action.payload));
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.deleteItemFail(err.response));
    yield action.payload.callback_fail();
  }
}

function* handleCreateItem(action) {
  try {
    yield call(apiItem.createItem, action.payload);
    yield action.payload.callback_success();
    yield put(actions.getItemListBySearchAdvanced({ page: 1, limit: 20 }))
  } catch (err) {
    // yield put(actions.createItemFail(err.response));
    yield action.payload.callback_fail();
  }
}

function* handleEditItem(action) {
  try {
    yield call(apiItem.editItem, action.payload);
    yield put(actions.editItemSuccess(action.payload));
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.editItemFail(err.response));
    yield action.payload.callback_fail();
  }
}


function* startLoading(action) {
  yield put(actions.startLoading());
}


function* handleGetUnitItemList(action) {
  try {
    const res = yield call(apiUnitItem.getUnitItemList, action.payload);
    yield put(actions.getUnitItemListSuccess(res.data));
  } catch (err) {
    yield put(actions.getUnitItemListFail(err.response));
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

function* handleGetGenerateById(action) {
  try {
    const res = yield call(apiItem.getGenerateById, action.payload);
    yield put(actions.getGenerateByIdSuccess(res.data));
    yield action.payload.callback();
  } catch (err) {
    yield put(actions.getGenerateByIdFail(err.response));
  }
}

// function* handleGetInfPartnerSetting(action) {
//   try {
//     const res = yield call(apipartnerSetting.getPartnerSetting, action.payload);
//     yield put(actions.getGenerateByIdSuccess(res.data));
//     yield action.payload.callback();
//   } catch (err) {
//     yield put(actions.getGenerateByIdFail(err.response));
//   }
// }

function* handleGetInfoVatSetting(action) {
  try {
    const res = yield call(apipartnerSetting.getInfoVatSetting, action.payload);
    yield put(actions.getInfoVatSettingSuccess(res.data));
  } catch (err) {
    yield put(actions.getInfoVatSettingFail(err.response));
  }
}

function* handleGetAddonList(action) {
  try {
    const res = yield call(apiAddon.getAddonList, action.payload);
    const dataResponse = {
      data: res.data.data,
      page: action.payload.data.page,
      total: res.data.total
    };
    yield put(actions.getAddonListSuccess(dataResponse));
  } catch (err) {
    yield put(actions.getAddonListFail(err.response));
    console.log(err);
  }
}

//////////////////////////////////////////////////////
// attach to Watcher

function* getItemListBySearchAdvanced() {
  yield takeEvery(actions.getItemListBySearchAdvanced, handleGetItemListBySearchAdvanced);
}

function* deleteItem() {
  yield takeEvery(actions.deleteItem, handleDeleteItem);
}

function* createItem() {
  yield takeEvery(actions.createItem, handleCreateItem);
}

function* editItem() {
  yield takeEvery(actions.editItem, handleEditItem);
}

function* getUnitItemList() {
  yield takeEvery(actions.getUnitItemList, handleGetUnitItemList);
}

function* getCategoryItemList() {
  yield takeEvery(actions.getCategoryItemList, handleGetCategoryItemList);
}

function* getGenerateById() {
  yield takeEvery(actions.getGenerateById, handleGetGenerateById);
}

function* getVatSetting() {
  yield takeEvery(actions.getInfoVatSetting, handleGetInfoVatSetting);
}

function* getAddonList() {
  yield takeEvery(actions.getAddonList, handleGetAddonList);
}

export default [
  getItemListBySearchAdvanced,
  deleteItem,
  createItem,
  editItem,
  getUnitItemList,
  getCategoryItemList,
  getGenerateById,
  startLoading,
  getVatSetting,
  getAddonList,
];
