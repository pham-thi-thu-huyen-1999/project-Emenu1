/**
 * @file reducer
 */

// Using to control stage

import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "Promotion";

const initialState = freeze({
  promotionList: [],
  isLoading: false,
  isError: false,
});

export default handleActions(
  {
    [actions.getPromotionList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getPromotionListSuccess]: (state, action) => {
      return freeze({
        ...state,
        promotionList: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getPromotionListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    ///////////////////////////////////////////////////////////////
    [actions.createPromotion]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.createPromotionSuccess]: (state, action) => {
      return freeze({
        ...state,
        promotionList: state.promotionList.concat(action.payload.data),
        isLoading: false,
      });
    },
    [actions.createPromotionFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    ///////////////////////////////////////////////////////////////
    [actions.deletePromotion]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.deletePromotionSuccess]: (state, action) => {
      const newPromotionList = state.promotionList.filter(
        (promotion) => promotion.id !== action.payload.data.promotion_id
      );
      return freeze({
        ...state,
        promotionList: newPromotionList,
        isLoading: false,
      });
    },
    [actions.deletePromotionFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    ///////////////////////////////////////////////////////////////
    [actions.editPromotion]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.editPromotionSuccess]: (state, action) => {
      const index = state.promotionList
        .map((promotion) => {
          return promotion.id;
        })
        .indexOf(action.payload.data.id);
      console.log("action.payload.data.id", action.payload.data.id);
      console.log(state.promotionList
        .map((promotion) => {
          return promotion.id;
        }));

      let newPromotionList = [...state.promotionList];
      newPromotionList.splice(index, 1, action.payload.data);

      return freeze({
        ...state,
        promotionList: newPromotionList,
        isLoading: false,
      });
    },
    [actions.editPromotionFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
  },

  initialState
);
