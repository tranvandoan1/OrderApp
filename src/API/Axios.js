import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {checkUserAsyncStorage} from '../checkUser';

const axiosClient = axios.create({
  baseURL: 'https://order-back.vercel.app/api',
});
axiosClient.interceptors.request.use(async req => {
  const logStorage = await AsyncStorage?.getItem('user');
  const user = JSON.parse(logStorage);
  req.headers['Authorization'] = 'Bearer ' + user?.token;
  req.headers['Content-Type'] = 'application/json';
  return req;
});
axiosClient.interceptors.response.use(
  res => {
    return res;
  },
  error => {
    return error.response;
  },
);

export {axiosClient};
