import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Badge} from 'react-native-paper';
// import {Badge} from 'react-native-elements';
import {AuthContext} from '../context/AuthContextProvider';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import moment from 'moment';
import storage from '@react-native-firebase/storage';

const ChatItem = ({data}) => {
  // console.log('This is new data');
  const dataItem = data.data();
  // console.log(data.id);
  // console.log(dataItem.latest_msg[0].seconds);
  const [imageUrl, setImageUrl] = useState(
    'https://media.gettyimages.com/vectors/male-avatar-icon-vector-id1331350914?s=2048x2048',
  );
  //
  //

  const {user, getUser} = useContext(AuthContext);

  const partner_id = dataItem.uid1 == user.uid ? dataItem.uid2 : dataItem.uid1;
  // console.log(partner_id);
  const [partner, setPartner] = useState();
  const [latest_msg, setLatestMessage] = useState({
    time: 'Now',
    message: '',
    senderID: '',
  });

  function onMsgError(error) {
    console.error(error);
  }

  async function getProfile() {
    const profile_reference = storage()
      .ref('/profiles/' + partner_id + '.png')
      .getDownloadURL()
      .then(url => {
        console.log(url);
        if (url) setImageUrl(url);
      })
      .catch(e => {
        console.log('Errors while downloading => ', e);
      });
  }

  useEffect(() => {
    getPartner();
    getLatestChat();
    getProfile();

    const chat_update = firestore()
      .collection('Chats')
      .doc(data.id)
      .onSnapshot(() => {
        getLatestChatUpdate();
      }, onMsgError);

    return () => chat_update();
  }, []);

  async function getLatestChatUpdate() {
    await firestore()
      .collection('Chats')
      .doc(data.id)
      .get()
      .then(querySnapshot => {
        // console.log(querySnapshot.data().latest_msg[0].seconds);
        setLatestMessage({
          time: moment(
            new Date(querySnapshot.data().latest_msg[0].seconds * 1000),
          ).fromNow(),
          message: querySnapshot.data().latest_msg[1],
          senderID: querySnapshot.data().latest_msg[2],
        });
      });
  }

  async function getPartner() {
    // setPartner(getUser(partner_id));
    let random_user = await getUser(partner_id);
    setPartner(random_user);
    // console.log(random_user);
    // await firestore()
    //   .collection('Users')
    //   .where('uid', '==', partner_id)
    //   .get()
    //   .then(querySnapshot => {
    //     // console.log(querySnapshot.docs[0].data());
    //     setPartner(querySnapshot.docs[0].data());
    //   })
    //   .catch(error => console.error(error));
  }

  async function getLatestChat() {
    await firestore()
      .collection('Chats')
      .doc(data.id)
      .get()
      .then(querySnapshot => {
        // console.log(querySnapshot.data().latest_msg[0].seconds);
        setLatestMessage({
          time: moment(
            new Date(querySnapshot.data().latest_msg[0].seconds * 1000),
          ).fromNow(),
          message: querySnapshot.data().latest_msg[1],
          senderID: querySnapshot.data().latest_msg[2],
        });
      });

    // setLatestMessage({
    //   time: moment(new Date(dataItem.latest_msg[0].seconds * 1000)).fromNow(),
    //   message: dataItem.latest_msg[1],
    //   senderID: dataItem.latest_msg[2],
    // });
    // console.log(latest_msg.time);
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 5,
        marginBottom: 5,
        paddingLeft: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10,
      }}>
      <View style={{flexDirection: 'row'}}>
        <View style={{marginRight: 10}}>
          <Image
            style={{width: 50, height: 50, borderRadius: 25}}
            // source={require('./../assets/me2.png')}
            source={{uri: imageUrl}}
          />
        </View>
        <View>
          <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
            {partner?.name}
          </Text>
          <Text style={{fontSize: 14}}>
            {latest_msg.senderID == user.uid && 'You: '}{' '}
            {latest_msg.message.substring(0, 20)} ...
          </Text>
        </View>
      </View>
      <View style={{width: 90}}>
        <Text style={{fontSize: 12, marginBottom: 2, alignSelf: 'center'}}>
          {/* {latest_msg.time.getHours()}: {latest_msg.time.getMinutes()} */}
          {latest_msg.time}
        </Text>
        <Badge style={{backgroundColor: '#30887a', alignSelf: 'center'}}>
          5
        </Badge>
      </View>
    </View>
  );
};

export default ChatItem;
