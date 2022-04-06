import React, {useState, useContext, useEffect} from 'react';

import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconE from 'react-native-vector-icons/Entypo';
import MessageBox from '../components/MessageBox';
import {ActivityIndicator, Badge} from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

import {AuthContext} from '../context/AuthContextProvider';

import storage from '@react-native-firebase/storage';

const ChatScreenTest = ({route, navigation}) => {
  const data = route.params;
  // console.log(data.data.id);

  // console.log();
  const {user, getUser} = useContext(AuthContext);
  const [partner, setPartner] = useState();
  // const [chat, setChat] = useState([]);

  const [messages, setMessages] = useState([]);

  const [new_message, setNewmessage] = useState('');
  const [chats, setChats] = useState([]);
  const [imageUrl, setImageUrl] = useState(
    'https://media.gettyimages.com/vectors/male-avatar-icon-vector-id1331350914?s=2048x2048',
  );

  const [isLoading, setIsLoading] = useState(true);

  const partner_id =
    data.data.data().uid1 == user.uid
      ? data.data.data().uid2
      : data.data.data().uid1;

  let found_chat = false;
  let temp_chats = [];
  let temp_messages = [];

  async function getAllChats() {
    await firestore()
      .collection('Chats')
      .doc(data.data.id)
      .collection('messages')
      .orderBy('date_created', 'asc')
      .get()
      .then(querySnapshot => {
        temp_messages = [];
        querySnapshot.forEach(data => {
          // console.log('Every chat msg');
          temp_messages.push(data);
        });
      });

    // console.log(temp_messages[0].data());
    setMessages(temp_messages);
  }

  async function getProfile() {
    const profile_reference = storage()
      .ref('/profiles/' + partner_id + '.png')
      .getDownloadURL()
      .then(url => {
        console.log(url);
        if (url) setImageUrl(url);
        setIsLoading(false);
      })
      .catch(e => {
        console.log('Errors while downloading => ', e);
        setIsLoading(false);
      });
  }

  async function getAllMessages(docId) {
    let new_tem_msg = [];
    await firestore()
      .collection('Chats')
      .doc(docId)
      .collection('messages')
      .orderBy('date_created', 'asc')
      .get()
      .then(querySnapshot => {
        final_item_index = 0;
        querySnapshot.forEach(data => {
          new_tem_msg.push(data);
        });
      });
    setMessages(new_tem_msg);
  }

  function onMsgError(error) {
    console.error(error);
  }

  useEffect(() => {
    getAllChats();
    getProfile();

    const chat_update = firestore()
      .collection('Chats')
      .doc(data.data.id)
      .collection('messages')
      .onSnapshot(() => {
        // console.log(chats);
        getAllMessages(data.data.id);
      }, onMsgError);

    return () => chat_update();
  }, []);

  async function getPartner() {
    let random_user = await getUser(partner_id);
    setPartner(random_user);
  }

  return (
    <>
      {!isLoading ? (
        <View style={{flex: 1}}>
          <View
            style={{
              backgroundColor: '#2fbba4',
              paddingVertical: 8,
              paddingHorizontal: 5,
              paddingRight: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Chatsreen');
                }}>
                <Icon name="arrow-left" size={18} color="white" />
              </TouchableOpacity>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  marginHorizontal: 5,
                }}
                // source={require('./../assets/me2.png')}
                source={{uri: imageUrl}}
              />
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
                {partner?.name}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="video" size={18} color="white" />
              <Icon
                name="phone"
                size={17}
                color="white"
                style={{marginHorizontal: 20}}
              />
              <IconE name="dots-three-vertical" size={18} color="#fff" />
            </View>
          </View>
          {/* <ScrollView
        style={{backgroundColor: '#ebe5db', flexGrow: 1, paddingTop: 5}}>
        <ScrollView> */}
          <FlatList
            inverted
            data={[...messages].reverse()}
            // data={messages}
            renderItem={({item}) => {
              return <MessageBox message={item.data()} />;
            }}
            keyExtractor={(item, index) => {
              return index;
            }}
          />
          <View style={{height: 10}}></View>
          {/* </ScrollView> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 5,
            }}>
            <View style={styles.passwordContainer}>
              <Icon name="smile" color="gray" size={20} />
              <TextInput
                style={styles.inputStyle}
                autoCorrect={true}
                placeholder="Message"
                value={new_message}
                onChangeText={value => {
                  setNewmessage(value);
                }}
              />
              <IconE name="attachment" color="gray" size={20} />
              {new_message.trim().length == 0 && (
                <Icon
                  style={{marginLeft: 18}}
                  name="camera"
                  color="gray"
                  size={20}
                />
              )}
            </View>
            <View style={{flex: 1}}>
              <Badge
                onPress={() => {
                  if (new_message) {
                    let time_stamp = firebase.firestore.Timestamp.now();
                    firestore()
                      .collection('Chats')
                      .doc(data.data.id)
                      .collection('messages')
                      .add({
                        date_created: time_stamp,
                        message: new_message,
                        senderID: user.uid,
                      });

                    firestore()
                      .collection('Chats')
                      .doc(data.data.id)
                      .update({
                        latest_msg: [time_stamp, new_message, user.uid],
                      });
                  }
                  setNewmessage('');
                }}
                style={{
                  backgroundColor: '#30887a',
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                }}>
                <Icon
                  name={
                    new_message.trim().length > 0 ? 'paper-plane' : 'microphone'
                  }
                  color="white"
                  size={20}
                />
              </Badge>
            </View>
          </View>
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    borderRadius: 15,
    backgroundColor: 'white',
    flex: 7,
  },
  inputStyle: {
    paddingLeft: 10,
    width: '72%',
  },
});

export default ChatScreenTest;
