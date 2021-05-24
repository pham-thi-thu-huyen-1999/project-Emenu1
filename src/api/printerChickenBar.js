import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";
const endPoint = "/PrinterChickenBar";

// Cai dat may in cho bep/bar
export const getPrinterChickenBarList = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint}?language=vi&partner_id=${infoToken.partner_id}`);
};

export const getPrinterChickenBarById = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { printer_chicken_bar_id } = payload;
  return api.get(`${endPoint}/${printer_chicken_bar_id}?language=vi&partner_id=${infoToken.partner_id}`);
};

export const createPrinterChickenBar = payload => {
  const { data } = payload;
  return api.post(`${endPoint}?language=vi`, data);
};

export const deletePrinterChickenBar = payload => {
  const { printer_chicken_bar_id } = payload;
  return api.delete(`${endPoint}/${printer_chicken_bar_id}?language=vi`);
};

export const editPrinterChickenBar = payload => {
  const { printer_chicken_bar_id, data } = payload;
  return api.put(`${endPoint}/${printer_chicken_bar_id}?language=vi`, data);
};
