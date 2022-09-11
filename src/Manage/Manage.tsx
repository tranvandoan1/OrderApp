import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {checkUserAsyncStorage} from '../checkUser';
import {Size} from '../size';
import {FlatGrid} from 'react-native-super-grid';
const Setting = ({navigation}: any) => {
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const width = Size().width;
  const data = [
    {id: 1, name: 'Thống kê', navigation: 'statistical', icon: 'chart'},
    {id: 2, name: 'Tầng', navigation: 'floor', icon: 'home-city-outline'},
    {id: 3, name: 'Bàn', navigation: 'table', icon: 'table-furniture'},
    {id: 4, name: 'Danh mục', navigation: 'categoris', icon: 'category'},
    {id: 5, name: 'Sản phẩm', navigation: 'products', icon: 'product-hunt'},
    {id: 6, name: 'Đơn hàng', navigation: 'bill', icon: 'shopping-cart'},
  ];
  return (
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
      <FlatGrid
        itemDimension={200}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({item, index}: any) => {
          return (
            <TouchableOpacity
              style={[styles.item, {marginTop: 0}]}
              onPress={() => navigation.navigate(`${item.navigation}`)}>
              <View style={styles.li}>
                {index == 0 ? (
                  <Icon
                    name={`${item.icon}`}
                    size={40}
                    style={{marginRight: 4, color: 'black'}}
                  />
                ) : index == 1 || index == 2 ? (
                  <MaterialCommunityIcons
                    name={`${item.icon}`}
                    size={30}
                    style={{marginRight: 10, marginLeft: 5, color: 'black'}}
                  />
                ) : index == 3 ? (
                  <MaterialIcons
                    name={`${item.icon}`}
                    size={30}
                    style={{marginRight: 10, marginLeft: 5, color: 'black'}}
                  />
                ) : index == 4 ? (
                  <FontAwesome
                    name={`${item.icon}`}
                    size={30}
                    style={{marginRight: 10, marginLeft: 5, color: 'black'}}
                  />
                ) : (
                  index == 5 && (
                    <Feather
                      name={`${item.icon}`}
                      size={30}
                      style={{marginRight: 10, marginLeft: 5, color: 'black'}}
                    />
                  )
                )}
                <Text style={{fontSize: width < 720 ? 17 : 23, color: 'black'}}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginVertical: 5,
    paddingVertical: 60,
    borderRadius: 3,
    elevation: 10,
    shadowColor: '#FF9966',
    backgroundColor: '#fff',
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
});
