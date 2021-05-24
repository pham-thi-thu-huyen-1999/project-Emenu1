/**
 * @file reducer
 */

// Using to control stage

import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "TableArrangement";

const initialState = freeze({
  areaInfo: {},
  tableList: [],
  tableArrangement: {},
  areaIconList: [],
  searchedTableList: [],
  isSearching: false,
  isLoading: false,
  isError: false
});

export default handleActions(
  {
    // Get area info
    [actions.getAreaInfo]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getAreaInfoSuccess]: (state, action) => {
      return freeze({
        ...state,
        areaInfo: action.payload.data,
        isLoading: false,
      })
    },
    [actions.getAreaInfoFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },
    [actions.getTableList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getTableListSuccess]: (state, action) => {
      return freeze({
        ...state,
        tableList: action.payload.data,
        isLoading: false
      });
    },
    [actions.getTableListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    // GET TABLELIST BY ID
    [actions.getTableListByAreaId]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getTableListByAreaIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        tableList: action.payload,
        isLoading: false
      });
    },
    [actions.getTableListByAreaIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    /* GET TABLELISTARRANGEMENT */
    [actions.getTableListArrangementById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getTableListArrangementByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        tableArrangement: action.payload.data,
        isLoading: false
      },);
    },
    [actions.getTableListArrangementByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    // GET AREA ICON
    [actions.getAreaIcon]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getAreaIconSuccess]: (state, action) => {
      return freeze({
        ...state,
        areaIconList: action.payload.data,
        isLoading: false
      });
    },
    [actions.getAreaIconFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    /* PUT TABLE ARRANGEMENT */
    [actions.postTableListArrangementById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.postTableListArrangementByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },
    [actions.postTableListArrangementByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      })
    },
    //PUT AREA
    [actions.editArea]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.editAreaSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },
    [actions.editAreaFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      })
    },
    //
    [actions.searchTable]: (state, action) => {
      const { searchByName, searchByArea } = action.payload;
      let tableListTemp = [...state.tableList];
      if (tableListTemp.length > 0) {
        if (searchByName !== "") {
          tableListTemp = tableListTemp.filter((tableItem, index) => {
            return tableItem.name.toUpperCase().indexOf(searchByName.toUpperCase()) > -1;
          })
        }
        if (searchByArea !== null) {
          tableListTemp = tableListTemp.filter((tableItem, index) => {
            return tableItem.area_id === searchByArea;
          })
        }
      }
      return freeze({
        ...state,
        searchedTableList: [...tableListTemp],
        isSearching: true,
        isLoading: false
      });
    },
  },
  initialState
);
