import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export let checkUserAsyncStorage = async () => {
  const [checkUserLogin, setCheckUserLogin] = useState();
  /* A variable hoisting. */
  // console.log(h, 'ewqdsa',h1)
  console.log(h, 'chào nhé')
  let h = 12
  // var h1 = 2
  const k = () => {
    console.log(h, '13ew2qdsd21wq')
  }
  k()
  async function checkUser() {
    const logStorage = await AsyncStorage?.getItem('user');
    const checklogin = await AsyncStorage?.getItem('checklogin');
    const user = JSON.parse(logStorage);
    console.log(user, 'ewdsx')
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
