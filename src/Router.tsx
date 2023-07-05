// In App.js in a new project
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/EvilIcons';

import Manage from './Manage/Manage';
import Signin from './Login/Signin';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './App/Store';
import { Provider } from 'react-redux';
import { Size } from './Component/size';
import ListBill from './Manage/Bill/ListBill';
import Account from './Manage/Account/Account';
import Loading from './Component/Loading';
import Home from './Home/Home';
import Order from './Orders/Order';
const Tab = createBottomTabNavigator();
function Router() {
  const width = Size().width;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: 50, zIndex: 0 },
      }}>
      <Tab.Screen
        name="Order"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: () => <View></View>,
          tabBarActiveBackgroundColor: 'blue',
          tabBarLabel: ({ focused, color }) => (
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
          tabBarLabel: ({ focused, color }) => (
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
  return (
    <Provider store={store}>
      <StatusBar animated={true} hidden={true} translucent={true} />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="loading"
            component={Loading}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signin"
            component={Signin}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="orders"
            component={Order}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="bill"
            // @ts-ignore
            component={ListBill}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="account"
            // @ts-ignore
            component={Account}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="manage"
            component={Manage}
            options={{ headerShown: false }}
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
