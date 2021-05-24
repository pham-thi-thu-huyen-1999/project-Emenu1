import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "../actions";
import * as apiSetting from "../../../api/vatSetting"
import * as apiPartner from "../../../api/partner";
import * as apiPrinterBill from "../../../api/printerBill";
import * as apiPrinterChickenBar from "../../../api/printerChickenBar";
/**
 * get info tax
 * @param {*} action
 */
function* handleGetInfoTaxSetting(action) {
  try {
    const res = yield call(apiSetting.getInfoTaxSetting, action.payload);
    yield put(actions.getInfoTaxSettingSuccess(res.data))
  } catch {
  }
}
/**
 * update info tax
 * @param {*} action
 */
function* handleUpdateInfoTaxSetting(action) {
  try {
    yield call(apiSetting.updateInfoTaxSetting, action.payload);
    yield action.payload.showSuccess();
    yield put(actions.getInfoTaxSetting());
  } catch (error) {
    yield action.payload.showErr();
    return error;
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

/**
 * Printer Bill - Thu Ngan
 */
function* handleGetPrinterBillList(action) {
  try {
    const res = yield call(apiPrinterBill.getPrinterBillList, action.payload);
    yield put(actions.getPrinterBillListSuccess(res.data));
  } catch (err) {
    yield put(actions.getPrinterBillListFail(err.response));
  }
}

function* handleGetPrinterBillById(action) {
  try {
    const res = yield call(apiPrinterBill.getPrinterBillById, action.payload);
    yield put(actions.getPrinterBillByIdSuccess(res.data));
  } catch (err) {
    yield put(actions.getPrinterBillByIdFail(err.response));
  }
}

function* handleCreatePrinterBill(action) {
  try {
    const res = yield call(apiPrinterBill.createPrinterBill, action.payload);
    yield put(actions.createPrinterBillSuccess(action.payload));
    yield put(actions.getPrinterBillList())
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.createPrinterBillFail(err.response));
    yield action.payload.callback_fail();
  }
}

function* handleDeletePrinterBill(action) {
  try {
    yield call(apiPrinterBill.deletePrinterBill, action.payload);
    yield put(actions.deletePrinterBillSuccess(action.payload));
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.deletePrinterBillFail(err.response));
    yield action.payload.callback_fail();
  }
}

function* handleEditPrinterBill(action) {
  try {
    const res = yield call(apiPrinterBill.editPrinterBill, action.payload);
    yield put(actions.editPrinterBillSuccess(res.data));
    yield put(actions.getPrinterBillList())
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.editPrinterBillFail(err.response));
    yield action.payload.callback_fail();
  }
}

/**
 * Printer Chicken Bar - Bep , Bar
 */
function* handleGetPrinterChickenBarList(action) {
  try {
    const res = yield call(apiPrinterChickenBar.getPrinterChickenBarList, action.payload);
    yield put(actions.getPrinterChickenBarListSuccess(res.data));
  } catch (err) {
    yield put(actions.getPrinterChickenBarListFail(err.response));
  }
}

function* handleGetPrinterChickenBarById(action) {
  try {
    const res = yield call(apiPrinterChickenBar.getPrinterChickenBarById, action.payload);
    yield put(actions.getPrinterChickenBarByIdSuccess(res.data));
  } catch (err) {
    yield put(actions.getPrinterChickenBarByIdFail(err.response));
  }
}

function* handleCreatePrinterChickenBar(action) {
  try {
    const res = yield call(apiPrinterChickenBar.createPrinterChickenBar, action.payload);
    yield put(actions.createPrinterChickenBarSuccess(action.payload));
    yield put(actions.getPrinterChickenBarList())
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.createPrinterChickenBarFail(err.response));
    yield action.payload.callback_fail();
  }
}

function* handleDeletePrinterChickenBar(action) {
  try {
    yield call(apiPrinterChickenBar.deletePrinterChickenBar, action.payload);
    yield put(actions.deletePrinterChickenBarSuccess(action.payload));
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.deletePrinterChickenBarFail(err.response));
    yield action.payload.callback_fail();
  }
}

function* handleEditPrinterChickenBar(action) {
  try {
    const res = yield call(apiPrinterChickenBar.editPrinterChickenBar, action.payload);
    yield put(actions.editPrinterChickenBarSuccess(res.data));
    yield put(actions.getPrinterChickenBarList())
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.editPrinterChickenBarFail(err.response));
    yield action.payload.callback_fail();
  }
}

function* getInfoTax() {
  yield takeEvery(actions.getInfoTaxSetting, handleGetInfoTaxSetting)
}

function* updateInfoTax() {
  yield takeEvery(actions.updateInfoTaxSetting, handleUpdateInfoTaxSetting)
}

function* getPartnerById() {
  yield takeEvery(actions.getPartnerById, handleGetPartnerById);
}

/**
 * Printer Bill - Thu Ngan
 */
function* getPrinterBillList() {
  yield takeEvery(actions.getPrinterBillList, handleGetPrinterBillList);
}

function* getPrinterBillById() {
  yield takeEvery(actions.getPrinterBillById, handleGetPrinterBillById);
}

function* createPrinterBill() {
  yield takeEvery(actions.createPrinterBill, handleCreatePrinterBill);
}

function* deletePrinterBill() {
  yield takeEvery(actions.deletePrinterBill, handleDeletePrinterBill);
}

function* editPrinterBill() {
  yield takeEvery(actions.editPrinterBill, handleEditPrinterBill);
}

/**
 * Printer Chicken Bar - Bep , Bar
 */
function* getPrinterChickenBarList() {
  yield takeEvery(actions.getPrinterChickenBarList, handleGetPrinterChickenBarList);
}

function* getPrinterChickenBarById() {
  yield takeEvery(actions.getPrinterChickenBarById, handleGetPrinterChickenBarById);
}

function* createPrinterChickenBar() {
  yield takeEvery(actions.createPrinterChickenBar, handleCreatePrinterChickenBar);
}

function* deletePrinterChickenBar() {
  yield takeEvery(actions.deletePrinterChickenBar, handleDeletePrinterChickenBar);
}

function* editPrinterChickenBar() {
  yield takeEvery(actions.editPrinterChickenBar, handleEditPrinterChickenBar);
}


export default [
  getInfoTax,
  updateInfoTax,
  getPartnerById,
  getPrinterBillList,
  editPrinterBill,
  createPrinterBill,
  deletePrinterBill,
  getPrinterChickenBarList,
  editPrinterChickenBar,
  createPrinterChickenBar,
  deletePrinterChickenBar,
  getPrinterChickenBarById,
  getPrinterBillById
];