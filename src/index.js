import React from 'react';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import {DeviceEventEmitter} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

import AuthNavigator from './navigations/auth-navigator';
import AppNavigator from './navigations/app-navigator';
import {AuthContext} from './utils/authContext';

const Stack = createStackNavigator();

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            token: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignOut: false,
            token: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignOut: true,
            token: null,
          };
      }
    },
    {
      isLoading: true,
      isSignOut: false,
      token: null,
    },
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('token');
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'RESTORE_TOKEN', token: token});
    };
    bootstrapAsync();
  }, []);

  React.useEffect(() => {
    const onMessageListener = messaging().onMessage(remoteMessage => {
      DeviceEventEmitter.emit('data', remoteMessage.data);
    });
    return onMessageListener;
  }, []);

  React.useEffect(() => {
    SplashScreen.hide();
  });

  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async () => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: {opacity: 1},
            animationEnabled: false,
          }}>
          {/* <Stack.Screen name="Auth" component={AuthNavigator} /> */}
          {state.token == null ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <Stack.Screen name="App" component={AppNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
