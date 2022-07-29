import { axiosClient } from "./Axios.js";

const UserAPI = {
  signup(user) {
    const url = `/signup`;
    return axiosClient.post(url, user);
  },
  signin(user) {
    const url = `/signin`;
    return axiosClient.post(url, user);
  },
};
export default UserAPI;
export const upload = (id, data) => {
  const url = `/user/${id}`;
  return axiosClient.put(url, data);
}