import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from '../screens/login/index.js';
import SignUpSCreen from '../screens/Signup/index.js';
import SignupVarify from '../screens/SignupVarify';
const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: {opacity: 1},
        animationEnabled: false,
      }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signupvarify" component={SignupVarify} />
      <AuthStack.Screen name="Signup" component={SignUpSCreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
