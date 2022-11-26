import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../App/Store';
import { removeTable } from './../../Features/TableSlice';
type Props = {
  onCloseModal: () => void;
  modalVisible: any;
  id: any;
};
const ModalDeleteTable = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [check, setCheck] = useState<Boolean>(false);

  const click = () => (
    <TouchableWithoutFeedback onPress={() => props.onCloseModal()}>
      <View style={{flex: 1, width: '100%'}}></View>
    </TouchableWithoutFeedback>
  );
  const deletee = async () => {
    setCheck(true);
    await dispatch(removeTable(props.id));
    setCheck(false);
    props.onCloseModal();
    ToastAndroid.show('Xóa thành công', ToastAndroid.SHORT);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}>
      <View style={styles.centeredView}>
        {click()}
        <View style={styles.modalView}>
          <Text style={styles.titleCheck}>Bạn có muốn xóa không ?</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 20,
              marginBottom: 10,
              width: 200,
            }}>
            <TouchableOpacity
              style={styles.close}
              onPress={() => props.onCloseModal()}>
              {check == true ? (
                <ActivityIndicator size={20} color={'#fff'} />
              ) : (
                <Text style={{color: '#fff', fontSize: 18}}>Đóng</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.delete} onPress={() => deletee()}>
              {check == true ? (
                <ActivityIndicator size={20} color={'#fff'} />
              ) : (
                <Text style={{color: '#fff', fontSize: 18}}>Xóa</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalDeleteTable;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleCheck: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: 'red',
  },
  close: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: 'blue',
  },
  delete: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});
