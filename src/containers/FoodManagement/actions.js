import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getItemList = createAction(CONST.GETITEMLIST);
export const getItemListSuccess = createAction(CONST.GETITEMLIST_SUCCESS);
export const getItemListFail = createAction(CONST.GETITEMLIST_FAIL);

export const getItemListBySearchAdvanced = createAction(CONST.GETITEMLISTBYSEARCHADVANCED);
export const getItemListBySearchAdvancedSuccess = createAction(CONST.GETITEMLISTBYSEARCHADVANCED_SUCCESS);
export const getItemListBySearchAdvancedFail = createAction(CONST.GETITEMLISTBYSEARCHADVANCED_FAIL);

export const deleteItem = createAction(CONST.DELETEITEM);
export const deleteItemSuccess = createAction(CONST.DELETEITEM_SUCCESS);
export const deleteItemFail = createAction(CONST.DELETEITEM_FAIL);

export const createItem = createAction(CONST.CREATEITEM);
export const createItemSuccess = createAction(CONST.CREATEITEM_SUCCESS);
export const createItemFail = createAction(CONST.CREATEITEM_FAIL);

export const editItem = createAction(CONST.EDITITEM);
export const editItemSuccess = createAction(CONST.EDITITEM_SUCCESS);
export const editItemFail = createAction(CONST.EDITITEM_FAIL);

export const getUnitItemList = createAction(CONST.GETUNITITEMLIST);
export const getUnitItemListSuccess = createAction(CONST.GETUNITITEMLIST_SUCCESS);
export const getUnitItemListFail = createAction(CONST.GETUNITITEMLIST_FAIL);

export const getCategoryItemList = createAction(CONST.GETCATEGORYITEMLIST);
export const getCategoryItemListSuccess = createAction(CONST.GETCATEGORYITEMLIST_SUCCESS);
export const getCategoryItemListFail = createAction(CONST.GETCATEGORYITEMLIST_FAIL);

export const getGenerateById = createAction(CONST.GETGENERATEBYID);
export const getGenerateByIdSuccess = createAction(CONST.GETGENERATEBYID_SUCCESS);
export const getGenerateByIdFail = createAction(CONST.GETGENERATEBYID_FAIL);

export const uploadImageItem = createAction(CONST.UPLOADIMAGEITEM);
export const uploadImageItemSuccess = createAction(CONST.UPLOADIMAGEITEM_SUCCESS);
export const uploadImageItemFail = createAction(CONST.UPLOADIMAGEITEM_FAIL);

export const startLoading = createAction(CONST.START_LOADING);

export const getInfoVatSetting = createAction(CONST.GETINFOVATSETTING);
export const getInfoVatSettingSuccess = createAction(CONST.GETINFOVATSETTING_SUCCESS);
export const getInfoVatSettingFail = createAction(CONST.GETINFOVATSETTING_FAIL);

export const getAddonList = createAction(CONST.GETADDONLIST);
export const getAddonListSuccess = createAction(CONST.GETADDONLIST_SUCCESS);
export const getAddonListFail = createAction(CONST.GETADDONLIST_FAIL);