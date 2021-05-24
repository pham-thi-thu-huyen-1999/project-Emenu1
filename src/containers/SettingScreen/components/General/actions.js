import { createAction } from "redux-actions";
import * as CONSTS from "./constants";


export const getPartnerSetting = createAction(CONSTS.GETPARTNERSETTING);
export const getPartnerSettingSuccess = createAction(CONSTS.GETPARTNERSETTING_SUCCESS);
export const getPartnerSettingFail = createAction(CONSTS.GETPARTNERSETTING_FAIL);

export const updatePartnerSetting = createAction(CONSTS.UPDATEPARTNERSETTING);
export const updatePartnerSettingSuccess = createAction(CONSTS.UPDATEPARTNERSETTING_SUCCESS);
export const updatePartnerSettingFail = createAction(CONSTS.UPDATEPARTNERSETTING_FAIL);

export const getPartnerById = createAction(CONSTS.GETPARTNERBYID);
export const getPartnerByIdSuccess = createAction(CONSTS.GETPARTNERBYID_SUCCESS);
export const getPartnerByIdFail = createAction(CONSTS.GETPARTNERBYID_FAIL);

export const getCurrencyUnit = createAction(CONSTS.GETCURRENCYUNIT);
export const getCurrencyUnitSuccess = createAction(CONSTS.GETCURRENCYUNIT_SUCCESS);
export const getCurrencyUnitFail = createAction(CONSTS.GETCURRENCYUNIT_FAIL);