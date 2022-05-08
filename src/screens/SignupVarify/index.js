import React from 'react';
import {
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
// import {AuthContext} from '../../utils/authContext';
import {Http} from '../../services';
// import { ScrollView } from 'react-native-gesture-handler';

export default function SignUpVarify({navigation}) {
  // const {signIn} = React.useContext(AuthContext);
  const [email, onChangeEmail] = React.useState('');

  const login = async () => {
    const getOTPResponse = await Http.request(
      'post',
      '/user/auth/generateotp',
      {
        email: email,
      },
    );
    if (getOTPResponse && getOTPResponse.success) {
      console.log(getOTPResponse, 'getOTPResponse');
      navigation.navigate('Signup', {
        userId: getOTPResponse.result._id,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tophead}>
        <Text style={styles.heading}>VirtualQ</Text>
      </View>
      <View style={styles.boxtop}>
        <Text style={styles.topLabel}>Email Id</Text>

        <TextInput
          style={styles.inputBox}
          placeholderTextColor="rgba(255, 255, 255, 0.2)"
          value={email}
          onChangeText={onChangeEmail}
        />
      </View>
      <TouchableOpacity style={styles.buttonhead} onPress={login}>
        <Text style={styles.signintext}>Send OTP</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
SignUpVarify.propTypes = {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '13.813rem',
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
    marginBottom: '3rem',
  },
  signintext: {
    fontSize: '1.125rem',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  topLabel: {
    color: 'white',
    fontSize: '1.125rem',
    marginTop: '0.813rem',
  },
});
