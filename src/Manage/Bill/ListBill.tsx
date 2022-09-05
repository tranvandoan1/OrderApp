import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ListTableBill from './ListTableBill';
import ModalAddCategoris from '../../Modal/ModalCategoris/ModalAddCategoris';
import {Size} from '../../size';
const ListBill = ({navigation}: any) => {
  const width = Size()?.width;
  const [checkSearch, setCheckSearch] = useState<any>(false);
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [dataEdit, setDataEdit] = useState();

  return (
    <View style={{flex: 1, width: '100%' }}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('manage')}>
            <AntDesign name="left" style={styles.iconBack} />
          </TouchableOpacity>
          <Text
            style={[
              styles.titlePro,
              {
                fontSize: width < 720 ? 20 : 23,
              },
            ]}>
            Hóa đơn
          </Text>
        </View>
      </View>

      {checkSearch == true && (
        <TextInput style={styles.inputSearch} placeholder="Tìm kiếm sản phẩm" />
      )}

      <ListTableBill
        onClickAddDataEdit={(e: any) => setDataEdit(e)}
        onClickOpenModal={() => setModalAddVisible(true)}
      />

      <ModalAddCategoris
        modalVisible={modalAddVisible}
        onCloseModal={() => (setModalAddVisible(false), setDataEdit(undefined))}
        dataEdit={dataEdit}
      />
    </View>
  );
};

export default ListBill;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 15,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'blue',
    borderColor: 'rgb(219,219,219)',
    borderBottomWidth: 1,
  },
  titlePro: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    fontFamily: Platform.OS == 'android' ? 'Roboto-Light' : 'Roboto-Bold',
    fontStyle: 'normal',
  },
  iconBack: {
    fontSize: 20,
    color: '#fff',
    marginRight: 10,
    fontWeight: '600',
  },

  inputSearch: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginTop: 5,
    paddingLeft: 10,
    paddingVertical: 5,
  },
});
