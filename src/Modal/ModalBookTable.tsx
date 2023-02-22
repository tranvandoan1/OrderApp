import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../App/Store';
import { editBookTable, getAllTable } from '../Features/TableSlice';
import { Controller, useForm } from 'react-hook-form';
import { validatePhone } from '../Component/Validate';
type Props = {
  bookTable: any;
  hiddenBookTable: () => void;
  loading: (e: boolean) => void;
  textLanguage: any;
  width: any;
};
const ModalBookTable: React.FC<Props> = ({
  textLanguage,
  loading,
  hiddenBookTable,
  bookTable,
  width,
}) => {
  const [showTable, setShowTable] = useState<boolean>(false);
  const [loadingBooking, setLoadingBooking] = useState<boolean>(false);
  const [selectTable, setSelectTable] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const tables = useAppSelect((data: any) => data.tables.value);
  useEffect(() => {
    dispatch(getAllTable());
  }, []);

  // lấy những bàn trống
  const tableFilter: any = tables?.filter(
    (item: any) =>
      item.timeBookTable == 'null' &&
      (item?.orders?.length <= 0 || item?.orders == null),
  );


  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      phone: '',
      amount: '',
      timeBookTable: '',
      nameUser: '',
    },
  });

  const booxTable = async (values: any) => {
    if (validatePhone(values.phone) == false) {
      Alert.alert('Số điện thoại chưa đúng !');
    } else if (Number.isFinite(Number(values.amount)) == false) {
      Alert.alert('Số lượng phải là số !');
    } else if (isNaN(values.nameUser) == false) {
      Alert.alert('Tên khách phải là chữ !');
    } else if (selectTable?._id == undefined) {
      Alert.alert('Chưa chọn bàn !');
    } else {
      loading(true);
      hiddenBookTable();
      await dispatch(
        // @ts-ignore
        editBookTable({
          id: selectTable?._id,
          nameUser: values.nameUser,
          timeBookTable: values.timeBookTable,
          amount: values.amount,
          phone: values.phone,
        }),
      );

      reset({
        phone: '',
        amount: '',
        timeBookTable: '',
        nameUser: '',
      });
      Keyboard.dismiss();
      loading(false);

    }
  };
  const close = () => {
    setLoadingBooking(true);
    reset({
      phone: '',
      amount: '',
      timeBookTable: '',
      nameUser: '',
    });
    hiddenBookTable();
    setLoadingBooking(false);
  };
  return (
    <Modal transparent={true} visible={bookTable} animationType="slide">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => (
            setLoadingBooking(false),
            setSelectTable({ floor_id: null, table_id: null }),
            hiddenBookTable()
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            width: '80%',
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 4,
            shadowColor: 'red',
            shadowOffset: { width: 10, height: 14 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 23,
              textAlign: 'center',
              fontWeight: '500',
              borderColor: 'rgb(219,219,219)',
              borderBottomWidth: 1,
              paddingVertical: 10,
              marginBottom: 10,
            }}>
            {textLanguage?.table_booking_information}
          </Text>
          <View style={styles.name}>
            <Controller
              rules={{
                required: true,
              }}
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      width: '100%',
                      borderColor: errors.nameUser ? 'red' : '#0099FF',
                    },
                  ]}
                  placeholder={`${textLanguage?.name}`}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="nameUser"
            />
            {errors.nameUser && (
              <Text style={{ color: 'red' }}>
                {textLanguage?.name_not_entered_yet} !
              </Text>
            )}
          </View>
          <View style={[styles.name]}>
            <Controller
              rules={{
                required: true,
              }}
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      width: '100%',
                      borderColor: errors.phone ? 'red' : '#0099FF',
                    },
                  ]}
                  placeholder={`${textLanguage?.phone}`}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="number-pad"
                />
              )}
              name="phone"
            />
            {errors.phone && (
              <Text style={{ color: 'red' }}>
                {textLanguage?.phone_not_entered} !
              </Text>
            )}
          </View>
          <View style={styles.name}>
            <Controller
              rules={{
                required: true,
              }}
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      width: '100%',
                      borderColor: errors.timeBookTable ? 'red' : '#0099FF',
                    },
                  ]}
                  placeholder={`${textLanguage?.time}`}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="number-pad"
                  value={value}
                />
              )}
              name="timeBookTable"
            />

            {errors.timeBookTable && (
              <Text style={{ color: 'red' }}>
                {textLanguage?.time_not_entered} !
              </Text>
            )}
          </View>

          <View style={[styles.name, { marginBottom: 10 }]}>
            <Controller
              rules={{
                required: true,
              }}
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      width: '100%',
                      borderColor: errors.amount ? 'red' : '#0099FF',
                    },
                  ]}
                  placeholder={`${textLanguage?.number_clients}`}
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="amount"
            />
            {errors.amount && (
              <Text style={{ color: 'red' }}>
                {textLanguage?.client_not_entered} !
              </Text>
            )}
          </View>

          <Text
            style={{
              color: 'black',
              fontSize: 19,
              marginTop: 20,
              fontWeight: '500',
            }}>
            {textLanguage?.select_you_want_book}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              position: 'relative',
              zIndex: 11
            }}>
            <View style={{ width: '100%', position: 'relative' }}>
              <TouchableOpacity
                style={styles.floorTable}
                onPress={() => {
                  setShowTable(!showTable);
                  Keyboard.dismiss();
                }}>
                <TextInput
                  selectTextOnFocus={false}
                  editable={false}
                  value={selectTable == undefined ? '' : selectTable?.name}
                  style={[
                    styles.input,
                    { textAlign: 'center', fontSize: 19, borderColor: '#0099FF' },
                  ]}
                  placeholder={`${textLanguage?.select}`}
                />
              </TouchableOpacity>
            </View>
            {showTable == true && (
              <View
                style={[
                  {
                    position: 'absolute',
                    top: 55,
                    height: 200,
                    width: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    overflow: 'visible',
                    borderColor: '#AAAAAA',
                    borderWidth: 1,
                    zIndex: 100
                  },
                ]}>
                <SafeAreaView>
                  {/* <FlatList
                    data={tableFilter}
                    renderItem={renderTable}
                    keyExtractor={item => item}
                  /> */}
                  <ScrollView>
                    {
                      tableFilter?.map((item: any) => (
                        <TouchableOpacity
                          style={{ marginTop: 10 }}
                          onPress={() => (setSelectTable(item), setShowTable(false))}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 18,
                              textAlign: 'center',
                            }}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    }
                  </ScrollView>
                </SafeAreaView>
              </View>
            )}
          </View>

          <View style={{ marginTop: 20, zIndex: 1 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#0099FF', padding: 10, borderRadius: 5 }}
              onPress={handleSubmit(booxTable)}>
              {loadingBooking == true ? (
                <ActivityIndicator size={25} color={'#fff'} />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 19,
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                  {textLanguage?.book_table}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
              }}
              onPress={() => close()}>
              {loadingBooking == true ? (
                <ActivityIndicator size={25} color={'#fff'} />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 19,
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                  {textLanguage?.cancel}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ModalBookTable;

const styles = StyleSheet.create({
  checkChange: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 10,
  },
  input: {
    color: 'black',
    padding: 5,
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1.5,
    width: '100%',
    marginVertical: 5,
    shadowColor: 'red',
    shadowOffset: { width: 10, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    fontWeight: '500',
    height: 50,
  },
  floorTable: {
    // borderWidth: 1,
    // borderColor: 'rgb(219,219,219)',
    width: '100%',
    color: 'black',
    borderRadius: 3,
    textAlign: 'center',
  },
  selectFloor: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  name: {
    flexDirection: 'column',
  },
});
