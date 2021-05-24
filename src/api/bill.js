import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";
const endPoint = "/Bill";

export const getBillList = (payload) => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint}?partner_id=${infoToken.partner_id}&language=vi&page=1&limit=100`);
};

export const getBillInfoById = (payload) => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { bill_id } = payload;
  return api.get(`${endPoint}/${bill_id}?partner_id=${infoToken.partner_id}&language=vi`);
};

export const getBillListByOrderId = (payload) => {
  const { order_id } = payload;
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint}?partner_id=${infoToken.partner_id}&order_id=${order_id}&language=vi`);
};

export const cancelBill = (payload) => {
  const { bill_id, reason } = payload;
  console.log("api", bill_id, reason)
  return api.put(`${endPoint}/${bill_id}/canceled?language=vi`, { reason });
};