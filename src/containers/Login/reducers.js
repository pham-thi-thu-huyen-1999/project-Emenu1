/**
 * @file reducer
 */

// Using to control stage

import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "LoginPage";

const initialState = freeze({
  userInfo: {},
  isLoading: false,
  isLogined: false,
  isError: false,
  errorMessage: "",
});

export default handleActions(
  {
    [actions.login]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.loginSuccess]: (state, action) => {
      return freeze({
        ...state,
        userInfo: action.payload.data,
        isLogined: true,
        isLoading: false
      });
    },
    [actions.loginFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload
      });
    },
  },
  initialState
);
