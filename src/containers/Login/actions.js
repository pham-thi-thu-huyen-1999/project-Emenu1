import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const login = createAction(CONST.LOGIN);
export const loginSuccess = createAction(CONST.LOGIN_SUCCESS);
export const loginFail = createAction(CONST.LOGIN_FAIL);
