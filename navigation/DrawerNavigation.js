import React from 'react';

import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeNavigation from './HomeNavigation';
import {Entypo} from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconE from 'react-native-vector-icons/Entypo';

import CustomSidebarMenu from '../home/CustomSidebarMenu';
// import MapsUber from '../maps/MapsUber';

const Drawer = createDrawerNavigator();
const DrawerNavigation = ({navigation}) => {
  return (
    <Drawer.Navigator
      drawerContent={CustomSidebarMenu}
      screenOptions={{
        headerRight: () => {
          return (
            <View
              style={{
                flexDirection: 'row',
                paddingRight: 10,
                alignItems: 'center',
              }}>
              <Icon
                style={{marginRight: 10}}
                name="search"
                size={22}
                color="#fff"
              />
              <IconE name="dots-three-vertical" size={18} color="#fff" />
            </View>
          );
        },
        headerStyle: {
          backgroundColor: '#30887a',
        },
        headerTitleStyle: {
          alignSelf: 'center',
          color: 'white',
        },
        headerTintColor: 'white',
      }}>
      <Drawer.Screen name="BlogPosts" component={HomeNavigation} />
      {/* <Drawer.Screen name="MapsUber" component={MapsUber} /> */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
