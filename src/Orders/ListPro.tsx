import {
  ActivityIndicator,
  Alert,
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
import React, { useEffect, useState } from 'react';
import { Size, SizeScale } from '../Component/size';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../App/Store';
import { FlatGrid } from 'react-native-super-grid';
import { getProductAll } from '../Features/ProductsSlice';
import ModalSelectCate from '../Modal/ModalSelectCate';
import { getAllTable } from '../Features/TableSlice';

type Props = {
  params: any;
  hiddeViewCate: (e: any) => void;
  order: (e: any) => void;
  timeStartOrder: (e: any) => void;
  selectModalCate: any;
  valueCate: any;
  data: any;
};
const ListPro = (props: Props) => {
  const width = Size().width;
  const widthScale = SizeScale();

  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const products = useAppSelect((data: any) => data.products.value);

  useEffect(() => {
    dispatch(getProductAll());
    dispatch(getAllTable());
  }, []);
  const [modalVisible, setModalVisible] = useState(false);

  const [productOrder, setProductOrder] = useState<any>([]); //lấy sản phẩm ko có kg
  const [valueWeight, setValueWeight] = useState<any>(); //lấy số lượng kg
  const apply = async () => {
    const time = new Date();
    const timeStart = `${String(time.getHours()).length == 1
      ? `0${time.getHours()}`
      : time.getHours()
      }:${String(time.getMinutes()).length == 1
        ? `0${time.getMinutes()}`
        : time.getMinutes()
      }`;
    const newSaveOrder = props?.data?.find(
      (item: any) =>
        item.id_pro == productOrder._id && item.weight == valueWeight,
    );

    if (isNaN(valueWeight) == true) {
      Alert.alert('Cân nặng phải là số !');
    } else {
      setValueWeight(undefined);
      setModalVisible(false);
      if (newSaveOrder !== undefined) {
        const newData: any = [];
        props?.data?.map((itemOrder: any) => {
          if (itemOrder.id == newSaveOrder.id) {
            newData.push({
              ...itemOrder,
              amount: +newSaveOrder.amount + +1,
              weight: Number(valueWeight),
            });
          } else {
            newData.push(itemOrder);
          }
        });
        props?.order(newData);
        props?.data.length <= 0 && props?.timeStartOrder(timeStart);
      } else {
        const newOrder = {
          amount: 1,
          id_pro: productOrder._id,
          weight: Number(valueWeight),
          name: productOrder.name,
          photo: productOrder.photo,
          price: productOrder.price,
          dvt: productOrder.dvt,
          id: Math.random().toString(36).substring(0, 20),
        };
        props?.order([...props?.data, newOrder]);
        props?.data.length <= 0 && props?.timeStartOrder(timeStart);
      }
    }
  };

  const selectProduct = async (pro: any) => {
    const time = new Date();
    const timeStart = `${String(time.getHours()).length == 1
      ? `0${time.getHours()}`
      : time.getHours()
      }:${String(time.getMinutes()).length == 1
        ? `0${time.getMinutes()}`
        : time.getMinutes()
      }`
    // lấy ra được sản phẩm vừa chọn
    // kiểm tra xem sp lựa chọn đã tồn lại ở bàn này hay chưa
    const newSaveOrder = props?.data?.find(
      (item: any) => item.id_pro == pro._id,
    );
    // th1 nếu mà sp order mà cần có kg
    if (pro.check == true) {
      // nếu sp là sp theo cân thì hiện input nhập cân nặng
      setModalVisible(true);
      setProductOrder(pro);
    } else {
      if (newSaveOrder == undefined) {
        const newOrder: any = {
          amount: 1,
          id_pro: pro._id,
          name: pro.name,
          photo: pro.photo,
          price: pro.price,
          dvt: pro.dvt,
          weight: 0,
          id: Math.random().toString(36).substring(0, 20),
        };
        props?.order([...props?.data, newOrder])
        props?.data.length <= 0 && props?.timeStartOrder(timeStart)
      } else {
        const newData: any = [];
        props?.data?.map((itemOrder: any) => {
          if (itemOrder.id == newSaveOrder.id) {
            newData.push({
              ...itemOrder,
              amount: +newSaveOrder.amount + +1,
            });
          } else {
            newData.push(itemOrder);
          }
        });
        props?.order(newData)
        props?.data.length <= 0 && props?.timeStartOrder(timeStart)

      }
    }
  };

  return (
    <>
      <View style={{ width: '100%', flex: 1 }}>
        {products.length <= 0 ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={'blue'} />
          </View>
        ) : (
          <View style={{ flex: 1, marginBottom: width < 960 ? 80 : 0 }}>
            <FlatGrid
              itemDimension={width < 960 ? (width < 539 ? 150 : 220) : 190}
              // @ts-ignore
              showsVerticalScrollIndicator={false}
              data={
                props?.valueCate == undefined ||
                  String(props?.valueCate).length <= 0
                  ? products
                  : props?.valueCate.pro
              }
              renderItem={({ item, index }: any) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.listPro,
                    { height: widthScale?.height * 350 },
                  ]}
                  onPress={() => selectProduct(item)}>
                  <ImageBackground
                    source={{
                      uri: item.photo,
                    }}
                    resizeMode="cover"
                    style={styles.image}></ImageBackground>
                  <View style={styles.listtt}>
                    <Text
                      style={[
                        styles.name,
                        { fontSize: widthScale?.width * 25 },
                      ]}>
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.price,
                        { fontSize: widthScale?.width * 27 },
                      ]}>
                      {item.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                      đ
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
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
                { width: width < 720 ? '100%' : '50%' },
              ]}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={{ flexDirection: 'column' }}>
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
                        { fontSize: width < 720 ? 18 : 20 },
                      ]}
                      autoCapitalize="words"
                      // @ts-ignore
                      onChangeText={(e: number) => {
                        setValueWeight(e)

                      }
                      }
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

        {props?.selectModalCate == true && (
          <ModalSelectCate
            selectModalCate={props?.selectModalCate}
            selectCate={(e: any) => props?.hiddeViewCate(e)}
            valueCate={props?.valueCate}
          />
        )}
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
    fontWeight: '500',
    color: 'black',
    textTransform: 'capitalize',
  },

  price: {
    textAlign: 'center',
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
