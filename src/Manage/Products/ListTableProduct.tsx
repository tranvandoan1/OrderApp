import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {DataTable} from 'react-native-paper';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../App/Store';
import {getAll} from '../../Features/ProductsSlice';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MyComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const products = useAppSelect((data: any) => data.products.value);
  useEffect(() => {
    dispatch(getAll());
  }, []);
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>
          <Text style={{fontWeight: '500', fontSize: 14}}>Tên sản phẩm</Text>
        </DataTable.Title>
        <DataTable.Title
          numeric
          textStyle={{width: '100%', textAlign: 'center'}}>
          <Text style={{fontWeight: '500', fontSize: 14}}>Giá tiền</Text>
        </DataTable.Title>
        <DataTable.Title numeric>
          <Text style={{fontWeight: '500', fontSize: 14}}>Thao tác</Text>
        </DataTable.Title>
      </DataTable.Header>

      {products.length < 0 ? (
        <View style={styles.loading1}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (
        products?.map((item: any, index: any) => {
          return (
            <DataTable.Row key={index}>
              <DataTable.Cell textStyle={{width: '100%'}}>
                <Text style={{textTransform: 'capitalize', fontSize: 12}}>
                  {item.name}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell
                numeric
                textStyle={{textAlign: 'center', width: '100%', fontSize: 12}}>
                <Text>
                  {`${item.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${
                    item.check == true ? '/KG' : 'đ'
                  }`}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity>
                    <Feather
                      name="edit"
                      style={{fontSize: 18, marginRight: 10, color: 'blue'}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => console.log(item._id)}>
                    <MaterialIcons
                      name="delete-outline"
                      style={{fontSize: 20, color: 'red'}}
                    />
                  </TouchableOpacity>
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          );
        })
      )}
    </DataTable>
  );
};

export default MyComponent;
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
  loading1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
});
