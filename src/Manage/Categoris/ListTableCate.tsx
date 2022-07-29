import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {DataTable} from 'react-native-paper';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../App/Store';
import {getAll} from '../../Features/CateSlice';

const ListTableCate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const categoris = useAppSelect((data: any) => data.categoris.value);
  useEffect(() => {
    dispatch(getAll());
  }, []);

  return (
    <View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Tên danh mục</DataTable.Title>
          <DataTable.Title numeric>Thao tác</DataTable.Title>
        </DataTable.Header>

        {categoris?.map((item: any) => {
          return (
            <DataTable.Row style={{height: 100}}>
              <DataTable.Cell>{item.name}</DataTable.Cell>;
            </DataTable.Row>
          );
        })}
      </DataTable>
    </View>
  );
};

export default ListTableCate;

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
});
