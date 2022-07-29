import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {checkUserStorage} from '../Features/CheckUserSlice';
let ko = [];
async function checkToken() {
  const checkUser = useSelector(data => data.checkuser.value);
  useEffect(() => {
    dispatch(checkUserStorage());
  }, []);
}
checkToken();
console.log(ko, '12323');
export const axiosClient = axios.create({
  baseURL: 'https://order-back-ay43ee7e7-tranvandoan1.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token !== undefined && token?.data?.slice(1, -1)}`,
  },
});
