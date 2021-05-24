/**
 * @file reducer
 */

// Using to control stage

import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
import pagination from "../../utils/pagination";
import { USER_LIST_LIMIT } from "../../consts/settings/userManagement";
export const name = "UserManagement";
export const userReducerName = "UserManagement";

const initialState = freeze({
  code: "",
  userInfo: {},
  userInfoStaff: {},
  userList: [],
  PartnerList: [],
  groupUser: [],
  roleList: [],
  infoGroup: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
  listArea: [],
  listShift: [],
  listDayWeek: [],
  listOverTimeShift: [],
  listArea: [],
  listShiftCalendar: [],
  listCheckedOTShift: [],
  dayChoosedOT: "",
  listTakeLeave: [],
  listTakeLeaveByDay: [],
  listCheckinOut: [],
  listCheckHistory: [],
  listShiftWeekday: [],
  totalUserList: 0,
  page: 0,
  limitPage: 0,
  noCalendar: [],
  indexUser: 0,
  infoPar: {}
});
const arrayUnique = (array) => {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j])
        a.splice(j--, 1);
    }
  }
  return a;
}
export default handleActions(
  {

    [actions.getListArea]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListAreaSuccess]: (state, action) => {
      return freeze({
        ...state,
        listArea: action.payload.data,
        isLoading: false,
      })
    },
    [actions.getListAreaFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },
    [actions.getPartnerList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getPartnerListSuccess]: (state, action) => {
      return freeze({
        ...state,
        PartnerList: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getPartnerListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.getAccountInfo]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getAccountInfoSuccess]: (state, action) => {
      const { data, infoPar } = action.payload;
      return freeze({
        ...state,
        userInfo: data.data,
        code: infoPar.data.code,
        infoPar: infoPar.data,
        isLogined: true,
        isLoading: false,
      });
    },
    [actions.getAccountInfoFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.getAccountInfoStaff]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getAccountInfoStaffSuccess]: (state, action) => {
      return freeze({
        ...state,
        userInfoStaff: action.payload.data,
        isLogined: true,
        isLoading: false,
      });
    },
    [actions.getAccountInfoStaffFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.getRoleList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getRoleListSuccess]: (state, action) => {
      return freeze({
        ...state,
        roleList: action.payload.data ? action.payload.data : action.payload,
        isLoading: false,
      });
    },
    [actions.getRoleListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.getRoleById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getRoleByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        infoGroup: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getRoleByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.getGroupUser]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getGroupUserSuccess]: (state, action) => {
      return freeze({
        ...state,
        groupUser: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getGroupUserFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.addGroupUser]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.addGroupUserSuccess]: (state, action) => {
      return freeze({
        ...state,
        groupUser: state.groupUser.concat(action.payload.data),
        isLoading: false,
      });
    },
    [actions.addGroupUserFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.deleteGroupUser]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.deleteGroupUserSuccess]: (state, action) => {
      var filtered = state.groupUser.filter((value) => {
        return value.id !== action.payload;
      });
      return freeze({
        ...state,
        groupUser: filtered,
        isLoading: false,
      });
    },
    [actions.deleteGroupUserFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.editGroupUser]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.editGroupUserSuccess]: (state, action) => {
      let newGroupUser = [...state.groupUser];
      for (let i = 0; i < newGroupUser.length; i++) {
        if (newGroupUser[i].id === action.payload.data.id) {
          newGroupUser.splice(i, 1, action.payload.data);
        }
      }
      return freeze({
        ...state,
        groupUser: newGroupUser,
        isLoading: false,
      });
    },
    [actions.editGroupUserFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    /**
     * list user
     */
    [actions.getUserList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getUserListSuccess]: (state, action) => {
      const { next_page,
        index, page_size,
        current_page, total } = action.payload;
      const data = index === 0
        ? [...action.payload.data]
        : [...state.userList, ...action.payload.data];
      return freeze({
        ...state,
        userList: data,
        limitPage: pagination(USER_LIST_LIMIT, total),
        indexUser: (page_size * current_page),
        page: next_page,
        isLoading: false,
      });
    },
    [actions.getUserListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.createUser]: (state, action) => {
      return freeze({
        ...state,
        errorMessage: "",
        isLoading: true,
      });
    },
    [actions.createUserSuccess]: (state, action) => {
      var group_type;
      group_type = state.groupUser.map(group => {
        if (group.id === action.payload.data.group_user_id) { return group.name }
      })
      action.payload.data = {
        ...action.payload.data, status: 1,
        user_group_type: group_type
      }
      return freeze({
        ...state,
        userList: [action.payload.data, ...state.userList],
        isLoading: false,
      });
    },
    [actions.createUserFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.editUser]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.editUserSuccess]: (state, action) => {
      let newUserList = [...state.userList];
      for (let i = 0; i < newUserList.length; i++) {
        if (newUserList[i].id === action.payload.data.staff_id) {
          action.payload.data = { ...action.payload.data, status: 1, created_at: newUserList[i].created_at, updated_at: newUserList[i].updated_at };
          newUserList.splice(i, 1, action.payload.data);
        }
      }
      return freeze({
        ...state,
        userList: newUserList,
        isLoading: false,
      });
    },
    [actions.editUserFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    [actions.deleteUser]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.deleteUserSuccess]: (state, action) => {
      var filtered = state.userList.map((user) => {
        if (user.staff_id ? user.staff_id : user.id === action.payload.data.id) {
          return { ...user, status: action.payload.data.status };
        }
        return user;
      });
      return freeze({
        ...state,
        userList: filtered,
        isLoading: false,
      });
    },
    [actions.deleteUserFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.getListShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getListShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        listShift: action.payload.data,
        isLoading: false
      });
    },
    [actions.getListShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    /**
     * list day
     */
    [actions.getListDay]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getListDaySuccess]: (state, action) => {
      return freeze({
        ...state,
        listDayWeek: action.payload.data,
        isLoading: false
      });
    },
    [actions.getListDayFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    /**
     * list overtime shift
     */
    [actions.getListOverShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getListOverShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        listOverTimeShift: action.payload.data,
        isLoading: false
      });
    },
    [actions.getListOverShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    /**
     * add OT Shift for staff
     */
    [actions.addOTShiftForStaff]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.addOTShiftForStaffSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      });
    },
    [actions.addOTShiftForStaffFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },

    /**
     * get list ot change day
     */
    [actions.getListOTChangeDay]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getListOTChangeDaySuccess]: (state, action) => {
      let { resOT, resCalendar } = action.payload;
      let listCheckedOTShift = [...resOT.data]
      let newLstOTS = [];
      listCheckedOTShift.map((item, index) => {
        newLstOTS[index] = item.Shift.id
        return newLstOTS
      })
      let listCheckedCalendar = [...resCalendar.data[0].shifts];
      let dayChoosedOT = resCalendar.data[0].date_at;
      // const dayChoosedOT = moment(day).format("DD-MM-YYYY");
      let newLstCalendar = [];
      listCheckedCalendar.map((item, index) => {
        newLstCalendar[index] = item.id
        return newLstCalendar
      })
      let listAll = [...newLstOTS, ...newLstCalendar]
      const newLst = arrayUnique(listAll);
      return freeze({
        ...state,
        listCheckedOTShift: newLst,
        isLoading: false,
        dayChoosedOT
      });
    },
    [actions.getListOTChangeDayFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    /**
     * get list take leave
     */
    [actions.getListTakeLeave]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getListTakeLeaveSuccess]: (state, action) => {
      return freeze({
        ...state,
        listTakeLeave: action.payload.data,
        isLoading: false
      });
    },
    [actions.getListTakeLeaveFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    /**
     * when select day
     */
    [actions.getListShiftByDayTakeLeave]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getListShiftByDayTakeLeaveSuccess]: (state, action) => {
      const { dataTakeLeave, dataCalendar } = action.payload;
      let listAllIdShift = [];
      let listCheckedCalendar = [...dataCalendar.data[0].shifts]
      let newLstCalendar = [];
      let newLstTakeLave = [];
      listCheckedCalendar.map((item, index) => {
        newLstCalendar[index] = item.id
      })
      state.listShift.map((item, index) => {
        listAllIdShift[index] = item.id
      })
      let newListAfterFilter = listAllIdShift.filter(item => !newLstCalendar.includes(item))
      let listCheckedTakeLeave = [...dataTakeLeave.data]
      listCheckedTakeLeave.map((item, index) => {
        newLstTakeLave[index] = item.Shift.id
        return newLstTakeLave
      })
      let lstALl = [...newLstTakeLave, ...newListAfterFilter]
      const newLst = arrayUnique([...lstALl]);
      return freeze({
        ...state,
        listTakeLeaveByDay: newLst,
        noCalendar: newListAfterFilter,
        isLoading: false
      });
    },
    [actions.getListShiftByDayTakeLeaveFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    /**
     * get list checkin - checkout
     */
    [actions.getListCheckinOut]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getListCheckinOutSuccess]: (state, action) => {
      return freeze({
        ...state,
        listCheckinOut: action.payload.data,
        isLoading: false
      });
    },
    [actions.getListCheckinOutFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    /**
     * list history check
     */
    [actions.getListHistoryCheck]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getListHistoryCheckSuccess]: (state, action) => {
      return freeze({
        ...state,
        listCheckHistory: action.payload.data,
        isLoading: false
      });
    },
    [actions.getListHistoryCheckFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    /**
     * list weekday shift
     */
    [actions.getListWeekdayShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getListWeekdayShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        listShiftWeekday: action.payload.data,
        isLoading: false
      });
    },
    [actions.getListWeekdayShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    /**
     * list shift calendar
     */
    [actions.getListCalendarOfUser]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getListCalendarOfUserSuccess]: (state, action) => {
      let listChecked = [...action.payload.data[0].shifts]
      let newLst = [];
      listChecked.map((item, index) => {
        newLst[index] = item.id
        return newLst
      })
      return freeze({
        ...state,
        listShiftCalendar: newLst,
        isLoading: false
      });
    },
    [actions.getListCalendarOfUserFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    }
  },
  initialState
);
