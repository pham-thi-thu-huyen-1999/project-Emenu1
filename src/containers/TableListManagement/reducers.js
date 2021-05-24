/**
 * @file reducer
 */

// Using to control stage

import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
import pagination from "../../utils/pagination";
import * as CONSTS from "./constants";
export const name = "TableManagement";

const initialState = freeze({
  tableList: [],
  tableListAll: [],
  areaList: [{ name: "" }],
  limitPage: 0,
  page: 1,
  tableType: [],
  iconList: [],
  searchByArea: null,
  searchByName: "",
  isSearching: false,
  isLoading: false,
  isError: false,
  infoPartner: {},
  infoPartnerSetting: {}
});

export default handleActions(
  {
    [actions.getTableList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.setPage]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
        page: action.payload
      })
    },
    [actions.getTableListSuccess]: (state, action) => {
      return freeze({
        ...state,
        limitPage: pagination(CONSTS.LIMIT, action.payload.total),
        tableList: state.page && state.page === 1 ? action.payload.data : [...state.tableList, ...action.payload.data],
        page: state.page + 1,
        isLoading: false
      });
    },
    [actions.getTableListAll]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getTableListAllSuccess]: (state, action) => {
      return freeze({
        ...state,
        tableListAll: action.payload.data,
        isLoading: false
      });
    },
    [actions.getTableListAllFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    /////////////////////////////////////////////////////
    [actions.createTable]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.createTableSuccess]: (state, action) => {
      for (var area of state.areaList) {
        if (area.id === action.payload.data.area_id) {
          action.payload.data = { ...action.payload.data, area_name: area.name }
        }
      }
      return freeze({
        ...state,
        tableList: state.tableList.concat(action.payload.data),
        isLoading: false
      });
    },
    [actions.createTableFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    ////////////////////////////////////////////////////
    [actions.deleteTable]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.deleteTableSuccess]: (state, action) => {
      var filtered = state.tableList.filter(function (value, index, arr) {
        return value.id !== action.payload.table_id;
      });
      return freeze({
        ...state,
        tableList: filtered,
        isLoading: false
      });
    },
    [actions.deleteTableFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    ////////////////////////////////////////////////////
    [actions.editTable]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.editTableSuccess]: (state, action) => {
      for (var area of state.areaList) {
        if (area.id === action.payload.data.area_id) {
          action.payload.data = { ...action.payload.data, area_name: area.name }
        }
      }
      let editedTable = action.payload.data;
      let editedId = action.payload.data.id;
      let newTableList = [...state.tableList];
      for (let i = 0; i < newTableList.length; i++) {
        if (newTableList[i].id === editedId) {
          newTableList.splice(i, 1, editedTable);
          break;
        }
      }
      return freeze({
        ...state,
        tableList: newTableList,
        isLoading: false
      });
    },
    [actions.editTableFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    ////////////////////////////////////////////////////

    [actions.getAreaList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getAreaListSuccess]: (state, action) => {
      return freeze({
        ...state,
        areaList: action.payload.data,
        isLoading: false
      });
    },
    [actions.getAreaListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    ////////////////////////////////////////////////////////
    [actions.getTableType]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getTableTypeSuccess]: (state, action) => {
      return freeze({
        ...state,
        tableType: action.payload.data,
        isLoading: false
      });
    },
    [actions.getTableTypeFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    ////////////////////////////////////////////////////////
    [actions.searchTable]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.searchTableSuccess]: (state, action) => {
      return freeze({
        ...state,
        limitPage: pagination(CONSTS.LIMIT, action.payload.total),
        tableList: state.page && state.page === 1 ? action.payload.data : [...state.tableList, ...action.payload.data],
        page: state.page + 1,
        isLoading: false
      });
    },
    [actions.searchTableFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      });
    },
    /////////////////////////////////////////////////////
    [actions.getTableIcon]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getTableIconSuccess]: (state, action) => {
      return freeze({
        ...state,
        iconList: [...action.payload.data],
        isLoading: false
      });
    },
    [actions.getTableIconFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    /////////////////////////////////////////////////////
    [actions.loadTableShape]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.unLoadTableShape]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      });
    },
    [actions.setSearching]: (state, action) => {
      const { searchByName, searchByArea } = action.payload;
      return freeze({
        ...state,
        isSearching: true,
        isLoading: true,
        searchByName: searchByName,
        searchByArea: searchByArea,
      });
    },
    [actions.setNoSearching]: (state, action) => {
      return freeze({
        ...state,
        isSearching: false,
        searchByName: "",
        searchByArea: null,
        isLoading: true,
      });
    },
    [actions.resetTable]: (state, action) => {
      return freeze({
        ...state,
        tableList: [],
        page: 1,
        limitPage: 0,
      });
    },
    [actions.getInfoPartner]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getInfoPartnerSuccess]: (state, action) => {
      return freeze({
        ...state,
        infoPartner: { ...action.payload.data },
        isLoading: false,
      })
    },
    [actions.getInfoPartnerFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },

    // partner setting
    [actions.getInfoPartnerSetting]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getInfoPartnerSettingSuccess]: (state, action) => {
      return freeze({
        ...state,
        infoPartnerSetting: { ...action.payload.data },
        isLoading: false,
      })
    },
    [actions.getInfoPartnerSettingFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },

    //////////////////////////////////////////////////////////
    [actions.updateTableByNoti]: (state, action) => {
      const { data } = action.payload;
      // Lấy ra action của notification
      const { action: actionNoti, table_id } = data;
      let { tableList } = state;
      // check xem action có nằm trong các action cần cập nhật dữ liệu không
      if (CONSTS.ACTION_UPDATE_TABLE_MANAGEMENT.includes(actionNoti) && table_id) {
        switch (actionNoti) {
          // Xử lý khi nhận action gọi món
          case CONSTS.NOTI_ACTION_STAFF_ORDER_ITEM:
            tableList = tableList.map(table => {
              if (table.id === table_id) {
                table = { ...table, status: CONSTS.CHECKED };
              }
              return table;
            })
            break;
          // Xử lý khi nhận action chuyển bàn trống
          case CONSTS.NOTI_ACTION_RESET_TABLE:
            tableList = tableList.map(table => {
              if (table.id === table_id) {
                table = { ...table, status: CONSTS.NO_CHECKED };
              }
              return table;
            })
            break;
          default:
        }
      }
      return freeze({
        ...state,
        tableList,
        isLoading: false,
      });
    },
  },
  initialState
);
