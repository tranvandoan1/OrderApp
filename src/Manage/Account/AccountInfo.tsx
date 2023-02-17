import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';

import { Size } from '../../Component/size';
import { Avatar } from 'react-native-elements';
import { checkUserAsyncStorage } from '../../Component/checkUser';

type Props = {
  logout: () => void;
};
const AccountInfo = (props: Props) => {
  const width = Size()?.width;
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
      }}>
      {checkUserStorage?.data == undefined ? (
        <View style={styles.loading1}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) :
        <SafeAreaView>
          <ScrollView>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  // backgroundColor: 'blue',
                  borderColor: 'rgb(219,219,219)',
                  borderRightWidth: 2,
                  overflow: 'hidden',
                  paddingHorizontal: 30,
                  paddingVertical: 15,
                  marginRight: 30,
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
                    color: 'black',
                    fontSize: width < 720 ? 18 : 23,
                    fontWeight: '500',
                    textTransform: 'capitalize',
                  }}>
                  {checkUserStorage?.data?.nameRestaurant}
                </Text>
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
          </ScrollView>
        </SafeAreaView>
      }
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
  loading1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
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
  

});
