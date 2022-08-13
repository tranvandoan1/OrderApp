import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

export function Size() {
  const [size, setSize] = useState<any>(Dimensions.get('screen'));

  Dimensions.addEventListener('change', function () {
    const width: any = Dimensions.get('screen').width;
    const height: any = Dimensions.get('screen').height;
    setSize({width: width, height: height});
  });

  return size;
}

export const checkUser = async () => {
  const [checkUser, setCheckUser] = useState<any>();
  useEffect(() => {
    async function checkUser() {
      const logStorage: any = await AsyncStorage?.getItem('user');
      const user = JSON.parse(logStorage);
      setCheckUser(user == null ? undefined : user);
    }
    checkUser();
  }, []);
  return checkUser;
};
