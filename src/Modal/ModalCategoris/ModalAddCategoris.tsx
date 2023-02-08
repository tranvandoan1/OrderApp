import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../App/Store';
// import {addCate, editCatee} from '../../Features/CateSlice';
import { Size } from '../../Component/size';
type Props = {
  dataEdit: any;
  onCloseModal: () => void;
  modalVisible: any;
};
const ModalAddCategoris = (props: Props) => {
  const width = Size()?.width;
  const dispatch = useDispatch<AppDispatch>();
  const [check, setCheck] = useState<Boolean>(false);
  const [value, setValue] = useState<any>();

  const click = () => (
    <TouchableWithoutFeedback
      onPress={() => (props.onCloseModal(), setValue(undefined))}>
      <View style={{ flex: 1, width: '100%' }}></View>
    </TouchableWithoutFeedback>
  );
  const onSubmit = async () => {
    if (props.dataEdit == undefined) {
      const user: any = await AsyncStorage.getItem('user');
      const user_id = JSON.parse(user).data._id;
      try {
        setCheck(true);
        // await dispatch(addCate({name: value, user_id: user_id}));
        setCheck(false);
        setValue(undefined);
        props.onCloseModal();
        ToastAndroid.show('Thêm thành công', ToastAndroid.SHORT);
      } catch (error: any) {
        Alert.alert(error.response.data.error);
      }
    } else {
      try {
        setCheck(true);

        // await dispatch(
        //   editCatee({
        //     id: props.dataEdit._id,
        //     data: {name: value == undefined ? props.dataEdit.name : value},
        //   }),
        // );

        setCheck(false);
        setValue(undefined);
        props.onCloseModal();
        ToastAndroid.show('Sửa thành công', ToastAndroid.SHORT);
      } catch (error: any) {
        Alert.alert(error.response.data.error);
      }
    }
  };
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
            width < 720 ? { width: '100%' } : { width: 600 },
          ]}>
          <Text style={[styles.title, { fontSize: width < 720 ? 20 : 25 }]}>
            {props.dataEdit == undefined ? 'Thêm danh mục' : 'Sửa danh mục'}
          </Text>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TextInput
              style={[
                String(value).length <= 0 ? styles.inputActive : styles.input,
                { fontSize: width < 720 ? 18 : 20 },
              ]}
              autoCapitalize="words"
              onChangeText={e => setValue(e)}
              defaultValue={
                props.dataEdit == undefined ? value : props.dataEdit.name
              }
              placeholder="Tên danh mục"
              placeholderTextColor={String(value).length <= 0 ? 'red' : ''}
            />
            {String(value).length <= 0 && (
              <Text style={styles.validate}>Tên không để trống !</Text>
            )}
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
    </Modal>
  );
};

export default ModalAddCategoris;

const styles = StyleSheet.create({
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
    fontSize: 18
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
