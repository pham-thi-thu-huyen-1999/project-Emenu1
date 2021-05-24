/**
 * @file reducer
 */

// Using to control stage

import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "settingFood";

const initialState = freeze({
  unitItemList: [],
  isLoading: false,
  isError: false,
  errorMessage: ""
});

export default handleActions(
  {
    /*Get data
    /------------------------------------------- */
    [actions.getUnitItemList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getUnitItemListSuccess]: (state, action) => {
      return freeze({
        ...state,
        unitItemList:action.payload.data,
        isLoading: false
      });
    },
    [actions.getUnitItemListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },

    /*Create Item
    /------------------------------------------- */
    [actions.createUnitItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.createUnitItemSuccess]: (state, action) => {
      return freeze({
        ...state,
        unitItemList: action.payload.data,
        isLoading: false
      });
    },
    [actions.createUnitItemFail]: (state, action) => {
      return freeze({
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },

    /**
     * Edit Item ----------------------------------
     */
    [actions.editUnitItem]: (state, action) => {
      return freeze(
        {
          ...state,
          isLoading: true,
        }
      )
    },
    [actions.editUnitItemSuccess]: (state, action) => {
      const updateUnitItem = [...state.unitItemList]
      for (let index = 0; index < updateUnitItem.length; index++) {
        if(updateUnitItem[index].id === action.payload.data.id){
          updateUnitItem.splice(index,1, action.payload.data)
        }
      }
      return freeze({
        ...state,
        unitItemList: updateUnitItem,
        isLoading: false
      });

    }, [actions.editUnitItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message
      });
    },

    /*Delete Item
   /------------------------------------------- */
    [actions.deleteUnitItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.deleteUnitItemSuccess]: (state, action) => {
      var filtered = state.unitItemList.filter(function (value) {
        return value.id !== action.payload.data.id;
      });
      return freeze({
        ...state,
        unitItemList: filtered,
        isLoading: false
      });
    },
    [actions.deleteUnitItemFail]: (state, action) => {
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
