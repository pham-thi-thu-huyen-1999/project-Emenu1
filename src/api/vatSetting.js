import api from '../services/api';
import common from '../utils/common';
import { get } from "../services/localStorage";
const endPoint = "/VatSetting";

export const getInfoTaxSetting = payload => {
  const infoToken = common.decodeToken(get('accessToken'));
  return api.get(
    `Partner/${infoToken.partner_id}${endPoint}`,
    {
      params: {
        language: "vi"
      }
    }
  )
};

export const updateInfoTaxSetting = payload => {
  const infoToken = common.decodeToken(get('accessToken'));
  const { data } = payload
  return api.put(`Partner/${infoToken.partner_id}${endPoint}?language=vi`, data)
};
