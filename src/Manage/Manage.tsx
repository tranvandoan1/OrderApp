import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, Suspense} from 'react';
import {Avatar} from 'react-native-elements';
import {checkUserAsyncStorage} from '../Component/checkUser';
import {Size} from '../Component/size';
import {FlatGrid} from 'react-native-super-grid';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Setting from './Setting';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
// import VerticalBarGraph from '@chartiful/react-native-vertical-bar-graph';
// import { ECharts } from 'react-native-echarts-wrapper';
import {getData} from './../Features/SettingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalConfim from '../Component/ModalConfim';
import Account from './Account/Account';
import ListBill from './Bill/ListBill';
const Mangage = ({navigation}: any) => {
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const width = Size().width;

  const [router, setRouter] = useState<any>('bill');
  const [loading, setLoading] = useState<boolean>(false);
  const [logOut, setLogOut] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const setting = useAppSelect((data: any) => data.setting.value);
  const background = setting?.background;
  console.log(background, 'background');
  const language = setting;
  const data = [
    {
      id: 2,
      name: `${language?.data?.setting?.cart}`,
      navigation: 'bill',
      icon: 'shoppingcart',
    },
    {
      id: 3,
      name: `${language?.data?.setting?.account}`,
      navigation: 'account',
      icon: 'user',
    },
    {
      id: 1,
      name: `${language?.data?.setting?.setting}`,
      navigation: 'setting',
      icon: 'setting',
    },
    {
      id: 4,
      name: `${language?.data?.setting?.back}`,
      navigation: 'home',
      icon: 'arrowleft',
    },
  ];
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
    <Suspense
      fallback={
        <View style={styles.loading_g}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
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
            paddingHorizontal: 10,
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
        <View
          style={{
            zIndex: 0,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <View
            style={{
              zIndex: 0,
              flex: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
            <FlatGrid
              showsVerticalScrollIndicator={false}
              data={data}
              horizontal
              renderItem={({item, index}: any) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      {
                        backgroundColor:
                          router == item.navigation ? 'tomato' : '#fff',
                      },
                    ]}
                    onPress={() =>
                      item.id == 4
                        ? navigation.goBack()
                        : setRouter(`${item.navigation}`)
                    }>
                    <View style={styles.li}>
                      <AntDesign
                        name={`${item.icon}`}
                        size={40}
                        style={{
                          marginRight: 4,
                          color: router == item.navigation ? '#fff' : 'black',
                        }}
                      />
                      <Text
                        style={{
                          fontSize: width < 720 ? 17 : 23,
                          color: router == item.navigation ? '#fff' : 'black',
                        }}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <View
            style={{
              width: width < 960 ? '75%' : '82%',
              borderLeftWidth: 1,
              borderColor: '#dddddd',
              paddingLeft: 20,
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
    </Suspense>
  );
};

export default Mangage;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginVertical: 5,
    paddingVertical: 20,
    borderRadius: 3,
    elevation: 10,
    shadowColor: '#FF9966',
    marginTop: 0,
    width: 200,
    paddingLeft:20
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
