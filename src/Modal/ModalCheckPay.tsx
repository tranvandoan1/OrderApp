import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Size } from '../Component/size';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../App/Store';
import { editBookTable, getAllTable } from '../Features/TableSlice';
import moment from 'moment';
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Cell,
} from 'react-native-table-component';
import { addOrder } from '../Features/OrderSlice';
import { removeSaveOrderAll } from '../Features/SaveOrderSlice';
import { removeOrderTable } from './../API/TableAPI';
type Props = {
  hiidenCheckPay: (e: any) => void;
  checkPay: any;
  valueSale: any;
  params: any;
  saveorders: any;
  sum: any;
  data: any;
  table: any;
  timeStart: any;
};
const ModalCheckPay = (props: Props) => {
  const width = Size().width;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const tables = useAppSelect((data: any) => data.tables.value);
  const [tableHead, setTableHead] = useState<any>([
    'Tên hàng',
    'SL',
    'ĐVT',
    'Giá',
    'T.TIỀN',
  ]);
  const [tableData, setTableData] = useState<any>([]);
  const [valueName, setValueName] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    dispatch(getAllTable());
    const persons: any = [];
    props?.data?.filter((item: any, index: any) => {
      persons.push([
        item.weight > 0 ? `${item.name} (${item.weight}kg)` : item.name,
        item.amount,
        item.dvt,
        item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        item.weight > 0
          ? (item.amount * item.price * item.weight)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
          : (item.amount * item.price)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
      ]);
    });

    setTableData(persons);
  }, []);
  const pay = async () => {
    const data = {
      seller_name: valueName == undefined ? 'Admin' : valueName,
      user_id: props?.table.user_id,
      orders: props?.data,
      bookTable: {
        nameUser: props?.table?.nameUser,
        timeBookTable: props?.table?.timeBookTable,
        phone: props?.table?.phone,
        amount: props?.table?.amount,
      },
      sale: props?.valueSale == undefined ? 0 : props.valueSale,
      sumPrice: props?.sum,
      table_id: props?.table._id,
      start_time: props?.table?.time_start,
      end_time: `${String(moment().hours()).length == 1
        ? `0${moment().hours()}`
        : moment().hours()
        }:${String(moment().minutes()).length == 1
          ? `0${moment().minutes()}`
          : moment().minutes()
        }`,
    };
    setLoading(true);
  
    setLoading(false);
    props?.hiidenCheckPay(data);
  };
  const close = () => {
    setLoading(true);
    props?.hiidenCheckPay(0);
    setTableData([]);
    setValueName(undefined);
    setLoading(false);
  };

  return (
    <Modal transparent={true} visible={props?.checkPay} animationType="slide">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => props?.hiidenCheckPay(0)}
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
            { width: width < 960 ? '80%' : '50%' },
          ]}>
          <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'column', width: '100%' }}>
                <View>
                  <Text style={styles.name}>Thông tin bán hàng</Text>
                  <Text style={styles.nametablefloor}>
                    {props?.params?.table.timeBookTable == 'null'
                      ? props?.params?.table.name
                      : `${props?.params?.table.name}( Bàn đặt )`}
                  </Text>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.date}>
                    Ngày : {moment().date()}/
                    {String(moment().month() + 1).length <= 1
                      ? `0${moment().month() + 1}`
                      : moment().month() + 1}
                    /{moment().year()}
                  </Text>
                  <Text style={styles.date}>
                    Số : {props?.saveorders[0]?._id}
                  </Text>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.date}>
                    Giờ vào :{props?.table.time_start == null ? props?.timeStart : props?.table.time_start}
                  </Text>
                  <Text style={styles.date}>
                    Giờ ra : {`${String(moment().hours()).length == 1
                      ? `0${moment().hours()}`
                      : moment().hours()
                      }:${String(moment().minutes()).length == 1
                        ? `0${moment().minutes()}`
                        : moment().minutes()
                      }`}
                  </Text>
                </View>
                {props?.params?.table.timeBookTable !== 'null' && (
                  <View style={styles.flex}>
                    <Text style={styles.date}>
                      Khách đặt : {props?.params?.table.name}
                    </Text>
                    <Text style={styles.date}>
                      Số điện thoại : {props?.params?.table.phone}
                    </Text>
                  </View>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.date, { marginVertical: 10 }]}>
                    Thu ngân :
                  </Text>
                  <TextInput
                    value={valueName}
                    onChangeText={e => setValueName(e)}
                    placeholder="Mời nhập tên người bán"
                    // @ts-ignore
                    placeholderTextColor={
                      valueName == '' ||
                      (String(valueName).length <= 0 && 'red')
                    }
                    style={{ marginTop: 5 }}
                  />
                </View>
              </View>
              <View style={styles.container}>
                <Table
                  borderStyle={{
                    borderWidth: 0.8,
                    borderColor: 'rgb(189,189,189)',
                    marginTop: 40,
                  }}>
                  <Row
                    data={tableHead}
                    style={styles.head}
                    textStyle={[styles.text, { fontSize: 18, fontWeight: '600' }]}
                    flexArr={[5, 1.5, 1.5, 3, 3]}
                  />
                  {tableData.map((rowData: any, index: any) => (
                    <TableWrapper key={index} style={styles.row}>
                      {rowData.map((cellData: any, cellIndex: any) => (
                        <Cell
                          key={cellIndex}
                          data={cellData}
                          textStyle={[
                            styles.text,
                            { textTransform: 'capitalize', fontSize: 16 },
                          ]}
                          style={{
                            width:
                              cellIndex == 0
                                ? '35.55%'
                                : cellIndex == 1
                                  ? '10.90%'
                                  : cellIndex == 2
                                    ? '10.70%'
                                    : cellIndex == 3
                                      ? '21.30%'
                                      : '21.65%',
                          }}
                        />
                      ))}
                    </TableWrapper>
                  ))}
                </Table>
              </View>
              <View style={[styles.flexx, { marginTop: 10 }]}>
                <Text style={styles.tt}>Thành tiền</Text>
                <Text style={styles.tt}>
                  {props.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
                </Text>
              </View>
              <View style={[styles.flexx, { marginVertical: 10 }]}>
                <Text style={[styles.tt, { fontWeight: '400' }]}>Giảm</Text>
                <Text style={styles.tt}>
                  {props?.valueSale == 0 ||
                    String(props.valueSale).length <= 0 ||
                    props.valueSale == undefined
                    ? 0
                    : props.valueSale}
                  %
                </Text>
              </View>
              <View
                style={{
                  borderColor: 'rgb(219,219,219)',
                  borderWidth: 1,
                }}></View>
              <View style={[styles.flexx, { marginTop: 10 }]}>
                <Text style={[styles.tt, { fontSize: 23 }]}>
                  Tổng tiền thanh toán
                </Text>
                <Text style={[styles.tt, { color: 'red', fontSize: 23 }]}>
                  {Math.ceil(
                    props.sum *
                    ((100 -
                      (props.valueSale == undefined ? 0 : props.valueSale)) /
                      100),
                  )
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  đ
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => pay()}
                style={{
                  backgroundColor: '#0099FF',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  marginTop: 30,
                }}>
                {loading == true ? (
                  <ActivityIndicator size="large" color={'#fff'} />
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      fontSize: 20,
                      fontWeight: '500',
                    }}>
                    Thanh toán
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => close()}
                style={{
                  backgroundColor: 'red',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}>
                {loading == true ? (
                  <ActivityIndicator size="large" color={'#fff'} />
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: '500',
                    }}>
                    Hủy
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

export default ModalCheckPay;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'relative',
  },
  navigationContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  name: {
    marginVertical: 10,
    fontSize: 28,
    textAlign: 'center',
    color: 'black',
    fontWeight: '800',
  },
  address: {
    marginVertical: 10,
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    fontWeight: '400',
  },
  phone: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    fontWeight: '400',
  },
  nametablefloor: {
    fontSize: 20,
    textAlign: 'center',
    color: 'red',
    fontWeight: '600',
  },
  date: {
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  container: {},
  head: { height: 40 },
  text: { margin: 6, color: 'black', textAlign: 'center' },
  row: { flexDirection: 'row', backgroundColor: '#fff' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },
  flexx: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tt: {
    fontSize: 20,
    color: 'black',
    fontWeight: '500',
  },
});
