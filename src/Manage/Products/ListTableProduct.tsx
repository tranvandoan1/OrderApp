import React, {useEffect, useState} from 'react';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../App/Store';
import {getAll} from '../../Features/CateSlice';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {getAllPro} from '../../Features/ProductsSlice';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Size} from '../../size';

const MyComponent = () => {
  const width = Size().width;
  const height = Size().height;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const products = useAppSelect((data: any) => data.products.value);
  useEffect(() => {
    dispatch(getAll());
    dispatch(getAllPro());
  }, []);
  return (
    <View style={{paddingHorizontal: 5}}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          {products.map((item: any, index: any) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 10,
                  borderColor: 'rgb(219,219,219)',
                  borderBottomWidth: 1,
                  alignItems: 'center',
                }}>
                <View style={{width: '40%'}}>
                  <Text style={styles.listTxt}>{item.name}</Text>
                </View>
                <View
                  style={{
                    width: '30%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={{uri: `${item.photo}`}}
                    style={{width: 100, height: 100}}
                  />
                </View>
                <View style={{width: width < 720 ? '30%' : '20%'}}>
                  <Text
                    style={[
                      styles.listTxt,
                      {textAlign: 'center'},
                    ]}>{`${item.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${
                    item.check == true ? '/KG' : 'đ'
                  }`}</Text>
                </View>
                {width > 720 && (
                  <View
                    style={{
                      width: '10%',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => console.log(item._id, 'edit')}>
                      <Feather
                        name="edit"
                        style={{fontSize: 22, marginRight: 10, color: 'blue'}}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => console.log(item._id, 'xóa')}>
                      <MaterialIcons
                        name="delete-outline"
                        style={{fontSize: 25, color: 'red'}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default MyComponent;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
  },
  listTxt: {
    textTransform: 'capitalize',
    // fontFamily: Platform.OS == 'android' ? 'Roboto-Light' : 'Roboto-Bold',
    fontStyle: 'normal',
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
  },
});
