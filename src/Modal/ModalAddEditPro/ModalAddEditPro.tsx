import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component, useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  Dimensions,
  useWindowDimensions,
  Button,
  FlatList,
  Image,
} from 'react-native';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../App/Store';
import {getAll} from '../../Features/CateSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Size} from '../../size';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
// import storage from '@react-native-firebase/storage';

type Props = {
  dataEdit: any;
  onCloseModal: () => void;
  modalVisible: any;
};
const ModalAddEditPro = (props: Props) => {
  const width = Size()?.width;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const categoris = useAppSelect((data: any) => data.categoris.value);

  const [check, setCheck] = useState<Boolean>(false);
  const [value, setValue] = useState<any>();
  const [cate, setCate] = useState<any>(false);
  const [image, setImage] = useState<any>();
  useEffect(() => {
    dispatch(getAll());
  }, []);
  const click = () => (
    <Pressable
      onPress={() => (props.onCloseModal(), setValue(undefined))}
      style={{position: 'absolute', top: 0, width: '100%', height: '100%'}}>
      <View style={{flex: 1, width: '100%'}}></View>
    </Pressable>
  );
  const click1 = () => (
    <Pressable
      style={{position: 'absolute', top: 0, width: '100%', height: '100%'}}
      onPress={() => setCate(false)}>
      <View style={{flex: 1, width: '100%'}}></View>
    </Pressable>
  );
  const onSubmit = async () => {
    console.log('first');
    // if (props.dataEdit == undefined) {
    //   const user: any = await AsyncStorage.getItem('user');
    //   const user_id = JSON.parse(user).data._id;
    //   try {
    //     setCheck(true);
    //     await dispatch(addCate({name: value, user_id: user_id}));
    //     setCheck(false);
    //     setValue(undefined);
    //     props.onCloseModal();
    //   } catch (error: any) {
    //     Alert.alert(error.response.data.error);
    //   }
    // } else {
    //   try {
    //     setCheck(true);
    //     let formData = new FormData();
    //     formData.append(
    //       'name',
    //       value == undefined ? props.dataEdit.name : value,
    //     );
    //     await dispatch(editCatee({id: props.dataEdit._id, data: formData}));

    //     setCheck(false);
    //     setValue(undefined);
    //     props.onCloseModal();
    //   } catch (error: any) {
    //     Alert.alert(error.response.data.error);
    //   }
    // }
  };
  // const upImage = () => {
  //   ImagePicker.openPicker({
  //     cropping: true,
  //   }).then(async (image: any) => {
  //     const images = Platform.OS == 'ios' ? image.sourceURL : image.path;
  //     setImage(images);
  //     // let filename = image.substring(image.lastIndexOf('/') + 1);
  //     // const imageRef = ref(storage, `images/${image.modificationDate}`);
  //     // uploadBytes(imageRef, image).then(() => {
  //     //   getDownloadURL(imageRef).then((url:any) => {
  //     //       console.log(url,'dâs')
  //     //   });
  //     // });
  //     // const storageRef = storage().ref(`images/${image.modificationDate}`);
  //     // const url = await storageRef.getDownloadURL();
  //     // console.log(url);
  //     // console.log(storageRef, 'e3wqsa');
  //   });
  // };

  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);

  const takePhotoFromCamera = () => {
    // ImagePicker.openCamera({
    //   width: 1200,
    //   height: 780,
    //   cropping: true,
    // }).then(image => {
    //   console.log(image);
    //   const imageUri: any =
    //     Platform.OS === 'ios' ? image.sourceURL : image.path;
    //   const uploadUri: any = imageUri;
    //   let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    //   const task: any = storage().ref(filename).putFile(uploadUri);
    //   console.log(task,'21wqsa')
    //   setImage(imageUri);
    // });
  };

  const upImage = () => {
    // ImagePicker.openPicker({
    //   width: 1200,
    //   height: 780,
    //   cropping: true,
    // }).then(image => {
    //   console.log(image);
    //   const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
    //   setImage(imageUri);
    //   const uploadUri: any = imageUri;
    //   let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    //   const task: any = storage().ref(filename).putFile(uploadUri);
    //   console.log(task,'edasds')
    // });
  };

  const submitPost = async () => {
    //   const imageUrl = await uploadImage();
    //   console.log('Image Url: ', imageUrl);
    //   console.log('Post: ', post);
    //   firestore()
    //   .collection('posts')
    //   .add({
    //     userId: user.uid,
    //     post: post,
    //     postImg: imageUrl,
    //     postTime: firestore.Timestamp.fromDate(new Date()),
    //     likes: null,
    //     comments: null,
    //   })
    //   .then(() => {
    //     console.log('Post Added!');
    //     Alert.alert(
    //       'Post published!',
    //       'Your post has been published Successfully!',
    //     );
    //     setPost(null);
    //   })
    //   .catch((error) => {
    //     console.log('Something went wrong with added post to firestore.', error);
    //   });
  };

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    const task: any = storage().ref(filename).putFile(uploadUri);

    // Add timestamp to File Name
    // const extension = filename.split('.').pop();
    // const name = filename.split('.').slice(0, -1).join('.');
    // filename = name + Date.now() + '.' + extension;

    // setUploading(true);
    // setTransferred(0);

    // const storageRef = storage().ref(`photos/${filename}`);
    // const task = storageRef.putFile(uploadUri);

    // // Set transferred state
    // task.on('state_changed', (taskSnapshot) => {
    //   console.log(
    //     `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
    //   );

    //   setTransferred(
    //     Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
    //       100,
    //   );
    // });

    // try {
    //   await task;

    //   const url = await storageRef.getDownloadURL();

    //   setUploading(false);
    //   setImage(null);

    //   // Alert.alert(
    //   //   'Image uploaded!',
    //   //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
    //   // );
    //   return url;

    // } catch (e) {
    //   console.log(e);
    //   return null;
    // }
  };

  const renderItem = ({item, index}: any) => (
    <TouchableOpacity
      style={{
        borderColor: 'rgb(219,219,219)',
        borderBottomWidth: 1,
        paddingVertical: 10,
      }}
      onPress={() => console.log(item, 'dá')}>
      <Text style={styles.listOption}>{item.name}</Text>
    </TouchableOpacity>
  );
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible}>
        <View style={styles.centeredView}>
          {click()}
          <View
            style={[
              styles.modalView,
              width < 720 ? {width: '100%'} : {width: 500},
            ]}>
            <Text style={styles.title}>
              {props.dataEdit == undefined ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}
            </Text>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <TextInput
                style={
                  String(value).length <= 0 ? styles.inputActive : styles.input
                }
                autoCapitalize="words"
                onChangeText={(e: any) => setValue(e)}
                defaultValue={
                  props.dataEdit == undefined ? value : props.dataEdit.name
                }
                placeholder="Tên sản phẩm"
                placeholderTextColor={String(value).length <= 0 ? 'red' : ''}
              />
              {String(value).length <= 0 && (
                <Text style={styles.validate}>Tên không để trống !</Text>
              )}
              <TextInput
                style={
                  String(value).length <= 0 ? styles.inputActive : styles.input
                }
                autoCapitalize="words"
                onChangeText={(e: any) => setValue(e)}
                defaultValue={
                  props.dataEdit == undefined ? value : props.dataEdit.name
                }
                placeholder="Giá sản phẩm"
                placeholderTextColor={String(value).length <= 0 ? 'red' : ''}
              />
              {String(value).length <= 0 && (
                <Text style={styles.validate}>Giá không để trống !</Text>
              )}
              <TouchableOpacity
                style={{position: 'relative'}}
                onPress={() => setCate(true)}>
                <TextInput
                  style={
                    String(value).length <= 0
                      ? styles.inputActive
                      : styles.input
                  }
                  autoCapitalize="words"
                  defaultValue={
                    props.dataEdit == undefined ? value : props.dataEdit.name
                  }
                  editable={false}
                  selectTextOnFocus={false}
                  placeholder="Danh mục sản phẩm"
                  placeholderTextColor={String(value).length <= 0 ? 'red' : ''}
                />
                <AntDesign
                  name="caretdown"
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 27,
                    fontSize: 16,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => upImage()}
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    padding: 7,
                    justifyContent: 'center',
                    height: 200,
                  },
                  styles.input,
                ]}>
                {image == undefined ? (
                  <>
                    <SimpleLineIcons name="cloud-upload" size={30} />
                    <Text style={{fontSize: 20, marginLeft: 10}}>Chọn ảnh</Text>
                  </>
                ) : (
                  <Image
                    source={{uri: image}}
                    style={{width: '100%', height: '100%'}}
                  />
                )}
              </TouchableOpacity>
            </KeyboardAvoidingView>

            <TouchableOpacity onPress={() => onSubmit()}>
              <Text style={styles.add}>
                {check == true ? (
                  <ActivityIndicator size={20} color={'#fff'} />
                ) : props.dataEdit == undefined ? (
                  ' Thêm'
                ) : (
                  'Sửa'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={cate}>
        <View style={styles.centeredViewCate}>
          {click1()}
          <View
            style={[
              styles.modalViewCate,
              width < 720 ? {width: '100%'} : {width: 450},
            ]}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={categoris}
              style={{
                backgroundColor: '#fff',
                borderRadius: 5,
                width:  width < 720 ? '100%' : 500,
                height: width < 720 ? 400 : 300,
              }}
              renderItem={renderItem}
              keyExtractor={(item: any) => item._id}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ModalAddEditPro;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 40,
  },
  input: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 3,
    width: '100%',
    fontSize: 15,
  },
  inputActive: {
    borderColor: 'red',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 5,
  },
  validate: {
    color: 'red',
    fontWeight: '400',
    marginBottom: 10,
  },
  add: {
    backgroundColor: 'rgb(23, 76, 250)',
    width: '100%',
    padding: 10,
    borderRadius: 2,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Platform.OS == 'android' ? 'DynaPuff-Light' : 'DynaPuff-Bold',
    color: 'black',
    fontStyle: 'normal',
  },
  listOption: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: '400',
  },
  modalViewCate: {
    borderRadius: 5,
    paddingVertical: 20,
  },
  centeredViewCate: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
