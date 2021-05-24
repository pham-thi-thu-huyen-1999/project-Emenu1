import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";
const endPoint = "/PrinterBill";

// Cai dat may in cho thu ngan
export const getPrinterBillList = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint}?language=vi&partner_id=${infoToken.partner_id}`);
};

export const getPrinterBillById = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { printer_bill_id } = payload;
  return api.get(`${endPoint}/${printer_bill_id}?language=vi&partner_id=${infoToken.partner_id}`);
};

export const createPrinterBill = payload => {
  const { data } = payload;
  console.log("data", data)
  return api.post(`${endPoint}?language=vi`, data);
};

export const deletePrinterBill = payload => {
  const { printer_bill_id } = payload;
  return api.delete(`${endPoint}/${printer_bill_id}?language=vi`);
};

export const editPrinterBill = payload => {
  const { printer_bill_id, data } = payload;
  return api.put(`${endPoint}/${printer_bill_id}?language=vi`, data);
};
