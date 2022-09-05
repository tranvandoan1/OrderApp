import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  FlatList,
} from 'react-native';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../App/Store';
import {addCate, editCatee} from '../../Features/CateSlice';
import {addFloor, editFloor, getAllFloor} from '../../Features/FloorSlice';
import {addTable, editTable} from '../../Features/TableSlice';
import {Size} from '../../size';
import AntDesign from 'react-native-vector-icons/AntDesign';
type Props = {
  dataEdit: any;
  onCloseModal: () => void;
  modalVisible: any;
};
const ModalAddTable = (props: Props) => {
  const width = Size()?.width;
  const dispatch = useDispatch<AppDispatch>();
  const [check, setCheck] = useState<Boolean>(false);
  const [value, setValue] = useState<any>();
  const [valueFloor, setValueFloor] = useState<any>();
  const [table, setTable] = useState<boolean>(false);
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const floors = useAppSelect((data: any) => data.floors.value);
  useEffect(() => {
    dispatch(getAllFloor());
  }, []);
  const click = () => (
    <TouchableWithoutFeedback
      onPress={() => (props.onCloseModal(), setValue(undefined))}>
      <View style={{flex: 1, width: '100%'}}></View>
    </TouchableWithoutFeedback>
  );
  const click1 = () => (
    <Pressable
      style={{position: 'absolute', top: 0, width: '100%', height: '100%'}}
      onPress={() => setTable(false)}>
      <View style={{flex: 1, width: '100%'}}></View>
    </Pressable>
  );
  const onSubmit = async () => {
    if (props.dataEdit == undefined) {
      const user: any = await AsyncStorage.getItem('user');
      const user_id = JSON.parse(user).data._id;
      try {
        setCheck(true);
        await dispatch(
          addTable({name: value, user_id: user_id, floor_id: valueFloor?._id}),
        );
        setCheck(false);
        setValue(undefined);
        setValueFloor(undefined);
        props.onCloseModal();
        ToastAndroid.show('Thêm thành công', ToastAndroid.SHORT);
      } catch (error: any) {
        Alert.alert(error.response.data.error);
      }
    } else {
      try {
        setCheck(true);
        await dispatch(
          editTable({
            id: props.dataEdit._id,
            data: {
              name: value == undefined ? props.dataEdit.name : value,
              floor_id:
                valueFloor == undefined
                  ? props?.dataEdit.floor_id
                  : valueFloor._id,
            },
          }),
        );

        setCheck(false);
        setValue(undefined);
        setValueFloor(undefined);
        props.onCloseModal();
        ToastAndroid.show('Sửa thành công', ToastAndroid.SHORT);
      } catch (error: any) {
        Alert.alert(error.response.data.error);
      }
    }
  };
  const renderItem = ({item, index}: any) => (
    <TouchableOpacity
      style={{
        borderColor: 'rgb(219,219,219)',
        borderBottomWidth: 1,
        paddingVertical: 10,
      }}
      onPress={() => (setValueFloor(item), setTable(false))}>
      <Text style={styles.listOption}>{item.name}</Text>
    </TouchableOpacity>
  );
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}>
      <View style={styles.centeredView}>
        {click()}
        <View
          style={[
            styles.modalView,
            width < 720 ? {width: '100%'} : {width: 600},
          ]}>
          <Text style={[styles.title, {fontSize: width < 720 ? 20 : 25}]}>
            {props.dataEdit == undefined ? 'Thêm bàn' : 'Sửa bàn'}
          </Text>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TextInput
              style={[
                String(value).length <= 0 ? styles.inputActive : styles.input,
                {fontSize: width < 720 ? 18 : 20},
              ]}
              autoCapitalize="words"
              onChangeText={e => setValue(e)}
              defaultValue={
                props.dataEdit == undefined ? value : props.dataEdit.name
              }
              placeholder="Tên bàn"
              placeholderTextColor={String(value).length <= 0 ? 'red' : ''}
            />
            {String(value).length <= 0 && (
              <Text style={styles.validate}>Tên không để trống !</Text>
            )}
            <TouchableOpacity
              style={{position: 'relative'}}
              onPress={() => setTable(true)}>
              <TextInput
                style={[
                  String(value).length <= 0 ? styles.inputActive : styles.input,
                  {fontSize: width < 720 ? 18 : 20},
                ]}
                autoCapitalize="words"
                defaultValue={
                  props.dataEdit == undefined
                    ? valueFloor?.name
                    : valueFloor == undefined
                    ? floors?.map((item: any) => {
                        if (item._id == props.dataEdit.floor_id) {
                          return item.name;
                        }
                      })
                    : valueFloor?.name
                }
                editable={false}
                selectTextOnFocus={false}
                placeholder="Chọn tầng"
                placeholderTextColor={String(value).length <= 0 ? 'red' : ''}
              />
              <AntDesign
                name="caretdown"
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 27,
                  fontSize: 16,
                }}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>

          <TouchableOpacity onPress={() => onSubmit()}>
            <Text style={styles.add}>
              {check == true ? (
                <ActivityIndicator size={20} color={'#fff'} />
              ) : props.dataEdit == undefined ? (
                ' Thêm'
              ) : (
                'Sửa'
              )}
            </Text>
          </TouchableOpacity>
        </View>
        {click()}
      </View>
      <Modal animationType="slide" transparent={true} visible={table}>
        <View style={styles.centeredViewTable}>
          {click1()}
          <View
            style={[
              styles.modalViewTable,
              width < 720 ? {width: '100%'} : {width: 450},
            ]}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={floors}
              style={{
                backgroundColor: '#fff',
                borderRadius: 5,
                width: width < 720 ? '100%' : 500,
              }}
              renderItem={renderItem}
              keyExtractor={(item: any) => item._id}
            />
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default ModalAddTable;

const styles = StyleSheet.create({
  modalViewTable: {
    borderRadius: 5,
    paddingVertical: 20,
  },
  centeredViewTable: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 40,
  },
  input: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 2,
    width: '100%',
    color: 'black',
  },
  inputActive: {
    borderColor: 'red',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 5,
  },
  validate: {
    color: 'red',
    fontWeight: '400',
    marginBottom: 10,
  },
  add: {
    backgroundColor: 'rgb(23, 76, 250)',
    width: '100%',
    padding: 10,
    borderRadius: 2,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  listOption: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: '400',
  },
});
