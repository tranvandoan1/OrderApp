import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../App/Store';

import { Size } from '../../Component/size';
import { Avatar } from 'react-native-elements';
import { checkUserAsyncStorage } from '../../Component/checkUser';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  logout: () => void
};
const AccountInfo = (props: Props) => {
  const width = Size()?.width;
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const [modalVisible, setModalVisible] = useState(false);
  const [checkLognout, setCheckLognout] = useState(false);
  const logout = async () => {
    setCheckLognout(true);
    setModalVisible(false);
    await AsyncStorage.removeItem('user');
    setCheckLognout(false);
    props?.logout()
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
      ) : modalVisible == true ? (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback
                onPress={() => setModalVisible(!modalVisible)}>
                <View style={{ flex: 1, width: '100%' }}></View>
              </TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Bạn có muốn đăng xuất không ?
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'center',
                  }}>
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonClose,
                      { marginRight: 30 },
                    ]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Hủy</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonLognout]}
                    onPress={() => logout()}>
                    <Text style={styles.textStyle}>Đăng xuất</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
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
                      uri: `${checkUserStorage?.data?.avatarRestaurant}`,
                    }}
                    size={120}
                  />
                </View>

                <Text
                  style={{
                    color: '#fff',
                    fontSize: width < 720 ? 18 : 23,
                    fontWeight: '500',
                    textTransform:'capitalize'
                  }}>
                  {checkUserStorage?.data?.nameRestaurant}
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

            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: 'row' }}>
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
                      style={{ color: 'black', fontWeight: '400', fontSize: 16 }}>
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
              <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center' }}>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  modalView: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonLognout: {
    backgroundColor: 'red',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'red',
    fontWeight: '500',
    fontSize: 20,
  },
});
