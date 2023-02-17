import { StyleSheet, Text, View, TouchableOpacity, Modal, StatusBar, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Size } from './../size';
type Props = {
  titile?: any;
  content?: any;
  btnAccept?: () => void;
  btnCancel?: () => void;
  textBtnCancel?: any;
  textBtnAccept?: any;
  modalVisible: boolean;
};
const ModalConfim: React.FC<Props> = ({
  titile,
  content,
  btnCancel,
  btnAccept,
  textBtnAccept,
  modalVisible,
  textBtnCancel,
}) => {
  const width = Size().width;
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => btnCancel()}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
      <StatusBar translucent hidden={true} />

          </Pressable>

        <View style={[styles.modalView, { width: width < 960 ? (width < 593 ? 400 : 450) : 330 }]}>
          <View>
            <Text style={styles.title}>{titile}</Text>
            <Text style={styles.content}>{content}</Text>
            <View style={styles.hr}></View>
            <View style={styles.button}>
              {
                textBtnCancel !== undefined &&
                <TouchableOpacity style={styles.buttonBtnCancel} onPress={() => btnCancel()}>
                  <Text style={styles.textBtnCancel}>{textBtnCancel}</Text>
                </TouchableOpacity>
              }
              {
                textBtnAccept !== undefined &&
                <TouchableOpacity style={styles.buttonBtnAccept} onPress={() => btnAccept()}>
                  <Text style={styles.textBtnAccept}>{textBtnAccept}</Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalConfim;

const styles = StyleSheet.create({
  hr: {
    marginTop: 20,
    borderColor: '#DDDDDD',
    borderWidth: 0.5
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 25,
    alignItems: 'center',
    shadowColor: '#0066FF',
    shadowOffset: {
      width: 10,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 15,
  },
  title: {
    color: '#FF0000',
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonBtnAccept: {
    backgroundColor: '#0033FF',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginLeft: 20,
    borderRadius: 5,
  },
  textBtnAccept: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
  },
  buttonBtnCancel: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginLeft: 30,
    borderRadius: 5,
  },
  textBtnCancel: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
  },
});
