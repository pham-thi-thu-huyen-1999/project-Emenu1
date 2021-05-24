import api from "../services/api";

const endPoint = "/Currency";

export const getCurrencyUnit = payload => {
  return api.get(`${endPoint}?language=vi`);
};
