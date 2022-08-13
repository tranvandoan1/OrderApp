import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../App/Store';
import {getAll} from '../../Features/CateSlice';
import {removeCate} from './../../Features/CateSlice';
import ModalDelete from './../../Modal/ModalCategoris/ModalDelete';
type Props = {
  onClickAddDataEdit: (e: any) => void;
  onClickOpenModal: () => void;
};
const ListTableCate = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const categoris = useAppSelect((data: any) => data.categoris.value);
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState();
  useEffect(() => {
    dispatch(getAll());
  }, []);

  return (
    <View style={{flex: 1}}>
      {categoris.length <= 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (
        <SafeAreaView>
          <ScrollView>
            {categoris
              .slice()
              .reverse()
              .map((item: any, index: number) => {
                return (
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
                        fontSize: 16,
                        fontFamily:
                          Platform.OS == 'android'
                            ? 'Roboto-Light'
                            : 'Roboto-Bold',
                        fontStyle: 'normal',
                      }}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => (setModalVisible(true), setId(item._id))}>
                      <Text>Xóa</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </SafeAreaView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
