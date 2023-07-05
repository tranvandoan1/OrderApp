import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Size, SizeScale } from '../Component/size';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../App/Store';
import { getCategori } from '../Features/CateSlice';
import { getProductAll } from './../Features/ProductsSlice';
type Props = {
  selectCate: (e: any) => void;
  selectModalCate: any;
  valueCate: any;
};
const ModalSelectCate = React.memo((props: Props) => {
  const width = Size().width;
  const widthScale = SizeScale().width;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const cateogoris = useAppSelect((data: any) => data.categoris.value);
  const products = useAppSelect((data: any) => data.products.value);
  const [check, setCheck] = useState<any>();
  useEffect(() => {
    dispatch(getCategori());
    dispatch(getProductAll());
  }, []);
  const select = (cate: any) => {
    setCheck(cate._id);
    const pro = products?.filter((item: any) => item.cate_id == cate._id);
    props.selectCate({ name: cate.name, pro: pro, id: cate._id });
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
            { width: width < 720 ? '50%' : '30%' },
          ]}>
          <View style={{ flexDirection: 'column', width: '100%' }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <View style={[styles.boxTextCate, { paddingVertical: widthScale * 20, paddingHorizontal: widthScale * 10 }]}>
                <Text style={[styles.textCate, { fontSize: widthScale * 35 }]}>Danh mục</Text>
              </View>
              {
                cateogoris?.length <= 0 ?
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={'blue'} />
                  </View> :
                  cateogoris?.map((item: any, index: any) => {
                    return (
                      <TouchableOpacity
                        onPressIn={() => select(item)}
                        key={index}
                        style={[
                          styles.list,
                          // @ts-ignore
                          props?.valueCate?.id == item._id &&
                          (props?.valueCate !== undefined ||
                            String(props?.valueCate).length > 0) &&
                          styles.listActive,
                          {
                            borderBottomWidth:
                              cateogoris.length == index + 1 ? 0 : 0.5,
                          },
                        ]}
                        onPress={() => console.log(item)}>
                        <Text
                          style={[
                            styles.textName,
                            // @ts-ignore
                            props?.valueCate?.id == item._id &&
                            styles.textNameActive,
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
});

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
    overflow: 'hidden'
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
    backgroundColor: '#0099FF',
  },
  textNameActive: {
    color: '#fff',
  },
  boxTextCate: {
    backgroundColor: 'red',
    width: '100%',
  },
  textCate: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600'
  }
});
