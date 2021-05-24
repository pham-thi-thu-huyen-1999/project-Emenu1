import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getAreaList = createAction(CONST.GETAREALIST);
export const getAreaListSuccess = createAction(CONST.GETAREALIST_SUCCESS);
export const getAreaListFail = createAction(CONST.GETAREALIST_FAIL);

export const getOrderFoodList = createAction(CONST.GETORDERFOODLIST);
export const getOrderFoodListSuccess = createAction(CONST.GETORDERFOODLIST_SUCCESS);
export const getOrderFoodListFail = createAction(CONST.GETORDERFOODLIST_FAIL);

export const getOrderByTable = createAction(CONST.GETORDERBYTABLE);
export const getOrderByTableSuccess = createAction(CONST.GETORDERBYTABLE_SUCCESS);
export const getOrderByTableFail = createAction(CONST.GETORDERBYTABLE_FAIL);

export const getDishByOrder = createAction(CONST.GETDISHBYORDER);
export const getDishByOrderSuccess = createAction(CONST.GETDISHBYORDER_SUCCESS);
export const getDishByOrderFail = createAction(CONST.GETDISHBYORDER_FAIL);

export const updateOrderItemIsCompleted = createAction(CONST.UPDATEDORDERITEMISCOMPLETED);
export const updateOrderItemIsCompletedSuccess = createAction(CONST.UPDATEDORDERITEMISCOMPLETED_SUCCESS);
export const updateOrderItemIsCompletedFail = createAction(CONST.UPDATEDORDERITEMISCOMPLETED_FAIL);

export const updateOrderItemIsOff = createAction(CONST.UPDATEORDERITEMISOFF);
export const updateOrderItemIsOffSuccess = createAction(CONST.UPDATEORDERITEMISOFF_SUCCESS);
export const updateOrderItemIsOffFail = createAction(CONST.UPDATEORDERITEMISOFF_FAIL);

export const addNofitication = createAction(CONST.ADDNOFITICATION);
export const addNofiticationSuccess = createAction(CONST.ADDNOFITICATION_SUCCESS);
export const addNofiticationFail = createAction(CONST.ADDNOFITICATION_FAIL);

export const setDishPage = createAction(CONST.SETDISHPAGE);
export const setOrderPage = createAction(CONST.SETORDERPAGE);

export const searchOrder = createAction(CONST.SEARCHORDER);
export const searchOrderSuccess = createAction(CONST.SEARCHORDER_SUCCESS);
export const searchOrderFail = createAction(CONST.SEARCHORDER_FAIL);

export const startLoading = createAction(CONST.STARTLOADING);
export const stopLoading = createAction(CONST.STOPLOADING);

export const getUserInfo = createAction(CONST.GETUSERINFO);

export const updateKitchenBar = createAction(CONST.UPDATEKITCHENBAR);
export const showMessageByNoti = createAction(CONST.SHOWMESSAGEBYNOTI);
export const updateOrderByNoti = createAction(CONST.UPDATEORDERBYNOTI);
export const getParamsTabFood = createAction(CONST.GETPARAMSTABFOOD);

export const getInfoStaff = createAction(CONST.GETACCOUNTINFOSTAFF);
export const getInfoStaffSuccess = createAction(CONST.GETACCOUNTINFOSTAFF_SUCCESS);
export const getInfoStaffFail = createAction(CONST.GETACCOUNTINFOSTAFF_FAIL);
