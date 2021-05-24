/**
 * @file reducer
 */

// Using to control stage

import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "settingTable";

const initialState = freeze({
  areaList: [],
  isLoading: false,
  isError: false,
  errorMessage: ""
});

export default handleActions(
  {
    [actions.createArea]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.createAreaSuccess]: (state, action) => {
      return freeze({
        ...state,
        areaList: state.areaList.concat(action.payload.data),
        isLoading: false
      });
    },
    [actions.createAreaFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    ///////////////////////////////////////////////////////////////////
    [actions.editArea]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.editAreaSuccess]: (state, action) => {
      let newAreaList = [...state.areaList];
      for (let i = 0; i < newAreaList.length; i++) {
        if (newAreaList[i].id === action.payload.data.id) {
          newAreaList.splice(i, 1, action.payload.data);
        }
      }
      return freeze({
        ...state,
        areaList: newAreaList,
        isLoading: false
      });
    },
    [actions.editAreaFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    //////////////////////////////////////////////////////////////////
    [actions.deleteArea]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.deleteAreaSuccess]: (state, action) => {
      var filtered = state.areaList.filter(function(value, index, arr) {
        return value.id !== action.payload.data.id;
      });

      return freeze({
        ...state,
        areaList: filtered,
        isLoading: false
      });
    },
    [actions.deleteAreaFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },
    ////////////////////////////////////////////////////////////////
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
    }
  },
  initialState
);
