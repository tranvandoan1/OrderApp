import {axiosClient} from './Axios.js';
const SaveorderAPI = {
  getAll() {
    const url = `/saveorder`;
    return axiosClient.get(url);
  },
  get(id) {
    const url = `/saveorder/${id}`;
    return axiosClient.get(url);
  },
};
export default SaveorderAPI;
export const add = saveorder => {
  const url = `/saveorder`;
  return axiosClient.post(url, saveorder);
};
export const upload = (id, saveorder) => {
  const url = `/saveorder/${id}`;
  return axiosClient.put(url, saveorder);
};
export const updateFind = (id, saveorder) => {
  const url = `/saveorders/${id}`;
  return axiosClient.put(url, saveorder);
};
export const remove = id => {
  const url = `/saveorder/${id}`;
  return axiosClient.delete(url);
};
export const removes = saveorder => {
  const url = `/saveorders`;
  return axiosClient.post(url, saveorder);
};
