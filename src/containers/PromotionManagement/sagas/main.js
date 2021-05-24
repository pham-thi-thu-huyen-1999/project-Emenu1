import { call, put, takeEvery } from "redux-saga/effects";
// import { push } from "connected-react-router";
import * as actions from "../actions";
import Swal from "../../../utils/sweetalert2";
import * as apiPromotion from "../../../api/promotion";

function* handleGetPromotionList(action) {
  try {
    const res = yield call(apiPromotion.getPromotionList, action.payload);
    yield put(actions.getPromotionListSuccess(res.data));
  } catch (err) {
    yield put(actions.getPromotionListFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
}

function* handleCreatePromotion(action) {
  try {
    let res;
    switch (action.payload.data.type) {
      case 1:
        res = yield call(
          apiPromotion.createPromotionBillDetail,
          action.payload
        );
        break;
      case 2:
        res = yield call(
          apiPromotion.createPromotionItemDetail,
          action.payload
        );
        break;

      default:
        break;
    }
    yield put(actions.createPromotionSuccess(res.data));
    Swal.fire({
      icon: "success",
      title: "Success",
      showConfirmButton: true,
      timer: 1500,
    });
  } catch (err) {
    yield put(actions.createPromotionFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
}

function* handleEditPromotion(action) {
  try {
    let res;
    switch (action.payload.data.type) {
      case 1:
        res = yield call(apiPromotion.editPromotionBillDetail, action.payload);
        break;
      case 2:
        res = yield call(apiPromotion.editPromotionItemDetail, action.payload);
        break;
      default:
        break;
    }
    yield put(actions.editPromotionSuccess(res.data));
    Swal.fire({
      icon: "success",
      title: "Success",
      showConfirmButton: true,
      timer: 1500,
    });
  } catch (err) {
    yield put(actions.editPromotionFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
}

function* handleDeletePromotion(action) {
  try {
    yield call(apiPromotion.deletePromotion, action.payload);
    yield put(actions.deletePromotionSuccess(action.payload));
    Swal.fire({
      icon: "success",
      title: "Success",
      showConfirmButton: true,
      timer: 1500,
    });
  } catch (err) {
    yield put(actions.deletePromotionFail(err.response));
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
}

//////////////////////////////////////////////////////
// attach to Watcher

function* getPromotionList() {
  yield takeEvery(actions.getPromotionList, handleGetPromotionList);
}

function* createPromotion() {
  yield takeEvery(actions.createPromotion, handleCreatePromotion);
}

function* deletePromotion() {
  yield takeEvery(actions.deletePromotion, handleDeletePromotion);
}

function* editPromotion() {
  yield takeEvery(actions.editPromotion, handleEditPromotion);
}

export default [
  getPromotionList,
  createPromotion,
  deletePromotion,
  editPromotion,
];
