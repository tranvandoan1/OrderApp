import React, {useEffect, useRef, useState} from 'react';
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
} from 'react-native';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {Size, SizeScale} from '../../size';
import {TextInput} from 'react-native-gesture-handler';
import {AppDispatch, RootState} from '../../App/Store';
import {
  editBookTable,
  editMoveTable,
  getAllTable,
} from './../../Features/TableSlice';
import {
  changeTables,
  removeSaveOrderAll,
  getAllSaveOrder,
} from '../../Features/SaveOrderSlice';
type Props = {
  select: any;
  checkSelect: any;
  saveorderCheckChangeTable: any;
  setCheckSelect: (e: any) => void;
  hiddeSelect: (e: any) => void;
  hiddeCheckSelect: (e: any) => void;
  checkSaveOrder: any;
};
const CheckChangeTable = (props: Props) => {
  const width = Size().width;
  const sizeScale = SizeScale().width;

  // tính tổng tiền
  const prices = props?.saveorderCheckChangeTable?.map((item: any) => {
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
  const [checkSelectTable, setCheckSelectTable] = useState<boolean>(false);
  const [checkChangeTable, setCheckChangeTable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkDeleteTable, setCheckDeleteTable] = useState<boolean>(false);
  const [cancelBookTable, setCancelBookTable] = useState<boolean>(false);
  const [selectTable, setSelectTable] = useState<any>();
  const saveorders = useSelector((data: any) => data.saveorders.value);

  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const tables = useAppSelect((data: any) => data.tables.value);
  useEffect(() => {
    dispatch(getAllTable());
    dispatch(getAllSaveOrder());
  }, []);

  const tableFilter: any = [];
  props?.checkSaveOrder.map((item: any) => {
    tables.map((itemTabe: any) => {
      if (itemTabe._id == item._id) {
        if (itemTabe.timeBookTable == 'null' && item.data.length <= 0) {
          tableFilter.push(itemTabe);
        }
      }
    });
  });
  // chuyển bàn
  const save = async () => {
    const id: any = [];
    saveorders?.map((itemm: any) => {
      if (itemm.id_table == props?.select._id) {
        id.push(itemm._id);
      }
    });
    if (selectTable == undefined) {
      ToastAndroid.show('Chưa chọn bàn muốn chuyển !', ToastAndroid.SHORT);
    } else {
      if (props?.select?.timeBookTable == 'null') {
        const data = {
          id: id,
          id_table: selectTable._id,
        };
        setLoading(true);
        // @ts-ignore
        await dispatch(changeTables(data));
        ToastAndroid.show('Chuyển bàn thành công', ToastAndroid.SHORT);
        props?.hiddeSelect('');
        setCheckSelectTable(false);
        setSelectTable(undefined);
        setCheckChangeTable(false);
        setLoading(false);
      } else {
        const data = {
          id: id,
          id_table: selectTable._id,
        };
        const uploadTable = {
          idStart: props.select._id,
          idEnd: selectTable._id,
          timeBookTableStart: 'null',
          amountStart: 0,
          nameUserStart: '',
          timeBookTableEnd: props?.select.timeBookTable,
          amountEnd: props?.select.amount,
          nameUserEnd: props?.select.nameUser,
        };

        setLoading(true);
        // @ts-ignore
        await dispatch(changeTables(data));
        // @ts-ignore
        await dispatch(editMoveTable(uploadTable));
        ToastAndroid.show('Chuyển bàn thành công', ToastAndroid.SHORT);
        props?.hiddeSelect('');
        setCheckSelectTable(false);
        setSelectTable(undefined);
        setCheckChangeTable(false);
        setLoading(false);
      }
    }
  };
  // xóa bàn
  const deleteTable = async () => {
    const id = props?.saveorderCheckChangeTable?.map((item: any) => {
      return item._id;
    });
    setCheckChangeTable(true);

    // @ts-ignore
    await dispatch(removeSaveOrderAll(id));

    ToastAndroid.show('Xóa bàn thành công', ToastAndroid.SHORT);
    props?.hiddeSelect('');
    setCheckDeleteTable(false);
    setCheckSelectTable(false);
    setSelectTable(undefined);

    setCheckChangeTable(false);
  };
  // hủy bàn đặt
  const cancelTable = async () => {
    setCheckChangeTable(true);
    if (
      props?.select?.timeBookTable !== 'null' &&
      props?.saveorderCheckChangeTable.length <= 0
    ) {
      await dispatch(
        // @ts-ignore
        editBookTable({
          id: props?.select?._id,
          nameUser: '',
          timeBookTable: 'null',
          amount: 0,
        }),
      );
    } else {
      const id = props?.saveorderCheckChangeTable?.map((item: any) => {
        return item._id;
      });
      await dispatch(
        // @ts-ignore
        editBookTable({
          id: props?.select?._id,
          nameUser: '',
          timeBookTable: 'null',
          amount: 0,
        }),
      );
      // @ts-ignore
      await dispatch(removeSaveOrderAll(id));
    }

    ToastAndroid.show(
      `Hủy bàn ${
        props?.select?.timeBookTable !== 'null' &&
        props?.saveorderCheckChangeTable.length <= 0
          ? 'đặt'
          : ''
      } thành công`,
      ToastAndroid.SHORT,
    );
    props?.hiddeSelect('');
    setCheckDeleteTable(false);
    setCheckSelectTable(false);
    setSelectTable(undefined);

    setCheckChangeTable(false);
    setCancelBookTable(false);
  };
  const renderFloorTable = () => {
    return (
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          {tableFilter?.map((item: any) => {
            return (
              <TouchableOpacity
                style={{marginTop: 10}}
                onPress={() => {
                  // checkSelectTable == 1
                  //   ? (setCheckSelectTable(3),
                  //     setIdFloorTable({
                  //       floor_id: item,
                  //       table_id:
                  //         idFloorTable?.table_id == null
                  //           ? null
                  //           : idFloorTable?.table_id,
                  //     }))
                  //   : (setCheckSelectTable(3),
                  setSelectTable(item);
                  setCheckSelectTable(false);
                  // )
                  // console.log('first')
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
      {props?.select !== undefined && (
        <View style={styles.checkChange}>
          <Pressable
            onPress={() => props.hiddeSelect(undefined)}
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
              {props?.select?.name}
            </Text>
            <TouchableOpacity onPress={() => props.setCheckSelect(1)}>
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

            <TouchableOpacity onPress={() => setCancelBookTable(true)}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 21,
                  textAlign: 'center',
                  marginVertical: 10,
                  fontWeight: '500',
                }}>
                {props?.select?.timeBookTable !== 'null' &&
                props?.saveorderCheckChangeTable.length <= 0
                  ? ' Hủy bàn đặt'
                  : 'Hủy bàn'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Chuyển bàn */}
      <Modal
        transparent={true}
        visible={props.checkSelect == undefined ? false : true}
        animationType="slide">
        <View style={styles.centeredView}>
          <Pressable
            onPress={() => props.hiddeCheckSelect(undefined)}
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
              Chuyển {props?.select?.name}
            </Text>
            <View
              style={{
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
                paddingHorizontal: 50,
              }}>
              {props?.select?.timeBookTable !== 'null' && (
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
                      {props?.select?.nameUser}
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
                      {props?.select?.timeBookTable}
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
                  {props?.select?.name} :
                </Text>
                <Text
                  style={{
                    color: 'red',
                    marginLeft: 10,
                    fontWeight: '500',
                    fontSize: 18,
                  }}>
                  {props?.saveorderCheckChangeTable?.length} sản phẩm
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
                  style={styles.floorTable}
                  onPress={() => setCheckSelectTable(!checkSelectTable)}>
                  <TextInput
                    selectTextOnFocus={false}
                    editable={false}
                    value={selectTable == null ? '' : selectTable?.name}
                    style={styles.input}
                    placeholder="Chọn bàn"
                  />
                </TouchableOpacity>
                {checkSelectTable == true && (
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
                    {renderFloorTable()}
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
                onPress={() => props?.hiddeSelect('')}>
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
      {/* hủy bàn */}
      <Modal
        transparent={true}
        visible={checkDeleteTable}
        animationType="slide">
        <View
          style={[
            styles.centeredView,
            {flexDirection: 'column', justifyContent: 'flex-end'},
          ]}>
          <Pressable
            onPress={() => setCheckDeleteTable(false)}
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
                backgroundColor: '#fff',
                paddingVertical: 10,
                borderRadius: 2,
                width: '100%',
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              },
            ]}>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: '500',
                  color: 'red',
                }}>
                Bạn có muốn xóa {props?.select?.name} không ?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  onPress={() => setCheckDeleteTable(false)}
                  style={{
                    backgroundColor: 'blue',
                    borderRadius: 3,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginRight: 10,
                  }}>
                  {checkChangeTable == true ? (
                    <ActivityIndicator size={25} color={'#fff'} />
                  ) : (
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '500',
                        color: '#fff',
                      }}>
                      Hủy
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteTable()}
                  style={{
                    backgroundColor: 'red',
                    borderRadius: 3,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginLeft: 10,
                  }}>
                  {checkChangeTable == true ? (
                    <ActivityIndicator size={25} color={'#fff'} />
                  ) : (
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '500',
                        color: '#fff',
                      }}>
                      Xóa
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={cancelBookTable} animationType="slide">
        <View
          style={[
            styles.centeredView,
            {flexDirection: 'column', justifyContent: 'flex-end'},
          ]}>
          <Pressable
            onPress={() => setCancelBookTable(false)}
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
                backgroundColor: '#fff',
                paddingVertical: 10,
                borderRadius: 2,
                width: '100%',
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              },
            ]}>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: '500',
                  color: 'red',
                }}>
                Bạn có hủy bàn đặt này không ?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  onPress={() => setCancelBookTable(false)}
                  style={{
                    backgroundColor: 'blue',
                    borderRadius: 3,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginRight: 10,
                  }}>
                  {checkChangeTable == true ? (
                    <ActivityIndicator size={25} color={'#fff'} />
                  ) : (
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '500',
                        color: '#fff',
                      }}>
                      Đóng
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => cancelTable()}
                  style={{
                    backgroundColor: 'red',
                    borderRadius: 3,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginLeft: 10,
                  }}>
                  {checkChangeTable == true ? (
                    <ActivityIndicator size={25} color={'#fff'} />
                  ) : (
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '500',
                        color: '#fff',
                      }}>
                      Hủy
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
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
  floorTable: {
    borderWidth: 1,
    borderColor: '#0099FF',
    width: '100%',
    color: 'black',
    borderRadius: 5,
    textAlign: 'center',
  },
  selectFloor: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
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
