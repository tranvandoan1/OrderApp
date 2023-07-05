import React, { useEffect, useReducer, useState } from 'react';
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
  TextInput
} from 'react-native';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Size, SizeScale } from '../../Component/size';
import { AppDispatch, RootState } from '../../App/Store';
import {
  changeTables,
  getAllTable,
  removeOrder,
} from './../../Features/TableSlice';
import ModalConfim from '../../Component/ModalConfim';

type Props = {
  selectionTable: any;
  showModalConfim: () => void;
  hiddeSelectTable: () => void;
  uploadData: (e: any) => void;
  textLanguage: any
};
type State = {
  showListTables: boolean;
  loading: boolean;
  selectTableWantToMove: any;
  showMockUpMoveTable: boolean;
};
const CheckChangeTable: React.FC<Props> = ({
  selectionTable,
  showModalConfim,
  hiddeSelectTable,
  textLanguage,
  uploadData
}) => {
  const width = Size().width;
  const sizeScale = SizeScale().width;

  const [state, setState] = useReducer(
    (state: State, newState: Partial<State>) => ({
      ...state,
      ...newState,
    }),
    {
      showListTables: false,
      loading: false,
      selectTableWantToMove: undefined,
      showMockUpMoveTable: false,
    },
  );

  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const tables = useAppSelect((data: any) => data.tables.value);
  useEffect(() => {
    dispatch(getAllTable());
  }, []);

  // tính tổng tiền
  const prices = selectionTable?.orders?.map((item: any) => {
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
  const tableFilter: any = tables?.filter(
    (item: any) =>
      item.timeBookTable == 'null' &&
      (item?.orders?.length <= 0 || item?.orders == null),
  );
  // chuyển bàn
  const save = async () => {
    if (state?.selectTableWantToMove == undefined) {
      Alert.alert('Chưa chọn bàn muốn chuyển !');
    } else {
      hiddeSelectTable()
      setState({
        loading: true,
        showMockUpMoveTable: false,
      });
      const uploadTable = {
        table_moved: selectionTable,
        table_received: state?.selectTableWantToMove._id,
      };
      uploadData(uploadTable)
      ToastAndroid.show('Chuyển bàn thành công', ToastAndroid.SHORT);
      setState({
        loading: false,
        selectTableWantToMove: undefined,
      });
      // @ts-ignore
      // dispatch(changeTables(uploadTable));
    }
  };
  const renderTable = () => {
    return (
      <SafeAreaView >
        <ScrollView showsVerticalScrollIndicator={false}>
          {tableFilter?.map((item: any) => {
            return (
              <TouchableOpacity
                style={{ marginTop: 10, zIndex: 100 }}
                onPress={() => {
                  setState({
                    selectTableWantToMove: item,
                    showListTables: false,
                  });
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
      {state?.loading == true && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      {selectionTable !== undefined && (
        <View style={styles.checkChange}>
          <Pressable
            onPress={() => hiddeSelectTable()}
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
              {selectionTable?.name}
            </Text>
            <TouchableOpacity
              onPress={() => setState({ showMockUpMoveTable: true })}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 21,
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                {textLanguage?.move_table}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              showModalConfim()
            }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 21,
                  textAlign: 'center',
                  marginVertical: 10,
                  fontWeight: '500',
                }}>
                {textLanguage?.cancel_table}

              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Chuyển bàn */}
      <Modal
        transparent={true}
        visible={state?.showMockUpMoveTable}
        animationType="slide">
        <View style={styles.centeredView}>
          <Pressable
            onPress={() => setState({ showMockUpMoveTable: false })}
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
              {textLanguage?.move} {selectionTable?.name}
            </Text>
            <View
              style={{
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
                paddingHorizontal: 50,
              }}>
              {selectionTable?.timeBookTable !== 'null' && (
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
                      {textLanguage?.orderer} :
                    </Text>
                    <Text
                      style={{
                        color: 'red',
                        marginLeft: 10,
                        fontWeight: '500',
                        fontSize: 18,
                      }}>
                      {selectionTable?.nameUser}
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
                      {textLanguage?.time} :
                    </Text>
                    <Text
                      style={{
                        color: 'red',
                        marginLeft: 10,
                        fontWeight: '500',
                        fontSize: 18,
                      }}>
                      {selectionTable?.timeBookTable}
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
                  {selectionTable?.name} :
                </Text>
                <Text
                  style={{
                    color: 'red',
                    marginLeft: 10,
                    fontWeight: '500',
                    fontSize: 18,
                  }}>
                  {selectionTable?.orders?.length} {textLanguage?.dish}
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
                  {textLanguage?.total_money} :
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
              {textLanguage?.move_in}
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
                  onPress={() =>
                    setState({ showListTables: !state?.showListTables })
                  }>
                  <TextInput
                    selectTextOnFocus={false}
                    editable={false}
                    value={
                      state?.selectTableWantToMove == null
                        ? ''
                        : state?.selectTableWantToMove?.name
                    }
                    style={styles.input}
                    placeholder="Chọn bàn"
                  />
                </TouchableOpacity>
                {state?.showListTables == true && (
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
                        zIndex: 10,
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
                display: state?.showListTables || state?.selectTableWantToMove == undefined ? 'none' : 'flex'
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#0099FF',
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => save()}>
                {state?.loading == true ? (
                  <ActivityIndicator size={25} color={'#fff'} />
                ) : (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: sizeScale * 21,
                      textAlign: 'center',
                      fontWeight: '500',
                    }}>
                    {textLanguage?.move_table}
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
                onPress={() => setState({ showMockUpMoveTable: false })}>
                {state?.loading == true ? (
                  <ActivityIndicator size={25} color={'#fff'} />
                ) : (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: sizeScale * 21,
                      textAlign: 'center',
                      fontWeight: '500',
                    }}>
                    {textLanguage?.cancel}
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
