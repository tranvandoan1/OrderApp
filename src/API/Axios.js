import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useEffect} from 'react';

export const axiosClient = axios.create({
  baseURL: 'https://order-back.vercel.app/api',
  headers: {
    // Accept: 'application/json',
    'Content-Type': 'application/json',
    // multipart/form-data
    // Authorization: `Bearer ${token !== undefined && token?.data?.slice(1, -1)}`,
  },
});
