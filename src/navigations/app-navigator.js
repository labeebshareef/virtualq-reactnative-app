import React from 'react';
import {Dimensions, Image, View, SafeAreaView} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import {createStackNavigator} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
// import { createDrawerNavigator } from "@react-navigation/drawer";
import {AuthContext} from '../utils/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SellerListScreen from '../screens/SellerList';
import BookingScreen from '../screens/BookingScreen';
import {Http} from '../services';
import AppointmentListScreen from '../screens/Appointments';
// import {DeviceStackNavigator} from '../screens/DeviceStack';
// import riodLogo from '../assets/images/riodtmlogo.png';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {opacity: 1},
        animationEnabled: false,
      }}>
      <Stack.Screen name="SellerListScreen" component={SellerListScreen} />
      <Stack.Screen name="BookingScreen" component={BookingScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTintColor: 'white',
        drawerStyle: {
          backgroundColor: '#23293E',
          width: 240,
        },
        headerStyle: {
          backgroundColor: '#0C101E',
        },
        headerTitle: 'VirtualQ',
      }}>
      <Drawer.Screen name="VirtualQ" component={MyStack} />
      <Drawer.Screen name="Appointments" component={AppointmentListScreen} />
      {/* <Drawer.Screen
        name="DevicesList"
        options={{drawerLabel: 'Devices List'}}
        component={DeviceStackNavigator}
      /> */}
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = props => {
  const {signOut} = React.useContext(AuthContext);
  const logout = async () => {
    const logoutResponse = await Http.request('get', '/user/auth/logout');
    if (logoutResponse && logoutResponse.success) {
      await AsyncStorage.clear();
      signOut();
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{flex: 1, justifyContent: 'space-between'}}>
      <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
        <DrawerItemList {...props} />
        {/* <DrawerItem
          label="Close drawer"
          onPress={() => props.navigation.closeDrawer()}
        /> */}
      </SafeAreaView>

      <DrawerItem
        label="Sign Out"
        onPress={logout}
        style={{position: 'absolute', bottom: 50, width: '100%'}}
      />
      {/* <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.toggleDrawer()}
      /> */}
      <View style={{height: 50, justifyContent: 'flex-end', marginBottom: 10}}>
        {/* <Image
          source={riodLogo}
          resizeMode="contain"
          style={{width: '100%', height: 50}}
        /> */}
      </View>
    </DrawerContentScrollView>
  );
};

const entireScreenHeight = Dimensions.get('window').height;
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({
  $rem: (entireScreenHeight * entireScreenWidth) / 19125,
});

export default AppNavigator;
