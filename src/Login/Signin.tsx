import {
  ActivityIndicator,
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
import React, { useState } from 'react';
import { Avatar } from 'react-native-elements';
import { Controller, useForm } from 'react-hook-form';
import UserAPI from '../API/Users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Size, SizeScale } from './../Component/size';
import ModalConfim from '../Component/ModalConfim';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
  const widthScale = SizeScale().width;
  const [check, setCheck] = useState<boolean>(false);
  const [confimSignUp, setConfimSignUp] = useState<boolean>(false);
  const [eye, setEye] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<ModalVisible>({
    error: null,
    status: false,
  });
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
      navigation?.navigate('loading',{id:1});
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
              paddingHorizontal: widthScale * 200,
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
                size={widthScale * 300}
              />
            </View>
            <View>
              <Text
                style={[
                  styles.title,
                  { fontSize: widthScale * 40 },
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
                              fontSize: widthScale * 23,
                              height: widthScale * 80,

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
                <View style={{ position: 'relative' }}>
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
                                fontSize: widthScale * 23,
                                height: widthScale * 80,
                              },
                            ]
                        }
                        placeholder="Password"
                        secureTextEntry={eye}
                        placeholderTextColor={errors.password && 'red'}
                      />
                    )}
                    name="password"
                  />
                  <TouchableOpacity style={styles.eye} onPress={() => setEye(!eye)}>
                    <FontAwesome5 name={eye ? 'eye' : 'eye-slash'} style={{ fontSize: widthScale * 30 }} />
                  </TouchableOpacity>
                  {errors.password && (
                    <Text style={styles.validate}>Password không để trống !</Text>
                  )}
                </View>
              </KeyboardAvoidingView>

              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                style={[styles.signin, {
                  height: widthScale * 80,

                }]}>
                <Text
                  style={[
                    {
                      fontSize: widthScale * 26,
                      fontWeight: '600',
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
                        size={widthScale * 45}
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
                    fontSize: widthScale * 25,
                  }}>
                  Bạn chưa có tài khoản ?
                </Text>
                <TouchableOpacity onPress={() => setConfimSignUp(true)}>
                  <Text
                    style={{
                      color: 'blue',
                      fontSize: widthScale * 26,
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
                : (setModalVisible({ error: null, status: false }));
            }}
            btnCancel={() => {
              confimSignUp
                ? setConfimSignUp(false)
                : setModalVisible({ error: null, status: false });
            }}
            titile={confimSignUp ? 'Thông báo' : 'Cảnh báo'}
            content={
              confimSignUp
                ? `Hãy truy cập trang web "${' https://admin-app-order.vercel.app/'}" này để đăng ký. Bạn có muốn đến trang web này không?`
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
    marginVertical: 5,
    borderRadius: 3,
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
    borderRadius: 3,
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
  eye: {
    position: 'absolute',
    top: 25,
    right: 20,
  }
});
