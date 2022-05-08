import {ToastAndroid, Platform, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import * as CONSTANTS from '../constants/index';

exports.request = async function (method, url, body, params) {
  try {
    console.log(CONSTANTS.BASE_URL + url, method);
    const token = await AsyncStorage.getItem('token');
    const response = await axios({
      method: method,
      url: CONSTANTS.BASE_URL + url,
      headers: {
        Authorization: token,
      },
      data: body,
      params: params,
    });
    console.log(response.data);
    return response.data;
  } catch (ex) {
    if (ex.response && ex.response.data) {
      if (!ex.response.data.success) {
        if (ex.response.status === 401) {
          await AsyncStorage.clear();
        } else if (
          ex.response.status === 422 &&
          ex.response.data.errors &&
          ex.response.data.errors.length
        ) {
          if (Platform.OS === 'android') {
            console.log(ex.response.data, ' ex.response.data');
            ToastAndroid.show(
              ex.response.data.errors[0].msg,
              ToastAndroid.SHORT,
            );
          } else {
            Alert.alert(ex.response.data.message);
          }
        } else if (ex.response.status === 400 && ex.response.data.message) {
          if (Platform.OS === 'android') {
            ToastAndroid.show(ex.response.data.message, ToastAndroid.SHORT);
          } else {
            Alert.alert(ex.response.data.message);
          }
        } else if (Platform.OS === 'android') {
          ToastAndroid.show(ex.response.data.message, ToastAndroid.SHORT);
        } else {
          Alert.alert(ex.response.data.message);
        }
      }
    }
    return false;
  }
};
