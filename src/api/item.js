import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";
import { partner_id } from "../consts/constants"

const endPoint = "/Admin/Item";

export const getListItemInit = payload => {
  return api.get(`${endPoint}?language=vi&partner_id=${partner_id}`);
};

export const getItemListBySearchAdvanced = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { name_search, category_id, group_type, page, limit } = payload;
  return api.get(
    `${endPoint}`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        name_search,
        category_id,
        group_type,
        page,
        limit
      }
    }
  )
}

export const getItemList = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { page, limit } = payload;
  return api.get(
    `${endPoint}`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        page,
        limit
      }
    }
  )
};

export const getGenerateById = payload => {
  const { data } = payload;
  return api.post(`${endPoint}/GenerateById?language=vi`, data);
};


export const deleteItem = payload => {
  const { food_id } = payload;
  const url = [endPoint, food_id].join("/");
  return api.delete(url);
};

export const createItem = payload => {
  const { data } = payload;
  return api.post(`${endPoint}?language=vi`, data);
};

export const editItem = payload => {
  const { data, food_id } = payload;
  const url = [endPoint, food_id].join("/");
  return api.put(url, data);
};

export const getItemListBySearch = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { group_type, page, limit, name_search } = payload;
  return api.get(
    `${endPoint}`,
    {
      params: {
        language: "vi",
        partner_id: infoToken.partner_id,
        name_search,
        group_type,
        page,
        limit
      }
    }
  )
}