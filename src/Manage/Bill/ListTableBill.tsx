import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Modal,
  Pressable,
  ToastAndroid,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../App/Store';
import { Size } from '../../Component/size';
import { removeOrder } from './../../Features/OrderSlice';
import { Avatar } from 'react-native-elements';

import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
type Props = {
  orderToDay: any;
  textLanguage: any;
  background: any;
};
const ListTableCate: React.FC<Props> = ({
  orderToDay,
  textLanguage,
  background,
}) => {
  const width = Size()?.width;
  const dispatch = useDispatch<AppDispatch>();
  const [order, setOrder] = useState<any>([]);
  const [deleteOrder, setDeleteOrder] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [check, setCheck] = useState<Boolean>(false);
  useEffect(() => {
    setOrder([]);
  }, [orderToDay?.data]);
  const tableData: any = [];
  order?.orders?.filter((item: any, index: any) => {
    tableData.push([
      item.weight > 0
        ? `${item.name || item.name_pro} (${item.weight}kg)`
        : item.name || item.name_pro,
      item.amount,
      item.dvt,
    ]);
  });
  const delelteOrder = async () => {
    setCheck(true);
    // @ts-ignore
    await dispatch(removeOrder({ id: deleteOrder }));
    setDeleteOrder(undefined);
    setCheck(false);
    setModalVisible(false);
    setOrder([]);
    ToastAndroid.show(`Xóa thành công`, ToastAndroid.SHORT);
  };
  return (
    <View
      style={[
        styles.main_list_table,
        { backgroundColor: background == 2 ? 'black' : '#fff' },
      ]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View style={{ width: '40%' }}>
          <View style={{ flex: 1 }}>
            <SafeAreaView>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'column', padding: 5 }}>
                  {orderToDay?.data?.length <= 0 && orderToDay?.loading == true ? (
                    <View >
                      <ActivityIndicator size="large" color="blue" />
                    </View>
                  ) : orderToDay?.data?.length <= 0 && (orderToDay?.loading == false || orderToDay?.loading == true) ?
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: '500',
                        color: background == 2 ? '#fff' : 'black',
                      }}>
                      {textLanguage?.no_bills}
                    </Text>
                    : (
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        data={orderToDay?.data?.slice().reverse()}
                        renderItem={({ item, index }: any) => {
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
                                  item._id == order?._id ? 'blue' : '#fff',
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
                                {time.getMinutes()} - {time.getDate()}-
                                {time.getMonth() + 1}-{time.getFullYear()}
                              </Text>

                            </TouchableOpacity>
                          );
                        }}
                        keyExtractor={(item: any) => item._id}
                      />
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
            borderLeftWidth: 0.5,
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
                  color: background == 2 ? '#fff' : 'black',
                }}>
                OrderTVD
              </Text>
            </View>
          ) : (
            <SafeAreaView>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 25,
                      fontWeight: '500',
                      color: background == 2 ? '#fff' : 'black',
                    }}>
                    {textLanguage?.bills}
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
                          color: background == 2 ? '#fff' : 'black',

                          marginBottom: 10,
                        }}>
                        {textLanguage?.entry_time} :{' '}
                        <Text style={{ textTransform: 'capitalize' }}>
                          {order?.start_time == null
                            ? 'Trống'
                            : order?.start_time}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          color: background == 2 ? '#fff' : 'black',

                          marginBottom: 10,
                        }}>
                        {textLanguage?.time_out} :
                        <Text style={{ textTransform: 'capitalize' }}>
                          {order?.end_time}
                        </Text>
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 18,
                        color: background == 2 ? '#fff' : 'black',

                        marginBottom: 10,
                      }}>
                      {textLanguage?.seller} :
                      <Text style={{ textTransform: 'capitalize' }}>
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
                      data={[`${textLanguage?.product_name}`, 'SL', 'ĐVT']}
                      style={styles.head}
                      textStyle={[
                        styles.text,
                        { fontSize: 18, fontWeight: '600', color: background == 1 ? 'black' : '#fff' },
                      ]}
                      flexArr={[5, 1.5, 1.5, 3, 3]}
                    />
                    {tableData?.map((rowData: any, index: any) => (
                      <TableWrapper
                        key={index}
                        style={[styles.row, { backgroundColor: background == 2 ? 'black' : '#fff' }]}>
                        {rowData.map((cellData: any, cellIndex: any) => (
                          <Cell
                            key={cellIndex}
                            data={cellData}
                            textStyle={[
                              styles.text,
                              { fontSize: 16, color: background == 1 ? 'black' : '#fff' },
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
                  <View style={{ marginTop: 20 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: background == 2 ? '#fff' : 'black',

                        textAlign: 'right',
                      }}>
                      {textLanguage?.total_money} :{' '}
                      <Text style={{ color: 'red', fontWeight: '500' }}>
                        {(order?.sumPrice)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        đ
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        color: background == 2 ? '#fff' : 'black',

                        textAlign: 'right',
                      }}>
                      {textLanguage?.sale} :{' '}
                      <Text style={{ color: 'red', fontWeight: '500' }}>
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
                      color: background == 2 ? '#fff' : 'black',

                      textAlign: 'center',
                      fontWeight: '500',
                    }}>
                    {textLanguage?.total_payment} :{' '}
                    <Text style={{ fontSize: 20, color: 'red' }}>
                      {' '}
                      {Math.ceil(order?.sumPrice * ((100 - order?.sale) / 100))
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                      đ
                    </Text>
                  </Text>
                </View>
              </ScrollView>
            </SafeAreaView>
          )}
        </View>
      </View>
      {/* </Suspense> */}
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
            <Text style={styles.modalText}>Bạn có muốn xóa không ?</Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
              }}>
              <Pressable
                style={[styles.button, styles.buttonClose, { marginRight: 30 }]}
                onPress={() => setModalVisible(!modalVisible)}>
                {/* <Text style={styles.textStyle}>Hủy</Text> */}
                {check == true ? (
                  <ActivityIndicator size={20} color={'#fff'} />
                ) : (
                  <Text style={styles.textStyle}>Hủy</Text>
                )}
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonLognout]}
                onPress={() => delelteOrder()}>
                {/* <Text style={styles.textStyle}>Xóa</Text> */}
                {check == true ? (
                  <ActivityIndicator size={20} color={'#fff'} />
                ) : (
                  <Text style={styles.textStyle}>Xóa</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListTableCate;

const styles = StyleSheet.create({
  main_list_table: { flex: 1, position: 'relative' },
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

  time: {
    fontSize: 18,
    fontWeight: '400',
    padding: 10,
  },
  head: {
    height: 40
  },
  text: {
    margin: 6,
    textTransform: 'capitalize',
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row'
  },

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
