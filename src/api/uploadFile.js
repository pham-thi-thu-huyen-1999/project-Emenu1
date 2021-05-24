import api from "../services/api";
const endPoint = "/upload";

export const upload = payload => {
  const { image } = payload;
  let data = new FormData();
  for (let i = 0; i < image.length; i++) {
    data.append("files", image[i]);
  }
  return api.post(`${endPoint}?language=vi`, data);
};

export const upload_image_account = payload => {
  const { image } = payload;
  let data = new FormData();
  data.append("files", image);
  return api.post(`${endPoint}?language=vi`, data);
};
