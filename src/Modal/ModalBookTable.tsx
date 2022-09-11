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
import React, {useEffect, useState} from 'react';
import {Size} from '../size';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {getAllFloor} from '../Features/FloorSlice';
import {editBookTable, editTable, getAllTable} from '../Features/TableSlice';
import {getAllSaveOrder} from '../Features/SaveOrderSlice';
type Props = {
  bookTable: any;
  hiddenBookTable: () => void;
};
const ModalBookTable = (props: Props) => {
  const width = Size().width;

  const [checkSelectFloorTable, setCheckSelectFloorTable] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [valueName, setValueName] = useState<any>();
  const [valueAmount, setValueAmount] = useState<any>();
  const [valueTime, setValueTime] = useState<any>();
  const [idFloorTable, setIdFloorTable] = useState<any>({
    floor_id: null,
    table_id: null,
  });

  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const floors = useAppSelect((data: any) => data.floors.value);
  const tables = useAppSelect((data: any) => data.tables.value);
  const saveorders = useAppSelect((data: any) => data.saveorders.value);
  useEffect(() => {
    dispatch(getAllFloor());
    dispatch(getAllTable());
    dispatch(getAllSaveOrder());
  }, []);

  let checkSaveOrder: any = [];
  tables?.map((element: any) => {
    let arrFilter = saveorders?.filter((e: any) => {
      return e.id_table === element._id;
    });
    checkSaveOrder.push({_id: element._id, data: arrFilter, sum: 0});
  });
  const tableFilter: any = [];
  tables.filter((item: any) => {
    if (
      item.floor_id == idFloorTable?.floor_id?._id &&
      item.timeBookTable == 'null'
    ) {
      checkSaveOrder?.map((check: any, index: any) => {
        if (check._id == item._id) {
          if (check.data.length <= 0) {
            tableFilter.push(item);
          }
        }
      });
    }
  });

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
  const booxTable = async () => {
    setLoading(true);
    await dispatch(
      editBookTable({
        id: idFloorTable?.table_id,
        nameUser: valueName,
        timeBookTable: valueTime,
        amount: valueAmount,
      }),
    );
    setLoading(false);
    setValueAmount(undefined);
    setValueName(undefined);
    setValueTime(undefined);
    setIdFloorTable({floor_id: null, table_id: null});
    props?.hiddenBookTable();
  };
  return (
    <Modal transparent={true} visible={props?.bookTable} animationType="slide">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => props?.hiddenBookTable()}
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
              width: '50%',
              backgroundColor: '#fff',
              padding: 10,
              borderRadius:4
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
              paddingVertical: 10,
              marginBottom: 10,
            }}>
            Thông tin bàn đặt
          </Text>
          <View style={styles.name}>
            <Text style={{color: 'black', fontSize: 17}}>Tên khách hàng :</Text>
            <TextInput
              value={valueName}
              onChangeText={(e: any) => setValueName(e)}
              style={styles.input}
              placeholder="Tên khách hàng"
            />
          </View>
          <View style={styles.name}>
            <Text style={{color: 'black', fontSize: 17}}>Thời gian :</Text>
            <TextInput
              value={valueTime}
              onChangeText={(e: any) => setValueTime(e)}
              style={styles.input}
              placeholder="Thời gian đặt bàn"
            />
          </View>

          <View style={[styles.name, {marginBottom: 10}]}>
            <Text style={{color: 'black', fontSize: 17}}>Số lượng :</Text>
            <TextInput
              value={valueAmount}
              onChangeText={(e: any) => setValueAmount(e)}
              style={styles.input}
              placeholder="Số lượng khách hàng"
            />
          </View>

          <Text style={{color: 'black', fontSize: 19, marginTop: 20}}>
            Chọn bàn muốn đặt
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <View style={{position: 'relative', width: '40%'}}>
              <TouchableOpacity
                style={[styles.floorTable]}
                onBlur={() => console.log('first')}
                onPress={() => setCheckSelectFloorTable(1)}>
                <TextInput
                  value={
                    idFloorTable?.floor_id == null
                      ? ''
                      : idFloorTable?.floor_id?.name
                  }
                  style={[styles.input, {textAlign: 'center'}]}
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
                  style={[styles.input, {textAlign: 'center'}]}
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
          <View style={{marginTop: 20}}>
            <TouchableOpacity
              style={{backgroundColor: 'blue', padding: 5}}
              onPress={() => booxTable()}>
              {loading == true ? (
                <ActivityIndicator size={25} color={'#fff'} />
              ) : (
                <Text
                  style={{color: '#fff', fontSize: 18, textAlign: 'center'}}>
                  Đặt bàn
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    // <Modal transparent={true} visible={props?.bookTable} animationType="slide">
    //   <View style={styles.centeredView}>
    //     <Pressable
    //       onPress={() => props?.hiddenBookTable()}
    //       style={{
    //         width: '100%',
    //         height: '100%',
    //         position: 'absolute',
    //         top: 0,
    //         bottom: 0,
    //         left: 0,
    //         right: 0,
    //       }}></Pressable>

    //     <View
    //       style={{
    //         backgroundColor: '#fff',
    //         width: 400,
    //         paddingTop: 10,
    //         borderRadius: 3,
    //       }}>
    //       <Text
    //         style={{
    //           color: 'black',
    //           textAlign: 'center',
    //           fontSize: 23,
    //           borderColor: 'rgb(219,219,219)',
    //           borderBottomWidth: 1,
    //         }}>
    //         Thông tin đặt bàn
    //       </Text>
    //       <Text>Bàn muốn đặt :</Text>
    //       <TouchableOpacity
    //         //   onPress={() => setBookTable(true)}
    //         style={{backgroundColor: 'blue', width: '100%', padding: 10}}>
    //         <Text style={{color: '#fff', fontSize: 18, textAlign: 'center'}}>
    //           Đặt bàn
    //         </Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // </Modal>
  );
};

export default ModalBookTable;

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
  name: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
