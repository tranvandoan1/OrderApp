import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Avatar, Button} from 'react-native-elements';
import {Controller, useForm} from 'react-hook-form';
import UserAPI from '../API/Users';
import ProAPI from '../API/ProAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
type FormData = {
  email: string;
  password: string;
};
const Signin = ({navigation}: any) => {
  const [check, setCheck] = useState<Boolean>(false);
  const [checkUser, setCheckUser] = useState<any>();
  useEffect(() => {
    async function checkUser() {
      const logStorage: any = await AsyncStorage?.getItem('user');
      const user = JSON.parse(logStorage);
      setCheckUser(user.data);
    }
    checkUser();
  }, []);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const user = {
        email: values.email,
        password: values.password,
      };
      setCheck(true);
      const {data} = await UserAPI.signin(user);

      await AsyncStorage.setItem(
        'user',
        JSON.stringify({data: data.user, token: data.token}),
      );

      setCheck(false);
      navigation?.navigate('Home');
    } catch (error: any) {
      setCheck(false);
      Alert.alert(error.response.data.error);
    }
  };
  return (
    <>
      {checkUser !== undefined ? (
        navigation?.navigate('Home')
      ) : (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{padding: 20}}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Avatar
                rounded
                source={{
                  uri: 'https://123design.org/wp-content/uploads/2020/07/LOGOLM0200-Chibi-%C4%90%E1%BB%87-nh%E1%BA%A5t-%C4%91%E1%BA%A7u-b%E1%BA%BFp-nh%C3%AD-Vua-%C4%91%E1%BA%A7u-b%E1%BA%BFp.jpg',
                }}
                size={150}
              />
            </View>
            <View>
              <Text style={styles.title}>Đăng nhập</Text>

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}: any) => (
                  <TextInput
                    style={errors.email ? styles.inputActive : styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Email/SĐT"
                    placeholderTextColor={errors.email && 'red'}
                  />
                )}
                name="email"
              />
              {errors.email && (
                <Text style={styles.validate}>Email không để trống !</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}: any) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={errors.password ? styles.inputActive : styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor={errors.password && 'red'}
                  />
                )}
                name="password"
              />
              {errors.password && (
                <Text style={styles.validate}>Password không để trống !</Text>
              )}

              <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                <Text style={styles.signin}>
                  {check == true ? (
                    <ActivityIndicator size="large" color={'#fff'} />
                  ) : (
                    'Đăng nhập'
                  )}
                </Text>
              </TouchableOpacity>
              <View style={styles.hr}></View>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text>Bạn chưa có tài khoản ?</Text>
                <TouchableOpacity
                  onPress={() => navigation?.navigate('Signup')}>
                  <Text style={{color: 'blue'}}> Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default Signin;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginVertical: 30,
    fontSize: 23,
    color: 'rgb(238, 77, 45)',
    fontWeight: '600',
  },
  input: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 2,
  },
  hr: {
    borderBottomColor: 'rgb(219, 219, 219)',
    borderBottomWidth: 0.4,
    marginVertical: 20,
  },
  signin: {
    backgroundColor: 'rgb(23, 76, 250)',
    width: '100%',
    padding: 10,
    borderRadius: 2,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
  },
  inputActive: {
    borderColor: 'red',
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 3,
  },
  validate: {
    color: 'red',
    fontWeight: '400',
  },
});
