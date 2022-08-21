import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
} from 'react-native';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {getAll} from '../Features/FloorSlice';
import Entypo from 'react-native-vector-icons/Entypo';
import {getAllTable} from '../Features/TableSlice';
import {checkUserAsyncStorage} from '../checkUser';
import {FlatGrid} from 'react-native-super-grid';
import {getAllSaveOrder} from '../Features/SaveOrderSlice';
import {Size} from '../size';

const Floor = ({navigation}: any) => {
  const [dataFloors, setDataFloors] = useState<any>();
  const width = Size().width;
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const floors = useAppSelect((data: any) => data.floors.value);
  const tables = useAppSelect((data: any) => data.tables.value);
  useEffect(() => {
    dispatch(getAll());
    dispatch(getAllTable());
    dispatch(getAllSaveOrder());
  }, []);
  const [modalVisible, setModalVisible] = useState(false);

  const table1 = tables?.filter((item: any) => item.floor_id == floors[0]?._id);
  const table2 = tables?.filter(
    (item: any) => item.floor_id == dataFloors?._id,
  );
  const order = (id: any) => {
    navigation?.navigate('orders', {
      id_table: id,
      floor_id: dataFloors == undefined ? floors[0]._id : dataFloors._id,
    });
  };
  return (
    <>
      {floors == undefined ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={styles.header}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[styles.titlePro, {fontSize: width < 720 ? 18 : 25}]}>
                {dataFloors == undefined ? floors[0]?.name : dataFloors.name}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Entypo
                name="dots-three-vertical"
                style={[styles.iconBack, {fontSize: width < 720 ? 20 : 25}]}
              />
            </TouchableOpacity>
          </View>
          <FlatGrid
            itemDimension={300}
            data={dataFloors == undefined ? table1 : table2}
            renderItem={({item}) => {
              return (
                <View style={styles.listTable}>
                  <TouchableOpacity
                    style={styles.table}
                    onPress={() => order(item._id)}
                    key={item._id}>
                    {/* <Image
                      style={{width: 50, height: 50}}
                      source={require('../assets/images/playstore.png')}
                    /> */}
                    <Text
                      style={[
                        styles.nameTable,
                        {fontSize: width < 720 ? 20 : 23},
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          <Modal transparent={true} visible={modalVisible}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback
                onPress={() => setModalVisible(!modalVisible)}>
                <View
                  style={{flex: 1, width: width < 720 ? '50%' : '70%'}}></View>
              </TouchableWithoutFeedback>
              <View
                style={[
                  styles.navigationContainer,
                  {width: width < 720 ? '50%' : '30%'},
                ]}>
                {/* <TextInput
              style={styles.inputSearch}
              placeholder="Tìm kiếm sản phẩm"
            /> */}
                {floors?.map((item: any, index: any) => {
                  if (checkUserStorage?.data?._id == item.user_id) {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.floor}
                        onPress={() => (
                          setDataFloors(item), setModalVisible(!modalVisible)
                        )}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontWeight: '500',
                            fontSize: width < 720 ? 20 : 25,
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                })}
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  signin: {
    backgroundColor: 'blue',
    width: '100%',
    padding: 15,
    borderRadius: 2,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
  },
  header: {
    width: '100%',
    paddingVertical: 15,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'blue',
    paddingHorizontal: 10,
  },
  titlePro: {
    fontWeight: '500',
    color: '#fff',
  },
  iconBack: {
    color: '#fff',
    fontWeight: '600',
  },

  navigationContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  inputSearch: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginTop: 5,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  floor: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    padding: 10,
    borderRadius: 3,
    marginBottom: 10,
    width: '100%',
  },
  centeredView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  listTable: {
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  table: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  nameTable: {
    textTransform: 'capitalize',
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});

export default Floor;
