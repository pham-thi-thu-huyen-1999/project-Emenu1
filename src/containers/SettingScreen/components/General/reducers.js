/**
 * @file reducer
 */

// Using to control stage

import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "settingGeneral";

const initialState = freeze({
  partnerSetting: {},
  currencyUnitList: [],
  isLoading: false,
  userInfo: {},
  isError: false,
});

export default handleActions(
  {
    [actions.getPartnerSetting]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getPartnerSettingSuccess]: (state, action) => {
      return freeze({
        ...state,
        partnerSetting: { ...action.payload.data },
        isLoading: false,
      });
    },
    [actions.getPartnerSettingFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },

    ///////////////////////////////////////////////////////
    [actions.updatePartnerSetting]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.updatePartnerSettingSuccess]: (state, action) => {
      return freeze({
        ...state,
        partnerSetting: { ...action.payload.data },
        isLoading: false,
      });
    },
    [actions.updatePartnerSettingFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },

    ///////////////////////////////////////////////////////
    [actions.getPartnerById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getPartnerByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        userInfo: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getPartnerByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },

    ///////////////////////////////////////////////////////
    [actions.getCurrencyUnit]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getCurrencyUnitSuccess]: (state, action) => {
      return freeze({
        ...state,
        currencyUnitList: [...action.payload.data],
        isLoading: false,
      });
    },
    [actions.getCurrencyUnitFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
  },
  initialState
);