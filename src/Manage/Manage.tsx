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
import { checkUser } from '../size';
const Setting = ({navigation}: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [checkLognout, setCheckLognout] = useState(false);
  const checkUserStorage:any = checkUser();
  console.log(checkUserStorage.data,'dasdasd')
  const logout = async () => {
    setCheckLognout(true);
    setModalVisible(false);
    await setInterval(() => {
      setCheckLognout(false);
    }, 2000);
    await AsyncStorage.removeItem('user');
    navigation.navigate('Signin');
  };
  return (
    <>
      {checkLognout == true ? (
        <View style={styles.loading1}>
          <ActivityIndicator size="large" color={'#fff'} />
        </View>
      ) : checkUser == undefined ? (
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
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, .5)',
              padding: 10,
            }}>
            <Avatar
              rounded
              source={{
                uri: `${checkUserStorage.data?.avatar}`,
              }}
              size={150}
            />
            <Text style={{color: '#fff', fontSize: 18, margin: 10}}>
              {checkUser?.name}
            </Text>
          </View>
          <SafeAreaView style={{flex: 1}}>
            <ScrollView>
              <TouchableOpacity style={[styles.item, {marginTop: 0}]}>
                <View style={styles.li}>
                  <Icon name="chart" size={30} style={{marginRight: 4}} />
                  <Text style={styles.text}>Thống kê</Text>
                </View>
                <IconMaterialIcons name="navigate-next" size={20} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.item}>
                <View style={styles.li}>
                  <MaterialCommunityIcons
                    name="home-city-outline"
                    size={20}
                    style={{marginRight: 10, marginLeft: 5}}
                  />
                  <Text style={styles.text}>Tầng</Text>
                </View>
                <IconMaterialIcons name="navigate-next" size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.item}>
                <View style={styles.li}>
                  <MaterialCommunityIcons
                    name="table-furniture"
                    size={20}
                    style={{marginRight: 10, marginLeft: 5}}
                  />
                  <Text style={styles.text}>Bàn</Text>
                </View>
                <IconMaterialIcons name="navigate-next" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('categoris')}>
                <View style={styles.li}>
                  <MaterialIcons
                    name="category"
                    size={20}
                    style={{marginRight: 10,marginLeft:5}}
                  />
                  <Text style={styles.text}>Danh mục</Text>
                </View>
                <IconMaterialIcons name="navigate-next" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('list-product')}>
                <View style={styles.li}>
                  <FontAwesome
                    name="product-hunt"
                    size={20}
                    style={{marginRight: 10, marginLeft: 5}}
                  />
                  <Text style={styles.text}>Sản phẩm</Text>
                </View>
                <IconMaterialIcons name="navigate-next" size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.item}>
                <View style={styles.li}>
                  <Feather
                    name="shopping-cart"
                    size={20}
                    style={{marginRight: 10, marginLeft: 5}}
                  />
                  <Text style={styles.text}>Đơn hàng</Text>
                </View>
                <IconMaterialIcons name="navigate-next" size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.item}>
                <View style={styles.li}>
                  <AntDesign
                    name="user"
                    size={20}
                    style={{marginRight: 10, marginLeft: 5}}
                  />
                  <Text style={styles.text}>Tài khoản</Text>
                </View>
                <IconMaterialIcons name="navigate-next" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.item}
                onPress={() => setModalVisible(true)}>
                <View style={styles.li}>
                  <MaterialCommunityIcons
                    name="logout"
                    size={20}
                    style={{marginRight: 10, marginLeft: 5}}
                  />
                  <Text style={styles.text}>Đăng xuất</Text>
                </View>
                <IconMaterialIcons name="navigate-next" size={20} />
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
    borderWidth: 0.5,
    marginVertical: 5,
    paddingVertical: 10,
  },
  li: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  text: {
    fontSize: 16,
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
    backgroundColor: 'rgba(0, 0, 0, .9)',
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
