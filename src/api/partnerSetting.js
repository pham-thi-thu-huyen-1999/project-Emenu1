import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";

const endPoint = "/Partner";
const PartnerSetting = "/PartnerSetting";

export const getPartnerSetting = (payload) => {
  let infoToken = common.decodeToken(get('accessToken'));
  /* let temp_partner_id = "e768374d-e86b-4a39-ac8e-187494f78693";
  console.log("partner_id", infoToken.partner_id, temp_partner_id) */
  return api.get(`${endPoint}/${infoToken.partner_id}${PartnerSetting}?language=vi`);
};

export const updatePartnerSetting = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  let { data } = payload;
  return api.put(
    `${endPoint}/${infoToken.partner_id}${PartnerSetting}?language=vi`,
    data
  );
};

export const getInfoVatSetting = (payload) => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint}/${infoToken.partner_id}/VatSetting?language=vi`);
};