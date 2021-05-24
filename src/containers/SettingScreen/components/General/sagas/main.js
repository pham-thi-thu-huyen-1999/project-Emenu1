import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "../actions";
import * as apiPartnerSetting from "../../../../../api/partnerSetting";
import * as apiPartner from "../../../../../api/partner";
import * as apiCurrency from "../../../../../api/currency";

function* handleGetPartnerSetting(action) {
  try {
    const res = yield call(apiPartnerSetting.getPartnerSetting, action.payload);
    yield put(actions.getPartnerSettingSuccess(res.data));
  } catch (err) {
    yield put(actions.getPartnerSettingFail(err.reponse));
  }
}

function* handleUpdatePartnerSetting(action) {
  try {
    yield call(apiPartnerSetting.updatePartnerSetting, action.payload);
    yield put(actions.updatePartnerSettingSuccess(action.payload));
    yield action.payload.showSuccess(action.payload.data);
  } catch (err) {
    yield put(actions.updatePartnerSettingFail(err.reponse));
    yield action.payload.showErr();
  }
}

function* handleGetPartnerById(action) {
  try {
    const res = yield call(apiPartner.getPartnerById, action.payload);
    yield put(actions.getPartnerByIdSuccess(res.data));
  } catch (err) {
    yield put(actions.getPartnerByIdFail(err.response));
  }
}

function* handleGetCurrencyUnit(action) {
  try {
    const res = yield call(apiCurrency.getCurrencyUnit, action.payload);
    yield put(actions.getCurrencyUnitSuccess(res.data));
  } catch (err) {
    yield put(actions.getCurrencyUnitFail(err.reponse));
  }
}

function* getPartnerSetting() {
  yield takeEvery(actions.getPartnerSetting, handleGetPartnerSetting);
}

function* updatePartnerSetting() {
  yield takeEvery(actions.updatePartnerSetting, handleUpdatePartnerSetting);
}

function* getPartnerById() {
  yield takeEvery(actions.getPartnerById, handleGetPartnerById);
}

function* getCurrencyUnit() {
  yield takeEvery(actions.getCurrencyUnit, handleGetCurrencyUnit);
}

export default [
  getPartnerSetting,
  updatePartnerSetting,
  getPartnerById,
  getCurrencyUnit,
];
