import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "../actions";
import * as apiPromotion from "../../../api/promotion";
import * as apiItem from "../../../api/item";
import * as apiComboItem from "../../../api/comboItem";
import { LIMIT_PROMOTION } from "../../../consts/settings/promotion";

function* handleGetListPromotion(action) {
  try {
    const res = yield call(apiPromotion.getPromotionList, action.payload);
    yield put(actions.getListPromotionSuccess(res.data));
  } catch (err) {
    yield put(actions.getListPromotionFail(err.response));
  }
}

/**
 * get promotions search
 * @param {*} action
 */
function* handleGetListPromotionBySearch(action) {
  try {
    const res = yield call(apiPromotion.getListPromotionBySearch, action.payload);
    yield put(actions.getListPromotionBySearchSuccess(res.data));
  } catch (err) {
    yield put(actions.getListPromotionBySearchFail(err.response));
  }
}

function* handleDeletePromotion(action) {
  try {
    yield call(apiPromotion.deletePromotion, action.payload);
    yield action.payload.deleteSuccess()
    yield put(actions.setPage(1))
    yield put(actions.getListPromotion({ page: 1, limit: LIMIT_PROMOTION }))
  } catch (err) {
    return err
  }
}
/**
 * get list promotion discount
 */
function* handleGetListPromotionDiscount(action) {
  try {
    const res = yield call(apiPromotion.getListPromotionDiscount, action.payload);
    yield put(actions.getListPromotionDiscountSuccess(res.data));
  } catch (err) {
    yield put(actions.getListPromotionDiscountFail(err.response));
  }
}
/**
 * add promotion discount
 * @param {*} action
 */
function* handleAddPromotionDiscountBill(action) {
  try {
    const res = yield call(apiPromotion.createPromotionBillDetail, action.payload);
    yield put(actions.setPage(1))
    yield put(actions.addPromotionDiscountBillSuccess(res.data));
    yield action.payload.addSuccess()
    yield put(actions.getListPromotion({ page: 1, limit: LIMIT_PROMOTION }))
  } catch (err) {
    yield action.payload.addError()
    yield put(actions.addPromotionDiscountBillFail(err.response));
  }
}
/**
 * get promotion bill discount by id
 * @param {*} action
 */
function* handleGetPromotionBillDiscountDetail(action) {
  try {
    const res = yield call(apiPromotion.getPromotionBillDetailById, { data: action.payload })
    yield put(actions.getPromotionBillDiscountByIdSuccess(res.data))
    action.payload.callBack();
  } catch (error) {
    yield put(actions.getPromotionBillDiscountByIdFail(error))
  }
}
/**
 * get list promotion item detail
 * @param {*} action
 */
function* handleGetPromotionItemDiscountDetail(action) {
  try {
    const res = yield call(apiPromotion.getPromotionItemDetailById, { data: action.payload })
    yield put(actions.getPromotionItemDiscountByIdSuccess(res.data))
    action.payload.callBack();
  } catch (error) {
    yield put(actions.getPromotionItemDiscountByIdFail(error))
  }
}
/**
 * get list prom comboitem detail
 * @param {* } action
 */
function* handleGetPromotionComboItemDiscountDetail(action) {
  try {
    const res = yield call(apiPromotion.getPromotionComboItemDetailById, { data: action.payload })
    yield put(actions.getPromotionComboItemDiscountByIdSuccess(res.data))
    action.payload.callBack();
  } catch (error) {
    yield put(actions.getPromotionComboItemDiscountByIdFail(error.response))
  }
}
/**
 * get promotion voucher details
 */
function* handleGetPromotionVoucherDetails(action) {
  try {
    const res = yield call(apiPromotion.getPromotionVoucherDetailById, { data: action.payload })
    yield put(actions.getPromotionVoucherDiscountByIdSuccess(res.data))
    action.payload.callBack();
  } catch (error) {
    yield put(actions.getPromotionVoucherDiscountByIdFail(error))
  }
}

/**
 * add promotion discount by food
 * @param {*} action
 */
function* handleAddPromotionDiscountItem(action) {
  try {
    const res = yield call(apiPromotion.createPromotionItemDetail, action.payload);
    yield put(actions.setPage(1));
    yield put(actions.addPromotionDiscountItemSuccess(res.data));
    yield action.payload.addSuccess()
    yield put(actions.getListPromotion({ page: 1, limit: LIMIT_PROMOTION }))
  } catch (err) {
    yield action.payload.addError()
    yield put(actions.addPromotionDiscountItemFail(err.response));
  }
}

function* handleAddPromotionDiscountComboItem(action) {
  try {
    yield call(apiPromotion.createPromotionComboDetail, action.payload);
    yield put(actions.setPage(1));
    yield action.payload.addSuccess()
    yield put(actions.getListPromotion({ page: 1, limit: LIMIT_PROMOTION }))
  } catch (err) {
    yield action.payload.addError()
    yield put(actions.addPromotionDiscountComboItemFail(err.response));
  }
}
/**
 * add promotion discount voucher
 * @param {*} action
 */
function* handleAddPromotionDiscountVoucher(action) {
  try {
    const res = yield call(apiPromotion.createPromotionVoucherDetail, action.payload);
    yield put(actions.setPage(1));
    yield put(actions.addPromotionDiscountVoucherSuccess(res.data));
    yield action.payload.addSuccess()
    yield put(actions.getListPromotion({ page: 1, limit: LIMIT_PROMOTION }))
  } catch (err) {
    yield action.payload.addError()
    yield put(actions.addPromotionDiscountVoucherFail(err.response));
  }
}
/**
 * edit promotion discount bill
 */
