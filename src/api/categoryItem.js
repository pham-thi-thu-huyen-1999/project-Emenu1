import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";

const endPoint = "/CategoryItem";

export const getCategoryItemList = payload => {
  /* const { partner_id } = payload; */
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint}?language=vi&partner_id=${/* partner_id ? partner_id :  */infoToken.partner_id}`);
};

export const createCategoryItem = payload => {
  const { data } = payload;
  return api.post(`${endPoint}?language=vi`, data);
};

export const deleteCategoryItem = payload => {
  const { category_id } = payload;
  const url = [endPoint, category_id].join("/");
  return api.delete(url);
};

export const editCategoryItem = payload => {
  const { data, category_id } = payload;
  const url = [endPoint, category_id].join("/");
  return api.put(url, data);
};
