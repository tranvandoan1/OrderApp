import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  ImageBackground,
  StatusBar,
} from 'react-native';
import React, { useEffect } from 'react';
import { Size } from './size';
import { Avatar, Button } from 'react-native-elements';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../App/Store';
import { getAllTable } from '../Features/TableSlice';
import { checkUserAsyncStorage } from './checkUser';

const Loading = ({ navigation }: any) => {
  const width = Size().width;
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const tables = useAppSelect((data: any) => data.tables);
  useEffect(() => {
    dispatch(getAllTable());
  }, []);
  const image = {
    uri: 'https://hthaostudio.com/wp-content/uploads/2019/08/Anh-food-layout-11-min-1180x760.jpg',
  };
  useEffect(() => {
    setTimeout(() => {
      navigation?.navigate('home')
    }, 1000);
  }, [])
  return (
    <View style={{ flex: 1 }}>
      {checkUserStorage?.check == false ? (
        navigation?.navigate('signin')
      )
        // : 
        // (tables?.value?.length <= 0 && tables?.loading == false) ||
        //   (tables?.value?.length > 0 && tables?.loading == false) ? (
        //   navigation?.navigate('home')
        // ) 
        : (
          <View style={{ position: 'relative' }}>
            <ImageBackground
              source={image}
              resizeMode="cover"
              style={{ width: '100%', height: '100%' }}>
              <View style={styles.background}></View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Avatar
                  rounded
                  source={{
                    uri: 'https://123design.org/wp-content/uploads/2020/07/LOGOLM0200-Chibi-%C4%90%E1%BB%87-nh%E1%BA%A5t-%C4%91%E1%BA%A7u-b%E1%BA%BFp-nh%C3%AD-Vua-%C4%91%E1%BA%A7u-b%E1%BA%BFp.jpg',
                  }}
                  size={width < 960 ? (width < 539 ? 200 : 230) : 280}
                />

                <Text
                  style={{
                    color: '#fff',
                    fontSize: width < 960 ? (width < 539 ? 20 : 30) : 40,
                    fontWeight: '700',
                  }}>
                  Order-TVD
                </Text>
                <ActivityIndicator size={57} color={'blue'} />
              </View>
            </ImageBackground>
          </View>
        )}
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
