import React, {useContext} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {AuthContext} from '../context/AuthContextProvider';

const MessageBox = ({message}) => {
  const {user} = useContext(AuthContext);
  const {height, width} = Dimensions.get('window');
  // console.log(message.date_created);
  var mydate = new Date(message.date_created.seconds * 1000);
  // console.log(mydate);
  if (message.senderID == user.uid) {
    // console.log(Math.floor(width.valueOf() * 0.7));
    return (
      <View
        style={{
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            backgroundColor: '#bfceaa',
            alignSelf: 'flex-end',
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginVertical: 2,
            borderRadius: 10,
            maxWidth: '80%',
          }}>
          <Text style={{color: 'black'}}>{message.message}</Text>
          <Text style={{color: 'black', alignSelf: 'flex-end'}}>
            {mydate.getHours()}:{mydate.getMinutes()}
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            alignSelf: 'flex-start',
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginVertical: 2,
            borderRadius: 10,
          }}>
          <Text style={{color: 'black'}}>{message.message}</Text>
          <Text style={{color: 'black', alignSelf: 'flex-end'}}>
            {mydate.getHours()}:{mydate.getMinutes()}
          </Text>
        </View>
      </View>
    );
  }
};

export default MessageBox;
