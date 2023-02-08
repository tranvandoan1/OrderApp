import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Loading = () => {
  return (
    <View style={{flex:1}}>
      <ImageBackground
        source={{
          uri: 'https://i.pinimg.com/originals/ca/89/fb/ca89fbce5e5c68f46d5330946c58ddc6.gif',
        }}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
