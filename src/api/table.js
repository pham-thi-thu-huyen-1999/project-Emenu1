import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";
import { getTableListArragementById } from "../api/area"
const endPoint = "/Table";

/**
 * Get list of table
 * @param {*} payload
 */
export const getTableList = (params) => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint}?language=vi&partner_id=${infoToken.partner_id}`, { params: params });
};

export const getTableListAll = () => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint}?language=vi&partner_id=${infoToken.partner_id}`);
}

export const getListTableByAreaId = ({ area_id }) => {
  const url = `Area/${area_id}${endPoint}?language=vi`
  return api.get(url);
};

// export const getListTableByAreaId = ({ area_id }) => {
//   const url = ['Area', area_id, 'Table'].join("/");
//   return api.get(url);
// }

export const getListTableArrangeByAreaId = ({ area_id }) => {
  const url = `${endPoint}?area_id=${area_id}`
  return api.get(url);
};
// export const getTableListArrangement = (payload)=>{
//   const { areaId } = payload;
//   const url = `${endPoint}?area_id=${areaId}`
//   let dataTable = api.get(url);
//   console.log(dataTable);
// }

/**
 * Create table
 * @param {*} payload
 */
export const createTable = (payload) => {
  const { data } = payload;
  return api.post(`${endPoint}?language=vi`, data);
};

/**
 * Update table
 * @param {*} payload
 */
export const editTable = (payload) => {
  const { data, table_id } = payload;
  const url = [endPoint, table_id].join("/");
  return api.put(url, data);
};
/**
 * Get info table by id
 * @param {*} payload
 */
export const getTableByID = (payload) => {
  const { data } = payload;
  const url = [endPoint, data.table_id].join("/");
  return api.get(url);
};

/**
 * Delete table
 * @param {*} payload
 */
export const deleteTable = (payload) => {
  const { table_id } = payload;
  const url = [endPoint, table_id].join("/");
  return api.delete(url);
};

/**
 * Update status of table
 * @param {*} payload
 */
export const updateStatus = (payload) => {
  const { selectedTable, status } = payload;
  const url = [endPoint, selectedTable.table_id, "status"].join("/");
  return api.put(url, { status: status });
};

/**
 * Join table
 */
export const joinTable = (params) => {
  const { join_tables, table_id } = params;
  const url = [endPoint, table_id, "TableJoin"].join("/");
  return api.post(url, join_tables);
};

/**
 * Get table join info
 */
export const getTableJoinInfo = (params) => {
  const { table_id } = params;
  const url = [endPoint, table_id, "TableJoin"].join("/");
  return api.get(url);
};

/**
 * Get QR code value
 */
export const generateQRCode = (params) => {
  const { table_id } = params;
  const url = [endPoint, table_id, "GenerateQrcode"].join("/");
  return api.put(url);
};

/**
 * Seperate table
 */
export const seperateTable = (params) => {
  const { join_tables, table_id } = params;
  const url = [endPoint, table_id, "TableJoin"].join("/");
  return api.post(url, join_tables);
};

/**
 * Update empty table
 */
export const updateEmptyTable = (payload) => {
  const { table_id, status } = payload;
  const url = [endPoint, table_id, "empty"].join("/");
  return api.put(url, { status: status });
}

/**
 * Get icon table
 * @param {*} payload
 */
export const getTableIcon = (payload) => {
  const url = "/TableIcon";
  return api.get(url);
};

/**
 * Search table
 * @param {*} payload
 */
export const searchTable = (params) => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint}?language=vi&partner_id=${infoToken.partner_id}`, { params: params });
};

/**
 * Do table statistics
 */
export const doTableStatistics = ({ partner_id }) => {
  return api.post(`/Partner/${partner_id}/AreaGeneral`);
};
export const updateStatusTableEmpty = (payload) => {
  const { table_id } = payload;
  const url = [endPoint, table_id, "empty"].join("/");
  return api.put(url);
}

export const updateStatusTableUsed = (payload) => {
  const { table_id } = payload;
  const url = [endPoint, table_id, "used"].join("/");
  return api.put(url);
}
