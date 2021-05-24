import api from "../services/api";
const endPoint = "/UnitItem";

export const getUnitItemList = payload => {
  return api.get(
    `${endPoint}?language=vi&partner_id=3fa85f64-5717-4562-b3fc-2c963f66afa6`
  );
};

export const createUnitItem = payload => {
  const data = payload;
  return api.post(`${endPoint}?language=vi`, data);
};

export const editUnitItem = payload => {

  const { updateItem, item_id } = payload;
  const url = [endPoint, item_id].join("/");
  return api.put(url, updateItem);
};

export const deleteUnitItem = payload => {
  const { item_id } = payload;
  const url = [endPoint, item_id].join("/");
  return api.delete(url);
};
