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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkUserAsyncStorage} from '../checkUser';
import {Size} from '../size';
const Setting = ({navigation}: any) => {
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const width = Size().width;

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'black',
            alignItems: 'center',
            paddingVertical: 30,
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Avatar
              rounded
              source={{
                uri: `${checkUserStorage?.data?.avatar}`,
              }}
              size={70}
            />
            <Text
              style={{
                color: '#E8E8E8',
                fontSize: width < 720 ? 18 : 23,
                margin: 10,
                fontWeight: '400',
              }}>
              {checkUserStorage?.data?.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('account')}
            style={{
              borderWidth: 1.5,
              borderColor: '#CFCFCF',
              borderRadius: 100,
              padding: 3,
              marginRight: 5,
            }}>
            <Feather
              name="user"
              style={{
                color: '#CFCFCF',
                fontSize: 25,
              }}
            />
          </TouchableOpacity>
        </View>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.item, {marginTop: 0}]}
              onPress={() => navigation.navigate('statistical')}>
              <View style={styles.li}>
                <Icon
                  name="chart"
                  size={40}
                  style={{marginRight: 4, color: 'black'}}
                />
                <Text style={{fontSize: width < 720 ? 17 : 23, color: 'black'}}>
                  Thống kê
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('floor')}>
              <View style={styles.li}>
                <MaterialCommunityIcons
                  name="home-city-outline"
                  size={30}
                  style={{marginRight: 10, marginLeft: 5, color: 'black'}}
                />
                <Text style={{fontSize: width < 720 ? 17 : 23, color: 'black'}}>
                  Tầng
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('table')}>
              <View style={styles.li}>
                <MaterialCommunityIcons
                  name="table-furniture"
                  size={30}
                  style={{marginRight: 10, marginLeft: 5, color: 'black'}}
                />
                <Text style={{fontSize: width < 720 ? 17 : 23, color: 'black'}}>
                  Bàn
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('categoris')}>
              <View style={styles.li}>
                <MaterialIcons
                  name="category"
                  size={30}
                  style={{marginRight: 10, marginLeft: 5, color: 'black'}}
                />
                <Text style={{fontSize: width < 720 ? 17 : 23, color: 'black'}}>
                  Danh mục
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('list-product')}>
              <View style={styles.li}>
                <FontAwesome
                  name="product-hunt"
                  size={30}
                  style={{marginRight: 10, marginLeft: 5, color: 'black'}}
                />
                <Text style={{fontSize: width < 720 ? 17 : 23, color: 'black'}}>
                  Sản phẩm
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('bill')}>
              <View style={styles.li}>
                <Feather
                  name="shopping-cart"
                  size={30}
                  style={{marginRight: 10, marginLeft: 5, color: 'black'}}
                />
                <Text style={{fontSize: width < 720 ? 17 : 23, color: 'black'}}>
                  Đơn hàng
                </Text>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('account')}>
                <View style={styles.li}>
                  <AntDesign
                    name="user"
                    size={30}
                    style={{marginRight: 10, marginLeft: 5, color: 'black'}}
                  />
                  <Text
                    style={{fontSize: width < 720 ? 17 : 23, color: 'black'}}>
                    Tài khoản
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.item, {borderBottomWidth: 0}]}
                onPress={() => setModalVisible(true)}>
                <View style={styles.li}>
                  <MaterialCommunityIcons
                    name="logout"
                    size={30}
                    style={{marginRight: 10, marginLeft: 5, color: 'black'}}
                  />
                  <Text
                    style={{fontSize: width < 720 ? 17 : 23, color: 'black'}}>
                    Đăng xuất
                  </Text>
                </View>
                {/* <IconMaterialIcons name="navigate-next" size={30} /> *
              </TouchableOpacity> */}
          </ScrollView>
        </SafeAreaView>
      </View>
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
    fontSize: 20,
  },
  
});
