import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Pressable,
  Modal,
  ToastAndroid,
  Alert,
} from 'react-native';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../App/Store';
import { getAllTable } from '../Features/TableSlice';
import { FlatGrid } from 'react-native-super-grid';
import { getAllSaveOrder } from '../Features/SaveOrderSlice';
import { Size, SizeScale } from '../size';
import CheckChangeTable from '../Modal/ModalCheckChangeTable/CheckChangeTable';
import Feather from 'react-native-vector-icons/Feather';
import { Avatar } from 'react-native-elements';
import ModalBookTable from '../Modal/ModalBookTable';
import { getUser } from './../Features/UserSlice';
import { removeOrder } from './../Features/TableSlice';
type Props = {
  route: any;
  navigation: any;
};
const Home = ({ navigation }: any, props: Props) => {
  const width = Size().width;
  const width1 = SizeScale();
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const tables = useAppSelect((data: any) => data.tables.value);
  const saveorders = useAppSelect((data: any) => data.saveorders.value);
  const users = useAppSelect((data: any) => data.users.value);
  const [bookTable, setBookTable] = useState<boolean>(false);
  const [selectionTable, setSelectionTable] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

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
    checkSaveOrder.push({ _id: element._id, data: arrFilter, sum: 0 });
  });

  const order = (item: any) => {
    if (((item?.orders?.length > 0 || item?.orders !== null) && item.timeBookTable !== 'null') || ((item?.orders?.length <= 0 || item?.orders == null) && item.timeBookTable == 'null')
    ) {
      navigation?.navigate('orders', {
        table: item,
      });
    } else if (item.timeBookTable !== 'null') {
      setSelectionTable(item);
    }
  };

  const renderBookTable = (item: any) => {
    const prices = item?.map((item: any) => {
      if (item?.weight > 0) {
        return Math.ceil(+item?.price * item?.weight * +item?.amount);
      } else {
        return Math.ceil(+item?.price * +item?.amount);
      }
    });
    let sum = 0;
    for (var i = 0; i < prices?.length; i++) {
      sum += +prices[i];
    }
    return sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const removeOrderTable = async () => {
    Alert.alert('Bạn có muốn hủy này không', '', [
      {
        text: 'Không',
        onPress: () => setSelectionTable(undefined),
      },
      {
        text: 'Có',
        onPress: async () => {
          setSelectionTable(undefined);
          setLoading(true)
          await dispatch(
            // @ts-ignore
            removeOrder({
              id: selectionTable?._id
            }),
          );
          setLoading(false)
          ToastAndroid.show(`Hủy bàn đặt thành công`, ToastAndroid.SHORT);
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading == true && (
        <View style={styles.loading_g}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      {tables.length <= 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    { fontSize: width < 960 ? 18 : 23, marginLeft: 10 },
                  ]}>
                  {users?.nameRestaurant}
                </Text>
              )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                <Text style={{ color: '#fff', fontSize: 18, marginLeft: 10 }}>
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
                <Text style={{ color: '#fff', fontSize: 18, marginLeft: 10 }}>
                  Có khách
                </Text>
              </View>
              <TouchableOpacity
                style={styles.bookTable}
                onPress={() => setBookTable(true)}>
                <Text style={{ color: '#fff', fontSize: 16 }}>Đặt bàn</Text>
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
          <View style={{ flexDirection: 'row', flex: 1 }}>
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
                renderItem={({ item, index }) => {
                  console.log(item, 'dâsasdasd')
                  return (
                    <View style={styles.listTable}>
                      <TouchableOpacity
                        style={styles.table}
                        onPress={() => order(item)}
                        onLongPress={() => {
                          // check xem bàn đó đã gọi món chưa nếu rồi hiện mockup chọn chuyển bàn hoặc hủy
                          if ((item?.orders?.length > 0 && (item?.timeBookTable == 'null' || item?.timeBookTable !== 'null'))) {
                            setSelectionTable(item);
                          }
                        }}
                        key={item._id}>
                        <View
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            flexDirection: 'row',
                            zIndex: 100,
                          }}>
                          {(item.timeBookTable !== 'null') ? (
                            <View
                              key={item}
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 100,
                                backgroundColor: 'red',
                                marginRight: 5,
                              }}></View>
                          ) : null}
                          {item?.orders?.length > 0 && (
                            <View
                              key={item}
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 100,
                                backgroundColor: '#00FF00',
                              }}></View>
                          )}
                        </View>

                        <Image
                          source={require(`../assets/images/table.png`)}
                          style={{ width: 100, height: 100, tintColor: 'blue' }}
                        />
                        <Text
                          style={[
                            styles.nameTable,
                            { fontSize: width < 960 ? 20 : 21 },
                          ]}>
                          {item.name}
                        </Text>

                        <Text
                          style={[
                            {
                              fontSize: width < 960 ? 18 : 16,
                              color: '#00CC00',
                              fontWeight: '500',
                            },
                          ]}>
                          {(item?.orders?.length <= 0 ||
                            item?.orders?.length == undefined) &&
                            (item.timeBookTable == null ||
                              item.timeBookTable == 'null') ? (
                            <Text style={{ color: 'red' }}> Trống</Text>
                          ) : ((item?.orders?.length <= 0 ||
                            item?.orders?.length == undefined) &&
                            (item.timeBookTable !== null ||
                              item.timeBookTable !== 'null')) ? (
                            <Text style={{ color: 'red' }}>
                              {' '}
                              {item.timeBookTable}{' '}
                              ({renderBookTable(item?.orders)}đ){' '}
                            </Text>
                          ) : (
                            <Text style={{ color: '#00CC00' }}>
                              Tổng
                              {' '}
                              {renderBookTable(item?.orders)}đ{' '}
                            </Text>
                          )}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          </View>
          <CheckChangeTable
            selectionTable={(selectionTable?.orders?.length <= 0 || selectionTable?.orders == null) ? undefined : selectionTable}
            removeOrderTable={() => {
              removeOrderTable()
            }}
            hiddeSelectTable={() => setSelectionTable(undefined)}
          />
        </View>
      )}
      <ModalBookTable
        bookTable={bookTable}
        hiddenBookTable={() => setBookTable(false)}
        loading={(e: boolean) => setLoading(e)}
      />

      <Modal
        transparent={true}
        style={{ zIndex: 1 }}
        visible={selectionTable !== undefined ? (selectionTable?.orders?.length <= 0 || selectionTable?.orders == null) ? true : false : false}
        animationType="fade">
        <View
          style={[
            styles.centeredView,
            { justifyContent: 'center', alignItems: 'center' },
          ]}>
          <Pressable
            onPress={() => setSelectionTable(undefined)}
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
              {selectionTable?.name}
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
                <Text style={styles.listTT}>{selectionTable?.nameUser}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text style={styles.listTT}>Thời gian đến : </Text>
                <Text style={styles.listTT}>
                  {selectionTable?.timeBookTable}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.listTT}>Số lượng khách hàng : </Text>
                <Text style={styles.listTT}>{selectionTable?.amount}</Text>
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
                      table: selectionTable,
                    });
                    setSelectionTable(undefined);
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
                  onPress={() => removeOrderTable()}
                  style={{
                    width: '70%',
                    borderRadius: 3,
                    backgroundColor: 'red',
                    paddingVertical: 5,
                  }}>
                  {loading == true ? (
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
    elevation: 7,
    shadowColor: 'tomato',
    overflow: 'hidden',
  },
  table: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 0.5,
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
  loading_g: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.9)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default Home;
