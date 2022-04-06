import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import Card from '../components/Card';
import {AuthContext} from '../context/AuthContextProvider';
// import ChatSection from '../components/ChatSection';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import ChatScreen from './ChatScreen';
import ChatSection from '../components/ChatSection';
import ChatScreenTest from './ChatScreenTest';

const HomeScreen = () => {
  const Stack = createNativeStackNavigator();
  const {user} = useContext(AuthContext);

  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Chatsreen">
      <Stack.Screen
        name="Chatsreen"
        component={ChatSection}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Conversation"
        component={ChatScreenTest}
        options={
          {
            // headerShown: true,
            // headerLeft: () => {
            //   return (
            //     <Image
            //       style={{width: 50, height: 50, borderRadius: 25}}
            //       source={require('./../assets/me2.png')}
            //     />
            //   );
            // },
          }
        }
      />
    </Stack.Navigator>
  );
};

export default HomeScreen;
