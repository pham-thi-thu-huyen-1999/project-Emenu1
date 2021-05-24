/**
 * @file reducer
 */
// Using to control stage
import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "FoodCategoryManagement";

const initialState = freeze({
  categoryItemList: [],
  isLoading: false,
  isError: false,
  generateId: '',
});

export default handleActions(
  {
    [actions.getCategoryItemList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getCategoryItemListSuccess]: (state, action) => {
      return freeze({
        ...state,
        categoryItemList: action.payload.data,
        isLoading: false
      });
    },
    [actions.getCategoryItemListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },

    /////////////////////////////////////////////

    [actions.createCategoryItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.createCategoryItemSuccess]: (state, action) => {
      return freeze({
        ...state,
        categoryItemList: state.categoryItemList.concat(action.payload.data),
        isLoading: false
      });
    },
    [actions.createCategoryItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    ///////////////////////////////////////////////////////////////
    [actions.deleteCategoryItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.deleteCategoryItemSuccess]: (state, action) => {
      var filtered = state.categoryItemList.filter(function (value, index, arr) {
        return value.id !== action.payload.category_id;
      });
      return freeze({
        ...state,
        categoryItemList: filtered,
        isLoading: false
      });
    },
    [actions.deleteCategoryItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    ///////////////////////////////////////////////////////////////
    [actions.editCategoryItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.editCategoryItemSuccess]: (state, action) => {
      // let newCategoryItem = [...state.categoryItemList];
      // for (let i = 0; i < newCategoryItem.length; i++) {
      //   if (newCategoryItem[i].id === action.payload.data.id) {
      //     newCategoryItem.splice(i, 1, action.payload.data);
      //   }
      // }
      return freeze({
        ...state,
        // categoryItemList: newCategoryItem,
        isLoading: false
      });
    },
    [actions.editCategoryItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    ////////////////////////////////////////////////////////////////

  },
  initialState
);
