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
import {Size} from '../../size';
import {TextInput} from 'react-native-gesture-handler';
import {AppDispatch, RootState} from '../../App/Store';
import {getAllFloor} from './../../Features/FloorSlice';
import {editBookTable, getAllTable} from './../../Features/TableSlice';
import {changeTables, removeSaveOrderAll} from '../../Features/SaveOrderSlice';
type Props = {
  select: any;
  checkSelect: any;
  saveorderCheckChangeTable: any;
  setCheckSelect: (e: any) => void;
  hiddeSelect: (e: any) => void;
  hiddeCheckSelect: (e: any) => void;
};
const CheckChangeTable = (props: Props) => {
  const width = Size().width;
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
  const [checkSelectFloorTable, setCheckSelectFloorTable] = useState<any>(0);
  const [checkChangeTable, setCheckChangeTable] = useState<boolean>(false);
  const [checkDeleteTable, setCheckDeleteTable] = useState<boolean>(false);
  const [cancelBookTable, setCancelBookTable] = useState<boolean>(false);
  const [idFloorTable, setIdFloorTable] = useState<any>({
    floor_id: null,
    table_id: null,
  });

  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const floors = useAppSelect((data: any) => data.floors.value);
  const tables = useAppSelect((data: any) => data.tables.value);
  useEffect(() => {
    dispatch(getAllFloor());
    dispatch(getAllTable());
  }, []);

  const tableFilter = tables.filter(
    (item: any) =>
      item.floor_id == idFloorTable?.floor_id?._id &&
      item._id !== props?.select?._id,
  );

  // chuyển bàn
  const save = async () => {
    if (idFloorTable?.floor_id !== null && idFloorTable?.table_id !== null) {
      const id = props?.saveorderCheckChangeTable?.map((item: any) => {
        return item._id;
      });
      const data = {
        id: id,
        floor_id: idFloorTable?.floor_id,
        id_table: idFloorTable?.table_id,
      };
      setCheckChangeTable(true);
      await dispatch(changeTables(data));
      ToastAndroid.show('Chuyển bàn thành công', ToastAndroid.SHORT);
      props?.hiddeSelect('');
      setCheckSelectFloorTable(0);
      setIdFloorTable({
        floor_id: null,
        table_id: null,
      });
      setCheckChangeTable(false);
    }
  };
  // xóa bàn
  const deleteTable = async () => {
    const id = props?.saveorderCheckChangeTable?.map((item: any) => {
      return item._id;
    });
    setCheckChangeTable(true);

    await dispatch(removeSaveOrderAll(id));

    ToastAndroid.show('Xóa bàn thành công', ToastAndroid.SHORT);
    props?.hiddeSelect('');
    setCheckDeleteTable(false);
    setCheckSelectFloorTable(0);
    setIdFloorTable({
      floor_id: null,
      table_id: null,
    });
    setCheckChangeTable(false);
  };
  // hủy bàn đặt
  const cancelTable = async () => {
    setCheckChangeTable(true);

    await dispatch(
      editBookTable({
        id: props?.select?._id,
        nameUser: '',
        timeBookTable: 'null',
        amount: 0,
      }),
    );

    ToastAndroid.show('Hủy bàn đặt thành công', ToastAndroid.SHORT);
    props?.hiddeSelect('');
    setCheckDeleteTable(false);
    setCheckSelectFloorTable(0);
    setIdFloorTable({
      floor_id: null,
      table_id: null,
    });
    setCheckChangeTable(false);
    setCancelBookTable(false);
  };
  const renderFloorTable = () => {
    return (
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          {(checkSelectFloorTable == 1 ? floors : tableFilter)?.map(
            (item: any) => {
              return (
                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={() =>
                    checkSelectFloorTable == 1
                      ? (setCheckSelectFloorTable(3),
                        setIdFloorTable({
                          floor_id: item,
                          table_id:
                            idFloorTable?.table_id == null
                              ? null
                              : idFloorTable?.table_id,
                        }))
                      : (setCheckSelectFloorTable(3),
                        setIdFloorTable({
                          floor_id:
                            idFloorTable?.floor_id == null
                              ? null
                              : idFloorTable?.floor_id,
                          table_id: item,
                        }))
                  }>
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
            },
          )}
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
              width: 200,
              paddingVertical: 10,
              borderRadius: 3,
            }}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: 23,
                marginBottom: 20,
                paddingBottom: 10,
                borderColor: 'rgb(219,219,219)',
                borderBottomWidth: 1,
              }}>
              {props?.select?.name}
            </Text>
            <TouchableOpacity onPress={() => props.setCheckSelect(1)}>
              <Text style={{color: 'black', fontSize: 18, textAlign: 'center'}}>
                Chuyển bàn
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCheckDeleteTable(true)}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  textAlign: 'center',
                  marginVertical: 10,
                }}>
                Hủy bàn
              </Text>
            </TouchableOpacity>
            {props?.select?.timeBookTable !== 'null' && (
              <TouchableOpacity onPress={() => setCancelBookTable(true)}>
                <Text
                  style={{color: 'black', fontSize: 18, textAlign: 'center'}}>
                  Hủy bàn đặt
                </Text>
              </TouchableOpacity>
            )}
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
          <View
            style={[
              {
                width: width < 720 ? '50%' : '30%',
                backgroundColor: '#fff',
                paddingVertical: 10,
              },
            ]}>
            <Text
              style={{
                color: 'black',
                fontSize: 23,
                textAlign: 'center',
                fontWeight: '500',
                borderColor: 'rgb(219,219,219)',
                borderBottomWidth: 1,
                paddingBottom: 10,
              }}>
              Chuyển bàn
            </Text>
            <View style={styles.list}>
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
            <View style={styles.list}>
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
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                textAlign: 'center',
                fontWeight: '500',
                marginVertical: 10,
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
              <View style={{position: 'relative', width: '40%'}}>
                <TouchableOpacity
                  style={[styles.floorTable]}
                  onPress={() => setCheckSelectFloorTable(1)}>
                  <TextInput
                    value={
                      idFloorTable?.floor_id == null
                        ? ''
                        : idFloorTable?.floor_id?.name
                    }
                    style={styles.input}
                    placeholder="Chọn tầng"
                    selectTextOnFocus={false}
                    editable={false}
                  />
                </TouchableOpacity>
                {checkSelectFloorTable == 1 && (
                  <View
                    style={[
                      {
                        position: 'absolute',
                        top: 42,
                        width: '100%',
                        height:
                          floors?.length <= 4
                            ? tableFilter?.length <= 4
                              ? 150
                              : 200
                            : 200,
                        backgroundColor: '#fff',
                        paddingVertical: 10,
                        borderRadius: 2,
                        overflow: 'hidden',
                        zIndex: 1000,
                        borderColor: '#AAAAAA',
                        borderWidth: 1,
                      },
                    ]}>
                    {renderFloorTable()}
                  </View>
                )}
              </View>
              <Text style={{textAlign: 'center', color: 'black'}}>-</Text>
              <View style={{width: '40%', position: 'relative'}}>
                <TouchableOpacity
                  style={styles.floorTable}
                  onPress={() =>
                    checkSelectFloorTable == 3
                      ? setCheckSelectFloorTable(2)
                      : null
                  }>
                  <TextInput
                    selectTextOnFocus={false}
                    editable={false}
                    value={
                      idFloorTable?.table_id == null
                        ? ''
                        : idFloorTable?.table_id?.name
                    }
                    style={styles.input}
                    placeholder="Chọn bàn"
                  />
                </TouchableOpacity>
                {checkSelectFloorTable == 2 && (
                  <View
                    style={[
                      {
                        position: 'absolute',
                        top: 42,
                        width: '100%',
                        height:
                          floors?.length <= 4
                            ? tableFilter?.length <= 4
                              ? 150
                              : 200
                            : 200,
                        backgroundColor: '#fff',
                        paddingVertical: 10,
                        borderRadius: 2,
                        overflow: 'hidden',
                        zIndex: 1000,
                        borderColor: '#AAAAAA',
                        borderWidth: 1,
                      },
                    ]}>
                    {renderFloorTable()}
                  </View>
                )}
              </View>
            </View>
            <View style={{paddingHorizontal: 10, marginTop: 20}}>
              <TouchableOpacity
                style={{backgroundColor: 'blue', padding: 5}}
                onPress={() => save()}>
                {checkChangeTable == true ? (
                  <ActivityIndicator size={25} color={'#fff'} />
                ) : (
                  <Text
                    style={{color: '#fff', fontSize: 18, textAlign: 'center'}}>
                    Chuyển bàn
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 10,
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
    borderColor: 'rgb(219,219,219)',
    width: '100%',
    color: 'black',
    borderRadius: 3,
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
});
