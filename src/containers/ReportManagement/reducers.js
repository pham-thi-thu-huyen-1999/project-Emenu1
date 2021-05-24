/**
 * @file reducer
 */

// Using to control stage
import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "ReportManagement";

const initialState = freeze({
  partnerSetting: {},
  reportOverview: {},
  isLoading: false,
  isError: false,
});

export default handleActions(
  {
    //////////////////////////////////////////////////
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
    //////////////////////////////////////////////////
    [actions.getReportOverview]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getReportOverviewSuccess]: (state, action) => {
      return freeze({
        ...state,
        reportOverview: { ...action.payload.data },
        isLoading: false,
      });
    },
    [actions.getReportOverviewFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    //////////////////////////////////////////////////

  },
  initialState
)