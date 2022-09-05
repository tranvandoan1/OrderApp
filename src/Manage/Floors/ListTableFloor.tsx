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
import {Size} from '../../size';
import {FlatGrid} from 'react-native-super-grid';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {getAllFloor} from './../../Features/FloorSlice';
import ModalDeleteFloor from './../../Modal/ModalFloors/ModalDelete';
type Props = {
  onClickAddDataEdit: (e: any) => void;
  onClickOpenModal: () => void;
};
const ListTableFloor = (props: Props) => {
  const width = Size()?.width;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const floors = useAppSelect((data: any) => data.floors.value);
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState();
  useEffect(() => {
    dispatch(getAllFloor());
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {floors.length <= 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (
        <View style={{paddingTop: 10}}>
          <FlatGrid
            itemDimension={400}
            data={floors}
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
      <ModalDeleteFloor
        modalVisible={modalVisible}
        onCloseModal={() => setModalVisible(false)}
        id={id}
      />
    </View>
  );
};

export default ListTableFloor;

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
