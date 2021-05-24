import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "../actions";
import * as apiPartner from "../../../api/partner";
import * as apiCategoryItem from "../../../api/categoryItem";
import * as apiRestaurtant from "../../../api/pageDetailRestaurant";
import * as apiTable from "../../../api/table";
import * as apiOrder from "../../../api/order";
import * as apiNoti from "../../../api/notification";
import getDataFromParam from "../../../utils/getDatafromParams";

function* handleGetInfoPartner(action) {
  try {
    const partnerId = getDataFromParam(action.payload, "ri", "")
    const res = yield call(apiPartner.getPartnerByIdNoLogin, partnerId);
    yield put(actions.getInfoPartnerSuccess(res.data));
  } catch (err) {
    yield put(actions.getInfoPartnerFail());
  }
}

function* handleGetCategoryItemList(action) {
  try {
    const partner_id = getDataFromParam(action.payload, "ri", "")
    const res = yield call(apiCategoryItem.getCategoryItemList, { partner_id });
    // yield put(actions.getOrderItem({ categoryName: res.data.data[0].name }))
    yield put(actions.getCategoryItemListSuccess(res.data));
  } catch (err) {
    yield put(actions.getCategoryItemListFail(err.response));
  }
}
/**
 * get item combo list
 * @param {*} action
 */
function* handleGetComboItemList(action) {
  try {
    const partner_id = getDataFromParam(action.payload, "ri", "")
    let arrayTemp = {};
    let arrayFilter = [];
    const res = yield call(apiRestaurtant.getComboItemList, { partner_id });
    arrayFilter = res.data.data.filter(data =>
      data.is_price === false
    )
    arrayTemp = { data: res.data.data, arrayFilter }
    yield put(actions.getComboItemListSuccess({ ...arrayTemp }));
  } catch (err) {
    yield put(actions.getComboItemListFail(err.response));
  }
}
/**
 * get item combo by id
 * @param {*} action
 */
function* handleGetComboItemById(action) {
  try {
    const res = yield call(apiRestaurtant.getComboById, action.payload)
    let arrayTemp = [];
    for (let i = 0; i < res.data.data.length; i++) {
      if (res.data.data[i].category_name === action.payload.categoryName) {
        arrayTemp.push(res.data.data[i]);
      }
    }
    yield put(actions.getComboByIdSuccess(arrayTemp))
  } catch (error) {
    yield put(actions.getComboByIdFail(error.response))
  }
}
/**
 * get info partnerSetting
 * @param {*} action
 */
function* handleGetPartnerSetting(action) {
  try {
    const partner_id = getDataFromParam(action.payload, "ri", "")
    const res = yield call(apiRestaurtant.getPartnerSetting, { partner_id });
    const infoPartnerSetting = res.data.data;
    let dataItems = [];
    let dataDefault = []
    let dataItemsByComboId = [];
    if (infoPartnerSetting.partner_type === 2) {
      const resAllItemIsCombo = yield call(apiRestaurtant.getComboItemList, { partner_id });
      dataDefault = resAllItemIsCombo.data.data
      dataItems = dataDefault.reduce((_itemLists, cur) => {
          const item = {
            ...cur,
            items: cur.combo_item_details.reduce((items, itemDetail) => [
              ...items,
              ...itemDetail.items
            ], [])
          }

          delete item.combo_item_details;

          return [
            ..._itemLists,
            {
              ...item
            }
          ]
        }, [])

      ;
      const resAllItemById = yield call(apiRestaurtant.getComboById,
        { partner_id, combo_item_id: dataItems[0].id });
      dataItemsByComboId = resAllItemById.data.data
    } else {
      const resAllItemNoCombo = yield call(apiOrder.getItemListNoCombo, { partner_id });
      dataItems = resAllItemNoCombo.data.data;
    }
    yield put(actions.getPartnerSettingSuccess({
      infoPartnerSetting: res.data.data,
      dataItems,
      dataItemsByComboId
    }));
  } catch (err) {
    yield put(actions.getPartnerSettingFail(err.response));
  }
}


// function* handleGetOrderItem(action) {
//   try {
//     let arrayTemp = [];
//     const res = yield call(apiRestaurtant.getOrderItem, action.payload);
//     for (let i = 0; i < res.data.data.length; i++) {
//       if (res.data.data[i].category_item_name === action.payload.categoryName) {
//         for (let j = 0; j < res.data.data[i].items.length; j++) {
//           arrayTemp.push(res.data.data[i].items[j]);
//         }
//       }
//     }
//     yield put(actions.getOrderItemSuccess(arrayTemp));
//   } catch (err) {
//     yield put(actions.getOrderItemFail(err.response));
//   }
// }

// function* getTableById(action) {
//   try {
//     const res = yield call(apiTable.getTableByID, action.payload);
//     yield put(actions.getTableByIdSuccess(res.data));
//   } catch (err) {
//     yield put(actions.getTableById(err.response));
//   }
// }

function* insertNotification(action) {
  try {
    const res = yield call(apiNoti.addNofitication, action.payload);
    if (res.data.data) {
      action.payload.callSuccess();
    }
  } catch (err) {
    action.payload.callFail()
  }
}
/**
  * attach to Watcher
**/
function* getInfoPartner() {
  yield takeEvery(actions.getInfoPartner, handleGetInfoPartner);
}

function* getCategoryItemList() {
  yield takeEvery(actions.getCategoryItemList, handleGetCategoryItemList);
}

function* getComboItemList() {
  yield takeEvery(actions.getComboItemList, handleGetComboItemList);
}

function* getComboById() {
  yield takeEvery(actions.getComboById, handleGetComboItemById);
}

function* getPartnerSetting() {
  yield takeEvery(actions.getPartnerSetting, handleGetPartnerSetting);
}

// function* getOrderItem() {
//   yield takeEvery(actions.getOrderItem, handleGetOrderItem);
// }

// function* getTableDetailById() {
//   yield takeEvery(actions.getTableById, getTableById);
// }
function* insertNoti() {
  yield takeEvery(actions.callStaff, insertNotification);
}
export default [
  getInfoPartner,
  getCategoryItemList,
  getComboItemList,
  getComboById,
  getPartnerSetting,
  //getOrderItem,
  //getTableDetailById,
  insertNoti
];
