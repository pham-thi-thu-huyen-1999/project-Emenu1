import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "../actions";
import * as apiPartnerSetting from "../../../api/partnerSetting";
import * as apiReport from "../../../api/report";

function* handleGetPartnerSetting(action) {
  try {
    const res = yield call(apiPartnerSetting.getPartnerSetting, action.payload);
    yield put(actions.getPartnerSettingSuccess(res.data));
  } catch (err) {
    yield put(actions.getPartnerSettingFail(err.reponse));
  }
}

function* handleGetReportOverview(action) {
  try {
    const res = yield call(apiReport.getReportOverview, action.payload);
    yield put(actions.getReportOverviewSuccess(res.data));
  } catch (err) {
    yield put(actions.getReportOverviewFail(err.reponse));
  }
}

function* getPartnerSetting() {
  yield takeEvery(actions.getPartnerSetting, handleGetPartnerSetting);
}

function* getReportOverview() {
  yield takeEvery(actions.getReportOverview, handleGetReportOverview);
}


export default [
  getPartnerSetting,
  getReportOverview,
];
