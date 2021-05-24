import { call, put, takeEvery, delay } from "redux-saga/effects";
// import { push } from "connected-react-router";
import * as actions from "../actions";
import * as CONSTS from "./../constants";
import apiArea from "../../../api/area";
import * as apiTableType from "../../../api/tableType";
import * as apiTable from "../../../api/table";
import * as apiUpload from "../../../api/uploadFile";
import * as apiPartner from "../../../api/partner";
import * as apiPartnerSeting from "../../../api/partnerSetting";
import Swal from "../../../utils/sweetalert2";


function* handleGetAreaList(action) {
  try {
    const res = yield call(apiArea.getAreaList, action.payload);
    yield put(actions.getAreaListSuccess(res.data));
  } catch (err) {
    yield put(actions.getAreaListFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.response.data.error.internal_message
    });
  }
}

function* handleGetTableType(action) {
  try {
    const res = yield call(apiTableType.getTableType, action.payload);
    yield put(actions.setNoSearching());
    yield put(actions.getTableTypeSuccess(res.data));
  } catch (err) {
    yield put(actions.getTableTypeFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Oops...",
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
      title: "Oops...",
      text: err.response.data.error.internal_message
    });
  }
}

function* handleGetTableListAll(action) {
  try {
    const res = yield call(apiTable.getTableListAll, action.payload);
    yield put(actions.getTableListAllSuccess(res.data));
  } catch (err) {
    yield put(actions.getTableListAllFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.response.data.error.internal_message
    });
  }
}

function* handleCreateTable(action) {
  try {
    const { searchByName, searchByArea, data } = action.payload;
    const resTable = yield call(apiTable.createTable, { data });
    yield put(actions.createTableSuccess(resTable.data));
    yield put(actions.getTableListAll())
    yield put(actions.setPage(1));
    yield put(actions.searchTable({ searchByName, searchByArea }));
    yield action.payload.addSuccess()
  } catch (err) {
    yield put(actions.createTableFail(err.response));
    Swal.fire({
      icon: "error",
      title: err.message,
      text: err.response.data.error.internal_message
    });
  }
}

function* handleDeleteTable(action) {
  try {
    yield call(apiTable.deleteTable, action.payload);
    yield put(actions.deleteTableSuccess(action.payload));
    yield action.payload.deleteSuccess(action.payload)
    yield put(actions.setPage(1));
    const { searchByName, searchByArea } = action.payload;
    yield put(actions.searchTable({ searchByName, searchByArea }));
  } catch (err) {
    yield put(actions.deleteTableFail(err.response));
    Swal.fire({
      icon: "error",
      title: '',
      text: err.response.data.error.internal_message,
    });
  }
}

function* handleEditTable(action) {
  try {
    // table_imgsTemp = table_imgsTemp.concat(imgsTemp);
    // table_imgs = table_imgs.concat(imgs);
    // const data = { ...action.payload.data, table_imgs };
    // const dataTemp = { ...action.payload.data, table_imgs: [...table_imgsTemp] }
    yield call(apiTable.editTable, {
      data: action.payload.data,
      table_id: action.payload.table_id,
    });

    // yield put(actions.editTableSuccess({ data: { ...dataTemp, id: action.payload.table_id } }));
    yield action.payload.editSuccess();
    yield put(actions.setPage(1));
    const { searchByName, searchByArea } = action.payload;
    yield put(actions.searchTable({ searchByName, searchByArea }));
  } catch (err) {
    yield put(actions.editTableFail(err.response));
    Swal.fire({
      icon: "error",
      title: err.message,
      text: err.response.data.error.internal_message
    });
  }
}

function* handleGetTableIcon(action) {
  try {
    const res = yield call(apiTable.getTableIcon, action.payload);
    yield put(actions.getTableIconSuccess(res.data));
  } catch (err) {
    yield put(actions.getTableIconFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.response.data.error.internal_message
    });
  }
}

function* handleSearchTable(action) {
  const { searchByName, searchByArea } = action.payload;
  try {
    const res = yield call(apiTable.searchTable, { area_id: searchByArea, name_search: searchByName });
    yield put(actions.setSearching(action.payload));
    yield put(actions.searchTableSuccess(res.data));
  } catch (err) {
    yield put(actions.searchTableFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.response.data.error.internal_message
    });
  }
}

function* handleLoadTableShape(action) {
  try {
    yield delay(200);
    yield put(actions.unLoadTableShape());
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.response.data.error.internal_message
    });
  }
}

function* handleGetInfoPartner(action) {
  try {
    const res = yield call(apiPartner.getPartnerById, action.payload);
    yield put(actions.getInfoPartnerSuccess(res.data));
  } catch (err) {
    yield put(actions.getInfoPartnerFail());
  }
}

function* handleGetInfoPartnerSetting(action) {
  try {
    const res = yield call(apiPartnerSeting.getPartnerSetting, action.payload);
    yield put(actions.getInfoPartnerSettingSuccess(res.data));
  } catch (err) {
    yield put(actions.getInfoPartnerSettingFail());
  }
}

/**
 * Hàm cập nhật lại dữ liệu bar khi có notification liên quan đến dữ liệu bar
 */
 function* handleUpdateTableByNoti(action) {
   try {
  } catch (err) {
  }
}
//////////////////////////////////////////////////////
// attach to Watcher

function* getAreaList() {
  yield takeEvery(actions.getAreaList, handleGetAreaList);
}

function* getTableType() {
  yield takeEvery(actions.getTableType, handleGetTableType);
}

function* getTableList() {
  yield takeEvery(actions.getTableList, handleGetTableList);
}

function* getTableListAll() {
  yield takeEvery(actions.getTableListAll, handleGetTableListAll);
}

function* createTable() {
  yield takeEvery(actions.createTable, handleCreateTable);
}

function* deleteTable() {
  yield takeEvery(actions.deleteTable, handleDeleteTable);
}

function* editTable() {
  yield takeEvery(actions.editTable, handleEditTable);
}

function* getTableIcon() {
  yield takeEvery(actions.getTableIcon, handleGetTableIcon);
}

function* searchTable() {
  yield takeEvery(actions.searchTable, handleSearchTable);
}

function* loadTableShape() {
  yield takeEvery(actions.loadTableShape, handleLoadTableShape);
}

function* getInfoPartner() {
  yield takeEvery(actions.getInfoPartner, handleGetInfoPartner);
}

function* getInfoPartnerSetting() {
  yield takeEvery(actions.getInfoPartnerSetting, handleGetInfoPartnerSetting);
}

function* updateTableByNoti() {
  yield takeEvery(actions.updateTableByNoti, handleUpdateTableByNoti);
}

export default [
  getAreaList,
  getTableType,
  getTableList,
  createTable,
  deleteTable,
  editTable,
  getTableIcon,
  searchTable,
  loadTableShape,
  getTableListAll,
  getInfoPartner,
  getInfoPartnerSetting,
  updateTableByNoti,
];