function* handleEditPromotionDiscountBill(action) {
  try {
    const res = yield call(apiPromotion.editPromotionBillDetail, action.payload);
    yield put(actions.setPage(1))
    yield put(actions.getListPromotion({ page: 1, limit: LIMIT_PROMOTION }))
    yield action.payload.addSuccess()
  } catch (err) {
    yield action.payload.addError()
  }
}

function* handleEditPromotionDiscountItem(action) {
  try {
    yield call(apiPromotion.editPromotionItemDetail, action.payload);
    yield put(actions.setPage(1))
    yield action.payload.addSuccess()
    yield put(actions.getListPromotion({ page: 1, limit: LIMIT_PROMOTION }))
  } catch (err) {
    yield action.payload.addError()
  }
}

function* handleEditPromoDiscountComboItem(action) {
  try {
    const res = yield call(apiPromotion.editPromotionComboItemDetail, action.payload);
    yield put(actions.setPage(1));
    yield action.payload.addSuccess()
    yield put(actions.getListPromotion({ page: 1, limit: LIMIT_PROMOTION }))
  } catch (err) {
    yield action.payload.addError()
  }
}

function* handleEditPromoDiscountVoucher(action) {
  try {
    const res = yield call(apiPromotion.editPromotionVoucherDetail, action.payload);
    yield put(actions.setPage(1));
    yield action.payload.addSuccess()
    yield put(actions.getListPromotion({ page: 1, limit: LIMIT_PROMOTION }))
  } catch (err) {
    yield action.payload.addError()
  }
}
/**
 * get list item
 * @param {*} action
 */
function* handleGetListItem(action) {
  try {
    const res = yield call(apiItem.getItemList, action.payload);
    yield put(actions.getListItemSuccess(res.data));
  } catch (err) {
    yield put(actions.getListItemFail(err.response));
  }
}
/**
 * get list comboitem
 * @param {*} action
 */
function* handleGetListComboItem(action) {
  try {
    const res = yield call(apiComboItem.getComboList, action.payload);
    yield put(actions.getListComboItemSuccess(res.data));
  } catch (err) {
    yield put(actions.getListComboItemFail(err.response));
  }
}
function* getListPromotion() {
  yield takeEvery(actions.getListPromotion, handleGetListPromotion)
}
function* getListPromoBySearch() {
  yield takeEvery(actions.getListPromotionBySearch, handleGetListPromotionBySearch)
}
function* deletePromotion() {
  yield takeEvery(actions.deletePromotion, handleDeletePromotion)
}

function* getListPromotionDiscount() {
  yield takeEvery(actions.getListPromotionDiscount, handleGetListPromotionDiscount)
}

function* addPromotionDiscountBill() {
  yield takeEvery(actions.addPromotionDiscountBill, handleAddPromotionDiscountBill)
}

function* addPromotionDiscountItem() {
  yield takeEvery(actions.addPromotionDiscountItem, handleAddPromotionDiscountItem)
}

function* addPromotionDiscountComboItem() {
  yield takeEvery(actions.addPromotionDiscountComboItem, handleAddPromotionDiscountComboItem)
}

function* addPromotionVoucher() {
  yield takeEvery(actions.addPromotionDiscountVoucher, handleAddPromotionDiscountVoucher)
}

function* getListItem() {
  yield takeEvery(actions.getListItem, handleGetListItem)
}

function* getListComboItem() {
  yield takeEvery(actions.getListComboItem, handleGetListComboItem)
}

function* getPromotionBillDiscountDetail() {
  yield takeEvery(actions.getPromotionBillDiscountById, handleGetPromotionBillDiscountDetail)
}

function* getPromotionItemDiscountDetail() {
  yield takeEvery(actions.getPromotionItemDiscountById, handleGetPromotionItemDiscountDetail)
}

function* getPromotionComboItemDiscountDetail() {
  yield takeEvery(actions.getPromotionComboItemDiscountById, handleGetPromotionComboItemDiscountDetail)
}

function* getPromotionVoucherDiscountDetail() {
  yield takeEvery(actions.getPromotionVoucherDiscountById, handleGetPromotionVoucherDetails)
}

function* editPromotionDiscountBill() {
  yield takeEvery(actions.editPromoDiscountBill, handleEditPromotionDiscountBill)
}

function* editPromotionDiscountItem() {
  yield takeEvery(actions.editPromoDiscountItem, handleEditPromotionDiscountItem)
}

function* editPromotionDiscountComboItem() {
  yield takeEvery(actions.editPromoDiscountComboItem, handleEditPromoDiscountComboItem)
}

function* editPromotionDiscountVoucher() {
  yield takeEvery(actions.editPromoDiscountVoucher, handleEditPromoDiscountVoucher)
}

export default [
  getListPromotion,
  getListPromotionDiscount,
  addPromotionDiscountBill,
  getPromotionBillDiscountDetail,
  getListItem,
  addPromotionDiscountItem,
  getListComboItem,
  addPromotionDiscountComboItem,
  getPromotionItemDiscountDetail,
  getPromotionComboItemDiscountDetail,
  deletePromotion,
  addPromotionVoucher,
  getPromotionVoucherDiscountDetail,
  editPromotionDiscountBill,
  editPromotionDiscountItem,
  editPromotionDiscountComboItem,
  editPromotionDiscountVoucher,
  getListPromoBySearch
]