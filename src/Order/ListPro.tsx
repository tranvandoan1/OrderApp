import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Size} from '../size';
import {checkUserAsyncStorage} from '../checkUser';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {
  addSaveOrder,
  getAllSaveOrder,
  uploadSaveOrderFind,
} from './../Features/SaveOrderSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {FlatGrid} from 'react-native-super-grid';
import {getAllPro} from '../Features/ProductsSlice';
import ModalSelectCate from '../Modal/ModalSelectCate';

type Props = {
  id: any;
  navigation: () => void;
  loading: (e: any) => void;
};
const ListPro = (props: Props) => {
  const width = Size().width;
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const products = useAppSelect((data: any) => data.products.value);
  const saveorders = useAppSelect((data: any) => data.saveorders.value);
  useEffect(() => {
    dispatch(getAllSaveOrder());
    dispatch(getAllPro());
  }, []);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectModalCate, setSelectModalCate] = useState(false);

  const [productOrder, setProductOrder] = useState<any>([]); //lấy sản phẩm ko có kg
  const [valueWeight, setValueWeight] = useState<any>(); //lấy số lượng kg

  const apply = async () => {
    const newSaveOrder = saveorders.find(
      (item: any) =>
        item.id_pro == productOrder._id &&
        item.id_table == props.id.id_table &&
        item.weight == valueWeight,
    );
    if (newSaveOrder !== undefined) {
      const upSaveOrder = {
        amount: +newSaveOrder.amount + +1,
        weight: Number(valueWeight),
      };
      setValueWeight(undefined);
      setModalVisible(false);
      props.loading(true);
      await dispatch(
        uploadSaveOrderFind({id: newSaveOrder._id, data: upSaveOrder}),
      );
      props.loading(false);
    } else {
      const newOrder: any = {
        id_user: checkUserStorage.data._id,
        amount: 1,
        id_table: props.id.id_table,
        floor_id: props.id.floor_id,
        id_pro: productOrder._id,
        weight: Number(valueWeight),
        name: productOrder.name,
        photo: productOrder.photo,
        price: productOrder.price,
        dvt: productOrder.dvt,
      };
      setValueWeight(undefined);
      setModalVisible(false);
      props.loading(true);
      await dispatch(addSaveOrder(newOrder));
      props.loading(false);
    }
  };

  const selectProduct = async (pro: any) => {
    // lấy ra được sản phẩm vừa chọn
    // kiểm tra xem sp lựa chọn đã tồn lại ở bàn này hay chưa
    const newSaveOrder = saveorders.find(
      (item: any) =>
        item.id_pro == pro._id && item.id_table == props.id.id_table,
    );

    // th1 nếu mà sp order mà cần có kg
    if (pro.check == true) {
      // nếu sp là sp theo cân thì hiện input nhập cân nặng
      setModalVisible(true);
      setProductOrder(pro);
    } else {
      if (newSaveOrder == undefined) {
        const newOrder = {
          id_user: checkUserStorage.data._id,
          amount: 1,
          id_table: props.id.id_table,
          id_pro: pro._id,
          name: pro.name,
          photo: pro.photo,
          price: pro.price,
          floor_id: props.id.floor_id,
          dvt: pro.dvt,
        };
        props.loading(true);
        await dispatch(addSaveOrder(newOrder));
        props.loading(false);
      } else {
        const addSaveOrder = {
          amount: +newSaveOrder.amount + +1,
        };
        props.loading(true);
        await dispatch(
          uploadSaveOrderFind({id: newSaveOrder._id, data: addSaveOrder}),
        );
        props.loading(false);
      }
    }
  };
  const [valueCate, setValueCate] = useState<any>();

  return (
    <>
      <View style={{width: '100%', flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'blue',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => props.navigation()}>
              <AntDesign name="left" size={23} color={'#fff'} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 23,
                color: '#fff',
                marginLeft: 10,
                fontWeight: '500',
              }}>
              {props?.id?.name_floor}/
            </Text>
            <Text style={{fontSize: 19, color: '#fff', marginLeft: 10}}>
              {props?.id?.name_table}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{position: 'relative'}}>
              <TouchableOpacity onPress={() => setSelectModalCate(true)}>
                <TextInput
                  value={valueCate == undefined ? '' : valueCate.name}
                  style={styles.inputSelect}
                  placeholderTextColor="#fff"
                  editable={false}
                  selectTextOnFocus={false}
                  placeholder="Lọc theo danh mục"
                />
              </TouchableOpacity>
              <AntDesign
                name="down"
                size={18}
                color={'#fff'}
                style={{position: 'absolute', top: 10, right: 20}}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {valueCate !== undefined && (
                <TouchableOpacity
                  style={{
                    marginRight: 5,
                    backgroundColor: 'red',
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: 3,
                  }}
                  onPress={() => setValueCate(undefined)}>
                  <Text style={{color: '#fff', fontSize: 17}}>Xóa</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={{marginRight: 5}}>
                <Feather name="search" size={25} color={'#fff'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {products.length <= 0 ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={'blue'} />
          </View>
        ) : (
          <FlatGrid
            itemDimension={200}
            showsVerticalScrollIndicator={false}
            data={valueCate == undefined ? products : valueCate.pro}
            renderItem={({item, index}) => (
              <TouchableOpacity
                key={index}
                style={styles.listPro}
                onPress={() => selectProduct(item)}>
                <ImageBackground
                  source={{
                    uri: item.photo,
                  }}
                  resizeMode="cover"
                  style={styles.image}></ImageBackground>
                <View style={styles.listtt}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>
                    {item.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    đ
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <Modal transparent={true} visible={modalVisible} animationType="slide">
          <View style={styles.centeredView}>
            <Pressable
              onPress={() => (
                setModalVisible(!modalVisible), setValueWeight(undefined)
              )}
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
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={{flexDirection: 'column'}}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TextInput
                      style={[
                        String(valueWeight).length <= 0
                          ? styles.inputActive
                          : styles.input,
                        {fontSize: width < 720 ? 18 : 20},
                      ]}
                      autoCapitalize="words"
                      onChangeText={e => setValueWeight(e)}
                      defaultValue={valueWeight}
                      placeholder="Cân nặng"
                      keyboardType="number-pad"
                      placeholderTextColor={
                        String(valueWeight).length <= 0 ? 'red' : ''
                      }
                    />
                    <TouchableOpacity
                      onPress={() => apply()}
                      style={{
                        backgroundColor: 'blue',
                        paddingHorizontal: 10,
                        paddingVertical: 13,
                        marginLeft: 5,
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '500',
                          color: '#fff',
                          textAlign: 'center',
                        }}>
                        Thêm
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {String(valueWeight).length <= 0 && (
                    <Text style={styles.validate}>Chưa nhập cân nặng !</Text>
                  )}
                </View>
              </KeyboardAvoidingView>
            </View>
          </View>
        </Modal>

        <ModalSelectCate
          selectModalCate={selectModalCate}
          selectCate={(e: any) => (setSelectModalCate(false), setValueCate(e))}
        />
      </View>
    </>
  );
};

export default ListPro;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 18.5,
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'relative',
  },
  navigationContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  listPro: {
    height: 250,
    borderColor: '#FF6600',
    borderWidth: 0.8,
    elevation: 10,
    shadowColor: '#FF9966',
    borderRadius: 3,
    overflow: 'hidden',
  },
  listtt: {
    backgroundColor: '#fff',
    paddingVertical: 2,
    borderColor: '#FF9966',
    borderTopWidth: 0.5,
  },
  name: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
    textTransform: 'capitalize',
  },

  price: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: 'red',
    textTransform: 'capitalize',
  },
  input: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 2,
    width: '80%',
  },
  inputActive: {
    borderColor: 'red',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 5,
    width: '80%',
  },
  validate: {
    color: 'red',
    fontWeight: '400',
    marginBottom: 10,
  },
  inputSelect: {
    borderColor: '#fff',
    borderWidth: 0.5,
    paddingLeft: 10,
    paddingVertical: 3,
    marginRight: 10,
    borderRadius: 3,
    width: 260,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
