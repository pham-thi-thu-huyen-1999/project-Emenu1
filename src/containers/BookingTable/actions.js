import { createAction } from "redux-actions";
import * as CONST from "./consts"

export const getListBookingTable = createAction(CONST.GETBOOKINGTABLE)
export const getListBookingTableSuccess = createAction(CONST.GETBOOKINGTABLE_SUCCESS)
export const getListBookingTableFail = createAction(CONST.GETBOOKINGTABLE_FAIL)

export const getBookingById = createAction(CONST.GETBOOKINGBYID)
export const getBookingByIdSuccess = createAction(CONST.GETBOOKINGBYID_SUCCESS)
export const getBookingByIdFail = createAction(CONST.GETBOOKINGBYID_FAIL)

export const addBookingTable = createAction(CONST.ADDBOOKINGTABLE)
export const addBookingTableSuccess = createAction(CONST.ADDBOOKINGTABLE_SUCCESS)
export const addBookingTableFail = createAction(CONST.GETBOOKINGTABLE_FAIL)

export const editBookingTable = createAction(CONST.EDITBOOKINGTABLE)
export const editBookingTableSuccess = createAction(CONST.EDITBOOKINGTABLE_SUCCESS)
export const editBookingTableFail = createAction(CONST.EDITBOOKINGTABLE_FAIL)
/**
 * list table empty
 */
export const getListTableStatus = createAction(CONST.GETLISTTABLESTATUS)
export const getListTableStatusSuccess = createAction(CONST.GETLISTTABLESTATUS_SUCCESS)
export const getListTableStatusFail = createAction(CONST.GETLISTTABLESTATUS_FAIL)

export const getListArea = createAction(CONST.GETLISTAREA)
export const getListAreaSuccess = createAction(CONST.GETLISTAREA_SUCCESS)
export const getListAreaFail = createAction(CONST.GETLISTAREA_FAIL)

export const sortTableBooking = createAction(CONST.SORTTABLEBOOKING)
export const sortTableBookingSuccess = createAction(CONST.SORTTABLEBOOKING_SUCCESS)
export const sortTableBookingFail = createAction(CONST.SORTTABLEBOOKING_FAIL)

export const getListTableBooking = createAction(CONST.GETLISTTABLEBOOKING)
export const getListTableBookingSuccess = createAction(CONST.GETLISTTABLEBOOKING_SUCCESS)
export const getListTableBookingFail = createAction(CONST.GETLISTTABLEBOOKING_FAIL)

export const updateStatusBooking = createAction(CONST.UPDATE_STATUS_BOOKING)
export const updateStatusBookingSuccess = createAction(CONST.UPDATE_STATUS_BOOKING_SUCCESS)
export const updateStatusBookingFail = createAction(CONST.UPDATE_STATUS_BOOKING_FAIL)

export const resetBookingDetail = createAction(CONST.RESETBOOKINGDETAIL)

export const getListAreaByParnerId = createAction(CONST.GETLISTAREABYPARNERID);
export const getListAreaByParnerIdSuccess = createAction(CONST.GETLISTAREABYPARNERID_SUCCESS);
export const getListAreaByParnerIdFail = createAction(CONST.GETLISTAREABYPARNERID_FAIL);

export const updateBookingTableById = createAction(CONST.UPDATEBOOKINGTABLEBYNOTI);
export const updateListBooking = createAction(CONST.UPDATELISTBOOKING);