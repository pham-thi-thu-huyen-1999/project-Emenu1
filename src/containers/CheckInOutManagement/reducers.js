import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
import pagination from "../../utils/pagination";
import * as CONSTS from "./consts";
export const name = "checkInOutManagement";
const initialState = freeze({
  isLoading: false,
  isError: false,
  calendarOfUser: [],
  accountList: [],
  listShifts: [],
  listCheckIn: [],
  overTimeList: [],
  takeLeaveList: [],
  replaceList: [],
  userInfo: {},
  employeeList: [],
  calendarOfUserByWeek: [],
  calendarOfUserByMonth: [],
  limitPageTakeLeave: 0,
  pageTakeLeave: 1,
  limitPageOverTime: 0,
  pageOverTime: 1,
  limitPageReplace: 0,
  pageReplace: 1,
  atCheckInPage: false,
});

export default handleActions(
  {
    //////////////////////////////////////////////////
    [actions.getCalendarOfUser]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getCalendarOfUserSuccess]: (state, action) => {
      return freeze({
        ...state,
        calendarOfUser: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getCalendarOfUserFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    //////////////////////////////////////////////////
    [actions.addCheckInOut]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.addCheckInOutSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
      });
    },
    [actions.addCheckInOutFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },
    //////////////////////////////////////////////
    [actions.getListShift]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [actions.getListShiftSuccess]: (state, action) => {
      return {
        ...state,
        listShifts: action.payload.data,
        isLoading: false,
      };
    },
    [actions.getListShiftFail]: (state, action) => {
      return {
        ...state,
        isError: true,
      };
    },

    /////////////////////////////////////////////////////////
    [actions.setPageOverTime]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        pageOverTime: action.payload,
        overTimeList: [],
      });
    },
    [actions.getOverTimeShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getOverTimeShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        limitPageOverTime: pagination(CONSTS.LIMIT, action.payload.total),
        overTimeList:
          state.pageOverTime && state.pageOverTime === 1
            ? action.payload.data
            : [...state.overTimeList, ...action.payload.data],
        pageOverTime: state.pageOverTime + 1,
        isLoading: false,
      });
    },
    [actions.getOverTimeShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },
    ////////////////////////////////////////////////////////
    [actions.deleteOverTimeShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.deleteOverTimeShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
      });
    },
    [actions.deleteOverTimeShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    /////////////////////////////////////////////////////////
    [actions.addOverTimeShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.addOverTimeShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
      });
    },
    [actions.addOverTimeShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    ///////////////////////////////////////////////////////
    [actions.getAccountList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getAccountListSuccess]: (state, action) => {
      return freeze({
        ...state,
        accountList: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getAccountListFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    //////////////////////////////////////////////////
    [actions.getUserInfo]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getUserInfoSuccess]: (state, action) => {
      return freeze({
        ...state,
        userInfo: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getUserInfoFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    ////////////////////////////////////////////////////////
    [actions.addTakeLeave]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.addTakeLeaveSuccess]: (state, action) => {
      return freeze({
        ...state,
        calendar: [],
        isLoading: false,
      });
    },
    [actions.addTakeLeaveFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },
    /////////////////////////////////////////////////////////
    [actions.setPageTakeLeave]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        pageTakeLeave: action.payload,
        takeLeaveList: [],
      });
    },
    [actions.getTakeLeaveShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getTakeLeaveShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        limitPageTakeLeave: pagination(CONSTS.LIMIT, action.payload.total),
        takeLeaveList:
          state.pageTakeLeave && state.pageTakeLeave === 1
            ? action.payload.data
            : [...state.takeLeaveList, ...action.payload.data],
        pageTakeLeave: state.pageTakeLeave + 1,
        isLoading: false,
      });
    },
    [actions.getTakeLeaveShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    /////////////////////////////////////////////////////////
    [actions.deleteTakeLeaveShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.deleteTakeLeaveShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
      });
    },
    [actions.deleteTakeLeaveShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },
    /////////////////////////////////////////////////////////
    [actions.resetCalendarOfUser]: (state, action) => {
      return freeze({
        ...state,
        calendarOfUser: [],
        isLoading: true,
      });
    },

    /////////////////////////////////////////////////////////
    [actions.addReplaceShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.addReplaceShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
      });
    },
    [actions.addReplaceShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    /////////////////////////////////////////////////////////
    [actions.deleteReplaceShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.deleteReplaceShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
      });
    },
    [actions.deleteReplaceShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    /////////////////////////////////////////////////////////
    [actions.setPageReplace]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        pageReplace: action.payload,
        replaceList: [],
        limitPageReplace: 0,
      });
    },
    [actions.getReplaceShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getReplaceShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        limitPageReplace: pagination(CONSTS.LIMIT, action.payload.total),
        replaceList:
          state.pageReplace && state.pageReplace === 1
            ? action.payload.data
            : [...state.replaceList, ...action.payload.data],
        pageReplace: state.pageReplace + 1,
        isLoading: false,
      });
    },
    [actions.getReplaceShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    //////////////////////////////////////////////////
    [actions.getCalendarOfUserByWeek]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getCalendarOfUserByWeekSuccess]: (state, action) => {
      return freeze({
        ...state,
        calendarOfUserByWeek: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getCalendarOfUserByWeekFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    //////////////////////////////////////////////////
    [actions.getEmployeeOfShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getEmployeeOfShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        employeeList: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getEmployeeOfShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    ///////////////////////////////////////////////////////
    [actions.addTakeLeaveForCalendar]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.addTakeLeaveForCalendarSuccess]: (state, action) => {
      return freeze({
        ...state,
        calendar: [],
        isLoading: false,
      });
    },
    [actions.addTakeLeaveForCalendarFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    //////////////////////////////////////////////////
    [actions.getCalendarOfUserByMonth]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getCalendarOfUserByMonthSuccess]: (state, action) => {
      return freeze({
        ...state,
        calendarOfUserByMonth: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getCalendarOfUserByMonthFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true,
      });
    },

    //////////////////////////////////////////////
    [actions.getListCheckIn]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [actions.getListCheckInSuccess]: (state, action) => {
      return {
        ...state,
        listCheckIn: action.payload.data,
        isLoading: false,
      };
    },
    [actions.getListCheckInFail]: (state, action) => {
      return {
        ...state,
        isError: true,
      };
    },
    //////////////////////////////////////////////
    [actions.deleteTakeLeaveForCalendar]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [actions.deleteTakeLeaveForCalendarSuccess]: (state, action) => {
      return {
        ...state,
        isLoading: false,
      };
    },
    [actions.deleteTakeLeaveForCalendarFail]: (state, action) => {
      return {
        ...state,
        isError: true,
      };
    },
    //////////////////////////////////////////////
    [actions.deleteOverTimeForCalendar]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [actions.deleteOverTimeForCalendarSuccess]: (state, action) => {
      return {
        ...state,
        isLoading: false,
      };
    },
    [actions.deleteOverTimeForCalendarFail]: (state, action) => {
      return {
        ...state,
        isError: true,
      };
    },
    //////////////////////////////////////////////
    [actions.deleteReplaceShiftForCalendar]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [actions.deleteReplaceShiftForCalendarSuccess]: (state, action) => {
      return {
        ...state,
        isLoading: false,
      };
    },
    [actions.deleteReplaceShiftForCalendarFail]: (state, action) => {
      return {
        ...state,
        isError: true,
      };
    },

    /////////////////////////////////////////////////////////
    [actions.setAtCheckInPage]: (state, action) => {
      return ({
        ...state,
        atCheckInPage: true,
      });
    },
    [actions.setNoAtCheckInPage]: (state, action) => {
      return ({
        ...state,
        atCheckInPage: false,
      });
    },
  },
  initialState
);
