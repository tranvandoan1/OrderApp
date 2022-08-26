import {
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
import React, {useEffect, useState} from 'react';
import {Size} from '../size';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {getAllTable} from '../Features/TableSlice';
import {getAllFloor} from '../Features/FloorSlice';
import moment from 'moment';
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Cell,
} from 'react-native-table-component';
import {addOrder} from '../Features/OrderSlice';
import {removeSaveOrderAll} from '../Features/SaveOrderSlice';
type Props = {
  hiidenCheckPay: (e: any) => void;
  checkPay: any;
  valueSale: any;
  idTableFloor: any;
  saveorders: any;
  sum: any;
};
const ModalCheckPay = (props: Props) => {
  const width = Size().width;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const floors = useAppSelect((data: any) => data.floors.value);
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
  useEffect(() => {
    dispatch(getAllTable());
    dispatch(getAllFloor());
    const persons: any = [];
    props?.saveorders?.filter((item: any, index: any) => {
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
  const date = new Date(props?.saveorders[0]?.createdAt);
  const pay = async () => {
    const id: any = [];
    props.saveorders.map((item: any) => id.push(item._id));
    const data = {
      seller_name: valueName,
      user_id: props.saveorders[0].id_user,
      saveorder_id: id,
      sale: props.valueSale,
      price: props.sum,
      table_id: props.idTableFloor.id_table,
      floor_id: props.idTableFloor.floor_id,
    };
    await dispatch(addOrder(data));
    await dispatch(removeSaveOrderAll(data));
    props?.hiidenCheckPay({name: valueName, check: true});
  };
  return (
    <Modal transparent={true} visible={props?.checkPay} animationType="slide">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => props?.hiidenCheckPay({name: undefined, check: false})}
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
                <View>
                  <Text style={styles.name}>Thông tin bán hàng</Text>
                  <Text style={styles.nametablefloor}>
                    {' '}
                    {floors?.map(
                      (item: any) =>
                        item._id == props?.idTableFloor.floor_id && item.name,
                    )}
                    /{' '}
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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[styles.date, {marginVertical: 10}]}>
                    Thu ngân :
                  </Text>
                  <TextInput
                    value={valueName}
                    onChangeText={e => setValueName(e)}
                    placeholder="Mời nhập tên người bán"
                    placeholderTextColor={
                      valueName == '' ||
                      (String(valueName).length <= 0 && 'red')
                    }
                    style={{marginTop: 5}}
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
              <TouchableOpacity
                onPress={() => pay()}
                style={{
                  backgroundColor: 'blue',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  marginTop: 30,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  Thanh toán
                </Text>
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
