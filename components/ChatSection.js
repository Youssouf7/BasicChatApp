import React, {useEffect, useContext, useState} from 'react';

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import ChatItem from './ChatItem';

import firestore from '@react-native-firebase/firestore';

import {AuthContext} from '../context/AuthContextProvider';

const ChatSection = ({navigation}) => {
  const {user} = useContext(AuthContext);
  // console.log(user);
  const [chats, setChats] = useState([]);
  let temp_chats = [];

  let unsubr_chat_update;

  useEffect(() => {
    getAllChats();

    return () => unsubr_chat_update();
  }, []);

  async function getAllChatsAgain() {
    temp_chats = [];
    await firestore()
      .collection('Chats')
      .where('uid1', '==', user.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(data => {
          temp_chats.push(data);
        });
      });
    await firestore()
      .collection('Chats')
      .where('uid2', '==', user.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(data => {
          temp_chats.push(data);
        });
      });
    setChats(temp_chats);
  }

  async function getAllChats() {
    await firestore()
      .collection('Chats')
      .where('uid1', '==', user.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(data => {
          temp_chats.push(data);
        });
      });
    await firestore()
      .collection('Chats')
      .where('uid2', '==', user.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(data => {
          temp_chats.push(data);
        });
      });
    setChats(temp_chats);

    console.log(temp_chats[0].id);
    unsubr_chat_update = firestore()
      .collection('Chats')
      .doc(temp_chats[0].id)
      .onSnapshot(getAllChatsAgain, ErroMode);
  }

  function ErroMode(error) {
    console.error(error);
  }

  // getAllChats();

  return (
    <View>
      <FlatList
        data={chats}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Conversation', {data: item});
              }}>
              <ChatItem data={item} />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => {
          return index;
        }}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
          );
        }}
        refreshControl={<RefreshControl refreshing={false} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default ChatSection;
