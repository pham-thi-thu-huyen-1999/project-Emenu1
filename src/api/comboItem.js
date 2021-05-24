import api from '../services/api';
import common from '../utils/common';
import { get } from "../services/localStorage";
const endPoint = "/ComboItem";

export const getComboList = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { page, limit } = payload
  return api.get(
    `${endPoint}`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        page: page,
        limit: limit
      }
    }
  )
};
export const getComboById = payload => {
  const { combo_item_id } = payload
  const url = [endPoint, combo_item_id].join("/")
  return api.get(url)
}

export const getItemCombo = payload => {
  const { combo_item_id, page, limit } = payload
  const url = [endPoint, combo_item_id, `ComboItemDetail`].join("/")
  return api.get(
    `${url}`,
    {
      params: {
        page: page,
        limit: limit
      }
    }
  )
}

export const createCombo = payload => {
  const { data } = payload
  return api.post(`${endPoint}?language=vi`, data)
}

export const updateCombo = payload => {
  const { data, combo_item_id } = payload
  const url = [endPoint, combo_item_id].join("/");
  return api.put(url, data)
}
export const deleteCombo = payload => {
  const { combo_item_id } = payload
  const url = [endPoint, combo_item_id].join("/")
  return api.delete(url)
}

export const getComboIcon = payload => {
  const url = "/ComboItemIcon"
  return api.get(url)
}
