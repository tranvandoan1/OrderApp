import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {Avatar} from 'react-native-elements';
import {useForm, Controller} from 'react-hook-form';
import Icon from 'react-native-vector-icons/AntDesign';
type FormData = {
  email: string;
  password: string;
  name: string;
  phone: string;
  avatar: String;
};

const SignUp = ({navigation}: any) => {
  const [email, setEmail] = useState<any>();
  const [phone, setPhone] = useState<any>();
  const [name, setName] = useState<any>();
  const [password, setPassword] = useState<any>();
  const [avatar, setAvatar] = useState<any>();
  const signin = () => {
    console.log(name, 'name');
    console.log(email, 'email');
    console.log(password, 'password');
    console.log(phone, 'phone');
    // navigation?.navigate('Signin');
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      avatar: '',
    },
  });
  const onSubmit = (data: any) => {
    navigation?.navigate('Signin');
  };
  const choosePhoto = () => {
    // ImageCropPicker.openPicker({
    //   multiple: true,

    //   maxFiles: 2,
    // }).then(images => {
    //   setAvatar(images);
    // });
    // ImagePicker.openPicker({ 
    //   cropping:true,
    //   height:300,
    //   width:300
    // }).then((result:any)=>{ 
    //  console.log(result)
    //   // if (!result.cancelled) {
    //   //   // User picked an image
    //   //   const {height, width, type, uri} = result;
    //   //   return uriToBlob(uri); // will follow later
    //   // }
     
    // })
    
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{padding: 20}}>
        <SafeAreaView>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Avatar
                rounded
                source={{
                  uri: 'https://123design.org/wp-content/uploads/2020/07/LOGOLM0200-Chibi-%C4%90%E1%BB%87-nh%E1%BA%A5t-%C4%91%E1%BA%A7u-b%E1%BA%BFp-nh%C3%AD-Vua-%C4%91%E1%BA%A7u-b%E1%BA%BFp.jpg',
                }}
                size={150}
              />
            </View>
            <View>
              <Text style={styles.title}>Đăng ký</Text>

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={errors.name ? styles.inputActive : styles.input}
                    placeholder="Họ và Tên"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={errors.name && 'red'}
                  />
                )}
                name="name"
              />
              {errors.name && (
                <Text style={styles.validate}>Name không để trống !</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}: any) => (
                  <TextInput
                    style={errors.email ? styles.inputActive : styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Email/SĐT"
                    placeholderTextColor={errors.email && 'red'}
                  />
                )}
                name="email"
              />
              {errors.email && (
                <Text style={styles.validate}>Email không để trống !</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}: any) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={errors.password ? styles.inputActive : styles.input}
                    placeholder="Password"
                    placeholderTextColor={errors.password && 'red'}
                  />
                )}
                name="password"
              />
              {errors.password && (
                <Text style={styles.validate}>Password không để trống !</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}: any) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    style={errors.phone ? styles.inputActive : styles.input}
                    placeholder="Số điện thoại"
                    placeholderTextColor={errors.phone && 'red'}
                  />
                )}
                name="phone"
              />
              {errors.phone && (
                <Text style={[styles.validate, {marginBottom: 5}]}>
                  Số điện thoại không để trống !
                </Text>
              )}

              <TouchableOpacity
                onPress={() => choosePhoto()}
                style={styles.avatar}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.upAvatar}>
                    <Icon name="clouduploado" size={30} />
                    <Text style={{marginLeft: 10}}>Nhập ảnh</Text>
                  </View>
                  {/* {avatar !== undefined && (
                    <Text style={{marginLeft: 10, marginBottom: 10}}>
                      {avatar[0].modificationDate}
                    </Text>
                  )} */}
                </View>

                <View>
                  {avatar !== undefined && (
                    <Image
                      style={styles.image}
                      source={{uri: `${avatar[0].path}`}}
                    />
                  )}
                </View>
              </TouchableOpacity>

              <Button
                title="Đăng ký"
                color={'blue'}
                onPress={handleSubmit(onSubmit)}
              />

              <View style={styles.hr}></View>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text>Bạn đã có tài khoản ?</Text>
                <TouchableOpacity
                  onPress={() => navigation?.navigate('signin')}>
                  <Text style={{color: 'blue'}}> Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginVertical: 30,
    fontSize: 23,
    color: 'rgb(238, 77, 45)',
    fontWeight: '600',
  },
  input: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 2,
  },
  hr: {
    borderBottomColor: 'rgb(219, 219, 219)',
    borderBottomWidth: 0.4,
    marginVertical: 20,
  },
  signin: {
    backgroundColor: 'rgb(23, 76, 250)',
    width: '100%',
    padding: 10,
    borderRadius: 2,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
  },
  validate: {
    color: 'red',
    fontWeight: '400',
  },
  inputActive: {
    borderColor: 'red',
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 3,
  },
  avatar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  upAvatar: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
    borderRadius: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
});
