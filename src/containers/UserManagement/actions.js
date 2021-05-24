import { createAction, createActions } from "redux-actions";
import * as CONST from "./constants";

export const getListArea = createAction(CONST.GET_LIST_AREA)
export const getListAreaSuccess = createAction(CONST.GET_LIST_AREA_SUCCESS)
export const getListAreaFail = createAction(CONST.GET_LIST_AREA_FAILURE)

export const getGroupUser = createAction(CONST.GETGROUPUSER);
export const getGroupUserSuccess = createAction(CONST.GETGROUPUSER_SUCCESS);
export const getGroupUserFail = createAction(CONST.GETGROUPUSER_FAIL);

export const getAccountInfo = createAction(CONST.GETACCOUNTINFO);
export const getAccountInfoSuccess = createAction(CONST.GETACCOUNTINFO_SUCCESS);
export const getAccountInfoFail = createAction(CONST.GETACCOUNTINFO_FAIL);

export const getAccountInfoStaff = createAction(CONST.GETACCOUNTINFOSTAFF);
export const getAccountInfoStaffSuccess = createAction(CONST.GETACCOUNTINFOSTAFF_SUCCESS);
export const getAccountInfoStaffFail = createAction(CONST.GETACCOUNTINFOSTAFF_FAIL);

export const changePassword = createAction(CONST.CHANGEPASSWORD);
export const changePasswordSuccess = createAction(CONST.CHANGEPASSWORD_SUCCESS);
export const changePasswordFail = createAction(CONST.CHANGEPASSWORD_FAIL);

export const addGroupUser = createAction(CONST.ADDGROUPUSER);
export const addGroupUserSuccess = createAction(CONST.ADDGROUPUSER_SUCCESS);
export const addGroupUserFail = createAction(CONST.ADDGROUPUSER_FAIL);

export const getRoleList = createAction(CONST.GETROLELIST);
export const getRoleListSuccess = createAction(CONST.GETROLELIST_SUCCESS);
export const getRoleListFail = createAction(CONST.GETROLELIST_FAIL);

export const getRoleById = createAction(CONST.GETROLEBYID);
export const getRoleByIdSuccess = createAction(CONST.GETROLEBYID_SUCCESS);
export const getRoleByIdFail = createAction(CONST.GETROLEBYID_FAIL);

export const getUserList = createAction(CONST.GETUSERLIST);
export const getUserListSuccess = createAction(CONST.GETUSERLIST_SUCCESS);
export const getUserListFail = createAction(CONST.GETUSERLIST_FAIL);

export const getPartnerList = createAction(CONST.GETPARTNERLIST);
export const getPartnerListSuccess = createAction(CONST.GETPARTNERLIST_SUCCESS);
export const getPartnerListFail = createAction(CONST.GETPARTNERLIST_FAIL);

export const createUser = createAction(CONST.CREATEUSER);
export const createUserSuccess = createAction(CONST.CREATEUSER_SUCCESS);
export const createUserFail = createAction(CONST.CREATEUSER_FAIL);

export const editUser = createAction(CONST.EDITUSER);
export const editUserSuccess = createAction(CONST.EDITUSER_SUCCESS);
export const editUserFail = createAction(CONST.EDITUSER_FAIL);

export const deleteUser = createAction(CONST.DELETEUSER);
export const deleteUserSuccess = createAction(CONST.DELETEUSER_SUCCESS);
export const deleteUserFail = createAction(CONST.DELETEUSER_FAIL);

export const deleteGroupUser = createAction(CONST.DELETEGROUPUSER);
export const deleteGroupUserSuccess = createAction(
  CONST.DELETEGROUPUSER_SUCCESS
);
export const deleteGroupUserFail = createAction(CONST.DELETEGROUPUSER_FAIL);

export const editGroupUser = createAction(CONST.EDITGROUPUSER);
export const editGroupUserSuccess = createAction(CONST.EDITGROUPUSER_SUCCESS);
export const editGroupUserFail = createAction(CONST.EDITGROUPUSER_FAIL);

/**
 * list shift
 */
export const getListShift = createAction(CONST.LISTSHIFT);
export const getListShiftSuccess = createAction(CONST.LISTSHIFT_SUCCESS);
export const getListShiftFail = createAction(CONST.LISTSHIFT_FAIL);
/**
 * LIST DAY in week
 */
export const getListDay = createAction(CONST.LISTDAY);
export const getListDaySuccess = createAction(CONST.LISTDAY_SUCCESS);
export const getListDayFail = createAction(CONST.LISTDAY_FAIL);

/***
 * LIST OVER SHIFT
 */
