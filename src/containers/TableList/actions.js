import * as ACTION_TYPES from './actionTypes';
import { createAction } from "redux-actions";

export const getListTable = createAction(ACTION_TYPES.GET_LIST_TABLE)
export const getListTableSuccess = createAction(ACTION_TYPES.GET_LIST_TABLE_SUCCESS)
export const getListTableFailure = createAction(ACTION_TYPES.GET_LIST_TABLE_FAILURE)

export const addCombineTable = createAction(ACTION_TYPES.ADD_COMBINE_TABLE)
export const removeCombineTable = createAction(ACTION_TYPES.REMOVE_COMBINE_TABLE)

export const combineTable = createAction(ACTION_TYPES.COMBINE_TABLE)
export const combineTableSuccess = createAction(ACTION_TYPES.COMBINE_TABLE_SUCCESS)
export const combineTableFailure = createAction(ACTION_TYPES.COMBINE_TABLE_FAILURE)

export const selectQRCodeTable = createAction(ACTION_TYPES.SELECT_QRCODE_TABLE)
export const deselectQRCodeTable = createAction(ACTION_TYPES.DESELECT_QRCODE_TABLE)

export const selectInUseTable = createAction(ACTION_TYPES.SELECT_IN_USE_TABLE)
export const deselectInUseTable = createAction(ACTION_TYPES.DESELECT_IN_USE_TABLE)

export const selectInUseTableFeature = createAction(ACTION_TYPES.SELECT_IN_USE_TABLE_FEATURE)
export const deselectInUseTableFeature = createAction(ACTION_TYPES.DESELECT_IN_USE_TABLE_FEATURE)

export const getTableOrders = createAction(ACTION_TYPES.GET_TABLE_ORDER)
export const getTableOrdersSuccess = createAction(ACTION_TYPES.GET_TABLE_ORDER_SUCCESS)
export const getTableOrdersFailure = createAction(ACTION_TYPES.GET_TABLE_ORDER_FAILURE)

export const selectOrder = createAction(ACTION_TYPES.SELECT_ORDER)
export const deselectOrder = createAction(ACTION_TYPES.DESELECT_ORDER)

export const getCombinedTable = createAction(ACTION_TYPES.GET_COMBINED_TABLE)
export const getCombinedTableSuccess = createAction(ACTION_TYPES.GET_COMBINED_TABLE_SUCCESS)
export const getCombinedTableFailure = createAction(ACTION_TYPES.GET_COMBINED_TABLE_FAILURE)

export const changeTableStatus = createAction(ACTION_TYPES.CHANGE_TABLE_STATUS)

export const getItemComboList = createAction(ACTION_TYPES.GETITEM_COMBOLIST);
export const getItemComboListSuccess = createAction(ACTION_TYPES.GETITEM_COMBOLIST_SUCCESS);
export const getItemComboListFail = createAction(ACTION_TYPES.GETITEM_COMBOLIST_FAIL);

export const resetItemComboList = createAction(ACTION_TYPES.RESETITEMCOMBOLIST)

export const getComboList = createAction(ACTION_TYPES.GETCOMBO);
export const getComboListSuccess = createAction(ACTION_TYPES.GETCOMBO_SUCCESS);
export const getComboListFail = createAction(ACTION_TYPES.GETCOMBO_FAIL);

export const getPartnerSetting = createAction(ACTION_TYPES.GETPARTNERSETTING);
export const getPartnerSettingSuccess = createAction(ACTION_TYPES.GETPARTNERSETTING_SUCCESS);
export const getPartnerSettingFail = createAction(ACTION_TYPES.GETPARTNERSETTING_FAIL);

export const getComboItemList = createAction(ACTION_TYPES.GETCOMBOITEMLIST);
export const getComboItemListSuccess = createAction(ACTION_TYPES.GETCOMBOITEMLIST_SUCCESS);
export const getComboItemListFail = createAction(ACTION_TYPES.GETCOMBOITEMLIST_FAIL);

export const getOrderItem = createAction(ACTION_TYPES.GETORDERITEM);
export const getOrderItemSuccess = createAction(ACTION_TYPES.GETORDERITEM_SUCCESS);
export const getOrderItemFail = createAction(ACTION_TYPES.GETORDERITEM_FAIL);

export const getCategoryItemList = createAction(ACTION_TYPES.GETCATEGORYITEMLIST);
export const getCategoryItemListSuccess = createAction(ACTION_TYPES.GETCATEGORYITEMLIST_SUCCESS);
export const getCategoryItemListFail = createAction(ACTION_TYPES.GETCATEGORYITEMLIST_FAIL);

