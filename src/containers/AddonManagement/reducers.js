/**
 * @file reducer
 */
import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
import pagination from "../../utils/pagination";
export const name = "AddonManagement";

const initialState = freeze({
  addonList: [],
  total: 0,
  limitPage: 0,
  page: 1,
  infoVatSetting: {},
  isLoading: false,
  isError: false,
});

export default handleActions(
  {
    /**
     * Get addon list with params
     */
    [actions.getAddonList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getAddonListSuccess]: (state, action) => {
      return freeze({
        ...state,
        page: action.payload.page,
        addonList: action.payload.page && action.payload.page === 1
          ? action.payload.data : [...state.addonList, ...action.payload.data],
        total: action.payload.total,
        limitPage: pagination(20, action.payload.total),
        isLoading: false
      });

    },
    [actions.getAddonListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    
    /**
     * Create addon
     */
    [actions.createAddon]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.createAddonSuccess]: (state, action) => {
      
      return freeze({
        ...state,
        isLoading: false
      });
    },
    [actions.createAddonFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },

    /**
     * Edit addon
     */
    [actions.editAddon]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.editAddonSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      });
    },
    [actions.editAddonFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },

    /**
     * Delete addon
     */
    [actions.deleteAddon]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.deleteAddonSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      });
    },
    [actions.deleteAddonFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    
    /**
     * Get Info vat setting by partner
     */
    [actions.getInfoVatSetting]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getInfoVatSettingSuccess]: (state, action) => {
      return freeze({
        ...state,
        infoVatSetting: action.payload.data,
        isLoading: false
      });
    },
    
    /**
     *  Create loading for page
     */
    [actions.startLoading]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
  },
  initialState
);
