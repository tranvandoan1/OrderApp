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
import {getAll} from '../../Features/CateSlice';
import ModalDelete from './../../Modal/ModalCategoris/ModalDelete';
import {Size} from '../../size';
import {FlatGrid} from 'react-native-super-grid';
import Fontisto from 'react-native-vector-icons/Fontisto';
type Props = {
  onClickAddDataEdit: (e: any) => void;
  onClickOpenModal: () => void;
};
const ListTableCate = (props: Props) => {
  const width = Size()?.width;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const categoris = useAppSelect((data: any) => data.categoris.value);
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState();
  useEffect(() => {
    dispatch(getAll());
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {categoris.length <= 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (
        <View style={{paddingTop: 10}}>
          <FlatGrid
            itemDimension={400}
            data={categoris.slice().reverse()}
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
      <ModalDelete
        modalVisible={modalVisible}
        onCloseModal={() => setModalVisible(false)}
        id={id}
      />
    </View>
  );
};

export default ListTableCate;

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
