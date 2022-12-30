import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkUserAsyncStorage} from '../checkUser';
import {Size} from './../size';
type FormData = {
  email: string;
  password: string;
};
const Signin = ({navigation}: any) => {
  const width = Size().width;
  const [check, setCheck] = useState<Boolean>(false);
  const X: any = checkUserAsyncStorage();
  const checkUserStorage: any = Object.values(X)[2];
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
    // try {
    const user = {
      email: values.email,
      password: values.password,
    };
    setCheck(true);
    const {data} = await UserAPI.signin(user);
    if (data.error) {
      setCheck(false);
      Alert.alert(data.error);
    } else {
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({data: data.user, token: data.token}),
      );
      setCheck(false);
      navigation?.navigate('home');
    }
    // } catch (error: any) {
    //   setCheck(false);
    //   Alert.alert(error.response.data.error);
    // }
  };
  return (
    <>
      {checkUserStorage?.data !== undefined ? (
        navigation?.navigate('home')
      ) : (
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
                paddingHorizontal: width < 960 ? 50 : 300,
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
                  size={220}
                />
              </View>
              <View>
                <Text style={styles.title}>Đăng nhập</Text>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                        style={
                          errors.password ? styles.inputActive : styles.input
                        }
                        placeholder="Password"
                        secureTextEntry={true}
                        placeholderTextColor={errors.password && 'red'}
                      />
                    )}
                    name="password"
                  />
                  {errors.password && (
                    <Text style={styles.validate}>
                      Password không để trống !
                    </Text>
                  )}
                </KeyboardAvoidingView>

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
                  <Text style={{fontSize: 20}}>Bạn chưa có tài khoản ?</Text>
                  <TouchableOpacity
                    onPress={() => navigation?.navigate('signup')}>
                    <Text style={{color: 'blue', fontSize: 20}}> Đăng ký</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default Signin;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginVertical: 30,
    fontSize: 35,
    color: 'rgb(238, 77, 45)',
    fontWeight: '600',
  },
  input: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 2,
    fontSize: 18,
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
    fontSize: 20,
  },
  inputActive: {
    borderColor: 'red',
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 3,
    fontSize: 20,
  },
  validate: {
    color: 'red',
    fontWeight: '400',
  },
});
