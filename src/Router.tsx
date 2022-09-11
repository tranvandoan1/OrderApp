// In App.js in a new project
import {ActivityIndicator, LogBox, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/EvilIcons';

import Manage from './Manage/Manage';
import Signin from './Login/Signin';
import SignUp from './Login/SignUp';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ListProducts from './Manage/Products/ListProducts';
import {store} from './App/Store';
import {Provider} from 'react-redux';
import ListCate from './Manage/Categoris/ListCate';
import {Size} from './size';
import Floor from './Order/Floors';
import Order from './Order/Order';
import ListFloor from './Manage/Floors/ListFloor';
import {checkUserAsyncStorage} from './checkUser';
import ListTable from './Manage/Table/ListTable';
import ListBill from './Manage/Bill/ListBill';
import ListStatistical from './Manage/Statistical/ListStatistical';
import Account from './Manage/Account/Account';
const Tab = createBottomTabNavigator();
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
function Router() {
  const width = Size().width;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {height: 50, zIndex: 0},
      }}>
      <Tab.Screen
        name="Order"
        component={Floor}
        options={{
          headerShown: false,
          tabBarIcon: () => <View></View>,
          tabBarActiveBackgroundColor: 'blue',
          tabBarLabel: ({focused, color}) => (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
                height: '100%',
              }}>
              <Icon
                name="cart"
                size={width < 960 ? 24 : 30}
                style={{
                  color: focused ? '#fff' : 'black',
                  fontWeight: '600',
                }}
              />
              <Text
                style={{
                  fontSize: width < 960 ? 12 : 15,
                  fontWeight: '600',
                  color: focused ? '#fff' : 'black',
                }}>
                Gọi món
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="manage"
        component={Manage}
        options={{
          headerShown: false,
          tabBarIcon: () => <View></View>,
          tabBarActiveBackgroundColor: 'blue',
          tabBarLabel: ({focused, color}) => (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
              }}>
              <Icons
                name="user"
                size={width < 960 ? 24 : 25}
                style={{
                  color: focused ? '#fff' : '#003399',
                  fontWeight: '600',
                }}
              />
              <Text
                style={{
                  fontSize: width < 960 ? 12 : 15,
                  color: focused ? '#fff' : '#003399',
                  fontWeight: '600',
                }}>
                Quản lý
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const Stack = createNativeStackNavigator();
function App() {
  const X = checkUserAsyncStorage();
  const checkUserStorage = Object.values(X)[2];

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          {checkUserStorage?.data == undefined && (
            <Stack.Screen
              name="signin"
              component={Signin}
              options={{headerShown: false}}
            />
          )}
          {checkUserStorage?.data == undefined && (
            <Stack.Screen
              name="signup"
              component={SignUp}
              options={{headerShown: false}}
            />
          )}
          <Stack.Screen
            name="home"
            component={Floor}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="orders"
            component={Order}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="products"
            component={ListProducts}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="categoris"
            component={ListCate}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="floor"
            component={ListFloor}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="table"
            component={ListTable}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="bill"
            component={ListBill}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="statistical"
            component={ListStatistical}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="account"
            component={Account}
            options={{headerShown: false}}
          />
              <Stack.Screen
            name="manage"
            component={Manage}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
const styles = StyleSheet.create({
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});
export default App;
