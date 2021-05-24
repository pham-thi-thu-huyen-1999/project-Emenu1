import { call, put, takeEvery, all } from "redux-saga/effects";
import * as actions from "../actions";
import * as apiUser from "../../../api/account";
import * as apiGroup from "../../../api/groupUser";
import * as apiRole from "../../../api/role";
import * as apiUpload from "../../../api/uploadFile";
import apiArea from "../../../api/area";
import * as apiShift from "../../../api/shift";
import * as apiPartner from "../../../api/partner";
import * as apiNoti from "../../../api/notification";
import { LIST_ROLE_FOR_CONSTRACT_RESTAURANT } from '../constants';
import { TEMP_CONTRACT } from "../../../consts/settings/partnerContract";
import moment from "moment";
import { get } from "../../../services/localStorage";

// import { HTTP_STATUS_CODES } from "../../../consts/constants";



function* handleGetAccountInfo(action) {
  try {
    const res1 = yield call(apiPartner.getPartnerById, action.payload);

    const res = yield call(apiUser.getAccountInfo, action.payload);

    res.data.data = { ...res.data.data, code: res1.data.data.code }
    yield put(actions.getAccountInfoSuccess({
      data: res.data,
      infoPar: res1.data
    }));
  } catch (err) {
    // yield put(actions.getAccountInfoFail(err.response.data.error.internal_message));
  }
}

function* handleGetAccountInfoStaff(action) {
  try {
    const res = yield call(apiUser.getAccountInfoStaff, action.payload);
    action.payload.callback({ ...res.data.data });
    yield put(actions.getAccountInfoStaffSuccess(res.data));
  } catch (err) {
    yield put(actions.getAccountInfoStaffFail(err.response.data.error.internal_message));
  }
}

function* handleGetListArea(action) {
  try {
    const res = yield call(apiArea.getAreaList, action.payload);
    yield put(actions.getListAreaSuccess(res.data));
  } catch (error) {
    yield put(actions.getListAreaFail(error));
  }
}

function* handleGetUserList(action) {
  try {
    const res = yield call(apiUser.getAccountList, action.payload);
    yield put(actions.getUserListSuccess(res.data));
  } catch (err) {
    yield put(actions.getUserListFail(err.response));
  }
}

function* handleCreateUser(action) {
  try {
    const deviceId = get("deviceId");
    const res = yield call(apiUser.createAccountStaff, action.payload);
    const { areas } = action.payload.data;
    yield put(actions.createUserSuccess(res.data));
    // gọi api sub các topic
    yield all(areas.map((item) => {
      const subtop = {
        device_id: deviceId,
        data: {
          topic: `area_${item}`
        },
        user_id: res.data.data.user_id
      }
      return call(apiNoti.subcriberToTopicByUser, subtop);
    }))
    yield action.payload.callSuccess();
  } catch (err) {
    yield put(actions.createUserFail(err.response));
    yield action.payload.callFail(err.response);
  }
}

function* handleEditUser(action) {
  try {
    const deviceId = get("deviceId");
    const { lstAreaUnsub } = action.payload;
    const { areas } = action.payload.data;
    yield call(apiUser.addGroupToUser, action.payload);
    const res = yield call(apiUser.updateAccountInfo, action.payload);
    yield put(actions.editUserSuccess(res.data));
    yield put(actions.getUserList({ index: 0, page_size: 5 }))
    // unsub topic
    yield all(lstAreaUnsub.map((item) => {
      const subtop = {
        device_id: deviceId,
        data: {
          topic: `area_${item}`
        },
        user_id: res.data.data.staff_id
      }
      return call(apiNoti.unSubcriberToTopicByUser, subtop);
    }))
    // sub topic
    yield all(areas.map((item) => {
      const subtop = {
        device_id: deviceId,
        data: {
          topic: `area_${item}`
        },
        user_id: res.data.data.staff_id
      }
      return call(apiNoti.subcriberToTopicByUser, subtop);
    }))

    yield action.payload.callSuccess();
  } catch (err) {
    yield put(actions.editUserFail(err.response));
    yield action.payload.callFail(err.response);
  }
}

