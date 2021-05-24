import api from "../services/api";
import common from "../utils/common";
import { get } from "../services/localStorage";
import { baseURLV11 } from "../consts/constants";

const endPoint = "Excel";
const infoToken = common.decodeToken(get("accessToken"));

export const exportCalendar = (payload) => {
  const { params } = payload;
  return api.get(`${baseURLV11}/${endPoint}/Calendar`, {
    params: {
      language: "vi",
      ...params,
    },
    responseType: "blob"
  });
};