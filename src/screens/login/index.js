import React from 'react';
import {
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {AuthContext} from '../../utils/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Http} from '../../services';
import messaging from '@react-native-firebase/messaging';
import {ScrollView} from 'react-native-gesture-handler';

export default function LoginScreen({navigation}) {
  const {signIn} = React.useContext(AuthContext);
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  const login = async () => {
    const loginResponse = await Http.request('post', '/user/auth/login', {
      email: email,
      password: password,
    });
    console.log(loginResponse, 'loginResponse');
    if (loginResponse && loginResponse.success) {
      await AsyncStorage.setItem('token', loginResponse.result.token);
      await AsyncStorage.setItem('userId', loginResponse.result._id);
      await AsyncStorage.setItem('fullName', loginResponse.result.fullName);
      await AsyncStorage.setItem('email', loginResponse.result.email);
      const fcmToken = await messaging().getToken();
      console.log(fcmToken, 'fcmToken--fcmToken');
      if (fcmToken) {
        await Http.request('post', '/user/fcmToken', {
          fcmToken: fcmToken,
        });
      }
      signIn();
    }
    // signIn();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tophead}>
        <Text style={styles.heading}>VirtualQ</Text>
      </View>
      <View style={styles.boxtop}>
        {/* <Text style={styles.topLabel}>Email Id</Text> */}

        <TextInput
          style={styles.inputBox}
          placeholder="Email Id"
          placeholderTextColor="rgba(255, 255, 255, 0.2)"
          value={email}
          onChangeText={onChangeEmail}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.2)"
          value={password}
          onChangeText={onChangePassword}
        />
      </View>
      <TouchableOpacity style={styles.buttonhead} onPress={login}>
        <Text style={styles.signintext}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signupvarify')}>
        <Text style={styles.forgot}>Create new account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
const entireScreenHeight = Dimensions.get('window').height;
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({
  $rem: (entireScreenHeight * entireScreenWidth) / 19125,
});
const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#0C101E',
    height: '100%',
    paddingLeft: '1.188rem',
    paddingRight: '1.188rem',
  },
  heading: {
    color: 'white',
    fontSize: '2.25rem',
    fontWeight: 'bold',
    letterSpacing: '1.0rem',
  },
  tophead: {
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '7.813rem',
  },
  headcolor: {
    color: '#18A0FB',
  },
  inputBox: {
    width: '100%',
    // backgroundColor: '#F5F5F5',
    // borderRadius: '0.313rem',
    // fontFamily: 'AirbnbCereal-Book',
    fontSize: '1.125rem',
    // lineHeight: '0.875rem',
    color: '#FFFFFF',
    borderColor: '#18A0FB',
    borderWidth: 1,
    borderRadius: '0.625rem',
    paddingLeft: '1.625rem',
    height: '3.125rem',
    marginTop: '1rem',
  },
  boxtop: {
    marginTop: '10.25rem',
  },
  buttonhead: {
    marginTop: '1.125rem',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#23293E',
    height: '3.125rem',
    borderRadius: '0.625rem',
    borderColor: '#18A0FB',
    borderWidth: 1,
    marginLeft: '3.125rem',
    marginRight: '3.125rem',
  },
  signintext: {
    fontSize: '1.125rem',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  forgot: {
    color: 'white',
    alignSelf: 'center',
    marginTop: '1rem',
    fontSize: '0.75rem',
  },
});