function* handleGetGroupUser(action) {
  try {
    const res = yield call(apiGroup.getGroupUser, action.payload);
    yield put(actions.getGroupUserSuccess(res.data));
    if (res.data.data.length > 0) {
      const data = { group_id: res.data.data[0].id };
      yield put(actions.getRoleById({ data }));
    }
  } catch (err) {
    yield put(actions.getGroupUserFail(err.response));
  }
}

function* handleAddGroup(action) {
  try {
    const res = yield call(apiGroup.addGroupUser, action.payload);
    const data = {
      group_user_id: res.data.data.id,
      arrRoleId: action.payload.data.arrRoleId,
    };
    yield call(apiGroup.updateGroupUserRole, { data });
    yield put(actions.addGroupUserSuccess(res.data));
    yield action.payload.callSuccess();
  } catch (err) {
    yield put(actions.addGroupUserFail(err.response));
    yield action.payload.callFail(err.response);
  }
}

function* handleEditGroupUser(action) {
  try {
    const res = yield call(apiGroup.editGroupUser, action.payload);
    yield put(actions.editGroupUserSuccess(res.data));
    yield action.payload.callSuccess();
  } catch (err) {
    yield put(actions.editGroupUserFail(err.response));
    yield action.payload.callFail(err.response);
  }
}

function* handleDeleteGroupUser(action) {
  try {
    yield call(apiGroup.deleteGroupUser, action.payload);
    yield put(actions.deleteGroupUserSuccess(action.payload.data.group_id));
    yield action.payload.callSuccess();
  } catch (err) {
    yield put(actions.deleteGroupUserFail(err.response));
    yield action.payload.callFail(err.response);

  }
}

function* handleGetRoleList(action) {
  try {
    const res = yield call(apiRole.getRoleList, action.payload);

    // check resraurant is contract restaurant
    const resPartner = yield call(apiPartner.getPartnerById, action.payload);
    let constractType = "";
    let constractTime = "";
    if (resPartner && resPartner.data && resPartner.data.data) {
      constractType = resPartner.data.data.contract_type_id;
      constractTime = resPartner.data.data.contract_end_time;
    }

    if (constractType === TEMP_CONTRACT || moment.utc(new Date()).isAfter(new Date(constractTime))) {
      let arr_roleList = [];
      for (let i = 0; i < res.data.data.length; i++) {
        for (let j = 0; j < LIST_ROLE_FOR_CONSTRACT_RESTAURANT.length; j++) {
          if (res.data.data[i].code === LIST_ROLE_FOR_CONSTRACT_RESTAURANT[j]) {
            arr_roleList.push(res.data.data[i]);
          }
        }
      }
      yield put(actions.getRoleListSuccess(arr_roleList));
    } else {
      yield put(actions.getRoleListSuccess(res.data));
    };
  } catch (err) {
    yield put(actions.getRoleListFail(err.response));
  }
}

function* handleGetRoleById(action) {
  try {
    const res = yield call(apiGroup.listRoleByGropID, action.payload);
    yield put(actions.getRoleByIdSuccess(res.data));
  } catch (err) {
    yield put(actions.getRoleByIdFail(err.response));
  }
}


function* handleDeleteUser(action) {
  try {
    const res = yield call(apiUser.changeStatusUser, action.payload);
    yield put(actions.deleteUserSuccess(res.data));
    yield action.payload.callSuccess();
  } catch (err) {
    yield put(actions.deleteUserFail);
    yield action.payload.callFail(err.response);
  }
}




function* handleChangePassword(action) {
  try {
    const res = yield call(apiUser.changePassword, { data: action.payload.data });
    //yield put(actions.changePasswordSuccess(action.payload));
    yield action.payload.callback_success();
  } catch (err) {
    //yield put(actions.changePasswordFail(err.response.data.error.internal_message));
    yield action.payload.callback_fail(err.response);

  }
}
/**
 * list shift
 * @param {*} action
 */
