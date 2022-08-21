import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkUserAsyncStorage} from '../checkUser';
import {Size} from '../size';
const Setting = ({navigation}: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [checkLognout, setCheckLognout] = useState(false);
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const width = Size().width;
  const logout = async () => {
    setCheckLognout(true);
    setModalVisible(false);
    await AsyncStorage.removeItem('user');
    setCheckLognout(false);
    navigation?.navigate('Signin');
  };
  return (
    <>
      {checkLognout == true ? (
        <View style={styles.loading1}>
          <ActivityIndicator size="large" color={'#fff'} />
        </View>
      ) : checkUserStorage == undefined ? (
        <View style={styles.loading}>
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
                <View style={{flex: 1, width: '100%'}}></View>
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
                      {marginRight: 30},
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
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#EEEEEE',
              padding: 10,
            }}>
            <Avatar
              rounded
              source={{
                uri: `${checkUserStorage.data?.avatar}`,
              }}
              size={150}
            />
            <Text
              style={{
                color: 'black',
                fontSize: width < 720 ? 18 : 25,
                margin: 10,
              }}>
              {checkUserStorage.data?.name}
            </Text>
          </View>
          <SafeAreaView style={{flex: 1}}>
            <ScrollView>
              <TouchableOpacity style={[styles.item, {marginTop: 0}]}>
                <View style={styles.li}>
                  <Icon
                    name="chart"
                    size={40}
                    style={{marginRight: 4, color: '#EEEEEE'}}
                  />
                  <Text
                    style={{fontSize: width < 720 ? 17 : 23, color: '#EEEEEE'}}>
                    Thống kê
                  </Text>
                </View>
                {/* <IconMaterialIcons
                  name="navigate-next"
                  size={30}
                  color={'#EEEEEE'}
                /> */}
              </TouchableOpacity>

              <TouchableOpacity style={styles.item}>
                <View style={styles.li}>
                  <MaterialCommunityIcons
                    name="home-city-outline"
                    size={30}
                    style={{marginRight: 10, marginLeft: 5, color: '#EEEEEE'}}
                  />
                  <Text
                    style={{fontSize: width < 720 ? 17 : 23, color: '#EEEEEE'}}>
                    Tầng
                  </Text>
                </View>
                {/* <IconMaterialIcons
                  name="navigate-next"
                  size={30}
                  color={'#EEEEEE'}
                /> */}
              </TouchableOpacity>
              <TouchableOpacity style={styles.item}>
                <View style={styles.li}>
                  <MaterialCommunityIcons
                    name="table-furniture"
                    size={30}
                    style={{marginRight: 10, marginLeft: 5, color: '#EEEEEE'}}
                  />
                  <Text
                    style={{fontSize: width < 720 ? 17 : 23, color: '#EEEEEE'}}>
                    Bàn
                  </Text>
                </View>
                {/* <IconMaterialIcons
                  name="navigate-next"
                  size={30}
                  color={'#EEEEEE'}
                /> */}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('categoris')}>
                <View style={styles.li}>
                  <MaterialIcons
                    name="category"
                    size={30}
                    style={{marginRight: 10, marginLeft: 5, color: '#EEEEEE'}}
                  />
                  <Text
                    style={{fontSize: width < 720 ? 17 : 23, color: '#EEEEEE'}}>
                    Danh mục
                  </Text>
                </View>
                {/* <IconMaterialIcons
                  name="navigate-next"
                  size={30}
                  color={'#EEEEEE'}
                /> */}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('list-product')}>
                <View style={styles.li}>
                  <FontAwesome
                    name="product-hunt"
                    size={30}
                    style={{marginRight: 10, marginLeft: 5, color: '#EEEEEE'}}
                  />
                  <Text
                    style={{fontSize: width < 720 ? 17 : 23, color: '#EEEEEE'}}>
                    Sản phẩm
                  </Text>
                </View>
                {/* <IconMaterialIcons
                  name="navigate-next"
                  size={30}
                  color={'#EEEEEE'}
                /> */}
              </TouchableOpacity>
              <TouchableOpacity style={styles.item}>
                <View style={styles.li}>
                  <Feather
                    name="shopping-cart"
                    size={30}
                    style={{marginRight: 10, marginLeft: 5, color: '#EEEEEE'}}
                  />
                  <Text
                    style={{fontSize: width < 720 ? 17 : 23, color: '#EEEEEE'}}>
                    Đơn hàng
                  </Text>
                </View>
                {/* <IconMaterialIcons
                  name="navigate-next"
                  size={30}
                  color={'#EEEEEE'}
                /> */}
              </TouchableOpacity>
              <TouchableOpacity style={styles.item}>
                <View style={styles.li}>
                  <AntDesign
                    name="user"
                    size={30}
                    style={{marginRight: 10, marginLeft: 5, color: '#EEEEEE'}}
                  />
                  <Text
                    style={{fontSize: width < 720 ? 17 : 23, color: '#EEEEEE'}}>
                    Tài khoản
                  </Text>
                </View>
                {/* <IconMaterialIcons
                  name="navigate-next"
                  size={30}
                  color={'#EEEEEE'}
                /> */}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.item, {borderBottomWidth: 0}]}
                onPress={() => setModalVisible(true)}>
                <View style={styles.li}>
                  <MaterialCommunityIcons
                    name="logout"
                    size={30}
                    style={{marginRight: 10, marginLeft: 5, color: '#EEEEEE'}}
                  />
                  <Text
                    style={{fontSize: width < 720 ? 17 : 23, color: '#EEEEEE'}}>
                    Đăng xuất
                  </Text>
                </View>
                {/* <IconMaterialIcons name="navigate-next" size={30} /> */}
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </View>
      )}
    </>
  );
};

export default Setting;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'rgb(219, 219, 219)',
    borderBottomWidth: 0.3,
    marginVertical: 5,
    paddingVertical: 10,
  },
  li: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  },
  loading1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
