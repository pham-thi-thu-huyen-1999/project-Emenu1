import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";
let infoToken = common.decodeToken(get('accessToken'));
let partner_id = infoToken.partner_id;
const endPoint = "/Admin/AddonItem";

export const getAddonList = payload => {
  const { page, limit, name_search } = payload.data;
  return api.get(
    `${endPoint}`,
    {
      params: {
        language: "vi",
        partner_id,
        page,
        limit,
        name_search,
      }
    }
  )
};

export const createAddon = payload => {
  const { data } = payload;
  return api.post(`${endPoint}?language=vi`, data);
};

export const deleteAddon = payload => {
  const { addon_item_id } = payload;
  const url = [endPoint, addon_item_id].join("/");
  return api.delete(url);
};

export const editAddon = payload => {
  const { data, addon_item_id } = payload;
  const url = [endPoint, addon_item_id].join("/");
  return api.put(url, data);
};
