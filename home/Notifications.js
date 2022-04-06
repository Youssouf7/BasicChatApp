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
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import Card from '../components/Card';
import {AuthContext} from '../context/AuthContextProvider';
import {PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';

const Notifications = ({navigation}) => {
  const {user} = useContext(AuthContext);

  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    getAllContacts();
  }, []);

  function getAllContacts() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    }).then(
      Contacts.getAll()
        .then(contacts => {
          // work with contacts
          console.log(contacts[0].phoneNumbers[0].number);
          setContacts(contacts);
        })
        .catch(e => {
          console.log(e);
        }),
    );
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
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => {
          return index;
        }}
        renderItem={({item}) => {
          const contact = item;
          console.log();
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Conversation', contact);
              }}>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: 10}}>
                  <Image
                    style={{width: 50, height: 50, borderRadius: 25}}
                    source={require('./../assets/person.png')}
                  />
                </View>
                <View>
                  <Text
                    style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
                    {contact.displayName}
                  </Text>
                  <Text style={{fontSize: 14}}>
                    {contact.phoneNumbers[0].number}
                  </Text>
                </View>
              </View>
              <View style={{width: 90}}>
                <Text
                  style={{fontSize: 12, marginBottom: 2, alignSelf: 'center'}}>
                  {contact.hasThumbnail}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  inputStyle: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 17,
  },
});

export default Notifications;
