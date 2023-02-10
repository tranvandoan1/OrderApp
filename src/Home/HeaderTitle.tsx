import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

import AntDesign from 'react-native-vector-icons/AntDesign';
// @ts-ignore
type Props = {
  route?: any;
  selectTable: boolean;
  navigation?: any;
  setSelectTable: () => void;
  setBookTable: () => void;
  setTableFilter: () => void;
  tableFilter: boolean;
};
const HeaderTitle = ({
  navigation,
  route,
  setSelectTable,
  selectTable,
  tableFilter,
  setTableFilter,
  setBookTable,
}: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 20,
        }}>
        <View
          style={{
            width: 15,
            height: 15,
            borderRadius: 100,
            backgroundColor: 'red',
          }}></View>
        <Text style={{color: '#fff', fontSize: 18, marginLeft: 10}}>
          Bàn đặt
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 20,
        }}>
        <View
          style={{
            width: 15,
            height: 15,
            borderRadius: 100,
            backgroundColor: '#00FF00',
          }}></View>
        <Text style={{color: '#fff', fontSize: 18, marginLeft: 10}}>
          Có khách
        </Text>
      </View>
      <TouchableOpacity style={styles.bookTable} onPress={() => setBookTable()}>
        <Text style={{color: '#fff', fontSize: 16, fontWeight: '500'}}>
          Đặt bàn
        </Text>
      </TouchableOpacity>
      <View
        style={[
          styles.bookTable,
          {
            backgroundColor: '#00CC00',
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}>
        <TouchableOpacity
          onPress={() => {
            setTableFilter();
          }}>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: '500'}}>
            {selectTable == undefined
              ? 'Lọc'
              : tableFilter == true
              ? 'Lọc'
              : selectTable?.name}
          </Text>
        </TouchableOpacity>
        {selectTable !== undefined && (
          <TouchableOpacity onPress={() => setSelectTable()}>
            <AntDesign
              name="closecircle"
              style={{
                color: 'red',
                fontSize: 18,
                marginLeft: 10,
                backgroundColor: '#fff',
                borderRadius: 100,
              }}
            />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('manage')}
        style={{
          borderWidth: 1.5,
          borderColor: '#fff',
          borderRadius: 100,
          padding: 3,
          marginRight: 5,
        }}>
        <Feather
          name="user"
          style={{
            color: '#fff',
            fontSize: 25,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderTitle;

const styles = StyleSheet.create({
  bookTable: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
    marginRight: 20,
  },
});
