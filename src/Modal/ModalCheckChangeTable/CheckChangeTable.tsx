import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Size, SizeScale } from '../../Component/size';
import { TextInput } from 'react-native-gesture-handler';
import { AppDispatch, RootState } from '../../App/Store';
import {
  changeTables,
  getAllTable,
} from './../../Features/TableSlice';

type Props = {
  selectionTable: any;
  removeOrderTable: () => void;
  hiddeSelectTable: () => void;
  
};
const CheckChangeTable = (props: Props) => {
  const width = Size().width;
  const sizeScale = SizeScale().width;

  const [showListTables, setShowListTables] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectTableWantToMove, setSelectTableWantToMove] = useState<any>();
  const [showMockUpMoveTable, setShowMockUpMoveTable] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const tables = useAppSelect((data: any) => data.tables.value);
  useEffect(() => {
    dispatch(getAllTable());
  }, []);

  // tính tổng tiền
  const prices = props?.selectionTable?.orders?.map((item: any) => {
    if (item.weight) {
      return Math.ceil(+item.price * item.weight * +item.amount);
    } else {
      return Math.ceil(+item.price * +item.amount);
    }
  });
  let sum = 0;
  for (var i = 0; i < prices?.length; i++) {
    sum += +prices[i];
  }
  // lấy danh sách bàn còn trống
  const tableFilter: any = tables?.filter((item: any) => item.timeBookTable == 'null' && (item?.orders?.length <= 0 || item?.orders == null));
  // chuyển bàn
  const save = async () => {
    if (selectTableWantToMove == undefined) {
      Alert.alert('Chưa chọn bàn muốn chuyển !');
    } else {
      setLoading(true);

      const uploadTable = {
        table1: props.selectionTable,
        table2: selectTableWantToMove._id,
      };
      // @ts-ignore
      await dispatch(changeTables(uploadTable));
      ToastAndroid.show('Chuyển bàn thành công', ToastAndroid.SHORT);
      props?.hiddeSelectTable()
      setSelectTableWantToMove(undefined);
      setShowMockUpMoveTable(false)
      setLoading(false);
    }
  };
  const renderTable = () => {
    return (
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          {tableFilter?.map((item: any) => {
            return (
              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() => {
                  setSelectTableWantToMove(item);
                  setShowListTables(false);
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    textAlign: 'center',
                  }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <>
      {props?.selectionTable !== undefined && (
        <View style={styles.checkChange}>
          <Pressable
            onPress={() => props.hiddeSelectTable()}
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
            style={{
              backgroundColor: '#fff',
              width: 400,
              paddingVertical: 10,
              borderRadius: 3,
            }}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: 30,
                marginBottom: 20,
                paddingBottom: 10,
                borderColor: 'rgb(219,219,219)',
                fontWeight: '500',
                borderBottomWidth: 1,
              }}>
              {props?.selectionTable?.name}
            </Text>
            <TouchableOpacity onPress={() => setShowMockUpMoveTable(true)}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 21,
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                Chuyển bàn
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props?.removeOrderTable()}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 21,
                  textAlign: 'center',
                  marginVertical: 10,
                  fontWeight: '500',
                }}>
                Hủy bàn
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Chuyển bàn */}
      <Modal
        transparent={true}
        visible={showMockUpMoveTable}
        animationType="slide">
        <View style={styles.centeredView}>
          <Pressable
            onPress={() => setShowMockUpMoveTable(false)}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}></Pressable>
          {loading == true && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          <View
            style={[
              {
                width: width < 960 ? '50%' : '35%',
                backgroundColor: '#fff',
                paddingVertical: 10,
                borderRadius: 4,
              },
            ]}>
            <Text
              style={{
                color: 'black',
                fontSize: 23,
                textAlign: 'center',
                fontWeight: '500',
                borderColor: '#BBBBBB',
                borderBottomWidth: 1,
                paddingBottom: sizeScale * 20,
                marginBottom: sizeScale * 20,
              }}>
              Chuyển {props?.selectionTable?.name}
            </Text>
            <View
              style={{
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
                paddingHorizontal: 50,
              }}>
              {props?.selectionTable?.timeBookTable !== 'null' && (
                <React.Fragment>
                  <View
                    style={[
                      styles.list,
                      {
                        justifyContent: 'space-between',
                        width: '100%',
                      },
                    ]}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 20,
                        fontWeight: '500',
                      }}>
                      Người đặt :
                    </Text>
                    <Text
                      style={{
                        color: 'red',
                        marginLeft: 10,
                        fontWeight: '500',
                        fontSize: 18,
                      }}>
                      {props?.selectionTable?.nameUser}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.list,
                      {
                        justifyContent: 'space-between',
                        width: '100%',
                      },
                    ]}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 20,
                        fontWeight: '500',
                      }}>
                      Thời gian đặt :
                    </Text>
                    <Text
                      style={{
                        color: 'red',
                        marginLeft: 10,
                        fontWeight: '500',
                        fontSize: 18,
                      }}>
                      {props?.selectionTable?.timeBookTable}
                    </Text>
                  </View>
                </React.Fragment>
              )}
              <View
                style={[
                  styles.list,
                  {
                    justifyContent: 'space-between',
                    width: '100%',
                  },
                ]}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  {props?.selectionTable?.name} :
                </Text>
                <Text
                  style={{
                    color: 'red',
                    marginLeft: 10,
                    fontWeight: '500',
                    fontSize: 18,
                  }}>
                  {props?.selectionTable?.orders?.length} món ăn
                </Text>
              </View>
              <View
                style={[
                  styles.list,
                  {
                    justifyContent: 'space-between',
                    width: '100%',
                  },
                ]}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  Tổng tiền :
                </Text>
                <Text
                  style={{
                    color: 'red',
                    marginLeft: 10,
                    fontWeight: '500',
                    fontSize: 18,
                  }}>
                  {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                textAlign: 'center',
                fontWeight: '500',
                marginVertical: 20,
              }}>
              Chuyển đến
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <View
                style={{
                  width: '100%',
                  position: 'relative',
                  paddingHorizontal: sizeScale * 10,
                }}>
                <TouchableOpacity
                  style={styles.table}
                  onPress={() => setShowListTables(!showListTables)}>
                  <TextInput
                    selectTextOnFocus={false}
                    editable={false}
                    value={selectTableWantToMove == null ? '' : selectTableWantToMove?.name}
                    style={styles.input}
                    placeholder="Chọn bàn"
                  />
                </TouchableOpacity>
                {showListTables == true && (
                  <View
                    style={[
                      {
                        position: 'absolute',
                        top: 42,
                        width: '100%',
                        height: sizeScale * 200,
                        backgroundColor: '#fff',
                        paddingVertical: 10,
                        borderRadius: 2,
                        zIndex: 1000,
                        borderColor: '#AAAAAA',
                        borderWidth: 1,
                        left: sizeScale * 10,
                      },
                    ]}>
                    {renderTable()}
                  </View>
                )}
              </View>
            </View>

            <View
              style={{
                marginTop: sizeScale * 30,
                paddingHorizontal: sizeScale * 20,
                zIndex: 1,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#0099FF',
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => save()}>
                {loading == true ? (
                  <ActivityIndicator size={25} color={'#fff'} />
                ) : (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: sizeScale * 18,
                      textAlign: 'center',
                      fontWeight: '500',
                    }}>
                    Chuyển bàn
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 10,
                }}
                onPress={() => setShowMockUpMoveTable(false)}>
                {loading == true ? (
                  <ActivityIndicator size={25} color={'#fff'} />
                ) : (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: sizeScale * 18,
                      textAlign: 'center',
                      fontWeight: '500',
                    }}>
                    Hủy
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CheckChangeTable;

const styles = StyleSheet.create({
  checkChange: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 10,
    justifyContent: 'center',
  },
  input: {
    color: 'black',
    padding: 5,
    borderRadius: 3,
    textAlign: 'center',
    fontSize: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#0099FF',
    width: '100%',
    color: 'black',
    borderRadius: 5,
    textAlign: 'center',
  },
  loading: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.9)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000000,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