export const getListOverShift = createAction(CONST.GETLISTOVERSHIFT);
export const getListOverShiftSuccess = createAction(CONST.GETLISTOVERSHIFT_SUCCESS);
export const getListOverShiftFail = createAction(CONST.GETLISTOVERSHIFT_FAIL);
/**
 * add overtime shift for staff
 */
export const addOTShiftForStaff = createAction(CONST.ADD_OTSHIFT_TOSTAFF);
export const addOTShiftForStaffSuccess = createAction(CONST.ADD_OTSHIFT_TOSTAFF_SUCCESS);
export const addOTShiftForStaffFail = createAction(CONST.ADD_OTSHIFT_TOSTAFF_FAIL);

export const addShiftForStaff = createAction(CONST.ADDSHIFTFFORSTAFF);
export const addShiftForStaffSuccess = createAction(CONST.ADDSHIFTFFORSTAFF_SUCCESS);
export const addShiftForStaffFail = createAction(CONST.ADDSHIFTFFORSTAFF_FAIL);

export const getListOTChangeDay = createAction(CONST.GETLISTOTCHANGEDAY);
export const getListOTChangeDaySuccess = createAction(CONST.GETLISTOTCHANGEDAY_SUCCESS);
export const getListOTChangeDayFail = createAction(CONST.GETLISTOTCHANGEDAY_FAIL);

export const getListTakeLeave = createAction(CONST.GETLISTTAKELEAVE);
export const getListTakeLeaveSuccess = createAction(CONST.GETLISTTAKELEAVE_SUCCESS);
export const getListTakeLeaveFail = createAction(CONST.GETLISTTAKELEAVE_FAIL);

export const deleteOTShiftById = createAction(CONST.DELETE_OTSHIFTBYID);

export const deleteTakeLeaveById = createAction(CONST.DELETE_TAKElEAVEBYID);

export const getListShiftByDayTakeLeave = createAction(CONST.GETLISTTAKELEAVEBYDAY);
export const getListShiftByDayTakeLeaveSuccess = createAction(CONST.GETLISTTAKELEAVEBYDAY_SUCCESS);
export const getListShiftByDayTakeLeaveFail = createAction(CONST.GETLISTTAKELEAVEBYDAY_FAIL);

export const addDayTakeLeave = createAction(CONST.ADDDAYTAKELEAVE);
export const addDayTakeLeaveSuccess = createAction(CONST.ADDDAYTAKELEAVE_SUCCESS);
export const addDayTakeLeaveFail = createAction(CONST.ADDDAYTAKELEAVE_FAIL);

export const getListCheckinOut = createAction(CONST.GETLISTCHECKIN_OUT);
export const getListCheckinOutSuccess = createAction(CONST.GETLISTCHECKIN_OUT_SUCCESS);
export const getListCheckinOutFail = createAction(CONST.GETLISTCHECKIN_OUT_FAIL);
/**
 * add checkin - checkout
 */
export const addCheckinOut = createAction(CONST.ADDCHECKIN_OUT);
export const addCheckinOutSuccess = createAction(CONST.ADDCHECKIN_OUT_SUCCESS);
export const addCheckinOutFail = createAction(CONST.ADDCHECKIN_OUT_FAIL);

export const editCheckinOut = createAction(CONST.EDITCHECKIN_OUT);
export const editCheckinOutSuccess = createAction(CONST.EDITCHECKIN_OUT_SUCCESS);
export const editCheckinOutFail = createAction(CONST.EDITCHECKIN_OUT_FAIL);

export const deleteCheckinOut = createAction(CONST.DELETECHECKIN_OUT);

export const getListHistoryCheck = createAction(CONST.GETLIST_HISTORYCHECK);
export const getListHistoryCheckSuccess = createAction(CONST.GETLIST_HISTORYCHECK_SUCCESS);
export const getListHistoryCheckFail = createAction(CONST.GETLIST_HISTORYCHECK_FAIL);

export const getListWeekdayShift = createAction(CONST.GETLISTWEEKDAYSHIFT);
export const getListWeekdayShiftSuccess = createAction(CONST.GETLISTWEEKDAYSHIFT_SUCCESS);
export const getListWeekdayShiftFail = createAction(CONST.GETLISTWEEKDAYSHIFT_FAIL);

export const getListCalendarOfUser = createAction(CONST.LISTSHIFTCALENDAROFUSER);
export const getListCalendarOfUserSuccess = createAction(CONST.LISTSHIFTCALENDAROFUSER_SUCCESS);
export const getListCalendarOfUserFail = createAction(CONST.LISTSHIFTCALENDAROFUSER_FAIL);

/**
 * Update status overtime shift
 */
export const updateOverShift = createAction(CONST.UPDATEOVERSHIFT);

/**
 * Update status takeleave shift
 */
 export const updateTakeLeaveShift = createAction(CONST.UPDATETAKELEAVESHIFT);