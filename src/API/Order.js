import { axiosClient } from "./Axios.js";
const OrderAPI = {
    getAll() {
        const url = `/order`;
        return axiosClient.get(url);
    },
    get(id) {
        const url = `/order/${id}`;
        return axiosClient.get(url);
    },
    add(orders) {
        const url = `/order`;
        return axiosClient.post(url, orders);
    },

};
export default OrderAPI;
export const remove = (id) => {
    const url = `/order/${id}`;
    return axiosClient.delete(url);
}