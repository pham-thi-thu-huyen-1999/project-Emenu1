import api from "../services/api";
import api_v1_1 from "../services/api_v1_1";
import common from '../utils/common';
import { get } from "../services/localStorage";
const endPoint = "/Area";

const getAreaList = (params = null) => {
  return api.get(`${endPoint}`, params);
}

const getAreaListByPartner = ({partner_id}) => {
  return api_v1_1.get(`/Partner/${partner_id}/Area`);
}

const createArea = (params) => {
  return api.post(`${endPoint}`, params);
};

const getAreaInfo = (areaId) => {
  const url = [endPoint, areaId].join("/");
  return api.get(url);
};

const editArea = ({ params, areaId }) => {
  const url = [endPoint, areaId].join("/");
  return api.put(url, params);
};

const deleteArea = ({ areaId }) => {
  const url = [endPoint, areaId].join("/");
  return api.delete(url);
};

//Danh sách sắp xếp sơ đồ bàn theo khu vực
const getTableListArragementById = (payload) => {
  const { area_id } = payload;
  return api.get(
    `${endPoint}/${area_id}/Table?language=vi`
  );
}
//Gửi danh sách bàn đã sắp xếp theo khu vực
const postTableListArrangementById = ({params,areaId}) =>{
  const url = `${endPoint}/${areaId}/Arrange?language=vi`
  return api.post(url,params)
}

//Icon thong tin phu theo khu vuc
const getAreaIcon = () => {
  return api.get(`AreaIcon?language=vi`);
  //https://api-stg.omenu.vn/api/v1.0/AreaIcon?language=vi
}



const getAreaSubIcon = ({ areaId }) => {
  const url = [endPoint, areaId, 'AreaArrangeDetail'].join("/");
  return api.get(url);
};
/**
 * get list area by parner
 * @param {*} params
 */
const getAreaListByParnerId = () => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`/Partner/${infoToken.partner_id}${endPoint}?language=vi`);
}

export default {
  getAreaList,
  createArea,
  getAreaInfo,
  editArea,
  deleteArea,
  getTableListArragementById,
  postTableListArrangementById,
  getAreaIcon,
  getAreaSubIcon,
  getAreaListByParnerId,
  getAreaListByPartner
}
