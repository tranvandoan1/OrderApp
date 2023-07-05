import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
  DrawerLayoutAndroid,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from 'react-native-elements';
import { checkUserAsyncStorage } from '../Component/checkUser';
import { Size, SizeScale } from '../Component/size';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Setting from './Setting';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../App/Store';
import { getData } from './../Features/SettingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalConfim from '../Component/ModalConfim';
import Account from './Account/Account';
import ListBill from './Bill/ListBill';
import Navbar from './Navbar';
const Mangage = ({ navigation }: any) => {
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const width = Size().width;
  const widthScale = SizeScale().width;
  const drawer = useRef<DrawerLayoutAndroid>(null);
  const [router, setRouter] = useState<any>('bill');
  const [loading, setLoading] = useState<boolean>(false);
  const [logOut, setLogOut] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const setting = useAppSelect((data: any) => data.setting.value);
  const background = setting?.background;
  const language = setting;
  useEffect(() => {
    dispatch(getData());
  }, []);
  const logout = async () => {
    setLoading(true);
    setLogOut(false);
    await AsyncStorage.removeItem('background');
    await AsyncStorage.removeItem('language');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('checklogin');
    setLoading(false);
    navigation?.navigate('signin');
  };
  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={widthScale * 250}
      drawerPosition={'left'}
      renderNavigationView={() =>
        <Navbar
          width={width}
          widthScale={widthScale}
          background={background}
          language={language}
          navigation={navigation}
          router={router}
          setRouter={(e: any) => setRouter(e)}
          hiddeDrawer={() => drawer.current?.closeDrawer()}
        />
      }>
      <View
        style={{
          flex: 1,
          backgroundColor: background == 1 ? '#fff' : 'black',
          position: 'relative',
        }}>
        {loading == true && (
          <View style={styles.loading_g}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            backgroundColor: 'blue',
            alignItems: 'center',
            paddingVertical: 30,
            // paddingHorizontal: 10,
            position: 'relative',
            overflow: 'hidden',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              width: 320,
              height: 100,
              borderTopRightRadius: 100,
              backgroundColor: 'tomato',
              zIndex: 10,
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

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {
              width <= 960 &&

              <TouchableOpacity
                onPress={() => drawer.current?.openDrawer()}
                style={{
                  borderWidth: 1.5,
                  borderColor: '#CFCFCF',
                  borderRadius: 3,
                  padding: 3,
                  marginRight: 15,
                }}>
                <AntDesign
                  name="menuunfold"
                  size={width < 960 ? 30 : 23}
                  color={'#fff'}
                />
              </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={() => setLogOut(true)}
              style={{
                borderWidth: 1.5,
                borderColor: '#CFCFCF',
                borderRadius: 100,
                padding: 3,
                marginRight: 5,
              }}>
              <AntDesign
                name="logout"
                size={width < 960 ? 30 : 23}
                color={'#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            zIndex: 0,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <View style={{ flex: width < 960 ? 0 : 1 }}>
            {width > 960 && (
              <Navbar
                width={width}
                widthScale={widthScale}
                background={background}
                language={language}
                navigation={navigation}
                router={router}
                setRouter={(e: any) => setRouter(e)}
                hiddeDrawer={() => drawer.current?.closeDrawer()}

              />
            )}
          </View>


          <View
            style={{
              // width: width < 960 ? '100%' : '82%',
              flex: width < 960 ? 1 : 4.5,
              borderLeftWidth: 1,
              borderColor: '#dddddd',
              paddingLeft: width < 960 ? 0 : 10,
            }}>
            {router == 'setting' ? (
              <Setting
                language={language}
                background={background}
                navigation={navigation}
                setLoading={(e: boolean) => setLoading(e)}
              />
            ) : router == 'account' ? (
              <Account
                language={language}
                background={background}
                navigation={navigation}
                checkUserStorage={checkUserStorage}
              />
            ) : (
              <ListBill
                language={language}
                background={background}
                navigation={navigation}
                checkUserStorage={checkUserStorage}
              />
            )}
          </View>
        </View>
        {logOut == true && (
          <ModalConfim
            modalVisible={logOut}
            btnAccept={async () => {
              logout();
            }}
            btnCancel={() => {
              setLogOut(false);
            }}
            titile={'Thông báo'}
            content={'Bạn có muốn đăng xuất không ?'}
            textBtnAccept={'Có'}
            textBtnCancel={'Không'}
          />
        )}
      </View>
    </DrawerLayoutAndroid>
  );
};

export default Mangage;

const styles = StyleSheet.create({
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  loading_g: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.9)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
