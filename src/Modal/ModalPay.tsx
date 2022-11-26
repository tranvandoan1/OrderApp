import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Size} from '../size';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {Avatar} from 'react-native-elements';
import {getAllTable} from '../Features/TableSlice';
import moment from 'moment';
import {
  Table,
  Row,
  TableWrapper,
  Cell,
} from 'react-native-table-component';
type Props = {
  hiidenPay: (e: any) => void;
  payy: any;
  valueSale: any;
  idTableFloor: any;
  saveorders: any;
  sum: any;
  valueName: any;
};
const ModalPay = (props: Props) => {
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
  useEffect(() => {
    dispatch(getAllTable());
    const persons: any = [];
    props?.saveorders?.filter((item: any, index: any) => {
      persons.push([
        item.name,
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
  const date = new Date(props?.saveorders[0]?.createdAt);
  return (
    <Modal transparent={true} visible={props?.payy} animationType="slide">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => props?.hiidenPay('')}
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
            {width: width < 720 ? '100%' : '50%'},
          ]}>
          <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{flexDirection: 'column', width: '100%'}}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Avatar
                    rounded
                    source={{
                      uri: 'https://123design.org/wp-content/uploads/2020/07/LOGOLM0200-Chibi-%C4%90%E1%BB%87-nh%E1%BA%A5t-%C4%91%E1%BA%A7u-b%E1%BA%BFp-nh%C3%AD-Vua-%C4%91%E1%BA%A7u-b%E1%BA%BFp.jpg',
                    }}
                    size={150}
                  />
                </View>
                <View>
                  <Text style={styles.name}>BOM BOM</Text>
                  <Text style={styles.address}>
                    Từ Vân, X.Lê Lợi, H.Thường Tín, TP.Hà Nội
                  </Text>
                  <Text style={styles.phone}>ĐT : 0329903787</Text>
                  <Text style={styles.name}>Hóa đơn bán hàng</Text>
                  <Text style={styles.nametablefloor}>
                    {tables?.map(
                      (item: any) =>
                        item._id == props?.idTableFloor.id_table && item.name,
                    )}
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
                    Giờ vào : {date.getHours()}:{date.getMinutes()}
                  </Text>
                  <Text style={styles.date}>
                    Giờ ra : {moment().hours()}:{moment().minutes()}
                  </Text>
                </View>
                <Text style={[styles.date, {marginVertical: 10}]}>
                  Thu ngân : {props.valueName}
                </Text>
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
                    textStyle={[styles.text, {fontSize: 18, fontWeight: '600'}]}
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
                            {textTransform: 'capitalize', fontSize: 16},
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
              <View style={[styles.flexx, {marginTop: 10}]}>
                <Text style={styles.tt}>Thành tiền</Text>
                <Text style={styles.tt}>
                  {props.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
                </Text>
              </View>
              <View style={[styles.flexx, {marginVertical: 10}]}>
                <Text style={[styles.tt, {fontWeight: '400'}]}>Giảm</Text>
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
              <View style={[styles.flexx, {marginTop: 10}]}>
                <Text style={[styles.tt, {fontSize: 23}]}>
                  Tổng tiền thanh toán
                </Text>
                <Text style={[styles.tt, {color: 'red', fontSize: 23}]}>
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
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 60,
                  marginBottom: 30,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    textAlign: 'center',
                    color: 'black',
                  }}>
                  Trân trọng cảm ơn !
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '400',
                    textAlign: 'center',
                  }}>
                  ( Hóa đơn chưa bao gồm phí GTGT )
                </Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

export default ModalPay;

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
    fontSize: 22,
    textAlign: 'center',
    color: 'black',
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
  head: {height: 40},
  text: {margin: 6, color: 'black', textAlign: 'center'},
  row: {flexDirection: 'row', backgroundColor: '#fff'},
  btn: {width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2},
  btnText: {textAlign: 'center', color: '#fff'},
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
