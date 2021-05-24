import { call, put, takeEvery } from "redux-saga/effects";
import { fork, all } from "redux-saga/effects"
import * as actions from './actions';

import { getOrderDetailById } from '../../api/order';
import { getPartnerById } from '../../api/partner';

function* handleGetOrderDetail(action) {
  try {
    const data = yield call(getOrderDetailById, action.payload);
    yield put(actions.getOrderDetailSuccess({orderDetail: data.data.data}));
  } catch (error) {
    yield put(actions.getOrderDetailFailure(error));
  }
}
/**
 * get info partner
 * @param {*} action
 */
function* handleGetInfoPartner(action) {
  try {
    const data = yield call(getPartnerById, action.payload);
    yield put(actions.getInfoPartnerSuccess({partnerInfo: data.data.data}));
  } catch (error) {
    yield put(actions.getInfoPartnerFail(error));
  }
}
// Watch actions
function* getOrderDetail() {
  yield takeEvery(actions.getOrderDetail, handleGetOrderDetail)
}

function* getInfoPartner() {
  yield takeEvery(actions.getInfoPartner, handleGetInfoPartner)
}
const sagas = [
  getOrderDetail,
  getInfoPartner
];

export default function* rootSaga() {
  yield all([...sagas.map(saga => fork(saga))])
}