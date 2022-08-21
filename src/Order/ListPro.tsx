import {
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Size} from '../size';
import {checkUserAsyncStorage} from '../checkUser';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {getAll} from './../Features/FloorSlice';
import {getAllTable} from '../Features/TableSlice';
import {
  addSaveOrder,
  getAllSaveOrder,
  uploadSaveOrder,
} from './../Features/SaveOrderSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FlatGrid} from 'react-native-super-grid';
import {getAllPro} from '../Features/ProductsSlice';

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
  const floors = useAppSelect((data: any) => data.floors.value);
  const tables = useAppSelect((data: any) => data.tables.value);
  const products = useAppSelect((data: any) => data.products.value);
  const saveorders = useAppSelect((data: any) => data.saveorders.value);
  useEffect(() => {
    dispatch(getAll());
    dispatch(getAllTable());
    dispatch(getAllSaveOrder());
    dispatch(getAllPro());
  }, []);
  const [modalVisible, setModalVisible] = useState(false);

  const [productOrder, setProductOrder] = useState<any>([]); //lấy sản phẩm ko có kg
  const [productOrderWeight, setProductOrderWeight] = useState<any>([]); //lấy sản phẩm có kg
  const [valueWeight, setValueWeight] = useState<any>(); //lấy số lượng kg
  const [proSelect, setProSelect] = useState<any>([]);
  const [selectWeight, setSelectWeight] = useState<boolean>(false);
  const weightCancel = () => {
    setSelectWeight(false);
  };
  const apply = () => {
    if (Number(productOrderWeight.weight) == Number(valueWeight)) {
      const newOrder = {
        ...productOrderWeight,
        id_user: checkUserStorage.data._id,
        amount: productOrderWeight.amount + 1,
        id_table: props.id.id_table,
        floor_id: props.id.floor_id,
        weight: Number(valueWeight),
      };
      setValueWeight(undefined);
      setSelectWeight(false);
      dispatch(uploadSaveOrder(newOrder));
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
      };
      setValueWeight(undefined);
      setSelectWeight(false);
      dispatch(addSaveOrder(newOrder));
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
      if (newSaveOrder == undefined) {
        // nếu sp là sp theo cân thì hiện input nhập cân nặng
        setSelectWeight(true);
        setProductOrder(pro);
      } else {
        setSelectWeight(true);
        setProductOrderWeight(newSaveOrder);
      }
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
        };
        props.loading(true);
        await dispatch(addSaveOrder(newOrder));
        props.loading(false);
      } else {
        const upSaveOrder = {
          amount: +newSaveOrder.amount + +1,
        };
        dispatch(uploadSaveOrder(upSaveOrder));
      }
    }
  };

  return (
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
            {floors?.map(
              (item: any) => item._id == props.id.floor_id && item.name,
            )}
            /
          </Text>
          <Text style={{fontSize: 19, color: '#fff', marginLeft: 10}}>
            {tables?.map(
              (item: any) => item._id == props.id.id_table && item.name,
            )}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{marginRight: 5}}>
          <AntDesign name="bars" size={35} color={'#fff'} />
        </TouchableOpacity>
      </View>
      <FlatGrid
        itemDimension={200}
        showsVerticalScrollIndicator={false}
        data={products}
        renderItem={({item}) => (
          <TouchableOpacity
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
                {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback
            onPress={() => setModalVisible(!modalVisible)}>
            <View style={{flex: 1, width: width < 720 ? '50%' : '70%'}}></View>
          </TouchableWithoutFeedback>

          <View
            style={[
              styles.navigationContainer,
              {width: width < 720 ? '50%' : '30%'},
            ]}>
            <Text>đasda</Text>
          </View>
        </View>
      </Modal>
    </View>
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
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  navigationContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  listPro: {
    height: 270,
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
    fontSize: 20,
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
});
