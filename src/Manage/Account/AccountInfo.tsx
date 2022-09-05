import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../App/Store';
import {getAll} from '../../Features/CateSlice';

import {Size} from '../../size';
import {Avatar} from 'react-native-elements';
import {checkUserAsyncStorage} from '../../checkUser';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {};
const AccountInfo = (props: Props, navigation: any) => {
  const width = Size()?.width;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const [modalVisible, setModalVisible] = useState(false);
  const [checkLognout, setCheckLognout] = useState(false);
  const logout = async () => {
    setCheckLognout(true);
    setModalVisible(false);
    await AsyncStorage.removeItem('user');
    setCheckLognout(false);
    navigation?.navigate('Signin');
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
      }}>
      {checkUserStorage?.data == undefined ? (
        <View style={styles.loading1}>
          <ActivityIndicator size="large" color={'#fff'} />
        </View>
      ) : checkLognout == true ? (
        <View style={styles.loading1}>
          <ActivityIndicator size="large" color={'#fff'} />
        </View>
      ) : (
        <SafeAreaView>
          <ScrollView>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: 'blue',
                paddingVertical: 60,
                marginTop: 5,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'blue',
                  borderColor: 'rgb(219,219,219)',
                  borderWidth: 2,
                  borderRadius: 100,
                  overflow: 'hidden',
                  paddingTop: 10,
                }}>
                <View>
                  <Avatar
                    rounded
                    source={{
                      uri: `https://123design.org/wp-content/uploads/2020/07/LOGOLM0200-Chibi-%C4%90%E1%BB%87-nh%E1%BA%A5t-%C4%91%E1%BA%A7u-b%E1%BA%BFp-nh%C3%AD-Vua-%C4%91%E1%BA%A7u-b%E1%BA%BFp.jpg`,
                    }}
                    size={120}
                  />
                </View>

                <Text
                  style={{
                    color: '#fff',
                    fontSize: width < 720 ? 18 : 23,
                    fontWeight: '500',
                  }}>
                  BOM BOM
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#B5B5B5',
                    width: 200,
                    paddingBottom: 5,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      padding: 5,
                      fontSize: 18,
                    }}>
                    Sửa
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{marginTop: 10}}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'rgb(219,219,219)',
                    borderRightWidth: 1,
                    paddingHorizontal: 30,
                    width: '50%',
                  }}>
                  <Avatar
                    rounded
                    source={{
                      uri: `${checkUserStorage?.data?.avatar}`,
                    }}
                    size={130}
                  />
                  <TouchableOpacity
                    style={{
                      borderWidth: 1.5,
                      borderColor: 'rgb(219,219,219)',
                      padding: 7,
                      borderRadius: 3,
                      marginTop: 10,
                    }}>
                    <Text
                      style={{color: 'black', fontWeight: '400', fontSize: 16}}>
                      Chọn ảnh
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '50%',
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      padding: 5,
                      fontSize: 18,
                    }}>
                    Tên quán : BOM BOM
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      padding: 5,
                      fontSize: 18,
                      marginVertical: 10,
                    }}>
                    Họ và Tên : {checkUserStorage?.data?.name}
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      padding: 5,
                      fontSize: 18,
                      marginBottom: 10,
                    }}>
                    Email : {checkUserStorage?.data?.email}
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      padding: 5,
                      fontSize: 18,
                    }}>
                    Số điện thoại : {checkUserStorage?.data?.phone}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                paddingVertical: 5,
                marginTop: 70,
              }}
              onPress={() => setModalVisible(true)}>
              <Text style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};

export default AccountInfo;

const styles = StyleSheet.create({
  logo: {
    width: 66,
    height: 200,
    backgroundColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 0,
    padding: 0,
  },
  list: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderColor: 'rgb(219,219,219)',
    borderWidth: 0.5,
    margin: 10,
    position: 'relative',
    borderRadius: 2,
    flexDirection: 'row',
    elevation: 5,
    shadowColor: 'tomato',
  },
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loading1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
