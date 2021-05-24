import api from "../services/api";
const endPoint = "/Role";

export const getRoleList = payload => {
  return api.get(`${endPoint}?language=vi&page_size=10`);
};
