import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";

const endPoint = "/TableType";

export const getTableType = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(
    `${endPoint}?language=vi&partner_id=${infoToken.partner_id}`
  );
};
