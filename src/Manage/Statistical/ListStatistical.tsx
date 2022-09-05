import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Size} from '../../size';
// import VerticalBarGraph from '@chartiful/react-native-vertical-bar-graph';
// import { ECharts } from 'react-native-echarts-wrapper';
const ListStatistical = ({navigation}: any) => {
  const width = Size()?.width;
  const [checkSearch, setCheckSearch] = useState<any>(false);
  const data = [{value: 50}, {value: 80}, {value: 90}, {value: 70}];
  return (
    <View style={{flex: 1, width: '100%'}}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('manage')}>
            <AntDesign name="left" style={styles.iconBack} />
          </TouchableOpacity>
          <Text
            style={[
              styles.titlePro,
              {
                fontSize: width < 720 ? 20 : 23,
              },
            ]}>
            Thống kê
          </Text>
        </View>
      </View>
      <View style={{backgroundColor: '#fff', flex: 1}}>
        <SafeAreaView>
          <ScrollView>
            <View style={styles.chart}>
              {/* <VerticalBarGraph
                data={[50000]}
                labels={['Hôm nay']}
                width={200}
                height={600}
                barRadius={5}
                barWidthPercentage={0.65}
                barColor="#53ae31"
                baseConfig={{
                  hasXAxisBackgroundLines: false,
                  xAxisLabelStyle: {
                    prefix: 'đ',
                    position: 'left',
                  },
                  yAxisLabelStyle: {
                    position: '',
                  },
                }}
                style={{
                  paddingTop: 20,
                  borderRadius: 20,
                  
                }}
              /> */}
              <Text>đâsd</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>

      {checkSearch == true && (
        <TextInput style={styles.inputSearch} placeholder="Tìm kiếm sản phẩm" />
      )}
    </View>
  );
};

export default ListStatistical;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 15,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'tomato',
  },
  titlePro: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    fontFamily: Platform.OS == 'android' ? 'Roboto-Light' : 'Roboto-Bold',
    fontStyle: 'normal',
  },
  iconBack: {
    fontSize: 20,
    color: '#fff',
    marginRight: 10,
    fontWeight: '600',
  },
  iconRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputSearch: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginTop: 5,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  chart:{
    // transform: [{ rotate: "90deg" }],
    // marginTop:100
    flexDirection:'row',
    backgroundColor: `#dff4d7`,

  }
});
