import { call, put, takeEvery } from "redux-saga/effects";
import * as apiCombo from "../../../api/comboItem";
import * as apiItem from "../../../api/item";
import * as actions from "../actions";
import { LIMIT_COMBO_ITEM } from "../../../consts/settings/dish/dish"
import Swal from "../../../utils/sweetalert2";


function* handleGetComboList(action) {
    try {
        const res = yield call(apiCombo.getComboList, action.payload);
        const page = action.payload.page
        yield put(actions.getComboListSuccess({ data: res.data, page }));
    } catch (error) {
        yield put(actions.getComboListFail(error.response));
    }
}
function* handleGetComboItemById(action) {
    try {
        const res = yield call(apiCombo.getComboById, action.payload)
        yield put(actions.getComboByIdSuccess(res.data))
    } catch (error) {
        yield put(actions.getComboByIdFail(error.response))
    }
}
function* handleCreateCombo(action) {
    try {
        const data = { ...action.payload.data }
        const res = yield call(apiCombo.createCombo, { data });
        yield put(actions.createComboSuccess(res.data));
        yield put(actions.getComboList({ limit: LIMIT_COMBO_ITEM, page: data.page }))
        yield action.payload.call_success()
    } catch (error) {
        yield action.payload.call_fail()
        yield put(actions.createComboFail(error.response));
    }
}

function* handleUpdateCombo(action) {
    try {
        let data = { ...action.payload.data, combo_item_id: action.payload.combo_item_id }
        const resCombo = yield call(apiCombo.updateCombo, { data, combo_item_id: action.payload.combo_item_id })
        yield put(actions.editComboSuccess(resCombo.data))
        yield put(actions.getComboList({ limit: LIMIT_COMBO_ITEM, page: data.page }))
        yield put(actions.resetComboDetail());
        yield action.payload.callSuccess()
    } catch (error) {
        yield action.payload.callFail()
        yield put(actions.editComboFail(error.response));
    }
}

function* handelGetItemListBySearch(action) {
    try {
        const res = yield call(apiItem.getItemListBySearch, action.payload)
        yield put(actions.getItemsSuccess(res.data))
    } catch (error) {
        yield put(actions.getItemsFail(error.response));
    }
}
function* handleGetItemComboList(action) {
    try {
        const res = yield call(apiCombo.getItemCombo, action.payload)
        yield put(actions.getItemComboListSuccess({ data: res.data, total_item: action.payload.total_item }))
    } catch (error) {
        yield put(actions.getItemComboListFail(error.response));
    }
}
/**
 * delete combo
 * @param {*} action
 */
function* handleDeleteCombo(action) {
    try {
        yield call(apiCombo.deleteCombo, action.payload);
        yield put(actions.getComboList({ limit: LIMIT_COMBO_ITEM, page: action.payload.page }));
        yield action.payload.callSuccess()
    } catch (error) {
        yield action.payload.callFail()
        yield put(actions.deleteComboFail(error.response));
    }
}
function* handleLoadDishIcon(action) {
    try {
        const res = yield call(apiCombo.getComboIcon)
        yield put(actions.getDishIconSuccess({ data: res.data }));
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data.error.internal_message
        });
    }
}


function* getComboList() {
    yield takeEvery(actions.getComboList, handleGetComboList);
}
function* getComboById() {
    yield takeEvery(actions.getComboById, handleGetComboItemById);
}
function* createCombo() {
    yield takeEvery(actions.createCombo, handleCreateCombo);
}
function* updateCombo() {
    yield takeEvery(actions.editCombo, handleUpdateCombo);
}
function* getItemCombo() {
    yield takeEvery(actions.getItemComboList, handleGetItemComboList);
}
function* getItemListBySearch() {
    yield takeEvery(actions.getItems, handelGetItemListBySearch);
}

function* deleteCombo() {
    yield takeEvery(actions.deleteCombo, handleDeleteCombo);
}
function* loadDishIcon() {
    yield takeEvery(actions.loadDishIcon, handleLoadDishIcon);
}
export default [
    getComboList,
    createCombo, updateCombo,
    getComboById, getItemListBySearch,
    getItemCombo, deleteCombo, loadDishIcon
];
