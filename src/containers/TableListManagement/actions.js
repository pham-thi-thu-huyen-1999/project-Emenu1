import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getAreaList = createAction(CONST.GETAREALIST);
export const getAreaListSuccess = createAction(CONST.GETAREALIST_SUCCESS);
export const getAreaListFail = createAction(CONST.GETAREALIST_FAIL);

export const getTableType = createAction(CONST.GETTABLETYPELIST);
export const getTableTypeSuccess = createAction(CONST.GETTABLETYPELIST_SUCCESS);
export const getTableTypeFail = createAction(CONST.GETTABLETYPELIST_FAIL);

export const getTableList = createAction(CONST.GETTABLELIST);
export const getTableListSuccess = createAction(CONST.GETTABLELIST_SUCCESS);
export const getTableListFail = createAction(CONST.GETTABLELIST_FAIL);

export const createTable = createAction(CONST.CREATETABLE);
export const createTableSuccess = createAction(CONST.CREATETABLE_SUCCESS);
export const createTableFail = createAction(CONST.CREATETABLE_FAIL);

export const deleteTable = createAction(CONST.DELETETABLE);
export const deleteTableSuccess = createAction(CONST.DELETETABLE_SUCCESS);
export const deleteTableFail = createAction(CONST.DELETETABLE_FAIL);

export const editTable = createAction(CONST.EDITTABLE);
export const editTableSuccess = createAction(CONST.EDITTABLE_SUCCESS);
export const editTableFail = createAction(CONST.EDITTABLE_FAIL);

export const searchTable = createAction(CONST.SEARCHTABLE);
export const searchTableSuccess = createAction(CONST.SEARCHTABLE_SUCCESS);
export const searchTableFail = createAction(CONST.SEARCHTABLE_FAIL);

export const getTableIcon = createAction(CONST.GETTABLEICON);
export const getTableIconSuccess = createAction(CONST.GETTABLEICON_SUCCESS);
export const getTableIconFail = createAction(CONST.GETTABLEICON_FAIL);

export const loadTableShape = createAction(CONST.LOADTABLESHAPE);
export const unLoadTableShape = createAction(CONST.UNLOADTABLESHAPE);

export const setPage = createAction(CONST.SETPAGE);
export const setSearching = createAction(CONST.SETSEARCHING);
export const setNoSearching = createAction(CONST.SETNOSEARCHING);
export const resetTable = createAction(CONST.RESETTABLE);

export const getTableListAll = createAction(CONST.GETTABLELISTALL);
export const getTableListAllSuccess = createAction(CONST.GETTABLELISTALL_SUCCESS);
export const getTableListAllFail = createAction(CONST.GETTABLELISTALL_FAIL);

export const getInfoPartner = createAction(CONST.GETINFOPARTNER);
export const getInfoPartnerSuccess = createAction(CONST.GETINFOPARTNER_SUCCESS);
export const getInfoPartnerFail = createAction(CONST.GETINFOPARTNER_FAIL);

export const getInfoPartnerSetting = createAction(CONST.GETPARTNERSETTING);
export const getInfoPartnerSettingSuccess = createAction(CONST.GETPARTNERSETTING_SUCCESS);
export const getInfoPartnerSettingFail = createAction(CONST.GETPARTNERSETTING_FAIL);

export const updateTableByNoti = createAction(CONST.UPDATETABLEBYNOTI);