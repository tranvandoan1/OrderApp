import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../App/Store';
import {Size} from '../../Component/size';
import {FlatGrid} from 'react-native-super-grid';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { getAllTable } from '../../Features/TableSlice';
import ModalDeleteTable from '../../Modal/ModalTable/ModalDelete';
type Props = {
  onClickAddDataEdit: (e: any) => void;
  onClickOpenModal: () => void;
};
const ListTablee = (props: Props) => {
  const width = Size()?.width;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const tables = useAppSelect((data: any) => data.tables.value);
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState();
  useEffect(() => {
    dispatch(getAllTable());
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {tables.length <= 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (
        <View style={{paddingTop: 10}}>
          <FlatGrid
            itemDimension={400}
            data={tables}
            renderItem={({item, index}) => (
              <TouchableOpacity
                key={index}
                style={styles.list}
                onLongPress={() => (
                  props.onClickAddDataEdit(item), props.onClickOpenModal()
                )}>
                <Text
                  style={{
                    textTransform: 'capitalize',
                    color: 'black',
                    fontWeight: '400',
                    fontSize: width < 720 ? 16 : 23,
                    fontFamily:
                      Platform.OS == 'android' ? 'Roboto-Light' : 'Roboto-Bold',
                    fontStyle: 'normal',
                  }}>
                  {item.name}
                </Text>
                <TouchableOpacity
                  onPress={() => (setModalVisible(true), setId(item._id))}
                  style={{position: 'absolute', top: 13, right: 11}}>
                  <Fontisto name="close" size={20} color={'red'} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <ModalDeleteTable
        modalVisible={modalVisible}
        onCloseModal={() => setModalVisible(false)}
        id={id}
      />
    </View>
  );
};

export default ListTablee;

const styles = StyleSheet.create({
  logo: {

    
    width: 66,
    height: 200,
    backgroundColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 0,
    padding: 0,
  },
  list: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderColor: 'rgb(219,219,219)',
    borderWidth: 0.5,
    margin: 10,
    position: 'relative',
    borderRadius: 2,
    flexDirection: 'row',
    elevation: 5,
    shadowColor: 'tomato',
  },
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
