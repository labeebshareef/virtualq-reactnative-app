import React from 'react';
import {
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {AuthContext} from '../../utils/authContext';
import propTypes from 'prop-types';
import {Http} from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp({route, navigation}) {
  const {signIn} = React.useContext(AuthContext);
  const [emailotp, onChangeEmailotp] = React.useState('');
  const [name, onChangName] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const {userId} = route.params;

  const login = async () => {
    const signupResponse = await Http.request('post', '/user/auth/signup', {
      fullName: name,
      userId: userId,
      password: password,
      emailOtp: emailotp,
    });

    if (signupResponse && signupResponse.success) {
      console.log(signupResponse, 'signupResponse');
      await AsyncStorage.setItem('token', signupResponse.result.token);
      await AsyncStorage.setItem(
        'userId',
        signupResponse.result.userDetails._id,
      );
      await AsyncStorage.setItem(
        'fullName',
        signupResponse.result.userDetails.fullName,
      );
      await AsyncStorage.setItem(
        'email',
        signupResponse.result.userDetails.email,
      );
      // navigation.navigate('Login');
      signIn();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tophead}>
        <Text style={styles.heading}>VirtualQ</Text>
      </View>
      <View style={styles.boxtop}>
        <View>
          <Text style={styles.topLabel}>Email OTP</Text>
          <TouchableOpacity style={styles.resend}>
            <Text style={styles.toprightLabel}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.inputBox}
          placeholderTextColor="rgba(255, 255, 255, 0.2)"
          value={emailotp}
          onChangeText={onChangeEmailotp}
        />

        <Text style={styles.topLabel}>Name</Text>
        <TextInput
          style={styles.inputBox}
          placeholderTextColor="rgba(255, 255, 255, 0.2)"
          value={name}
          onChangeText={onChangName}
        />

        <Text style={styles.topLabel}>Password</Text>

        <TextInput
          style={styles.inputBox}
          placeholderTextColor="rgba(255, 255, 255, 0.2)"
          value={password}
          onChangeText={onChangePassword}
        />
      </View>
      <TouchableOpacity style={styles.buttonhead} onPress={login}>
        <Text style={styles.signintext}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
SignUp.propTypes = {
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
    marginTop: '5.813rem',
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
    // lineHeight: '0.875rem'
    color: '#FFFFFF',
    borderColor: '#18A0FB',
    borderWidth: 1,
    borderRadius: '0.625rem',
    paddingLeft: '1.625rem',
    height: '3.125rem',
  },
  boxtop: {
    marginTop: '2.438rem',
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
    marginBottom: '4rem',
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
  topLabel: {
    color: 'white',
    fontSize: '1.125rem',
    marginTop: '0.813rem',
  },
  toprightLabel: {
    color: '#18A0FB',
    fontSize: '1.125rem',
  },
  resend: {
    marginTop: '0.813rem',
    position: 'absolute',
    right: 0,
  },
});
