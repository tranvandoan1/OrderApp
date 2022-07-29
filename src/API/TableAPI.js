import { axiosClient } from "./Axios.js";
const TableAPI = {
  getAll() {
    const url = `/table`;
    return axiosClient.get(url);
  },
  get(id) {
    const url = `/table/${id}`;
    return axiosClient.get(url);
  },
};
export default TableAPI;
export const remove = (id) => {
  const url = `/table/${id}`;
  return axiosClient.delete(url);
};
export const addTable = (table) => {
  const url = `/table`;
  return axiosClient.post(url, table);
};
export const uploadTable = (id, data) => {
  const url = `/table/${id}`;
  return axiosClient.put(url, data);
};
