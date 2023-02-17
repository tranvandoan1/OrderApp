import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export let checkUserAsyncStorage = async () => {
  const [checkUserLogin, setCheckUserLogin] = useState();
  async function checkUser() {
    const logStorage = await AsyncStorage?.getItem('user');
    const checklogin = await AsyncStorage?.getItem('checklogin');
    const user = JSON.parse(logStorage);
    setTimeout(() => {
      setCheckUserLogin(
        { data: user?.data, check: JSON.parse(checklogin)?.check == undefined ? false : JSON.parse(checklogin)?.check }
      );
    }, 1000);
  }
  useEffect(() => {
    checkUser();
  }, []);
  return checkUserLogin;
};
