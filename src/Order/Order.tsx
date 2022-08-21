import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import ListPro from './ListPro';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {
  getAllSaveOrder,
  removeSaveOrder,
  uploadSaveOrder,
} from '../Features/SaveOrderSlice';
import {checkUserAsyncStorage} from '../checkUser';
import {Size} from '../size';
type Props = {
  route: any;
  navigation: any;
};
const Order = (props: Props) => {
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const saveorders = useAppSelect((data: any) => data.saveorders.value);
  const newOrder = saveorders?.filter(
    (item: any) =>
      item.floor_id == props.route.params.floor_id &&
      item.id_table == props.route.params.id_table,
  );
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    dispatch(getAllSaveOrder());
  }, []);

  // tính tổng tiền
  const prices = newOrder.map((item: any) => {
    if (item.weight) {
      return Math.ceil(+item.price * item.weight * +item.amount);
    } else {
      return Math.ceil(+item.price * +item.amount);
    }
  });
  let sum = 0;
  for (var i = 0; i < prices.length; i++) {
    sum += +prices[i];
  }

  const onSubmit = async (itemm: any) => {
    const findSaveOrder = saveorders.find(
      (item: any) => item._id == itemm.data._id,
    );
    const upSaveOrder = {
      amount:
        itemm.check == 'add'
          ? +findSaveOrder.amount + +1
          : +findSaveOrder.amount - +1,
      id_user: checkUserStorage.data._id,
      id_table: props.route.params.id_table,
      id_pro: itemm.data._id,
      name: itemm.data.name,
      photo: itemm.data.photo,
      price: itemm.data.price,
      floor_id: props.route.params.floor_id,
    };
    setLoading(true);
    await dispatch(uploadSaveOrder({id: itemm.data._id, data: upSaveOrder}));
    setLoading(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'row',
        position: 'relative',
      }}>
      {loading == true && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      )}
      <View style={{width: '65%'}}>
        <ListPro
          loading={(e: any) => setLoading(e)}
          id={props.route.params}
          navigation={() => props.navigation?.navigate('Home')}
        />
      </View>
      <View style={styles.right}>
        <Text style={styles.proOrder}>Sản phẩm đã chọn</Text>
        <View style={{padding: 5, height: 550}}>
          <SafeAreaView>
            <ScrollView>
              {saveorders.length <= 0 ? (
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 25,
                    }}>
                    Chưa có sản phẩm
                  </Text>
                </View>
              ) : (
                newOrder?.map((item: any, index: any) => {
                  return (
                    <View style={styles.listOrder}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.stt}>{index + 1}</Text>
                        <Text style={styles.proname} numberOfLines={1}>
                          {item.name}
                        </Text>
                      </View>
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              onSubmit({data: item, check: 'decrease'})
                            }>
                            <Entypo
                              name="circle-with-minus"
                              color={'#FF6633'}
                              size={30}
                            />
                          </TouchableOpacity>
                          <TextInput
                            value={`${item.amount}`}
                            style={styles.text}
                            keyboardType="numeric"
                          />
                          <TouchableOpacity
                            onPress={() =>
                              onSubmit({data: item, check: 'add'})
                            }>
                            <AntDesign
                              name="pluscircle"
                              color={'#FF6633'}
                              size={25}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
        <View
          style={{
            width: '100%',
            borderColor: 'black',
            borderTopWidth: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              paddingHorizontal: 5,
              justifyContent: 'space-between',
            }}>
            <TextInput
              value=""
              placeholder="Nhập mã giảm giá"
              style={{
                borderWidth: 1,
                borderColor: '#EEEEEE',
                fontSize: 15,
                flex: 1,
                paddingLeft: 5,
                paddingVertical: 0,
              }}
            />
            <TouchableOpacity>
              <Text style={styles.xn}>Áp dụng</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text
              style={{
                textAlign: 'right',
                fontSize: 25,
                fontWeight: '500',
                color: 'blue',
              }}>
              Tổng tiền :{' '}
              <Text style={{color: 'red'}}>
                {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
              </Text>
            </Text>
            <TouchableOpacity>
              <Text style={styles.tt}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  right: {
    width: '35%',
    backgroundColor: '#fff',
    borderColor: '#EEEEEE',
    borderLeftWidth: 1,
  },
  proOrder: {
    color: '#fff',
    backgroundColor: 'blue',
    paddingHorizontal: 5,
    paddingVertical: 15,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '500',
  },
  listOrder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    borderColor: 'tomato',
    borderBottomWidth: 1,
  },
  stt: {
    borderColor: 'tomato',
    borderWidth: 2,
    paddingVertical: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    borderRadius: 20,
    textAlign: 'center',
    backgroundColor: 'tomato',
    color: '#fff',
    fontWeight: '700',
    marginRight: 10,
  },
  proname: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    textTransform: 'capitalize',
    width: 250,
  },

  text: {
    borderColor: '#FFCC99',
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 17,
    marginHorizontal: 5,
    paddingVertical: 0,
    paddingHorizontal: 3,
    borderRadius: 100,
    color: 'black',
    fontWeight: '600',
  },
  tt: {
    width: '100%',
    paddingVertical: 10,
    textAlign: 'center',
    backgroundColor: 'tomato',
    fontSize: 25,
    fontWeight: '600',
    color: '#fff',
  },
  xn: {
    borderColor: '#EEEEEE',
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: '#fff',
    backgroundColor: 'blue',
    borderRadius: 3,
    fontWeight: '500',
    marginLeft: 5,
  },
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
  },
});
