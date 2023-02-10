import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Avatar, Button } from 'react-native-elements';
import { Controller, useForm } from 'react-hook-form';
import UserAPI from '../API/Users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkUserAsyncStorage } from '../Component/checkUser';
import { Size } from './../Component/size';
import ModalConfim from '../Component/ModalConfim';
type FormData = {
  email: string;
  password: string;
};
type ModalVisible = {
  error: any;
  status: boolean;
};
const Signin = ({ navigation }: any) => {
  const width = Size().width;
  const [check, setCheck] = useState<boolean>(false);
  const [confimSignUp, setConfimSignUp] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<ModalVisible>({
    error: null,
    status: false,
  });
  const X: any = checkUserAsyncStorage();
  const checkUserStorage: any = Object.values(X)[2];
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = async (values: any) => {
    const user = {
      email: values.email,
      password: values.password,
    };
    setCheck(true);
    const { data } = await UserAPI.signin(user);
    if (data.error) {
      setModalVisible({
        error:
          data?.error?.code == undefined
            ? data.error
            : 'Email không đúng định dạng',
        status: true,
      });
      setCheck(false);
    } else {
      await AsyncStorage.setItem('checklogin', JSON.stringify({ check: true }));
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({ data: data.user, token: data.token }),
      );
      setCheck(false);
      navigation?.navigate('home');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true} />
      <SafeAreaView
        style={{
          height: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          backgroundColor: '#fff',
        }}>
        <ScrollView>
          <View
            style={{
              paddingVertical: 20,
              paddingHorizontal: width < 960 ? (width < 593 ? 20 : 150) : 350,
            }}>
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
                size={width < 960 ? (width < 539 ? 160 : 280) : 220}
              />
            </View>
            <View>
              <Text
                style={[
                  styles.title,
                  { fontSize: width < 960 ? (width < 539 ? 25 : 40) : 35 },
                ]}>
                Đăng nhập
              </Text>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }: any) => (
                    <TextInput
                      style={
                        errors.email
                          ? styles.inputActive
                          : [
                            styles.input,
                            {
                              fontSize:
                                width < 960 ? (width < 539 ? 14 : 25) : 20,
                            },
                          ]
                      }
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
                  render={({ field: { onChange, onBlur, value } }: any) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={
                        errors.password
                          ? styles.inputActive
                          : [
                            styles.input,
                            {
                              fontSize:
                                width < 960 ? (width < 539 ? 14 : 25) : 20,
                            },
                          ]
                      }
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
              </KeyboardAvoidingView>

              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                style={styles.signin}>
                <Text
                  style={[
                    {
                      fontSize: width < 960 ? (width < 539 ? 14 : 25) : 23,
                      color: '#fff',
                    },
                  ]}>
                  {check == true ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}>
                      <ActivityIndicator
                        size={width < 960 ? (width < 539 ? 25 : 26) : 28}
                        color={'#fff'}
                      />
                    </View>
                  ) : (
                    'Đăng nhập'
                  )}
                </Text>
              </TouchableOpacity>
              <View style={styles.hr}></View>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text
                  style={{
                    fontSize: width < 960 ? (width < 539 ? 14 : 25) : 20,
                  }}>
                  Bạn chưa có tài khoản ?
                </Text>
                <TouchableOpacity onPress={() => setConfimSignUp(true)}>
                  <Text
                    style={{
                      color: 'blue',
                      fontSize: width < 960 ? (width < 539 ? 14 : 25) : 20,
                    }}>
                    {' '}
                    Đăng ký
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        {(modalVisible?.status == true || confimSignUp == true) && (
          <ModalConfim
            modalVisible={modalVisible?.status || confimSignUp}
            btnAccept={async () => {
              confimSignUp == true
                ? (await Linking.openURL('https://admin-app-order.vercel.app/'),
                  setConfimSignUp(false))
                : (setModalVisible({ error: null, status: false }), reset());
            }}
            btnCancel={() => {
              confimSignUp
                ? setConfimSignUp(false)
                : setModalVisible({ error: null, status: false });
            }}
            titile={confimSignUp ? 'Thông báo' : 'Cảnh báo'}
            content={
              confimSignUp
                ? 'Bạn có muốn đến trang web này không?'
                : modalVisible?.error
            }
            textBtnAccept={confimSignUp ? 'Có' : 'Ok'}
            textBtnCancel={confimSignUp ? 'Không' : undefined}
          />
        )}
      </SafeAreaView>
    </View>

  );
};

export default Signin;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginVertical: 30,
    color: 'rgb(238, 77, 45)',
    fontWeight: '600',
  },
  input: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingLeft: 20,
    marginVertical: 10,
    borderRadius: 100,
    height: 70
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
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    height: 70,
    marginTop: 30
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
