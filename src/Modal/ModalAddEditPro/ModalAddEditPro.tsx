import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component, useEffect, useState} from 'react';
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
  Dimensions,
  useWindowDimensions,
  Button,
  FlatList,
} from 'react-native';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../App/Store';
import {checkUser, Size} from '../../size';
import {useForm, Controller} from 'react-hook-form';
import {Picker} from 'react-native-form-component';
import {getAll} from '../../Features/CateSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
type Props = {
  dataEdit: any;
  onCloseModal: () => void;
  modalVisible: any;
};
const ModalAddEditPro = (props: Props) => {
  const width = Size().width;
  const height = Size().height;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const categoris = useAppSelect((data: any) => data.categoris.value);

  const [check, setCheck] = useState<Boolean>(false);
  const [value, setValue] = useState<any>();
  const [cate, setCate] = useState<any>(false);
  useEffect(() => {
    dispatch(getAll());
  },[]);
  const click = () => (
    <TouchableWithoutFeedback
      onPress={() => (props.onCloseModal(), setValue(undefined))}>
      <View style={{flex: 1, width: '100%'}}></View>
    </TouchableWithoutFeedback>
  );
  const click1 = () => (
    <TouchableWithoutFeedback>
      <View style={{flex: 1, width: '100%'}}></View>
    </TouchableWithoutFeedback>
  );
  const onSubmit = async () => {
    console.log('first');
    // if (props.dataEdit == undefined) {
    //   const user: any = await AsyncStorage.getItem('user');
    //   const user_id = JSON.parse(user).data._id;
    //   try {
    //     setCheck(true);
    //     await dispatch(addCate({name: value, user_id: user_id}));
    //     setCheck(false);
    //     setValue(undefined);
    //     props.onCloseModal();
    //   } catch (error: any) {
    //     Alert.alert(error.response.data.error);
    //   }
    // } else {
    //   try {
    //     setCheck(true);
    //     let formData = new FormData();
    //     formData.append(
    //       'name',
    //       value == undefined ? props.dataEdit.name : value,
    //     );
    //     await dispatch(editCatee({id: props.dataEdit._id, data: formData}));

    //     setCheck(false);
    //     setValue(undefined);
    //     props.onCloseModal();
    //   } catch (error: any) {
    //     Alert.alert(error.response.data.error);
    //   }
    // }
  };
  const renderItem = ({item, index}: any) => (
    <TouchableOpacity
      style={{
        width: 500,
        borderWidth: 1,
        borderColor: 'rgb(229, 229, 229)',
      }}
      onPress={() => console.log('dá')}>
      <Text style={styles.listOption}>{item.value}</Text>
    </TouchableOpacity>
  );
  console.log(checkUser(),'32ewdsxz')
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
            width < 720 ? {width: '100%'} : {width: 500},
          ]}>
          <Text style={styles.title}>
            {props.dataEdit == undefined ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}
          </Text>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TextInput
              style={
                String(value).length <= 0 ? styles.inputActive : styles.input
              }
              autoCapitalize="words"
              onChangeText={e => setValue(e)}
              defaultValue={
                props.dataEdit == undefined ? value : props.dataEdit.name
              }
              placeholder="Tên sản phẩm"
              placeholderTextColor={String(value).length <= 0 ? 'red' : ''}
            />
            {String(value).length <= 0 && (
              <Text style={styles.validate}>Tên không để trống !</Text>
            )}
            <TextInput
              style={
                String(value).length <= 0 ? styles.inputActive : styles.input
              }
              autoCapitalize="words"
              onChangeText={e => setValue(e)}
              defaultValue={
                props.dataEdit == undefined ? value : props.dataEdit.name
              }
              placeholder="Giá sản phẩm"
              placeholderTextColor={String(value).length <= 0 ? 'red' : ''}
            />
            {String(value).length <= 0 && (
              <Text style={styles.validate}>Giá không để trống !</Text>
            )}
            <TouchableOpacity
              style={{position: 'relative'}}
              onPress={() => setCate(true)}>
              <TextInput
                style={
                  String(value).length <= 0 ? styles.inputActive : styles.input
                }
                autoCapitalize="words"
                defaultValue={
                  props.dataEdit == undefined ? value : props.dataEdit.name
                }
                editable={false}
                selectTextOnFocus={false}
                placeholder="Danh mục sản phẩm"
                placeholderTextColor={String(value).length <= 0 ? 'red' : ''}
              />
              <AntDesign
                name="caretdown"
                style={{position: 'absolute', right: 10, top: 27, fontSize: 16}}
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
      <Modal animationType="slide" transparent={true} visible={cate}>
        <View style={styles.centeredView}>
          {click1()}
          <View style={styles.modalView}>
            <View style={{width: '20%'}}>{click1()}</View>

            <FlatList
              data={categoris}
              style={{
                backgroundColor: '#fff',
                borderRadius: 5,
              }}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
            <View style={{width: '20%'}}>{click1()}</View>
          </View>
          {click1()}
        </View>
      </Modal>
    </Modal>
  );
};

export default ModalAddEditPro;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 40,
  },
  input: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 3,
    width: '100%',
    fontSize: 15,
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
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Platform.OS == 'android' ? 'DynaPuff-Light' : 'DynaPuff-Bold',
    color: 'black',
    fontStyle: 'normal',
  },
  listOption: {
    fontSize: 20,
    color: 'black',
  },
});
