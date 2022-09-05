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
import {getAllFloor} from '../Features/FloorSlice';
import Entypo from 'react-native-vector-icons/Entypo';
import {getAllTable} from '../Features/TableSlice';
import {checkUserAsyncStorage} from '../checkUser';
import {FlatGrid} from 'react-native-super-grid';
import {getAllSaveOrder} from '../Features/SaveOrderSlice';
import {Size} from '../size';
type Props = {
  route: any;
  navigation: any;
};
const Floor = ({navigation}: any, props: Props) => {
  const [dataFloors, setDataFloors] = useState<any>();
  const width = Size().width;
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const floors = useAppSelect((data: any) => data.floors.value);
  const tables = useAppSelect((data: any) => data.tables.value);
  const saveorders = useAppSelect((data: any) => data.saveorders.value);

  useEffect(() => {
    dispatch(getAllFloor());
    dispatch(getAllTable());
    dispatch(getAllSaveOrder());
  }, []);
  const [modalVisible, setModalVisible] = useState(false);

  const table1 = tables?.filter((item: any) => item.floor_id == floors[0]?._id);
  const table2 = tables?.filter(
    (item: any) => item.floor_id == dataFloors?._id,
  );
  let checkSaveOrder: any = [];
  tables?.map((element: any) => {
    let arrFilter = saveorders?.filter((e: any) => {
      return e.id_table === element._id;
    });
    checkSaveOrder.push({_id: element._id, data: arrFilter, sum: 0});
  });

  const order = (item: any) => {
    navigation?.navigate('orders', {
      id_table: item._id,
      floor_id: dataFloors == undefined ? floors[0]._id : dataFloors._id,
      name_table: item.name,
      name_floor: dataFloors == undefined ? floors[0].name : dataFloors.name,
    });
  };
  return (
    <>
      {table1.length <= 0 ? (
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
            itemDimension={200}
            data={dataFloors == undefined ? table1 : table2}
            renderItem={({item}) => {
              return (
                <View style={styles.listTable}>
                  <TouchableOpacity
                    style={styles.table}
                    onPress={() => order(item)}
                    key={item._id}>
                    {checkSaveOrder?.map((check: any, index: any) => {
                      if (check._id == item._id) {
                        if (check.data.length > 0) {
                          return (
                            <View
                              key={index}
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                              }}>
                              {/* <BlinkView
                                key={index}
                                delayVisible={500}
                                delayInvisible={200}
                                duration={500}
                                blinking> */}
                              <View
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: 100,
                                  backgroundColor: '#00FF00',
                                }}></View>
                              {/* </BlinkView> */}
                            </View>
                          );
                        }
                        check.data.map((price: any, indexx: any) => {
                          const tien = price.price * price.amount;
                          return (
                            <Text
                              style={{fontSize: 20, color: 'black'}}
                              key={indexx}>
                              {tien}
                            </Text>
                          );
                        });
                      }
                    })}
                    <Image
                      source={{
                        uri: 'https://png.pngtree.com/png-clipart/20220613/original/pngtree-dining-table-chairs-set-illustration-png-image_7997183.png',
                      }}
                      style={{width: 100, height: 100}}
                    />
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
                            color: 'black',
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
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    shadowColor: 'tomato',
    overflow: 'hidden',
  },
  table: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingVertical: 10,
    flexDirection: 'column',
    borderRadius: 10,
    alignItems: 'center',
  },
  nameTable: {
    textTransform: 'capitalize',
    textAlign: 'center',
    color: 'black',
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
