import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  ToastAndroid,
  Alert,
} from 'react-native';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {editBookTable, getAllTable} from '../Features/TableSlice';
import {FlatGrid} from 'react-native-super-grid';
import {getAllSaveOrder} from '../Features/SaveOrderSlice';
import {Size, SizeScale} from '../size';
import CheckChangeTable from '../Modal/ModalCheckChangeTable/CheckChangeTable';
import Feather from 'react-native-vector-icons/Feather';
import {Avatar} from 'react-native-elements';
import ModalBookTable from '../Modal/ModalBookTable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getUser} from './../Features/UserSlice';
type Props = {
  route: any;
  navigation: any;
};
const Home = ({navigation}: any, props: Props) => {
  const [dataFloors, setDataFloors] = useState<any>();
  const width = Size().width;
  const width1 = SizeScale();
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const tables = useAppSelect((data: any) => data.tables.value);
  const saveorders = useAppSelect((data: any) => data.saveorders.value);
  const users = useAppSelect((data: any) => data.users.value);
  const [bookTable, setBookTable] = useState<boolean>(false);
  const [select, setSelect] = useState<any>();
  const [checkSelect, setCheckSelect] = useState<any>();
  const [checkBookTable, setCheckBookTable] = useState<any>();
  const [checkChangeTable, setCheckChangeTable] = useState<boolean>(false);
  const saveorderCheckChangeTable = saveorders?.filter(
    (item: any) => item.id_table == select?._id,
  );
  useEffect(() => {
    dispatch(getAllTable());
    dispatch(getAllSaveOrder());
    dispatch(getUser());
  }, []);

  let checkSaveOrder: any = [];
  tables?.map((element: any) => {
    let arrFilter = saveorders?.filter((e: any) => {
      return e.id_table === element._id;
    });
    checkSaveOrder.push({_id: element._id, data: arrFilter, sum: 0});
  });

  const order = (item: any) => {
    checkSaveOrder?.map((check: any) => {
      if (
        (item._id == check._id &&
          check.data.length <= 0 &&
          item.timeBookTable == 'null') ||
        (item._id == check._id &&
          check.data.length >= 1 &&
          item.timeBookTable !== 'null') ||
        (item._id == check._id &&
          check.data.length >= 1 &&
          item.timeBookTable == 'null')
      ) {
        navigation?.navigate('orders', {
          table: item,
        });
      } else if (
        item._id == check._id &&
        check.data.length <= 0 &&
        item.timeBookTable !== 'null'
      ) {
        setCheckBookTable(item);
      }
    });
  };

  const renderBookTable = (item: any) => {
    const prices = item.data.map((item: any) => {
      if (item.weight) {
        return Math.ceil(+item.price * item.weight * +item.amount);
      } else {
        return Math.ceil(+item.price * +item.amount);
      }
    });
    let sum = 0;
    for (var i = 0; i < prices.length; i++) {
      sum += +prices[i];
    }
    return sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const cancelTable = async () => {
    Alert.alert('Bạn có muốn hủy bàn đặt này không', '', [
      {
        text: 'Không',
        onPress: () => setCheckBookTable(undefined),
      },
      {
        text: 'Có',
        onPress: async () => {
          setCheckChangeTable(true);
          await dispatch(
            // @ts-ignore
            editBookTable({
              id: checkBookTable?._id,
              nameUser: '',
              timeBookTable: 'null',
              amount: 0,
            }),
          );
          setCheckBookTable(undefined);
          setCheckChangeTable(false);
          ToastAndroid.show(`Hủy bàn đặt thành công`, ToastAndroid.SHORT);
        },
      },
    ]);
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {tables.length <= 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Avatar
                rounded
                source={{
                  uri: users?.avatarRestaurant,
                }}
                size={60}
              />
              {width < 960 ? (
                <View></View>
              ) : (
                <Text
                  style={[
                    styles.titlePro,
                    {fontSize: width < 960 ? 18 : 23, marginLeft: 10},
                  ]}>
                  {users?.nameRestaurant}
                </Text>
              )}
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
              <TouchableOpacity
                style={styles.bookTable}
                onPress={() => setBookTable(true)}>
                <Text style={{color: '#fff', fontSize: 16}}>Đặt bàn</Text>
              </TouchableOpacity>
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
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            <View
              style={{
                width: '100%',
                borderColor: 'rgb(219,219,219)',
                borderLeftWidth: 1,
              }}>
              <FlatGrid
                itemDimension={200}
                data={tables}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <View style={styles.listTable}>
                      <TouchableOpacity
                        style={styles.table}
                        onPress={() => order(item)}
                        onLongPress={() => setSelect(item)}
                        key={item._id}>
                        <View
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            flexDirection: 'row',
                            zIndex: 100,
                          }}>
                          {item.timeBookTable !== 'null' && (
                            <View
                              key={index}
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 100,
                                backgroundColor: 'red',
                                marginRight: 5,
                              }}></View>
                          )}
                          {checkSaveOrder?.map((check: any, index: any) => {
                            if (check._id == item._id) {
                              if (check.data.length > 0) {
                                return (
                                  <View
                                    key={index}
                                    style={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: 100,
                                      backgroundColor: '#00FF00',
                                    }}></View>
                                );
                              }
                            }
                          })}
                        </View>

                        <Image
                          source={require(`../assets/images/table.png`)}
                          style={{width: 100, height: 100, tintColor: 'blue'}}
                        />
                        <Text
                          style={[
                            styles.nameTable,
                            {fontSize: width < 960 ? 20 : 21},
                          ]}>
                          {item.name}
                        </Text>
                        {item.amount > 0
                          ? checkSaveOrder?.map((check: any, index: any) => {
                              if (check._id == item._id) {
                                if (check.data.length > 0) {
                                  return (
                                    <Text
                                      style={[
                                        {
                                          fontSize: width < 960 ? 18 : 16,
                                          color: '#00CC00',
                                          fontWeight: '500',
                                        },
                                      ]}>
                                      <Text style={{color: 'red'}}>
                                        {item.timeBookTable}{' '}
                                      </Text>
                                      {/* Tổng tiền  {sum} */}({' '}
                                      {renderBookTable(check)}đ )
                                    </Text>
                                  );
                                } else {
                                  return (
                                    <Text
                                      style={[
                                        {
                                          fontSize: width < 960 ? 18 : 16,
                                          color: '#00CC00',
                                          fontWeight: '500',
                                        },
                                      ]}>
                                      <Text style={{color: 'red'}}>
                                        {item.timeBookTable}{' '}
                                      </Text>
                                      {/* Tổng tiền  {sum} */}({' '}
                                      {renderBookTable(check)}đ )
                                    </Text>
                                  );
                                }
                              }
                            })
                          : checkSaveOrder?.map((check: any, index: any) => {
                              if (check._id == item._id) {
                                if (check.data.length > 0) {
                                  return (
                                    <Text
                                      style={[
                                        {
                                          fontSize: width < 960 ? 18 : 16,
                                          color: '#00CC00',
                                          fontWeight: '500',
                                        },
                                      ]}>
                                      {/* Tổng tiền  {sum} */}
                                      Tổng {renderBookTable(check)}đ
                                    </Text>
                                  );
                                } else {
                                  return (
                                    <Text
                                      style={[
                                        {
                                          fontSize: width < 960 ? 18 : 16,
                                          color: 'red',
                                          fontWeight: '500',
                                        },
                                      ]}>
                                      Trống
                                    </Text>
                                  );
                                }
                              }
                            })}
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          </View>
          <CheckChangeTable
            saveorderCheckChangeTable={saveorderCheckChangeTable}
            select={select}
            checkSelect={checkSelect}
            hiddeSelect={(e: any) => (
              setCheckSelect(undefined), setSelect(undefined)
            )}
            setCheckSelect={(e: any) => setCheckSelect(e)}
            hiddeCheckSelect={(e: any) => setCheckSelect(undefined)}
          />
        </View>
      )}
      <ModalBookTable
        bookTable={bookTable}
        hiddenBookTable={() => setBookTable(false)}
      />

      <Modal
        transparent={true}
        visible={checkBookTable !== undefined ? true : false}
        animationType="fade">
        <View
          style={[
            styles.centeredView,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Pressable
            onPress={() => setCheckBookTable(undefined)}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}></Pressable>

          <View
            style={[
              styles.navigationContainer,
              {
                width: width < 960 ? '50%' : '40%',
                elevation: 20,
                shadowColor: 'blue',
                borderRadius: 5,
              },
            ]}>
            <Text
              style={{
                color: 'black',
                fontWeight: '500',
                fontSize: 25,
                textAlign: 'center',
                paddingBottom: 10,
                borderColor: 'rgb(219,219,219)',
                borderBottomWidth: 1,
                width: '100%',
              }}>
              {checkBookTable?.name}
            </Text>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={styles.listTT}>Tên khách hàng : </Text>
                <Text style={styles.listTT}>{checkBookTable?.nameUser}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text style={styles.listTT}>Thời gian đến : </Text>
                <Text style={styles.listTT}>
                  {checkBookTable?.timeBookTable}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.listTT}>Số lượng khách hàng : </Text>
                <Text style={styles.listTT}>{checkBookTable?.amount}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation?.navigate('orders', {
                      table: checkBookTable,
                    });
                    setCheckBookTable(undefined);
                  }}
                  style={{
                    width: '70%',
                    borderRadius: 3,
                    backgroundColor: '#0099FF',
                    paddingVertical: 5,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '500',
                      fontSize: 18,
                      textAlign: 'center',
                    }}>
                    Gọi món
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  onPress={() => cancelTable()}
                  style={{
                    width: '70%',
                    borderRadius: 3,
                    backgroundColor: 'red',
                    paddingVertical: 5,
                  }}>
                  {checkChangeTable == true ? (
                    <ActivityIndicator size={25} color={'#fff'} />
                  ) : (
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: '500',
                        fontSize: 18,
                        textAlign: 'center',
                      }}>
                      Hủy bàn đặt
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    elevation: 4,
    shadowColor: 'tomato',
    borderColor: 'rgb(219,219,219)',
    borderRightWidth: 1,
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
  bookTable: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
    marginRight: 20,
  },
  listTT: {
    color: 'black',
    fontWeight: '500',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Home;
