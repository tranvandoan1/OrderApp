import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Size} from '../Component/size';
import {RadioButton} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../App/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {uploadBackground} from '../Features/SettingSlice';
import {dataEs} from '../assets/language/language';
import {dataVn} from './../assets/language/language';

type Props = {
  navigation: any;
  language: any;
  background: any;
  setLoading: (e: boolean) => void;
};

const Setting: React.FC<Props> = ({
  navigation,
  language,
  background,
  setLoading,
}) => {
  const width = Size()?.width;
  const [checked, setChecked] = useState<any>('vn');
  const dispatch = useDispatch<AppDispatch>();
  const textLanguage = language?.data?.setting;
  const languageSet = async (e: any) => {
    setLoading(true);
    await AsyncStorage.removeItem('language');
    await AsyncStorage.setItem('language', JSON.stringify('vn'));
    await dispatch(
      // @ts-ignore
      uploadBackground({
        data: e == 'vn' ? dataVn : dataEs,
        background: language?.background,
        language: e,
      }),
    );
    setLoading(false);
  };
  const backgroundSet = async (e: any) => {
    setLoading(true);
    await AsyncStorage.removeItem('background');
    await AsyncStorage.setItem('background', JSON.stringify(1));
    await dispatch(
      // @ts-ignore
      uploadBackground({
        data: language?.data,
        background: e,
        language: language?.language,
      }),
    );
    setLoading(false);
  };
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: background == 1 ? '#fff' : 'black',
        padding: 20,
      }}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: 'blue',
            width: '100%',
          }}>
          {/* <TouchableOpacity onPress={() => navigation.navigate('manage')}>
            <AntDesign name="left" style={styles.iconBack} />
          </TouchableOpacity> */}
          <Text
            style={[
              styles.titlePro,
              {
                fontSize: width < 720 ? 23 : 28,
                color: background == 2 ? '#fff' : 'black',
                paddingBottom: 10,
              },
            ]}>
            {textLanguage?.setting}
          </Text>
        </View>
      </View>
      <View style={{backgroundColor: background == 1 ? '#fff' : 'black'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: background == 2 ? '#fff' : 'black',
              width: width < 960 ? '25%' : '15%',
            }}>
            {textLanguage?.language} :{' '}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20,
              }}
              onPress={async () => {
                languageSet('vn');
              }}>
              <RadioButton
                value="first"
                status={language?.language == 'vn' ? 'checked' : 'unchecked'}
                color={background == 2 ? '#fff' : 'blue'}
                onPress={async () => {
                  languageSet('vn');
                }}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  color: background == 2 ? '#fff' : 'black',
                }}>
                Tiếng Việt
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20,
              }}
              onPress={async () => {
                languageSet('es');
              }}>
              <RadioButton
                value="first"
                status={language?.language == 'es' ? 'checked' : 'unchecked'}
                color={background == 2 ? '#fff' : 'blue'}
                onPress={async () => {
                  languageSet('es');
                }}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  color: background == 2 ? '#fff' : 'black',
                }}>
                Tiếng Anh
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: background == 1 ? '#fff' : 'black',
          marginTop: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: background == 2 ? '#fff' : 'black',
              width: width < 960 ? '25%' : '15%',
            }}>
            {textLanguage?.background}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20,
              }}
              onPress={async () => {
                backgroundSet(1);
              }}>
              <RadioButton
                value="first"
                status={background == 1 ? 'checked' : 'unchecked'}
                color={background == 2 ? '#fff' : 'blue'}
                onPress={async () => {
                  backgroundSet(1);
                }}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  color: background == 2 ? '#fff' : 'black',
                }}>
                Trắng
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20,
              }}
              onPress={async () => {
                backgroundSet(2);
              }}>
              <RadioButton
                value="first"
                status={background == 2 ? 'checked' : 'unchecked'}
                color={background == 2 ? '#fff' : 'blue'}
                onPress={async () => {
                  backgroundSet(2);
                }}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  color: background == 2 ? '#fff' : 'black',
                }}>
                Đen
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 15,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titlePro: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: Platform.OS == 'android' ? 'Roboto-Light' : 'Roboto-Bold',
    fontStyle: 'normal',
  },
  iconBack: {
    fontSize: 20,
    color: '#fff',
    marginRight: 10,
    fontWeight: '600',
  },
  iconRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputSearch: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginTop: 5,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  chart: {
    // transform: [{ rotate: "90deg" }],
    // marginTop:100
    flexDirection: 'row',
    backgroundColor: `#dff4d7`,
  },
});