export const getComboById = createAction(ACTION_TYPES.GETCOMBOBYID);
export const getComboByIdSuccess = createAction(ACTION_TYPES.GETCOMBOBYID_SUCCESS);
export const getComboByIdFail = createAction(ACTION_TYPES.GETCOMBOBYID_FAIL);

export const createOrder = createAction(ACTION_TYPES.CREATEORDER);
export const createOrderSuccess = createAction(ACTION_TYPES.CREATEORDER_SUCCESS);
export const createOrderFail = createAction(ACTION_TYPES.CREATEORDER_FAIL);
export const getNotificationsList = createAction(ACTION_TYPES.GETNOTIFICATIONSLIST);

export const getNotificationsListSuccess = createAction(
  ACTION_TYPES.GETNOTIFICATIONSLIST_SUCCESS
);

export const getNotificationsListFailure = createAction(
  ACTION_TYPES.GETNOTIFICATIONSLIST_FAILURE
);

export const postOrderItemById = createAction(ACTION_TYPES.POSTORDERITEMBYID);
export const postOrderItemByIdSuccess = createAction(ACTION_TYPES.POSTORDERITEMBYID_SUCCESS);
export const postOrderItemByIdFail = createAction(ACTION_TYPES.POSTORDERITEMBYID_FAIL);

export const getOrderItemById = createAction(ACTION_TYPES.GETORDERITEMBYID);
export const getOrderItemByIdSuccess = createAction(ACTION_TYPES.GETORDERITEMBYID_SUCCESS);
export const getOrderItemByIdFail = createAction(ACTION_TYPES.GETORDERITEMBYID_FAIL);

export const postOrderItemComboById = createAction(ACTION_TYPES.POSTORDERITEMCOMBOBYID);
export const postOrderItemComboByIdSuccess = createAction(ACTION_TYPES.POSTORDERITEMCOMBOBYID_SUCCESS);
export const postOrderItemComboByIdFail = createAction(ACTION_TYPES.POSTORDERITEMCOMBOBYID_FAIL);
export const updateStatusTable = createAction(ACTION_TYPES.UPDATESTATUSTABLE)
export const updateStatusTableSuccess = createAction(ACTION_TYPES.UPDATESTATUSTABLE_SUCCESS)
export const updateStatusTableFailure = createAction(ACTION_TYPES.UPDATESTATUSTABLE_FAILURE)

export const getComboItemListOnly = createAction(ACTION_TYPES.GETCOMBOITEMLISTONLY);
export const getComboItemListOnlySuccess = createAction(ACTION_TYPES.GETCOMBOITEMLISTONLY_SUCCESS);
export const getComboItemListOnlyFail = createAction(ACTION_TYPES.GETCOMBOITEMLISTONLY_FAIL);

export const setOrderId = createAction(ACTION_TYPES.SETORDERID);

export const updateIconTableByNoti = createAction(ACTION_TYPES.UPDATEICONTABLEBYNOTI);

export const getNotis = createAction(ACTION_TYPES.GETNOTIFICATIONS);

export const getNotisSuccess = createAction(
  ACTION_TYPES.GETNOTIFICATIONS_SUCCESS
);

export const getNotisFail = createAction(
  ACTION_TYPES.GETNOTIFICATIONS_FAILURE
);

export const getNotisForTable = createAction(ACTION_TYPES.GETNOTIFICATIONSFORTABLE);

export const createOrderByNoti = createAction(ACTION_TYPES.CREATEORDER)
export const createOrderByNotiSuccess = createAction(ACTION_TYPES.CREATEORDER_SUCCESS)
export const createOrderByNotiFail = createAction(ACTION_TYPES.CREATEORDER_FAIL)

// export const updateStatusNoti = createAction(ACTION_TYPES.UPDATESTATUSNOTI)
// export const updateStatusNotiSuccess = createAction(ACTION_TYPES.UPDATESTATUSNOTI_SUCCESS)
// export const updateStatusNotiFail = createAction(ACTION_TYPES.UPDATESTATUSNOTI_FAIL)

// export const changeActionStatus = createAction(ACTION_TYPES.CHANGEACTIONSTATUS)
// export const changeActionStatusSuccess = createAction(ACTION_TYPES.CHANGEACTIONSTATUS_SUCCESS)
// export const changeActionStatusFail = createAction(ACTION_TYPES.CHANGEACTIONSTATUS_FAIL)

export const removeNotiForTable = createAction(ACTION_TYPES.REMOVENOTICEFORTABLE);
