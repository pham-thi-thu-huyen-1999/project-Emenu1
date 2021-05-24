import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";

const endPoint = "/Order";
const endPointItem = "/Item";
const endPointComboItem = "/ComboItem";
const language = get("lng") || "vi";

export const getItemList = () => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint}/Item?partner_id=${infoToken.partner_id}`);
};

export const getComboItemList = payload => {
  const { partner_id } = payload
  let infoToken = common.decodeToken(get('accessToken'));
  let getDb= api.get(`Order/ComboItem?partner_id=${partner_id ? partner_id : infoToken.partner_id}&language=vi`)
  return getDb
};

export const getPartnerSetting = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { partner_id } = payload
  let getDb= api.get(
    `/Partner/${partner_id ? partner_id : infoToken.partner_id}/PartnerSetting?language=vi`
  );
  return getDb
};
export const getComboById = payload => {
  const { combo_item_id, partner_id } = payload;
  return api.get(
    `${endPoint}${endPointComboItem}/${combo_item_id}${endPointItem}?partner_id=${partner_id}&language=vi`
  );
}