import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {Size} from '../../size';
import AccountInfo from './AccountInfo';
const Account = ({navigation}: any) => {
  const width = Size()?.width;
  const [checkSearch, setCheckSearch] = useState<any>(false);

  return (
    <View style={{flex: 1, width: '100%'}}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('manage')}
            style={{position: 'absolute', left: 0}}>
            <AntDesign name="left" style={styles.iconBack} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
            }}>
            <Text
              style={[
                styles.titlePro,
                {
                  fontSize: width < 720 ? 20 : 23,
                },
              ]}>
              Hồ sơ của bạn
            </Text>
          </View>
        </View>
      </View>

      {checkSearch == true && (
        <TextInput style={styles.inputSearch} placeholder="Tìm kiếm sản phẩm" />
      )}

      <AccountInfo />
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 15,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderColor: 'rgb(219,219,219)',
    borderBottomWidth: 1,
  },
  titlePro: {
    fontSize: 18,
    color: 'black',
    fontFamily: Platform.OS == 'android' ? 'Roboto-Light' : 'Roboto-Bold',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  iconBack: {
    fontSize: 20,
    color: 'black',
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
});
