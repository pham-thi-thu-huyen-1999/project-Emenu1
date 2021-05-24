import { call, put, takeEvery } from "redux-saga/effects";
import { fork, all } from "redux-saga/effects"
import * as actions from './actions';

import areaApis from '../../api/area';


function* handleCreateNewArea(action) {
  try {
    yield call(areaApis.createArea, action.payload.params);
    if (action.payload.onSuccess) {
      yield action.payload.onSuccess();
    }
  } catch (error) {
    if (action.payload.onFailure) {
      yield action.payload.onFailure;
    }
  }
}

function* handleGetListArea(action) {
  try {
    const data = yield call(areaApis.getAreaList, action.payload);
    yield put(actions.getListAreaSuccess(data.data));
  } catch (error) {
    yield put(actions.getListAreaFailure(error));
  }
}

function* handleGetListAreaByPartner(action) {
  try {
    const data = yield call(areaApis.getAreaListByPartner, action.payload);
    yield put(actions.getListAreaByPartnerIdSuccess(data.data));
  } catch (error) {
    yield put(actions.getListAreaByPartnerIdFailure(error));
  }
}

function* handleGetAreaInfo(action) {
  try {
    const data = yield call(areaApis.getAreaInfo, action.payload);
    yield put(actions.getAreaInfoSuccess(data.data));
  } catch (error) {
    yield put(actions.getAreaInfoFailure(error));
  }
}

function* handleEditArea(action) {
  try {
    yield call(areaApis.editArea, {params: action.payload.params, areaId: action.payload.areaId});
    if (action.payload.onSuccess) {
      yield action.payload.onSuccess();
    }
  } catch (error) {
    if (action.payload.onFailure) {
      yield action.payload.onFailure();
    }
  }
}

function* handleDeleteArea(action) {
  try {
    yield call(areaApis.deleteArea, {areaId: action.payload.areaId});
    if (action.payload.onSuccess) {
      yield action.payload.onSuccess();
    }
    yield put(actions.deleteAreaSuccess({areaId: action.payload.areaId}));
  } catch (error) {
    if (action.payload.onFailure) {
      yield action.payload.onFailure();
    }
  }
}


// Watch actions
function* createArea() {
  yield takeEvery(actions.createArea, handleCreateNewArea)
}

function* getListArea() {
  yield takeEvery(actions.getListArea, handleGetListArea)
}

function* getAreaInfo() {
  yield takeEvery(actions.getAreaInfo, handleGetAreaInfo)
}

function* editArea() {
  yield takeEvery(actions.editArea, handleEditArea)
}

function* deleteArea() {
  yield takeEvery(actions.deleteArea, handleDeleteArea)
}


function* getListAreaByPartnerId() {
  yield takeEvery(actions.getListAreaByPartnerId, handleGetListAreaByPartner)
}

const sagas = [
  createArea,
  getListArea,
  getAreaInfo,
  editArea,
  deleteArea,
  getListAreaByPartnerId
];

export default function* rootSaga() {
  yield all([...sagas.map(saga => fork(saga))])
}