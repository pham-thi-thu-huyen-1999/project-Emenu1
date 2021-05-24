import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "../actions";
import api from "../../../../../api/area";

function* handleGetAreaList(action) {
  try {
    const res = yield call(api.getAreaList, action.payload);

    yield put(actions.getAreaListSuccess(res.data));
  } catch (error) {
    yield put(actions.getAreaListFail(error.response));
  }
}

function* handleCreateArea(action) {
  try {
    const res = yield call(api.createArea, action.payload);
    yield put(actions.createAreaSuccess(res.data));
  } catch (err) {
    yield put(actions.createAreaFail(err.response));
  }
}

function* handleEditArea(action) {
  try {
    const res = yield call(api.editArea, action.payload);
    yield put(actions.editAreaSuccess(res.data));
  } catch (err) {
    yield put(actions.editAreaFail(err.response));
  }
}

function* handleDeleteArea(action) {
  try {
    const res = yield call(api.deleteArea, action.payload);
    yield put(actions.deleteAreaSuccess(res.data));
  } catch (error) {
    yield put(actions.deleteAreaSuccess(error.response));
  }
}
//////////////////////////////////////////////////////
// attach to Watcher
function* GetAreaList() {
  yield takeEvery(actions.getAreaList, handleGetAreaList);
}

function* EditArea() {
  yield takeEvery(actions.editArea, handleEditArea);
}

function* DeleteArea() {
  yield takeEvery(actions.deleteArea, handleDeleteArea);
}

function* CreateArea() {
  yield takeEvery(actions.createArea, handleCreateArea);
}
export default [CreateArea, GetAreaList, DeleteArea, EditArea];
