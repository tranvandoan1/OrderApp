import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {getAllFloor} from '../Features/FloorSlice';
import {getAllTable} from '../Features/TableSlice';
import {checkUserAsyncStorage} from '../checkUser';
import {FlatGrid} from 'react-native-super-grid';
import {getAllSaveOrder} from '../Features/SaveOrderSlice';
import {Size} from '../size';
import CheckChangeTable from '../Modal/ModalCheckChangeTable/CheckChangeTable';
import Feather from 'react-native-vector-icons/Feather';
import {Avatar} from 'react-native-elements';
import ModalBookTable from './../Modal/ModalBookTable';
type Props = {
  route: any;
  navigation: any;
};
const Floor = ({navigation}: any, props: Props) => {
  const [dataFloors, setDataFloors] = useState<any>();
  const width = Size().width;
  console.log(width, 'eqwewqe');
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const floors = useAppSelect((data: any) => data.floors.value);
  const tables = useAppSelect((data: any) => data.tables.value);
  const saveorders = useAppSelect((data: any) => data.saveorders.value);
  const [bookTable, setBookTable] = useState<boolean>(false);
  const [select, setSelect] = useState<any>();
  const [checkSelect, setCheckSelect] = useState<any>();
  const saveorderCheckChangeTable = saveorders?.filter(
    (item: any) => item.id_table == select?._id,
  );
  useEffect(() => {
    dispatch(getAllFloor());
    dispatch(getAllTable());
    dispatch(getAllSaveOrder());
  }, []);

  const table1 = tables?.filter((item: any) => item.floor_id == floors[0]?._id);
  const table2 = tables?.filter(
    (item: any) => item.floor_id == dataFloors?._id,
  );
  let checkSaveOrder: any = [];
  tables?.map((element: any) => {
    let arrFilter = saveorders?.filter((e: any) => {
      return e.id_table === element._id;
    });
    checkSaveOrder.push({_id: element._id, data: arrFilter, sum: 0});
  });

  const order = (item: any) => {
    navigation?.navigate('orders', {
      table: item,
      floor: dataFloors == undefined ? floors[0] : dataFloors,
    });
  };

  const renderBookTable = (item: any) => {
    const prices = item.data.map((item: any) => {
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
    return sum;
  };
  return (
    <View style={{flex: 1, backgroundColor: '#EEEEEE'}}>
      {table1.length <= 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Avatar
                rounded
                source={{
                  uri: 'https://123design.org/wp-content/uploads/2020/07/LOGOLM0200-Chibi-%C4%90%E1%BB%87-nh%E1%BA%A5t-%C4%91%E1%BA%A7u-b%E1%BA%BFp-nh%C3%AD-Vua-%C4%91%E1%BA%A7u-b%E1%BA%BFp.jpg',
                }}
                size={60}
              />
              <Text
                style={[
                  styles.titlePro,
                  {fontSize: width < 720 ? 18 : 23, marginLeft: 10},
                ]}>
                BOM BOM
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 20,
                }}>
                <View
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 100,
                    backgroundColor: 'red',
                  }}></View>
                <Text style={{color: '#fff', fontSize: 18, marginLeft: 10}}>
                  Bàn đặt
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 20,
                }}>
                <View
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 100,
                    backgroundColor: '#00FF00',
                  }}></View>
                <Text style={{color: '#fff', fontSize: 18, marginLeft: 10}}>
                  Có khách
                </Text>
              </View>
              <TouchableOpacity
                style={styles.bookTable}
                onPress={() => setBookTable(true)}>
                <Text style={{color: '#fff', fontSize: 16}}>Đặt bàn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('manage')}
                style={{
                  borderWidth: 1.5,
                  borderColor: '#fff',
                  borderRadius: 100,
                  padding: 3,
                  marginRight: 5,
                }}>
                <Feather
                  name="user"
                  style={{
                    color: '#fff',
                    fontSize: 25,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            <View
              style={{
                width: '100%',
                borderColor: 'rgb(219,219,219)',
                borderLeftWidth: 1,
                paddingRight: 10,
                backgroundColor: '#fff',
              }}>
              <SafeAreaView>
                <ScrollView>
                  <FlatGrid
                    itemDimension={200}
                    data={dataFloors == undefined ? table1 : table2}
                    renderItem={({item, index}) => {
                      return (
                        <View style={styles.listTable}>
                          <TouchableOpacity
                            style={styles.table}
                            onPress={() => order(item)}
                            onLongPress={() => setSelect(item)}
                            key={item._id}>
                            <View
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                flexDirection: 'row',
                                // justifyContent:'space-around'
                              }}>
                              {item.timeBookTable !== 'null' && (
                                <View
                                  key={index}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 100,
                                    backgroundColor: 'red',
                                    marginRight: 5,
                                  }}></View>
                              )}
                              {checkSaveOrder?.map((check: any, index: any) => {
                                if (check._id == item._id) {
                                  if (check.data.length > 0) {
                                    return (
                                      <View
                                        key={index}
                                        style={{
                                          width: 20,
                                          height: 20,
                                          borderRadius: 100,
                                          backgroundColor: '#00FF00',
                                        }}></View>
                                    );
                                  }
                                }
                              })}
                            </View>

                            <View>{}</View>
                            <Image
                              source={{
                                uri: 'https://png.pngtree.com/png-clipart/20220613/original/pngtree-dining-table-chairs-set-illustration-png-image_7997183.png',
                              }}
                              style={{width: 100, height: 100}}
                            />
                            <Text
                              style={[
                                styles.nameTable,
                                {fontSize: width < 720 ? 20 : 23},
                              ]}>
                              {item.name}
                            </Text>
                            {item.amount > 0
                              ? checkSaveOrder?.map(
                                  (check: any, index: any) => {
                                    if (check._id == item._id) {
                                      if (check.data.length > 0) {
                                        return (
                                          <Text
                                            style={[
                                              {
                                                fontSize: width < 720 ? 18 : 16,
                                                color: '#00CC00',
                                                fontWeight: '500',
                                              },
                                            ]}>
                                            <Text style={{color: 'red'}}>
                                              {item.timeBookTable}{' '}
                                            </Text>
                                            {/* Tổng tiền  {sum} */}({' '}
                                            {sum
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                '.',
                                              )}
                                            đ )
                                          </Text>
                                        );
                                      } else {
                                        return (
                                          <Text
                                            style={[
                                              {
                                                fontSize: width < 720 ? 18 : 16,
                                                color: '#00CC00',
                                                fontWeight: '500',
                                              },
                                            ]}>
                                            <Text style={{color: 'red'}}>
                                              {item.timeBookTable}{' '}
                                            </Text>
                                            {/* Tổng tiền  {sum} */}({' '}
                                            {renderBookTable(check)
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                '.',
                                              )}
                                            đ )
                                          </Text>
                                        );
                                      }
                                    }
                                  },
                                )
                              : checkSaveOrder?.map(
                                  (check: any, index: any) => {
                                    if (check._id == item._id) {
                                      if (check.data.length > 0) {
                                        return (
                                          <Text
                                            style={[
                                              {
                                                fontSize: width < 720 ? 18 : 16,
                                                color: '#00CC00',
                                                fontWeight: '500',
                                              },
                                            ]}>
                                            {/* Tổng tiền  {sum} */}
                                            Tổng{' '}
                                            {renderBookTable(check)
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                '.',
                                              )}
                                            đ
                                          </Text>
                                        );
                                      } else {
                                        return (
                                          <Text
                                            style={[
                                              {
                                                fontSize: width < 720 ? 18 : 16,
                                                color: 'red',
                                                fontWeight: '500',
                                              },
                                            ]}>
                                            Trống
                                          </Text>
                                        );
                                      }
                                    }
                                  },
                                )}
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                  <FlatGrid
                    itemDimension={200}
                    data={dataFloors == undefined ? table1 : table2}
                    renderItem={({item, index}) => {
                      return (
                        <View style={styles.listTable}>
                          <TouchableOpacity
                            style={styles.table}
                            onPress={() => order(item)}
                            onLongPress={() => setSelect(item)}
                            key={item._id}>
                            <View
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                flexDirection: 'row',
                                // justifyContent:'space-around'
                              }}>
                              {item.timeBookTable !== 'null' && (
                                <View
                                  key={index}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 100,
                                    backgroundColor: 'red',
                                    marginRight: 5,
                                  }}></View>
                              )}
                              {checkSaveOrder?.map((check: any, index: any) => {
                                if (check._id == item._id) {
                                  if (check.data.length > 0) {
                                    return (
                                      <View
                                        key={index}
                                        style={{
                                          width: 20,
                                          height: 20,
                                          borderRadius: 100,
                                          backgroundColor: '#00FF00',
                                        }}></View>
                                    );
                                  }
                                }
                              })}
                            </View>

                            <View>{}</View>
                            <Image
                              source={{
                                uri: 'https://png.pngtree.com/png-clipart/20220613/original/pngtree-dining-table-chairs-set-illustration-png-image_7997183.png',
                              }}
                              style={{width: 100, height: 100}}
                            />
                            <Text
                              style={[
                                styles.nameTable,
                                {fontSize: width < 720 ? 20 : 23},
                              ]}>
                              {item.name}
                            </Text>
                            {item.amount > 0
                              ? checkSaveOrder?.map(
                                  (check: any, index: any) => {
                                    if (check._id == item._id) {
                                      if (check.data.length > 0) {
                                        return (
                                          <Text
                                            style={[
                                              {
                                                fontSize: width < 720 ? 18 : 16,
                                                color: '#00CC00',
                                                fontWeight: '500',
                                              },
                                            ]}>
                                            <Text style={{color: 'red'}}>
                                              {item.timeBookTable}{' '}
                                            </Text>
                                            {/* Tổng tiền  {sum} */}({' '}
                                            {sum
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                '.',
                                              )}
                                            đ )
                                          </Text>
                                        );
                                      } else {
                                        return (
                                          <Text
                                            style={[
                                              {
                                                fontSize: width < 720 ? 18 : 16,
                                                color: '#00CC00',
                                                fontWeight: '500',
                                              },
                                            ]}>
                                            <Text style={{color: 'red'}}>
                                              {item.timeBookTable}{' '}
                                            </Text>
                                            {/* Tổng tiền  {sum} */}({' '}
                                            {renderBookTable(check)
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                '.',
                                              )}
                                            đ )
                                          </Text>
                                        );
                                      }
                                    }
                                  },
                                )
                              : checkSaveOrder?.map(
                                  (check: any, index: any) => {
                                    if (check._id == item._id) {
                                      if (check.data.length > 0) {
                                        return (
                                          <Text
                                            style={[
                                              {
                                                fontSize: width < 720 ? 18 : 16,
                                                color: '#00CC00',
                                                fontWeight: '500',
                                              },
                                            ]}>
                                            {/* Tổng tiền  {sum} */}
                                            Tổng{' '}
                                            {renderBookTable(check)
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                '.',
                                              )}
                                            đ
                                          </Text>
                                        );
                                      } else {
                                        return (
                                          <Text
                                            style={[
                                              {
                                                fontSize: width < 720 ? 18 : 16,
                                                color: 'red',
                                                fontWeight: '500',
                                              },
                                            ]}>
                                            Trống
                                          </Text>
                                        );
                                      }
                                    }
                                  },
                                )}
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                  <FlatGrid
                    itemDimension={200}
                    data={dataFloors == undefined ? table1 : table2}
                    renderItem={({item, index}) => {
                      return (
                        <View style={styles.listTable}>
                          <TouchableOpacity
                            style={styles.table}
                            onPress={() => order(item)}
                            onLongPress={() => setSelect(item)}
                            key={item._id}>
                            <View
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                flexDirection: 'row',
                                // justifyContent:'space-around'
                              }}>
                              {item.timeBookTable !== 'null' && (
                                <View
                                  key={index}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 100,
                                    backgroundColor: 'red',
                                    marginRight: 5,
                                  }}></View>
                              )}
                              {checkSaveOrder?.map((check: any, index: any) => {
                                if (check._id == item._id) {
                                  if (check.data.length > 0) {
                                    return (
                                      <View
                                        key={index}
                                        style={{
                                          width: 20,
                                          height: 20,
                                          borderRadius: 100,
                                          backgroundColor: '#00FF00',
                                        }}></View>
                                    );
                                  }
                                }
                              })}
                            </View>

                            <View>{}</View>
                            <Image
                              source={{
                                uri: 'https://png.pngtree.com/png-clipart/20220613/original/pngtree-dining-table-chairs-set-illustration-png-image_7997183.png',
                              }}
                              style={{width: 100, height: 100}}
                            />
                            <Text
                              style={[
                                styles.nameTable,
                                {fontSize: width < 720 ? 20 : 23},
                              ]}>
                              {item.name}
                            </Text>
                            {item.amount > 0
                              ? checkSaveOrder?.map(
                                  (check: any, index: any) => {
                                    if (check._id == item._id) {
                                      if (check.data.length > 0) {
                                        return (
                                          <Text
                                            style={[
                                              {
                                                fontSize: width < 720 ? 18 : 16,
                                                color: '#00CC00',
                                                fontWeight: '500',
                                              },
                                            ]}>
                                            <Text style={{color: 'red'}}>
                                              {item.timeBookTable}{' '}
                                            </Text>
                                            {/* Tổng tiền  {sum} */}({' '}
                                            {sum
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                '.',
                                              )}
                                            đ )
                                          </Text>
                                        );
                                      } else {
                                        return (
                                          <Text
                                            style={[
                                              {
                                                fontSize: width < 720 ? 18 : 16,
                                                color: '#00CC00',
                                                fontWeight: '500',
                                              },
                                            ]}>
                                            <Text style={{color: 'red'}}>
                                              {item.timeBookTable}{' '}
                                            </Text>
                                            {/* Tổng tiền  {sum} */}({' '}
                                            {renderBookTable(check)
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                '.',
                                              )}
                                            đ )
                                          </Text>
                                        );
                                      }
                                    }
                                  },
                                )
                              : checkSaveOrder?.map(
                                  (check: any, index: any) => {
                                    if (check._id == item._id) {
                                      if (check.data.length > 0) {
                                        return (
                                          <Text
                                            style={[
                                              {
                                                fontSize: width < 720 ? 18 : 16,
                                                color: '#00CC00',
                                                fontWeight: '500',
                                              },
                                            ]}>
                                            {/* Tổng tiền  {sum} */}
                                            Tổng{' '}
                                            {renderBookTable(check)
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                '.',
                                              )}
                                            đ
                                          </Text>
                                        );
                                      } else {
                                        return (
                                          <Text
                                            style={[
                                              {
                                                fontSize: width < 720 ? 18 : 16,
                                                color: 'red',
                                                fontWeight: '500',
                                              },
                                            ]}>
                                            Trống
                                          </Text>
                                        );
                                      }
                                    }
                                  },
                                )}
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                </ScrollView>
              </SafeAreaView>
            </View>
          </View>
          <CheckChangeTable
            saveorderCheckChangeTable={saveorderCheckChangeTable}
            select={select}
            checkSelect={checkSelect}
            hiddeSelect={(e: any) => (
              setCheckSelect(undefined), setSelect(undefined)
            )}
            setCheckSelect={(e: any) => setCheckSelect(e)}
            hiddeCheckSelect={(e: any) => setCheckSelect(undefined)}
          />
        </View>
      )}
      <ModalBookTable
        bookTable={bookTable}
        hiddenBookTable={() => setBookTable(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 15,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'blue',
    paddingHorizontal: 10,
  },
  titlePro: {
    fontWeight: '500',
    color: '#fff',
  },
  iconBack: {
    color: '#fff',
    fontWeight: '600',
  },

  navigationContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    elevation: 4,
    shadowColor: 'tomato',
    borderColor: 'rgb(219,219,219)',
    borderRightWidth: 1,
  },
  inputSearch: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginTop: 5,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  floor: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    padding: 10,
    borderRadius: 3,
    marginBottom: 10,
    width: '100%',
  },
  centeredView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  listTable: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    shadowColor: 'tomato',
    overflow: 'hidden',
  },
  table: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingVertical: 10,
    flexDirection: 'column',
    borderRadius: 10,
    alignItems: 'center',
  },
  nameTable: {
    textTransform: 'capitalize',
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
  },
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  bookTable: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    marginRight: 20,
  },
});

export default Floor;
