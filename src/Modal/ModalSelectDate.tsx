import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Size} from '../size';
import moment from 'moment';
type Props = {
  selectDate: any;
  hiddenSelectDate: (e: any) => void;
};
const ModalSelectDate = (props: Props) => {
  const width = Size().width;
  const [valueDate, setValueDate] = useState<any>();
  const [valueMonth, setValueMonth] = useState<any>();
  const [valueYear, setValueYear] = useState<string>();
  const [listMonthModal, setListMonthModal] = useState<boolean>(false);
  const [listDateModal, setListDateModal] = useState<boolean>(false);
  const apply = () => {
    const date = {
      date:
        valueDate == undefined || String(valueDate).length <= 0
          ? String(moment().date()).length == 1
            ? `0${moment().date()}`
            : moment().date()
          : String(valueDate).length == 1
          ? `0${valueDate}`
          : valueDate,
      month:
        valueMonth == undefined || String(valueMonth).length <= 0
          ? String(moment().month() + 1).length == 1
            ? `0${moment().month() + 1}`
            : moment().month() + 1
          : String(valueMonth).length == 1
          ? `0${valueMonth}`
          : valueMonth,
      year:
        valueYear == undefined || String(valueYear).length <= 0
          ? moment().year()
          : valueYear,
    };
    props.hiddenSelectDate(date);
  };
  const monthFor = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const date = Array.from(
    {
      length: moment(
        `${valueYear == undefined ? `${moment().year()}` : valueYear}-${
          valueMonth == undefined
            ? `${
                String(moment().month() + 1).length == 1
                  ? `0${moment().month() + 1}`
                  : moment().month() + 1
              }`
            : `${
                String(valueMonth).length == 1 ? `0${valueMonth}` : valueMonth
              }`
        }`,
      ).daysInMonth(),
    },
    (v, k) => k + 1,
  );

  return (
    <Modal transparent={true} visible={props.selectDate} animationType="slide">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => props.hiddenSelectDate('')}
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
            {width: width < 720 ? '100%' : '50%'},
          ]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'black',
                  marginVertical: 10,
                  fontSize: 20,
                  fontWeight: '600',
                }}>
                Chọn ngày
              </Text>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    width: '100%',
                  }}>
                  <TextInput
                    style={[
                      String(valueYear).length <= 0
                        ? styles.inputActive
                        : styles.input,
                      {fontSize: width < 720 ? 18 : 16, marginLeft: 10},
                    ]}
                    autoCapitalize="words"
                    onChangeText={e => setValueYear(e)}
                    defaultValue={
                      valueYear == undefined ? `${moment().year()}` : valueYear
                    }
                    placeholder="Năm"
                    keyboardType="number-pad"
                    placeholderTextColor={
                      String(valueYear).length <= 0 ? 'red' : ''
                    }
                  />
                  <Text style={{fontWeight: '600'}}>/</Text>

                  <TouchableOpacity onPress={() => setListMonthModal(true)}>
                    <TextInput
                      style={[
                        String(valueMonth).length <= 0
                          ? styles.inputActive
                          : styles.input,
                        {fontSize: width < 720 ? 18 : 16, marginHorizontal: 10},
                      ]}
                      autoCapitalize="words"
                      onChangeText={e => setValueMonth(e)}
                      defaultValue={
                        valueMonth == undefined
                          ? `${
                              String(moment().month() + 1).length == 1
                                ? `0${moment().month() + 1}`
                                : moment().month() + 1
                            }`
                          : `${
                              String(valueMonth).length == 1
                                ? `0${valueMonth}`
                                : valueMonth
                            }`
                      }
                      placeholder="Tháng"
                      keyboardType="number-pad"
                      placeholderTextColor={
                        String(valueMonth).length <= 0 ? 'red' : ''
                      }
                      selectTextOnFocus={false}
                      editable={false}
                    />
                  </TouchableOpacity>
                  <Text style={{fontWeight: '600'}}>/</Text>
                  <TouchableOpacity onPress={() => setListDateModal(true)}>
                    <TextInput
                      style={[
                        String(valueDate).length <= 0
                          ? styles.inputActive
                          : styles.input,
                        {fontSize: width < 720 ? 18 : 16, marginRight: 10},
                      ]}
                      autoCapitalize="words"
                      onChangeText={e => setValueDate(e)}
                      defaultValue={
                        valueDate == undefined
                          ? `${
                              String(moment().date()).length == 1
                                ? `0${moment().date()}`
                                : moment().date()
                            }`
                          : `${
                              String(valueDate).length == 1
                                ? `0${valueDate}`
                                : valueDate
                            }`
                      }
                      placeholder="Ngày"
                      keyboardType="number-pad"
                      placeholderTextColor={
                        String(valueDate).length <= 0 ? 'red' : ''
                      }
                      selectTextOnFocus={false}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => apply()}
                  style={{
                    backgroundColor: 'blue',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginLeft: 5,
                    marginTop: 20,
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '500',
                      color: '#fff',
                      textAlign: 'center',
                    }}>
                    Chọn
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
      {/* CHọn tháng */}
      {listMonthModal == true && (
        <View style={styles.listMonth}>
          <Pressable
            onPress={() => setListMonthModal(false)}
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
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#fff',
              width: 80,
              height: 300,
              borderRadius: 3,
              overflow: 'hidden',
            }}>
            <SafeAreaView>
              <ScrollView showsVerticalScrollIndicator={false}>
                {monthFor?.map((item: any) => {
                  return (
                    <TouchableOpacity
                      onPress={() => (
                        setValueMonth(item), setListMonthModal(false)
                      )}
                      style={{
                        padding: 10,
                        backgroundColor:
                          valueMonth == undefined
                            ? item == moment().month() + 1
                              ? 'blue'
                              : '#fff'
                            : item == valueMonth
                            ? 'blue'
                            : '#fff',
                        width: 80,
                      }}>
                      <Text
                        style={{
                          color:
                            valueMonth == undefined
                              ? item == moment().month() + 1
                                ? '#fff'
                                : 'black'
                              : item == valueMonth
                              ? '#fff'
                              : 'black',
                          fontSize: 20,
                          textAlign: 'center',
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      )}
      {/* CHọn ngày */}
      {listDateModal == true && (
        <View style={styles.listMonth}>
          <Pressable
            onPress={() => setListDateModal(false)}
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
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#fff',
              width: 80,
              height: 300,
              borderRadius: 3,
              overflow: 'hidden',
            }}>
            <SafeAreaView>
              <ScrollView showsVerticalScrollIndicator={false}>
                {date?.map((item: any) => {
                  return (
                    <TouchableOpacity
                      onPress={() => (
                        setValueDate(item), setListDateModal(false)
                      )}
                      style={{
                        padding: 10,
                        backgroundColor:
                          valueDate == undefined
                            ? item == moment().date()
                              ? 'blue'
                              : '#fff'
                            : item == valueDate
                            ? 'blue'
                            : '#fff',
                        width: 80,
                      }}>
                      <Text
                        style={{
                          color:
                            valueDate == undefined
                              ? item == moment().date()
                                ? '#fff'
                                : 'black'
                              : item == valueDate
                              ? '#fff'
                              : 'black',
                          fontSize: 20,
                          textAlign: 'center',
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default ModalSelectDate;

const styles = StyleSheet.create({
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

  input: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 2,
    textAlign: 'center',
    padding: 5,
    color: 'black',
  },
  inputActive: {
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
    padding: 5,
  },
  listMonth: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
