import {
  ActivityIndicator,
  Button,
  FlatList,
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
import {editBookTable, editTable, getAllTable} from '../Features/TableSlice';
import {getAllSaveOrder} from '../Features/SaveOrderSlice';
import {Controller, useForm} from 'react-hook-form';

type Props = {
  bookTable: any;
  hiddenBookTable: () => void;
};
const ModalBookTable = (props: Props) => {
  const width = Size().width;

  const [checkSelectFloorTable, setCheckSelectFloorTable] = useState<any>(0);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [valueName, setValueName] = useState<any>();
  const [valueAmount, setValueAmount] = useState<any>();
  const [valueTime, setValueTime] = useState<any>();
  const [valuePhone, setValuePhone] = useState<any>();
  const [selectTable, setSelectTable] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const tables = useAppSelect((data: any) => data.tables.value);
  const saveorders = useAppSelect((data: any) => data.saveorders.value);
  useEffect(() => {
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
  // lấy những bàn trống
  tables.filter((item: any) => {
    if (item.timeBookTable == 'null') {
      checkSaveOrder?.map((check: any, index: any) => {
        if (check._id == item._id) {
          if (check.data.length <= 0) {
            tableFilter.push(item);
          }
        }
      });
    }
  });

  const renderTable = ({item}: any) => {
    return (
      <View>
        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => (setSelectTable(item), setShowTable(false))}>
          <Text
            style={{
              color: 'black',
              fontSize: 18,
              textAlign: 'center',
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      phone: '',
      amount: '',
      timeBookTable: '',
      nameUser: '',
    },
  });

  const booxTable = async (values: any) => {
    setLoading(true);
    const newData: any = {
      id: selectTable?._id,
      ...values,
    };
    // @ts-ignore
    await dispatch(editBookTable(newData));

    setLoading(false);
    reset({
      phone: '',
      amount: '',
      timeBookTable: '',
      nameUser: '',
    });
    props?.hiddenBookTable();
  };
  const close = () => {
    setLoading(true);
    reset({
      phone: '',
      amount: '',
      timeBookTable: '',
      nameUser: '',
    });
    props?.hiddenBookTable();
    setLoading(false);
  };
  return (
    <Modal transparent={true} visible={props?.bookTable} animationType="slide">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => (
            setLoading(false),
            setValueAmount(undefined),
            setValueName(undefined),
            setValueTime(undefined),
            setSelectTable({floor_id: null, table_id: null}),
            props?.hiddenBookTable()
          )}
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
              width: '35%',
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 4,
              shadowColor: 'red',
              shadowOffset: {width: 10, height: 14},
              shadowOpacity: 0.2,
              shadowRadius: 3,
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
            Thông tin đặt bàn 
            {/* {String(selectTable).length} */}
          </Text>
          <View style={styles.name}>
            <Controller
              rules={{
                required: true,
              }}
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      width: '100%',
                      borderColor: errors.nameUser ? 'red' : '#0099FF',
                    },
                  ]}
                  placeholder="Tên khách hàng"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="nameUser"
            />
            {errors.nameUser && (
              <Text style={{color: 'red'}}>Chưa nhập tên !</Text>
            )}
          </View>
          <View style={[styles.name]}>
            <Controller
              rules={{
                required: true,
              }}
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      width: '100%',
                      borderColor: errors.phone ? 'red' : '#0099FF',
                    },
                  ]}
                  placeholder="Số điện thoại"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="number-pad"
                />
              )}
              name="phone"
            />
            {errors.phone && (
              <Text style={{color: 'red'}}>Chưa nhập số điện thoại !</Text>
            )}
          </View>
          <View style={styles.name}>
            <Controller
              rules={{
                required: true,
              }}
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      width: '100%',
                      borderColor: errors.timeBookTable ? 'red' : '#0099FF',
                    },
                  ]}
                  placeholder="Thời gian đặt bàn"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="number-pad"
                  value={value}
                />
              )}
              name="timeBookTable"
            />
            {errors.timeBookTable && (
              <Text style={{color: 'red'}}>Chưa nhập thời gian !</Text>
            )}
          </View>

          <View style={[styles.name, {marginBottom: 10}]}>
            <Controller
              rules={{
                required: true,
              }}
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      width: '100%',
                      borderColor: errors.amount ? 'red' : '#0099FF',
                    },
                  ]}
                  placeholder="Số lượng khách hàng"
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="amount"
            />
            {errors.amount && (
              <Text style={{color: 'red'}}>Chưa nhập số lượng khách !</Text>
            )}
          </View>

          <Text
            style={{
              color: 'black',
              fontSize: 19,
              marginTop: 20,
              fontWeight: '500',
            }}>
            Chọn bàn muốn đặt
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              position: 'relative',
            }}>
            <View style={{width: '100%', position: 'relative'}}>
              <TouchableOpacity
                style={styles.floorTable}
                onPress={() => setShowTable(true)}>
                <TextInput
                  selectTextOnFocus={false}
                  editable={false}
                  value={selectTable == undefined ? '' : selectTable?.name}
                  style={[
                    styles.input,
                    {textAlign: 'center', fontSize: 19, borderColor: '#0099FF'},
                  ]}
                  placeholder="Chọn bàn"
                />
              </TouchableOpacity>
            </View>
            {showTable == true && (
              <View
                style={[
                  {
                    position: 'absolute',
                    top: 0,
                    height: 200,
                    width: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    overflow: 'visible',
                    zIndex: 1000,
                    borderColor: '#AAAAAA',
                    borderWidth: 1,
                  },
                ]}>
                <SafeAreaView>
                  <FlatList
                    data={tableFilter}
                    renderItem={renderTable}
                    keyExtractor={item => item}
                  />
                </SafeAreaView>
              </View>
            )}
          </View>

          <View style={{marginTop: 20}}>
            <TouchableOpacity
              style={{backgroundColor: '#0099FF', padding: 10, borderRadius: 5}}
              onPress={handleSubmit(booxTable)}>
              {loading == true ? (
                <ActivityIndicator size={25} color={'#fff'} />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 19,
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                  Đặt bàn
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
              onPress={() => close()}>
              {loading == true ? (
                <ActivityIndicator size={25} color={'#fff'} />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 19,
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
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1.5,
    width: '100%',
    marginVertical: 5,
    shadowColor: 'red',
    shadowOffset: {width: 10, height: 14},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    fontWeight: '500',
    height: 50,
  },
  floorTable: {
    // borderWidth: 1,
    // borderColor: 'rgb(219,219,219)',
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
    flexDirection: 'column',
  },
});
