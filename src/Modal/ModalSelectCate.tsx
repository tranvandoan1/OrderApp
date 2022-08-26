import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Size} from '../size';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {getAll} from '../Features/CateSlice';
import {getAllPro} from './../Features/ProductsSlice';
type Props = {
  selectCate: (e: any) => void;
  selectModalCate: any;
};
const ModalSelectCate = (props: Props) => {
  const width = Size().width;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const cateogoris = useAppSelect((data: any) => data.categoris.value);
  const products = useAppSelect((data: any) => data.products.value);
  const [check, setCheck] = useState<any>();
  useEffect(() => {
    dispatch(getAll());
    dispatch(getAllPro());
  }, []);
  const select = (cate: any) => {
    setCheck(cate._id);
    const pro = products?.filter((item: any) => item.cate_id == cate._id);
    props.selectCate({name: cate.name, pro: pro});
  };
  return (
    <Modal
      transparent={true}
      visible={props.selectModalCate}
      animationType="fade">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => props.selectCate('')}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}></Pressable>

        <View
          style={[
            styles.navigationContainer,
            {width: width < 720 ? '50%' : '30%'},
          ]}>
          <View style={{flexDirection: 'column', width: '100%'}}>
            <View
              style={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              {cateogoris?.map((item: any, index: any) => {
                return (
                  <TouchableOpacity
                    onPressIn={() => select(item)}
                    key={index}
                    style={[
                      styles.list,
                      check == item._id && styles.listActive,
                      {
                        borderBottomWidth:
                          cateogoris.length == index + 1 ? 0 : 0.5,
                      },
                    ]}
                    onPress={() => console.log(item)}>
                    <Text
                      style={[
                        styles.textName,
                        check == item._id && styles.textNameActive,
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalSelectCate;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'relative',
  },
  navigationContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 10,
  },
  textName: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
    textTransform: 'capitalize',
    paddingVertical: 10,
    width: '100%',
    textAlign: 'center',
  },
  list: {
    borderColor: 'rgb(219, 219, 219)',
    width: '100%',
  },
  listActive: {
    backgroundColor: 'blue',
  },
  textNameActive: {
    color: '#fff',
  },
});
