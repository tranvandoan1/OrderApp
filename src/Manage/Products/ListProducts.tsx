import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TextInput} from 'react-native-gesture-handler';
import ListTableProduct from './ListTableProduct';
import ModalAddEditPro from './../../Modal/ModalAddEditPro/ModalAddEditPro';
const ListProducts = ({navigation}: any) => {
  const [checkSearch, setCheckSearch] = useState<any>(false);
  const [modalAddEidtVisible, setModalAddEditPro] = useState(false);
  const [dataEdit, setDataEdit] = useState();
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('manage')}>
            <AntDesign name="left" style={styles.iconBack} />
          </TouchableOpacity>
          <Text style={styles.titlePro}>Sản phẩm</Text>
        </View>
        <View style={styles.iconRight}>
          <TouchableOpacity onPress={() => setCheckSearch(!checkSearch)}>
            <AntDesign
              name="search1"
              style={[styles.iconBack, {marginRight: 20}]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalAddEditPro(true)}>
            <AntDesign name="plus" style={styles.iconBack} />
          </TouchableOpacity>
        </View>
      </View>
      {checkSearch == true && (
        <TextInput style={styles.inputSearch} placeholder="Tìm kiếm sản phẩm" />
      )}
      <ModalAddEditPro
        modalVisible={modalAddEidtVisible}
        onCloseModal={() => (setModalAddEditPro(false), setDataEdit(undefined))}
        dataEdit={dataEdit}
      />

      <ListTableProduct />
    </View>
  );
};

export default ListProducts;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 15,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'tomato',
  },
  titlePro: {
    fontSize: 23,
    color: '#fff',
    fontFamily: Platform.OS == 'android' ? 'Roboto-Light' : 'Roboto-Bold',
    fontStyle: 'normal',
    fontWeight: '600',
  },
  iconBack: {
    fontSize: 25,
    color: '#fff',
    marginRight: 10,
  },
  iconRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputSearch: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingLeft: 10,
    paddingVertical: 5,
  },
});
