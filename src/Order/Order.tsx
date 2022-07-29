import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  DrawerLayoutAndroid,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {getAll} from '../Features/FloorSlice';
import Entypo from 'react-native-vector-icons/Entypo';
import {checkUserStorage} from '../Features/CheckUserSlice';
import {getAllTable} from '../Features/TableSlice';
import {Col, Grid, Row} from 'react-native-easy-grid';
import {getAllSaveOrder} from './../Features/SaveOrderSlice';

const Order = () => {
  const drawer = useRef<any>(null);
  const [dataFloors, setDataFloors] = useState<any>();
  const [checkDrawerLayoutAndroid, setCheckDrawerLayoutAndroid] =
    useState<any>();
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const floors = useAppSelect((data: any) => data.floors.value);
  const checkUser = useAppSelect((data: any) => data.checkuser.value);
  const tables = useAppSelect((data: any) => data.tables.value);
  const saveorders = useAppSelect((data: any) => data.saveorders.value);
  console.log(saveorders)
  //   const vegetables =  [

  //     {name:"beans",price: 5},
  //     {name:"tomato",price: 3},
  //     {name:"pumpkin",price: 2},
  //     {name:"broccoli",price: 7},
  // ]

  // console.log(floors.length);
  // // console.log(vegetables.sort((a,b) =>  a.price-b.price ))
  // if (floors.length > 0) {
  //   const ko = floors?.sort(
  //     (a: any, b: any) => a.numerical_order - b.numerical_order,
  //   );
  //   console.log(ko);
  // }

  useEffect(() => {
    dispatch(getAll());
    dispatch(checkUserStorage());
    dispatch(getAllTable());
    dispatch(getAllSaveOrder());
  }, []);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.titlePro}>
            {dataFloors == undefined ? floors[0]?.name : dataFloors.name}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Entypo name="dots-three-vertical" style={[styles.iconBack]} />
        </TouchableOpacity>
      </View>

      <SafeAreaView>
        <ScrollView style={{marginHorizontal: 10, marginTop: 20}}>
          {tables.length > 0 && (
            <View style={styles.listTable}>
              <Grid>
                {tables.map((item: any, index: any) => {
                  if (
                    dataFloors == undefined
                      ? item.floor_id == floors[0]?._id
                      : item.floor_id == dataFloors?._id
                  ) {
                    return (
                      <Col>
                        <TouchableOpacity
                          style={styles.table}
                          onPress={() => console.log(item._id)}
                          key={item._id}>
                          <Text style={styles.nameTable}>{item.name}</Text>
                        </TouchableOpacity>
                      </Col>
                    );
                  }
                })}
              </Grid>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback
            onPress={() => setModalVisible(!modalVisible)}>
            <View style={{flex: 1, width: '50%'}}></View>
          </TouchableWithoutFeedback>
          <View style={[styles.navigationContainer]}>
            {/* <TextInput
              style={styles.inputSearch}
              placeholder="Tìm kiếm sản phẩm"
            /> */}
            {floors?.map((item: any, index: any) => {
              if (checkUser?._id == item.user_id) {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.floor}
                    onPress={() => (
                      setDataFloors(item), setModalVisible(!modalVisible)
                    )}>
                    <Text style={{textAlign: 'center', fontWeight: '500'}}>
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
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  iconBack: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },

  navigationContainer: {
    backgroundColor: '#fff',
    width: '50%',
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
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor:'blue'
  },
  table: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginHorizontal: 5,
    borderRadius: 3,
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  nameTable: {
    textTransform: 'capitalize',
    textAlign: 'center',
    fontSize: 20,
  },
});

export default Order;
