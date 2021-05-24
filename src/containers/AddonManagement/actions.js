import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getAddonList = createAction(CONST.GETADDONLIST);
export const getAddonListSuccess = createAction(CONST.GETADDONLIST_SUCCESS);
export const getAddonListFail = createAction(CONST.GETADDONLIST_FAIL);

export const createAddon = createAction(CONST.CREATEADDON);
export const createAddonSuccess = createAction(CONST.CREATEADDON_SUCCESS);
export const createAddonFail = createAction(CONST.CREATEADDON_FAIL);

export const editAddon = createAction(CONST.EDITADDON);
export const editAddonSuccess = createAction(CONST.EDITADDON_SUCCESS);
export const editAddonFail = createAction(CONST.EDITADDON_FAIL);

export const deleteAddon = createAction(CONST.DELETEADDON);
export const deleteAddonSuccess = createAction(CONST.DELETEADDON_SUCCESS);
export const deleteAddonFail = createAction(CONST.DELETEADDON_FAIL);

export const getInfoVatSetting = createAction(CONST.GETINFOVATSETTING);
export const getInfoVatSettingSuccess = createAction(CONST.GETINFOVATSETTING_SUCCESS);
export const getInfoVatSettingFail = createAction(CONST.GETINFOVATSETTING_FAIL);

export const startLoading = createAction(CONST.START_LOADING);