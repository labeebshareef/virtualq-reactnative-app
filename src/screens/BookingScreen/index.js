import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {AuthContext} from '../../utils/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Http} from '../../services';
import messaging from '@react-native-firebase/messaging';
import {ScrollView} from 'react-native-gesture-handler';
import RadioButton from '../../components/radioButton';
import HorizontalDatepicker from '@awrminkhodaei/react-native-horizontal-datepicker';

export default function BookingScreen({route, navigation}) {
  const [timeslotList, setTimeslotList] = useState([]);
  const [date, setDate] = useState([]);
  const [selectedTimeslotId, setSelectedTimeslotId] = useState(null);

  const {sellerData} = route.params;
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedDate(
        new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
      );
    });
    return unsubscribe;
  });
  const setSelectedDate = async selectedDate => {
    setTimeslotList([]);
    setDate(selectedDate);
    console.log(sellerData);
    const bodyData = {
      sellerId: sellerData._id,
      date: selectedDate,
    };
    const timeslotListResponse = await Http.request(
      'post',
      '/user/timeslot/getTimeslotDatewise',
      bodyData,
    );
    if (timeslotListResponse && timeslotListResponse.success) {
      console.log(timeslotListResponse, 'sellerListResponse');
      setTimeslotList(timeslotListResponse.result);
    }
  };

  const onSelect = async value => {
    setSelectedTimeslotId(value);
  };
  const bookSlot = async () => {
    const bodyData = {
      sellerId: sellerData._id,
      date: date,
      timeslotId: selectedTimeslotId,
    };
    console.log(bodyData);
    const bookslotResponse = await Http.request(
      'post',
      '/user/appointment/requestAppointment',
      bodyData,
    );
    if (bookslotResponse && bookslotResponse.success) {
      navigation.navigate('Appointments');
      if (Platform.OS === 'android') {
        ToastAndroid.show(bookslotResponse.message, ToastAndroid.SHORT);
      } else {
        Alert.alert(bookslotResponse.message);
      }
    }
  };
  return (
    <>
      <ScrollView style={styles.container}>
        <HorizontalDatepicker
          mode="gregorian"
          startDate={new Date()}
          endDate={new Date().setDate(new Date().getDate() + 7)}
          initialSelectedDate={new Date()}
          onSelectedDateChange={selectedDate => setSelectedDate(selectedDate)}
          selectedItemWidth={170}
          unselectedItemWidth={38}
          itemHeight={38}
          itemRadius={10}
          selectedItemTextStyle={styles.selectedItemTextStyle}
          unselectedItemTextStyle={styles.selectedItemTextStyle}
          selectedItemBackgroundColor="#222831"
          unselectedItemBackgroundColor="#ececec"
          flatListContainerStyle={styles.flatListContainerStyle}
        />
        <RadioButton data={timeslotList} onSelect={onSelect} />
        <TouchableOpacity style={styles.buttonhead} onPress={bookSlot}>
          <Text style={styles.signintext}>Book Slot</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
BookingScreen.propTypes = {
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
