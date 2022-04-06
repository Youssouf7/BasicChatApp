import React from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeNavigation from './HomeNavigation';

const StackNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="mystack" component={HomeNavigation} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