function* handleGetListShift(action) {
  try {
    const res = yield call(apiShift.getListShift, action.payload);
    yield put(actions.getListShiftSuccess(res.data))
  } catch (err) {
    // yield action.payload.callback_fail(err.response);

  }
}
/**
 * list day in week
 * @param {*} action
 */
function* handleGetListDayShift(action) {
  try {
    const res = yield call(apiShift.getListDayShift, action.payload);
    yield put(actions.getListDaySuccess(res.data))
  } catch (err) {
    // yield action.payload.callback_fail(err.response);

  }
}
/**
 * get list overshift
 * @param {} action
 */
function* handleGetListOverShift(action) {
  try {
    const res = yield call(apiShift.getListOverShift, action.payload);
    yield put(actions.getListOverShiftSuccess(res.data))
  } catch (err) {
    return err;
  }
}

function* handleAddOTShiftForStaff(action) {
  try {
    const { data } = action.payload
    const res = yield call(apiShift.addOTShift, action.payload);
    yield put(actions.addOTShiftForStaffSuccess(res.data));
    yield put(actions.getListOverShift({
      user_id: data.user_id,
      params: { overtime_at: data.overtime_at }
    }))
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showErr("Nhân viên đã có lịch làm việc cho những ca này");
    yield put(actions.addOTShiftForStaffFail(err.response.data))
  }
}
/**
 * add weekdayShift
 * @param {*} action
 */
function* handleAddShiftForStaff(action) {
  try {
    const res = yield call(apiShift.postShiftForStaff, action.payload);
    yield put(actions.addShiftForStaffSuccess(res.data))
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showErr();
    return err;
  }
}
/**
 * delete OT shift by id
 * @param {*} action
 */
function* handleDeleteOTShiftById(action) {
  try {
    yield call(apiShift.deleteShiftForStaff, action.payload);
    yield put(actions.getListOverShift({
      user_id: action.payload.user_id,
      params: { overtime_at: action.payload.overtime_at }
    }))
    yield action.payload.showSuccess()
  } catch (err) {
    yield action.payload.showError()
    return err
  }
}

function* handleGetListOTChangeDay(action) {
  try {
    const resOT = yield call(apiShift.getListOverShift, action.payload);
    let payloadCalendar = {
      user_id: action.payload.user_id,
      from_date: action.payload.params.overtime_at,
      to_date: action.payload.params.overtime_at
    }
    const resCalendar = yield call(apiShift.getListCalendarOfUser, payloadCalendar);
    yield put(actions.getListOTChangeDaySuccess({ resOT: resOT.data, resCalendar: resCalendar.data }))
  } catch (err) {
    // yield action.payload.callback_fail(err.response);
  }
}
/**
 * get list take leave
 * @param {*} action
 */
function* handleGetListTakeLeave(action) {
  try {
    const res = yield call(apiShift.getListTakeLeave, action.payload);
    yield put(actions.getListTakeLeaveSuccess(res.data));
  } catch (err) {
    return err;
  }
}

function* handleDeleteTakeLeave(action) {
  try {
    yield call(apiShift.deleteTakeLeave, action.payload);
    yield put(actions.getListTakeLeave({
      user_id: action.payload.user_id,
      params: { ...action.payload.params }
    }))
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showError();
    return err;
  }
}
/**
 * get list take Leave when change day
 * @param {*} action
 */
function* handleGetListTakeLeaveByDay(action) {
  try {
    const res = yield call(apiShift.getListTakeLeave, action.payload);
    let payloadCalendar = {
      user_id: action.payload.user_id,
      from_date: action.payload.params.take_leave_at,
      to_date: action.payload.params.take_leave_at
    }
    const resCalendar = yield call(apiShift.getListCalendarOfUser, payloadCalendar);
    yield put(actions.getListShiftByDayTakeLeaveSuccess({ dataTakeLeave: res.data, dataCalendar: resCalendar.data }));
    yield action.payload.callBack();
  } catch (err) {
    return err;
  }
}
/**
 * add day take leave
 * @param {*} action
 */
