import React, { Suspense, useEffect, useReducer, useRef, useState } from 'react';
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
  SafeAreaView,
  FlatList,
  Animated,
  StatusBar,
} from 'react-native';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../App/Store';
import { getAllTable, changeTables } from '../Features/TableSlice';
import { FlatGrid } from 'react-native-super-grid';
import { Size, SizeScale } from '../Component/size';
import CheckChangeTable from '../Modal/ModalCheckChangeTable/CheckChangeTable';
import { Avatar, CheckBox } from 'react-native-elements';
import ModalBookTable from '../Modal/ModalBookTable';
import { removeOrder } from '../Features/TableSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
// @ts-ignore
import ImageError from '../Component/image/error.png';
import HeaderTitle from './HeaderTitle';
import { checkUserAsyncStorage } from '../Component/checkUser';
import ModalConfim from '../Component/ModalConfim';
import { getData } from './../Features/SettingSlice';
import { ScrollView } from 'react-native';
type Props = {
  route: any;
  navigation: any;
};

type State = {
  bookTable: boolean;
  showTableFilter: boolean;
  loading: boolean;
  selectionTable: any;
  selectTable: any;
  checked: number;
  toggerMenu: boolean;
  showModalConfim: boolean;
  dataTable: any;
};
const Home = ({ navigation, route }: Props) => {
  const propParams = route?.params;
  const width = Size().width;
  const widthScale = SizeScale().width;
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const tables = useAppSelect((data: any) => data.tables);
  const setting = useAppSelect((data: any) => data.setting.value);
  const textLanguage = setting?.data?.home;
  const [state, setState] = useReducer(
    (state: State, newState: Partial<State>) => ({
      ...state,
      ...newState,
    }),
    {
      bookTable: false,
      showTableFilter: false,
      loading: false,
      selectionTable: undefined,
      selectTable: undefined,
      checked: 0,
      toggerMenu: false,
      showModalConfim: false,
      dataTable: [],
    },
  );
  // sử lý khi quay lại trang 'home' thì truyền qua data để upload mảng mới trước khi thêm lên db và trường hợp khi ấn thanh toán thì xóa sản phẩm đã order ở bàn đó đi
  const uploadData = (e: any) => {
    if (propParams?.data !== undefined || propParams?.pay == true) {
      setState({ loading: true });
      const newData: any = [];
      tables?.value?.map((item: any) => {

        if (item?._id == propParams?.id_table) {
          console.log('first1')
          newData.push({
            ...item, orders:
              // trường hợp thanh toán
              propParams?.pay == true ?

                [] :

                propParams?.data
          });
        }

        else {
          newData.push(item);
        }
      });
      setState({ dataTable: tables?.value, loading: false });
    }
  }

  // upload data khi chuyển bàn
  const uploadDataChangeTable = (e: any) => {
    setState({ loading: true });
    const newData: any = [];
    tables?.value?.map((item: any) => {
      if (item?._id == e.table_moved._id) {
        newData.push({
          ...item, orders: [],
          phone: null,
          timeBookTable: 'null',
          nameUser: '',
          amount: null
        });
      }
      else if (e.table_received == item?._id) {
        newData.push({
          ...item, orders: e.table_moved.orders,
          phone: e.table_moved.phone,
          timeBookTable: e.table_moved.timeBookTable,
          nameUser: e.table_moved.nameUser,
          amount: e.table_moved.amount

        });
      }
      else {
        newData.push(item);
      }
    });
    console.log(newData, 'ewedscxewefd')
    setState({ dataTable: newData, loading: false });
    // @ts-ignore
    dispatch(changeTables(e))
  }
  useEffect(() => {
    uploadData(undefined)
  }, [propParams?.data, tables?.value, propParams?.pay]);
  // upload lại data khi hủy bàn
  const uploadDataRemove = (e: any) => {
    setState({
      loading: true,
      showModalConfim: false,
      selectionTable: undefined,
    });
    const time = setTimeout(() => {
      const newData: any = [];
      tables?.value?.map((item: any) => {
        if (item?._id == e) {
          newData.push({ ...item, orders: [] });
        } else {
          newData.push(item);
        }
      });
      setState({
        loading: false,
        dataTable: newData,
      });
      dispatch(
        // @ts-ignore
        removeOrder({
          id: state?.selectionTable?._id,
        }),
      );
    }, 500);
    setTimeout(() => {
      clearTimeout(time)
    }, 600);
  };

  useEffect(() => {
    dispatch(getAllTable());
    dispatch(getData());
  }, []);

  const order = (item: any) => {
    if (
      ((item?.orders?.length > 0 ||
        item?.orders !== null ||
        item?.orders?.length == undefined) &&
        item.timeBookTable !== 'null') ||
      ((item?.orders?.length <= 0 ||
        item?.orders == null ||
        item?.orders.length == undefined) &&
        item.timeBookTable == 'null') ||
      item?.orders?.length == undefined ||
      ((item?.orders?.length > 0 || item?.orders !== null) &&
        item.timeBookTable == 'null')
    ) {
      navigation?.navigate('orders', {
        table: item?.orders == null ? { ...item, orders: [] } : item,
      });
    } else if (item.timeBookTable !== 'null') {
      setState({ selectionTable: item });
    }
  };

  // tính tổng tiền từng bàn
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

  // lọc dữ liệu khi chọn lọc bàn
  useEffect(() => {
    const statusTable = tables?.value.filter((item: any) =>
      state?.checked == 0
        ? item
        : state?.checked == 1
          ? item.timeBookTable == 'null' &&
          (item?.orders?.length < 0 || item?.orders == null)
          : state?.checked == 2
            ? (item.timeBookTable !== 'null' && item?.orders?.length > 0) ||
            item?.orders?.length > 0
            : item.timeBookTable !== 'null',
    );
    setState({ dataTable: statusTable });
  }, [state?.checked, tables?.value]);

  const toggleCheckbox = (item: any) =>
    setState({ checked: state?.checked == item ? 0 : item });
  const renderTable = ({ item }: any) => {
    return (
      <View>
        <TouchableOpacity
          style={{
            marginVertical: item.id == 2 ? 5 : 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() =>
            setState({ checked: state?.checked == item.id ? 0 : item.id })
          }>
          <CheckBox
            checked={state?.checked == item.id ? true : false}
            onPress={() => toggleCheckbox(item.id)}
            iconType="material-community"
            checkedIcon="checkbox-outline"
            uncheckedIcon={'checkbox-blank-outline'}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 18,
              textAlign: 'center',
              fontWeight: '500',
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const fadeAnim = useRef(new Animated.Value(0)).current;
  state?.toggerMenu == true
    ? // @ts-ignore
    Animated.timing(fadeAnim, {
      toValue: 800,
      duration: 2500,
    }).start()
    : // @ts-ignore
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1500,
    }).start();
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar animated={true} hidden={true} translucent={true} />
      {state?.loading == true && (
        <View style={styles.loading_g}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <View
          style={{
            // width: width < 960 ? '30%' : '25%',
            borderRightWidth: 1,
            borderColor: '#EEEEEE',
            flex: 1,
            height: '100%'
          }}>
          <SafeAreaView style={{ height: '100%' }}>
            <ScrollView showsVerticalScrollIndicator={true} >

              <View style={styles.header}>
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#fff" />}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar
                      rounded
                      source={{
                        uri: checkUserStorage?.data?.avatarRestaurant,
                      }}
                      size={60}
                    />

                    <Text
                      style={[
                        styles.titlePro,
                        { fontSize: width < 960 ? 20 : 23, marginLeft: 10 },
                      ]}>
                      {checkUserStorage?.data?.nameRestaurant}
                    </Text>
                  </View>
                </Suspense>
              </View>
              {/* hiện lựa chọn lọc bàn */}
              <View
                style={{
                  padding: 10,

                }}>
                <View>
                  <TouchableOpacity
                    style={styles.bookTable}
                    onPress={() => setState({ bookTable: true })}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: '500',
                        textAlign: 'center',
                      }}>
                      {textLanguage?.book_table}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingLeft: 20,
                      marginTop: 30,
                      color: 'black',
                      fontWeight: '500',
                      borderBottomWidth: 0.8,
                      borderColor: '#DDDDDD',
                      paddingBottom: 10,
                    }}>
                    {textLanguage?.table_filter}
                  </Text>
                  <FlatList
                    data={[
                      { id: 1, name: `${textLanguage?.empty}` },
                      { id: 2, name: `${textLanguage?.have_guests}` },
                      { id: 3, name: `${textLanguage?.preset_table}` },
                    ]}
                    renderItem={renderTable}
                    keyExtractor={(item: any) => item}
                  />
                </View>
                <View style={{ flexDirection: 'column', marginTop: 20 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>
                    {textLanguage?.note}
                  </Text>
                  <View style={{ flexDirection: 'column' }}>
                    <View
                      style={styles.preset_table}>
                      <View
                        style={{
                          width: widthScale * 25,
                          height: widthScale * 25,
                          borderRadius: 100,
                          backgroundColor: 'red',
                        }}></View>
                      <Text style={{ color: 'black', fontSize: 18, marginLeft: 10 }}>
                        {textLanguage?.preset_table}
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
                          width: widthScale * 25,
                          height: widthScale * 25,
                          borderRadius: 100,
                          backgroundColor: '#00FF00',
                        }}></View>
                      <Text style={{ color: 'black', fontSize: 18, marginLeft: 10 }}>
                        {textLanguage?.have_guests}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
        <View style={{ flex: 3 }}>
          <View
            style={[
              styles.header,
              {
                backgroundColor: 'blue',
              },
            ]}>
            {/* chế độ điện thoại */}
            {width < 539 ? (
              <TouchableOpacity onPress={() => setState({ toggerMenu: true })}>
                <AntDesign
                  name="menufold"
                  style={{ color: '#fff', fontSize: 25 }}
                />
              </TouchableOpacity>
            ) : (
              <HeaderTitle
                setTableFilter={() =>
                  setState({ showTableFilter: !state?.showTableFilter })
                }
                selectTable={state?.selectTable}
                setSelectTable={() => setState({ selectTable: undefined })}
                showTableFilter={state?.showTableFilter}
                navigation={navigation}
                setBookTable={() => setState({ bookTable: true })}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: state?.dataTable?.length <= 0 ? 'column' : 'row',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
            {state?.dataTable?.length <= 0 ? (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image source={ImageError} style={{ width: 400, height: 400 }} />
                <Text style={{ fontSize: 20, fontWeight: '500', color: 'red' }}>
                  {textLanguage?.no_data} !
                </Text>
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  borderColor: 'rgb(219,219,219)',
                  borderLeftWidth: 1,
                }}>
                <FlatGrid
                  itemDimension={width < 960 ? (width < 539 ? 150 : 150) : 180}
                  data={state?.dataTable}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={[styles.listTable, { zIndex: 1 }]}>
                        <TouchableOpacity
                          style={styles.table}
                          onPress={() => order(item)}
                          onLongPress={() => {
                            // check xem bàn đó đã gọi món chưa nếu rồi hiện mockup chọn chuyển bàn hoặc hủy
                            if (
                              (item?.orders?.length > 0 &&
                                item?.timeBookTable == 'null') ||
                              ((item?.orders?.length > 0 ||
                                item?.orders?.length <= 0 ||
                                item?.orders == null) &&
                                item?.timeBookTable !== 'null')
                            ) {
                              setState({ selectionTable: item });
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
                            {item.timeBookTable !== 'null' && (
                              <View
                                key={item}
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: 100,
                                  backgroundColor: 'red',
                                  marginRight: 5,
                                }}></View>
                            )}
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
                            style={{
                              width: 100,
                              height: 100,
                              tintColor: 'blue',
                            }}
                          />

                          <Text
                            style={[
                              styles.nameTable,
                              { fontSize: width < 960 ? 20 : 21 },
                            ]}>
                            {setting?.language == 'es' ? 'Talbe' : 'Bàn'}{' '}{item.name}
                          </Text>

                          <Text
                            style={[
                              {
                                fontSize: width < 960 ? 18 : 16,
                                color: '#00CC00',
                                fontWeight: '500',
                              },
                            ]}>
                            {item.amount > 0 ? (
                              item?.orders?.length > 0 ||
                                item?.orders?.length <= 0 ||
                                item.timeBookTable !== 'null' ? (
                                <Text style={{ color: 'red' }}>
                                  {item.timeBookTable} (
                                  {renderBookTable(item?.orders)}đ){' '}
                                </Text>
                              ) : (
                                <Text
                                  style={{
                                    color:
                                      item?.orders?.length > 0
                                        ? '#00CC00'
                                        : 'red',
                                  }}>
                                  {item?.orders?.length > 0
                                    ? `Tổng ${renderBookTable(item?.orders)}đ`
                                    : 'Trống'}
                                </Text>
                              )
                            ) : (
                              <Text
                                style={{
                                  color:
                                    item?.orders?.length > 0
                                      ? '#00CC00'
                                      : 'red',
                                }}>
                                {item?.orders?.length > 0
                                  ? `${textLanguage?.total} ${renderBookTable(
                                    item?.orders,
                                  )}đ`
                                  : `${textLanguage?.empty}`}
                              </Text>
                            )}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </View>
      {/* )} */}
      {/* hiện modal booking */}
      {state?.bookTable == true && (
        <ModalBookTable
          bookTable={state?.bookTable}
          hiddenBookTable={() => setState({ bookTable: false })}
          loading={(e: boolean) => setState({ loading: e })}
          textLanguage={textLanguage}
          width={width}
        />
      )}

      <Modal
        transparent={true}
        style={{ zIndex: 1 }}
        visible={
          state?.selectionTable !== undefined
            ? state?.selectionTable?.orders?.length <= 0 ||
              state?.selectionTable?.orders == null
              ? true
              : false
            : false
        }
        animationType="fade">
        <View
          style={[
            styles.centeredView,
            { justifyContent: 'center', alignItems: 'center' },
          ]}>
          <Pressable
            onPress={() => setState({ selectionTable: undefined })}
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
              {state?.selectionTable?.name}
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
                <Text style={styles.listTT}>{textLanguage?.name} : </Text>
                <Text style={styles.listTT}>
                  {state?.selectionTable?.nameUser}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text style={styles.listTT}>{textLanguage?.time} : </Text>
                <Text style={styles.listTT}>
                  {state?.selectionTable?.timeBookTable}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.listTT}>
                  {textLanguage?.number_clients} :{' '}
                </Text>
                <Text style={styles.listTT}>
                  {state?.selectionTable?.amount}
                </Text>
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
                      table: state?.selectionTable,
                    });
                    setState({ selectTable: undefined });
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
                    {textLanguage?.order}
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
                  onPress={() =>
                    setState({ showModalConfim: true, selectionTable: undefined })
                  }
                  style={{
                    width: '70%',
                    borderRadius: 3,
                    backgroundColor: 'red',
                    paddingVertical: 5,
                  }}>
                  {state?.loading == true ? (
                    <ActivityIndicator size={25} color={'#fff'} />
                  ) : (
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: '500',
                        fontSize: 18,
                        textAlign: 'center',
                      }}>
                      {textLanguage?.cancel_table}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {state?.toggerMenu == true && (
        <View style={[styles.menumobi]}>
          <SafeAreaView>
            <Animated.View
              style={[
                {
                  width: fadeAnim,
                  height: '100%',
                  right: 0,
                },
              ]}>
              <View style={styles.bodyMenu}>
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 100,
                    backgroundColor: 'red',
                  }}
                  onPress={() => setState({ toggerMenu: false })}>
                  <Text style={{ color: '#fff', fontSize: 30 }}>x</Text>
                </TouchableOpacity>
                <HeaderTitle
                  setTableFilter={() =>
                    setState({ showTableFilter: !state?.showTableFilter })
                  }
                  selectTable={state?.selectTable}
                  setSelectTable={() => setState({ selectTable: undefined })}
                  showTableFilter={state?.showTableFilter}
                  setBookTable={() => setState({ bookTable: true })}
                />
              </View>
            </Animated.View>
          </SafeAreaView>
        </View>
      )}

      {/* hiện modal confim khi ấn giữ chuột vào bàn đã có khách */}
      <CheckChangeTable
        selectionTable={
          state?.selectionTable?.orders?.length <= 0 ||
            state?.selectionTable?.orders == null
            ? undefined
            : state?.selectionTable
        }
        hiddeSelectTable={() => setState({ selectionTable: undefined })}
        showModalConfim={() => setState({ showModalConfim: true })}
        textLanguage={textLanguage}
        uploadData={(e: any) => uploadDataChangeTable(e)}
      />
      {/* hiện modal confil hủy bàn */}
      {state?.showModalConfim == true && (
        <ModalConfim
          modalVisible={state?.showModalConfim}
          btnAccept={async () => {
            uploadDataRemove(state?.selectionTable?._id);
          }}
          btnCancel={() => {
            setState({ showModalConfim: false });
          }}
          titile={'Thông báo'}
          content={'Bạn có muốn hủy bàn này không ?'}
          textBtnAccept={'Có'}
          textBtnCancel={'Không'}
        />
      )}
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
    height: 80,
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
    marginTop: 30,
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
  menumobi: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  bodyMenu: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterTable: {
    position: 'absolute',
    top: -15,
    right: 50,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 2,
    zIndex: 1000,
    borderColor: '#AAAAAA',
    borderWidth: 1,
    elevation: 7,
    shadowColor: 'tomato',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  preset_table: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderTopWidth: 1,
    borderColor: 'red',
  }
});

export default Home;
