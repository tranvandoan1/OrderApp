import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ListTableCate from './ListTableCate';

const ListCate = ({navigation}: any) => {
  const [checkSearch, setCheckSearch] = useState<any>(false);

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('manage')}>
            <AntDesign name="left" style={styles.iconBack} />
          </TouchableOpacity>
          <Text style={styles.titlePro}>Danh mục</Text>
        </View>
        <View style={styles.iconRight}>
          <TouchableOpacity onPress={() => setCheckSearch(!checkSearch)}>
            <AntDesign
              name="search1"
              style={[styles.iconBack, {marginRight: 20}]}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name="pluscircleo" style={styles.iconBack} />
          </TouchableOpacity>
        </View>
      </View>

      {checkSearch == true && (
        <TextInput style={styles.inputSearch} placeholder="Tìm kiếm sản phẩm" />
      )}

      <ListTableCate />
    </View>
  );
};

export default ListCate;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingVertical: 15,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'blue',
  },
  titlePro: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  iconBack: {
    fontSize: 20,
    color: '#fff',
    marginRight: 10,
    fontWeight: '600',
  },
  iconRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputSearch: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginTop: 5,
    paddingLeft: 10,
    paddingVertical: 5,
  },
});
