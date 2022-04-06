import React, {useState, useContext, useEffect} from 'react';

import {View, Text, Image, TextInput, FlatList, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconE from 'react-native-vector-icons/Entypo';
import MessageBox from '../components/MessageBox';
import {Badge} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';

import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../context/AuthContextProvider';

const ChatScreen = ({route, navigation}) => {
  // const data = route.params.data;
  console.log(route);
  console.log('This is new data');

  console.log(route);

  const {user, getUser} = useContext(AuthContext);
  const [partner, setPartner] = useState();
  const partner_id = data.uid1 == user.uid ? data.uid2 : data.uid1;

  const [messages, setMessages] = useState([]);

  const [new_message, setNewmessage] = useState('');

  useEffect(() => {
    setMessages(data.messages);
    // console.log(data.messages.length);
    getPartner();
  }, []);

  async function getPartner() {
    let random_user = await getUser(partner_id);
    setPartner(random_user);
  }
  return (
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
            source={require('./../assets/me2.png')}
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
      <View style={{backgroundColor: '#ebe5db', flexGrow: 1, paddingTop: 5}}>
        <FlatList
          data={messages}
          renderItem={({item}) => {
            return <MessageBox message={item} />;
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 5,
          backgroundColor: '#ebe5db',
        }}>
        <View style={styles.passwordContainer}>
          <Icon name="smile" color="gray" size={20} />
          <TextInput
            style={styles.inputStyle}
            autoCorrect={true}
            placeholder="Message"
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
            style={{
              backgroundColor: '#30887a',
              height: 40,
              width: 40,
              borderRadius: 20,
            }}>
            <Icon
              onPress={() => {
                // firestore()
                //   .collection('Chats')
                //   .where('uid1', '==', user.id)
                //   .collection('messages');
              }}
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

export default ChatScreen;
