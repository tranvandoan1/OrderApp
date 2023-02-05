import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

export let checkUserAsyncStorage = async () => {
  const [checkUser, setCheckUser] = useState();
  useEffect(() => {
      async function checkUser() {
      const logStorage = await AsyncStorage?.getItem('user');
      const user = JSON.parse(logStorage);
      setCheckUser(
        user == null ? undefined : {data: user.data, token: user.token},
      );
    }
    checkUser();
  }, []);
  return checkUser;
};
