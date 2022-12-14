import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../App/Store';
import {Size} from '../../size';
import {getAllOrder, removeOrder} from './../../Features/OrderSlice';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Avatar} from 'react-native-elements';

import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Cell,
} from 'react-native-table-component';
import ModalSelectDate from '../../Modal/ModalSelectDate';
type Props = {
  onClickAddDataEdit: (e: any) => void;
  onClickOpenModal: () => void;
};
const ListTableCate = (props: Props) => {
  const width = Size()?.width;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const orders = useAppSelect((data: any) => data.orders.value);
  const [order, setOrder] = useState<any>([]);
  const [deleteOrder, setDeleteOrder] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [check, setCheck] = useState<Boolean>(false);
  useEffect(() => {
    dispatch(getAllOrder());
  }, []);

  const [date, setDate] = useState<any>({
    date:
      String(moment().date()).length == 1
        ? `0${moment().date()}`
        : moment().date(),
    month:
      String(moment().month() + 1).length == 1
        ? `0${moment().month() + 1}`
        : moment().month() + 1,
    year: moment().year(),
  });
  const [selectDate, setSelectDate] = useState<boolean>(false);
  const orderToDay: any = [];
  if (orders.length >= 1) {
    orders?.filter((item: any) => {
      const time = new Date(item.createdAt);
      if (
        time.getFullYear() == date.year &&
        time.getMonth() + 1 == date.month &&
        time.getDate() == date.date
      ) {
        orderToDay.push(item);
      }
    });
  }

  const tableData: any = [];
  order?.orders?.filter((item: any, index: any) => {
    tableData.push([
      item.weight > 0 ? `${item.name_pro} (${item.weight}kg)` : item.name_pro,
      item.amount,
      item.dvt,
    ]);
  });

  const delelteOrder = async () => {
    setCheck(true);
    await dispatch(removeOrder(deleteOrder));
    setDeleteOrder(undefined);
    setCheck(false);
    setModalVisible(false);
    setOrder([]);
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff', position: 'relative'}}>
      {orders.length <= 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <View style={{width: '40%'}}>
            <View style={{flex: 1}}>
              <View style={styles.header}>
                <Text style={styles.title}>
                  {date.date == moment().date() &&
                  date.month == moment().month() + 1 &&
                  date.year == moment().year()
                    ? 'H??m nay'
                    : `Ng??y ${date.date}/${date.month}/${date.year}`}
                </Text>
                <TouchableOpacity onPress={() => setSelectDate(true)}>
                  <TextInput
                    selectTextOnFocus={false}
                    editable={false}
                    defaultValue={`${date.date}/${date.month}/${date.year}`}
                    style={{
                      color: '#fff',
                      borderColor: '#fff',
                      borderWidth: 1,
                      borderRadius: 2,
                      paddingHorizontal: 10,
                      paddingVertical: 0,
                      margin: 0,
                      fontWeight: '500',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{flexDirection: 'column', padding: 5}}>
                    {orderToDay?.length <= 0 ? (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 20,
                          fontWeight: '500',
                          color: 'black',
                        }}>
                        Ch??a c?? h??a ????n
                      </Text>
                    ) : (
                      orderToDay
                        ?.slice()
                        .reverse()
                        .map((item: any, index: any) => {
                          const time = new Date(item.createdAt);
                          return (
                            <TouchableOpacity
                              onPress={() => setOrder(item)}
                              onLongPress={() => (
                                setModalVisible(true), setDeleteOrder(item._id)
                              )}
                              key={index}
                              style={{
                                marginTop: index == 0 ? 0 : 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                backgroundColor:
                                  item._id == order?._id ? '#009900' : '#fff',
                                borderColor: '#BBBBBB',
                                borderWidth: 1,
                                alignItems: 'center',
                                shadowColor: 'black',
                                elevation: 5,
                                borderRadius: 2,
                              }}>
                              <Text
                                style={[
                                  styles.time,
                                  {
                                    color:
                                      item._id == order?._id ? '#fff' : 'black',
                                  },
                                ]}>
                                #{item._id} - {time.getHours()}:
                                {time.getMinutes()}
                              </Text>
                              <AntDesign
                                name="right"
                                size={20}
                                color={
                                  item._id == order?._id ? '#fff' : 'black'
                                }
                              />
                            </TouchableOpacity>
                          );
                        })
                    )}
                  </View>
                </ScrollView>
              </SafeAreaView>
            </View>
          </View>

          <View
            style={{
              width: '60%',
              height: '100%',
              borderColor: '#808000',
              borderLeftWidth: 1,
              padding: 10,
            }}>
            {order.length <= 0 ? (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                }}>
                <Avatar
                  rounded
                  source={{
                    uri: 'https://123design.org/wp-content/uploads/2020/07/LOGOLM0200-Chibi-%C4%90%E1%BB%87-nh%E1%BA%A5t-%C4%91%E1%BA%A7u-b%E1%BA%BFp-nh%C3%AD-Vua-%C4%91%E1%BA%A7u-b%E1%BA%BFp.jpg',
                  }}
                  size={150}
                />
                <Text
                  style={{
                    fontSize: 23,
                    fontWeight: '700',
                    marginTop: 10,
                    color: 'black',
                  }}>
                  BOM BOM
                </Text>
              </View>
            ) : (
              <SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 25,
                        fontWeight: '500',
                        color: 'black',
                      }}>
                      H??a ????n
                    </Text>

                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            color: 'black',
                            marginBottom: 10,
                          }}>
                          Gi??? v??o :
                          <Text style={{textTransform: 'capitalize'}}>
                            {order?.start_time}
                          </Text>
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            color: 'black',
                            marginBottom: 10,
                          }}>
                          Gi??? ra :
                          <Text style={{textTransform: 'capitalize'}}>
                            {order?.end_time}
                          </Text>
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 18,
                          color: 'black',
                          marginBottom: 10,
                        }}>
                        Ng?????i b??n h??ng :
                        <Text style={{textTransform: 'capitalize'}}>
                          {' '}
                          {order?.seller_name}
                        </Text>
                      </Text>
                    </View>

                    <Table
                      borderStyle={{
                        borderWidth: 0.8,
                        borderColor: 'rgb(189,189,189)',
                        marginTop: 40,
                      }}>
                      <Row
                        data={['T??n h??ng', 'SL', '??VT']}
                        style={styles.head}
                        textStyle={[
                          styles.text,
                          {fontSize: 18, fontWeight: '600'},
                        ]}
                        flexArr={[5, 1.5, 1.5, 3, 3]}
                      />
                      {tableData?.map((rowData: any, index: any) => (
                        <TableWrapper key={index} style={styles.row}>
                          {rowData.map((cellData: any, cellIndex: any) => (
                            <Cell
                              key={cellIndex}
                              data={cellData}
                              textStyle={[
                                styles.text,
                                {textTransform: 'capitalize', fontSize: 16},
                              ]}
                              style={{
                                width:
                                  cellIndex == 0
                                    ? '62.4%'
                                    : cellIndex == 1
                                    ? '18.70%'
                                    : '18.9%',
                              }}
                            />
                          ))}
                        </TableWrapper>
                      ))}
                    </Table>
                    <View style={{marginTop: 20}}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: 'black',
                          textAlign: 'right',
                        }}>
                        T???ng ti???n :{' '}
                        <Text style={{color: 'red', fontWeight: '500'}}>
                          {(order?.price == undefined ? 0 : order?.price)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                          ??
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          color: 'black',
                          textAlign: 'right',
                        }}>
                        Khuy???n m??i :{' '}
                        <Text style={{color: 'red', fontWeight: '500'}}>
                          {order?.sale}%
                        </Text>
                      </Text>
                    </View>
                    <View
                      style={{
                        borderColor: 'rgb(219,219,219)',
                        borderWidth: 1,
                        marginVertical: 30,
                      }}></View>
                    <Text
                      style={{
                        fontSize: 25,
                        color: 'black',
                        textAlign: 'center',
                        fontWeight: '500',
                      }}>
                      T???ng ti???n thanh to??n :{' '}
                      <Text style={{fontSize: 20, color: 'red'}}>
                        {' '}
                        {Math.ceil(
                          (order?.price == undefined ? 0 : order?.price) *
                            ((100 - order?.sale) / 100),
                        )
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        ??
                      </Text>
                    </Text>
                  </View>
                </ScrollView>
              </SafeAreaView>
            )}
          </View>
        </View>
      )}

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}></Pressable>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>B???n c?? mu???n x??a kh??ng ?</Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
              }}>
              <Pressable
                style={[styles.button, styles.buttonClose, {marginRight: 30}]}
                onPress={() => setModalVisible(!modalVisible)}>
                {/* <Text style={styles.textStyle}>H???y</Text> */}
                {check == true ? (
                  <ActivityIndicator size={20} color={'#fff'} />
                ) : (
                  <Text style={styles.textStyle}>H???y</Text>
                )}
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonLognout]}
                onPress={() => delelteOrder()}>
                {/* <Text style={styles.textStyle}>X??a</Text> */}
                {check == true ? (
                  <ActivityIndicator size={20} color={'#fff'} />
                ) : (
                  <Text style={styles.textStyle}>X??a</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <ModalSelectDate
        selectDate={selectDate}
        hiddenSelectDate={(e: any) =>
          String(e).length >= 1
            ? (setDate(e), setSelectDate(false))
            : setSelectDate(false)
        }
      />
    </View>
  );
};

export default ListTableCate;

const styles = StyleSheet.create({
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  header: {
    width: '100%',
    backgroundColor: '#009900',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  time: {
    fontSize: 18,
    fontWeight: '400',
    padding: 10,
  },
  head: {height: 40},
  text: {margin: 6, color: 'black', textAlign: 'center'},
  row: {flexDirection: 'row', backgroundColor: '#fff'},
  btn: {width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2},
  btnText: {textAlign: 'center', color: '#fff'},
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, .5)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  modalView: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonLognout: {
    backgroundColor: 'red',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'red',
    fontWeight: '500',
    fontSize: 20,
  },
});
