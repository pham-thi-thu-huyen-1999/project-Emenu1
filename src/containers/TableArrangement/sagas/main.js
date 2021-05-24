import { call, put, takeEvery } from "redux-saga/effects";
// import { push } from "connected-react-router";
import * as actions from "../actions";

import apiArea from "../../../api/area";
import * as apiTable from "../../../api/table";
import Swal from "../../../utils/sweetalert2";
import _ from 'lodash';


function* handleGetAreaInfo(action) {
  try {
    const res = yield call(apiArea.getAreaInfo, action.payload);
    yield put(actions.getAreaInfoSuccess(res.data));
  } catch (err) {
    yield put(actions.getAreaInfoFail(err.response));
    Swal.fire({
      icon: "error",
      title: "",
      text: err.response.data.error.internal_message
    });
  }
}

function* handleGetTableList(action) {
  try {
    const res = yield call(apiTable.getTableList, action.payload);
    yield put(actions.getTableListSuccess(res.data));
  } catch (err) {
    yield put(actions.getTableListFail(err.response));
    Swal.fire({
      icon: "error",
      title: "",
      text: err.response.data.error.internal_message
    });
  }
}

function* handleGetTableListAreaById(action) {
  try {
    const res = yield call(apiTable.getListTableArrangeByAreaId, action.payload);
    const res2 = yield call(apiArea.getTableListArragementById, action.payload);
    let allTable = res.data.data
    let arrangeTable = [];
    if(res2.data.data !== null){
      arrangeTable = arrangeTable.concat(res2.data.data.table_infos);
      res2.data.data.area_arranges.map(item=>{
        arrangeTable = arrangeTable.concat(item.table_infos);
      })
    }
    const result = allTable.filter(item=>{
      return arrangeTable.find(itemArrange=>{
        return itemArrange.table_id === item.id
      }) === undefined && item.is_active === 1
    })
    yield put(actions.getTableListByAreaIdSuccess(result));
  } catch (err) {
    yield put(actions.getTableListByAreaIdFail(err.response));
    Swal.fire({
      icon: "error",
      title: "",
      text: err.response.data.error.internal_message
    });
  }
}

function* handleGetTableListArrangementById(action) {
  try {
    const res = yield call(apiArea.getTableListArragementById, action.payload);
    yield put(actions.getTableListArrangementByIdSuccess(res.data));
  } catch (err) {
    yield put(actions.getTableListArrangementByIdFail(err.response));
    Swal.fire({
      icon: "error",
      title: "",
      text: err.response.data.error.internal_message
    });
  }
}
function* handlePostTableListArrangementById(action){
  try {
    const res= yield call(apiArea.postTableListArrangementById,{params: action.payload.data, areaId: action.payload.areaId})
    yield put(actions.postTableListArrangementByIdSuccess(res.data))
    Swal.fire({
      icon: "success",
      title: "Thành công",
      text: "Sơ đồ bàn đã được lưu!"
    })
  } catch (err) {
    yield put(actions.postTableListArrangementByIdFail(err.response));
    Swal.fire({
      icon: "error",
      title: "",
      text: err.response.data.error.internal_message
    })
  }
}


function* handleEditArea(action) {
  try {
    const res = yield call(apiArea.editArea, { params: action.payload.dataArea, areaId: action.payload.areaId });
    yield put(actions.editAreaSuccess(res.data));    
  } catch (err) {
    yield put(actions.editAreaFail(err.response));
    Swal.fire({
      icon: "error",
      title: "",
      text: err.response.data.error.internal_message
    })
  }
}
function* handleGetAreaIcon() {
  try {
    const res = yield call(apiArea.getAreaIcon);
    yield put(actions.getAreaIconSuccess(res.data));
  } catch (err) {
    yield put(actions.getAreaIconFail(err.response));
    Swal.fire({
      icon: "error",
      title: "",
      text: err.response.data.error.internal_message
    })
  }
}



//////////////////////////////////////////////////////
// attach to Watcher

function* getAreaIcon() {
  yield takeEvery(actions.getAreaIcon, handleGetAreaIcon);
}

function* getAreaInfo() {
  yield takeEvery(actions.getAreaInfo, handleGetAreaInfo);
}

function* getTableList() {
  yield takeEvery(actions.getTableList, handleGetTableList);
}
function* getTableListAreaById(){
  yield takeEvery(actions.getTableListByAreaId,handleGetTableListAreaById)
}
function* getTableListArrangementById() {
  yield takeEvery(actions.getTableListArrangementById, handleGetTableListArrangementById);
}
function* postTableListArrangementById(){
  yield takeEvery(actions.postTableListArrangementById,handlePostTableListArrangementById)
}
function* editArea() {
  yield takeEvery(actions.editArea, handleEditArea);
}

export default [
  getAreaInfo,
  getTableList,
  getTableListArrangementById,
  postTableListArrangementById,
  getTableListAreaById,
  getAreaIcon,
  editArea,
];