function* handleAddDayTakeLeave(action) {
  try {
    const res = yield call(apiShift.addTakeLeave, action.payload);
    yield put(actions.addDayTakeLeaveSuccess(res.data));
    yield put(actions.getListTakeLeave({
      user_id: action.payload.user_id,
      params: { ...action.payload.params }
    }))
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showErr("nhân viên không có lịch làm việc hôm nay");
    return err;
  }
}


function* handleGetListCheckinOut(action) {
  try {
    const res = yield call(apiShift.getListCheckinCheckout, action.payload);
    yield put(actions.getListCheckinOutSuccess(res.data));
  } catch (err) {
    return err;
  }
}
/**
 * add checkin checkout
 * @param {*} action
 */

function* handleAddCheckinOut(action) {
  try {
    const res = yield call(apiShift.createCheckinOut, action.payload);
    yield put(actions.addCheckinOutSuccess(res.data));
    yield put(actions.getListCheckinOut({
      user_id: action.payload.user_id,
      params: action.payload.params
    }))
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showErr();
    return err;
  }
}

function* handleEditCheckinOut(action) {
  try {
    const res = yield call(apiShift.putCheckinOut, action.payload);
    yield put(actions.editCheckinOutSuccess(res.data));
    yield put(actions.getListCheckinOut({
      user_id: action.payload.user_id,
      params: action.payload.params
    }))
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showError();
    return err;
  }
}

function* handleDeleteCheckinOut(action) {
  try {
    yield call(apiShift.deleteCheckinOut, action.payload)
    yield put(actions.getListCheckinOut({
      user_id: action.payload.user_id,
      params: action.payload.params
    }))
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showError();
    return err;
  }
}
/**
 * get list checkin - checkout
 * @param {*} action
 */
function* handleGetListHistoryCheck(action) {
  try {
    const res = yield call(apiShift.getListHistoryCheck, action.payload);
    yield put(actions.getListHistoryCheckSuccess(res.data));
    yield action.payload.callBack();
  } catch (err) {
    return err;
  }
}

function* handleGetListWeekdayShift(action) {
  try {
    const res = yield call(apiShift.getListWeekdayShift, action.payload);
    yield put(actions.getListWeekdayShiftSuccess(res.data));
    yield action.payload.callBack();
  } catch (err) {
    return err;
  }
}
/**
 * get list shift calendar
 * @param {*} action
 */
function* handleGetListCalendarOfUser(action) {
  try {
    const res = yield call(apiShift.getListCalendarOfUser, action.payload);
    yield put(actions.getListCalendarOfUserSuccess(res.data));
  } catch (err) {
    return err;
  }
}

function* handleUpdateOverShift(action) {
  try {
    yield call(apiShift.updateOverShift, action.payload);
    yield put(actions.getListOverShift({
      user_id: action.payload.user_id,
      params: { overtime_at: action.payload.overtime_at }
    }))
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showErr();
  }
}

function* handleUpdateTakeLeaveShift(action) {
  try {
    yield call(apiShift.updateTakeLeaveShift, action.payload);
    yield put(actions.getListTakeLeave({
      user_id: action.payload.user_id,
      params: { ...action.payload.params }
    }))
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showErr();
  }
}
//////////////////////////////////////////////////////
// attach to Watcher
function* changePassword() {
  yield takeEvery(actions.changePassword, handleChangePassword);
}

function* getAccountInfoStaff() {
  yield takeEvery(actions.getAccountInfoStaff, handleGetAccountInfoStaff);
}

function* getAreaList() {
  yield takeEvery(actions.getListArea, handleGetListArea);
}

function* getUserList() {
  yield takeEvery(actions.getUserList, handleGetUserList);
}

function* getAccountInfo() {
  yield takeEvery(actions.getAccountInfo, handleGetAccountInfo);
}

// function* getPartnerList() {
//   yield takeEvery(actions.getPartnerList, handleGetPartnerList);
// }

function* createUser() {
  yield takeEvery(actions.createUser, handleCreateUser);
}

function* getGroupUser() {
  yield takeEvery(actions.getGroupUser, handleGetGroupUser);
}

function* getRoleList() {
  yield takeEvery(actions.getRoleList, handleGetRoleList);
}

