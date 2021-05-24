import * as ACTION_TYPES from './actionTypes';
import { createAction } from "redux-actions";

export const createArea = createAction(ACTION_TYPES.CREATE_AREA)
export const createAreaSuccess = createAction(ACTION_TYPES.CREATE_AREA_SUCCESS)
export const createAreaFailure = createAction(ACTION_TYPES.CREATE_AREA_FAILURE)

export const editArea = createAction(ACTION_TYPES.EDIT_AREA)
export const editAreaSuccess = createAction(ACTION_TYPES.EDIT_AREA_SUCCESS)
export const editAreaFailure = createAction(ACTION_TYPES.EDIT_AREA_FAILURE)

export const getListArea = createAction(ACTION_TYPES.GET_LIST_AREA)
export const getListAreaSuccess = createAction(ACTION_TYPES.GET_LIST_AREA_SUCCESS)
export const getListAreaFailure = createAction(ACTION_TYPES.GET_LIST_AREA_FAILURE)

export const getListAreaByPartnerId = createAction(ACTION_TYPES.GET_LIST_AREA_BY_PARTNER)
export const getListAreaByPartnerIdSuccess = createAction(ACTION_TYPES.GET_LIST_AREA_BY_PARTNER_SUCCESS)
export const getListAreaByPartnerIdFailure = createAction(ACTION_TYPES.GET_LIST_AREA_BY_PARTNER_FAILURE)

export const getAreaInfo = createAction(ACTION_TYPES.GET_AREA_INFO)
export const getAreaInfoSuccess = createAction(ACTION_TYPES.GET_AREA_INFO_SUCCESS)
export const getAreaInfoFailure = createAction(ACTION_TYPES.GET_AREA_INFO_FAILURE)

export const deleteArea = createAction(ACTION_TYPES.DELETE_AREA)
export const deleteAreaSuccess = createAction(ACTION_TYPES.DELETE_AREA_SUCCESS)
export const deleteAreaFailure = createAction(ACTION_TYPES.DELETE_AREA_FAILURE)

export const selectArea = createAction(ACTION_TYPES.SELECT_AREA)
export const deselectArea = createAction(ACTION_TYPES.DESELECT_AREA)

export const getAreaSubIcon = createAction(ACTION_TYPES.GET_AREA_SUB_ICON)
export const getAreaSubIconSuccess = createAction(ACTION_TYPES.GET_AREA_SUB_ICON_SUCCESS)
export const getAreaSubIconFailure = createAction(ACTION_TYPES.GET_AREA_INFO_FAILURE)