import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "../actions";
import * as apiAddon from "../../../api/addon";
import * as apipartnerSetting from "../../../api/partnerSetting";

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

function* handleDeleteAddon(action) {
  try {
    yield call(apiAddon.deleteAddon, action.payload);
    yield put(actions.getAddonList({ data: { ...action.payload.dataGetAddons }}));
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.deleteAddonFail(err.response));
    yield action.payload.callback_fail();
  }
}

function* handleCreateAddon(action) {
  try {
    yield call(apiAddon.createAddon, action.payload);
    yield put(actions.getAddonList({ data: { ...action.payload.dataGetAddons }}));
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.createAddonFail(err.response));
    yield action.payload.callback_fail();
  }
}

function* handleEditAddon(action) {
  try {
    yield call(apiAddon.editAddon, action.payload);
    yield put(actions.getAddonList({ data: { ...action.payload.dataGetAddons }}));
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.editAddonFail(err.response));
    yield action.payload.callback_fail();
  }
}


function* startLoading(action) {
  yield put(actions.startLoading());
}

function* handleGetInfoVatSetting(action) {
  try {
    const res = yield call(apipartnerSetting.getInfoVatSetting, action.payload);
    yield put(actions.getInfoVatSettingSuccess(res.data));
  } catch (err) {
    yield put(actions.getInfoVatSettingFail(err.response));
  }
}

//////////////////////////////////////////////////////
// attach to Watcher

function* getAddonList() {
  yield takeEvery(actions.getAddonList, handleGetAddonList);
}

function* deleteAddon() {
  yield takeEvery(actions.deleteAddon, handleDeleteAddon);
}

function* createAddon() {
  yield takeEvery(actions.createAddon, handleCreateAddon);
}

function* editAddon() {
  yield takeEvery(actions.editAddon, handleEditAddon);
}

function* getVatSetting() {
  yield takeEvery(actions.getInfoVatSetting, handleGetInfoVatSetting);
}

export default [
  getAddonList,
  deleteAddon,
  createAddon,
  editAddon,
  startLoading,
  getVatSetting
];
