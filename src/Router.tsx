// In App.js in a new project
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
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
const Tab = createBottomTabNavigator();

function Router() {
  const width = Size().width;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarStyle: {height: 60},
      }}>
      <Tab.Screen
        name="Order"
        component={Floor}
        options={{
          headerShown: false,
          tabBarIcon: () => <View></View>,
          tabBarActiveBackgroundColor: 'tomato',
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
                size={width < 720 ? 26 : 40}
                style={{
                  color: focused ? '#fff' : 'tomato',
                  fontWeight: '600',
                }}
              />
              <Text
                style={{
                  fontSize: width < 720 ? 12 : 18,
                  fontWeight: '600',
                  color: focused ? '#fff' : 'tomato',
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
          tabBarActiveBackgroundColor: 'tomato',
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
                size={width < 720 ? 26 : 30}
                style={{
                  color: focused ? '#fff' : 'tomato',
                  fontWeight: '600',
                }}
              />
              <Text
                style={{
                  fontSize: width < 720 ? 12 : 18,
                  color: focused ? '#fff' : 'tomato',
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
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Signin"
              component={Signin}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signup"
              component={SignUp}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={Router}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="orders"
              component={Order}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="list-product"
              component={ListProducts}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="categoris"
              component={ListCate}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
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