function* editUser() {
  yield takeEvery(actions.editUser, handleEditUser);
}

function* deleteUser() {
  yield takeEvery(actions.deleteUser, handleDeleteUser);
}

function* getRolebyId() {
  yield takeEvery(actions.getRoleById, handleGetRoleById);
}

function* addGroupUser() {
  yield takeEvery(actions.addGroupUser, handleAddGroup);
}

function* deleteGroupUser() {
  yield takeEvery(actions.deleteGroupUser, handleDeleteGroupUser);
}

function* editGroupUser() {
  yield takeEvery(actions.editGroupUser, handleEditGroupUser);
}

function* getListShift() {
  yield takeEvery(actions.getListShift, handleGetListShift);
}

function* getListDay() {
  yield takeEvery(actions.getListDay, handleGetListDayShift);
}

function* getListOverTimeShift() {
  yield takeEvery(actions.getListOverShift, handleGetListOverShift);
}

function* addOverTimeShiftForStaff() {
  yield takeEvery(actions.addOTShiftForStaff, handleAddOTShiftForStaff);
}

function* addShiftForStaff() {
  yield takeEvery(actions.addShiftForStaff, handleAddShiftForStaff);
}

function* deleteOTShiftById() {
  yield takeEvery(actions.deleteOTShiftById, handleDeleteOTShiftById);
}

function* getOTChangeDay() {
  yield takeEvery(actions.getListOTChangeDay, handleGetListOTChangeDay);
}

function* getListTakeLeave() {
  yield takeEvery(actions.getListTakeLeave, handleGetListTakeLeave);
}

function* getListTakeLeaveByDay() {
  yield takeEvery(actions.getListShiftByDayTakeLeave, handleGetListTakeLeaveByDay);
}

function* deleteTakeLeave() {
  yield takeEvery(actions.deleteTakeLeaveById, handleDeleteTakeLeave);
}

function* addTakeLeave() {
  yield takeEvery(actions.addDayTakeLeave, handleAddDayTakeLeave);
}

function* getListCheckinOut() {
  yield takeEvery(actions.getListCheckinOut, handleGetListCheckinOut);
}

function* addCheckinOut() {
  yield takeEvery(actions.addCheckinOut, handleAddCheckinOut);
}

function* editCheckinOut() {
  yield takeEvery(actions.editCheckinOut, handleEditCheckinOut);
}

function* deleteCheckinOut() {
  yield takeEvery(actions.deleteCheckinOut, handleDeleteCheckinOut);
}

function* getListHistoryCheck() {
  yield takeEvery(actions.getListHistoryCheck, handleGetListHistoryCheck);
}

function* getListWeekdayShift() {
  yield takeEvery(actions.getListWeekdayShift, handleGetListWeekdayShift);
}

function* getShiftsCalendar() {
  yield takeEvery(actions.getListCalendarOfUser, handleGetListCalendarOfUser);
  }
  
function* updateOverShift() {
  yield takeEvery(actions.updateOverShift, handleUpdateOverShift);
}

function* updateTakeLeaveShift() {
  yield takeEvery(actions.updateTakeLeaveShift, handleUpdateTakeLeaveShift);
}

export default [
  getAccountInfoStaff,
  getAreaList,
  getAccountInfo,
  getUserList,
  createUser,
  getGroupUser,
  getRoleList,
  editUser,
  deleteUser,
  getRolebyId,
  addGroupUser,
  deleteGroupUser,
  editGroupUser,
  // getPartnerList,
  changePassword,
  getListShift,
  getListDay,
  getListOverTimeShift,
  /* getPartnerList, */
  changePassword,
  addOverTimeShiftForStaff,
  addShiftForStaff,
  deleteOTShiftById,
  getOTChangeDay,
  getListTakeLeave, deleteTakeLeave, getListTakeLeaveByDay, addTakeLeave,
  getListCheckinOut, addCheckinOut, editCheckinOut, deleteCheckinOut, getListHistoryCheck,
  getListWeekdayShift, getShiftsCalendar, updateOverShift, updateTakeLeaveShift,
];
