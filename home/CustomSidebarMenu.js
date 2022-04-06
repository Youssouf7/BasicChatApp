// / Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/
import React, {useContext, useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
  Alert,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {TouchableOpacity} from 'react-native';
import {AuthContext} from '../context/AuthContextProvider';
import storage from '@react-native-firebase/storage';
import {utils} from '@react-native-firebase/app';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const CustomSidebarMenu = props => {
  const {user} = useContext(AuthContext);
  const {logout} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const [imageUrl, setImageUrl] = useState(
    'https://media.gettyimages.com/vectors/male-avatar-icon-vector-id1331350914?s=2048x2048',
  );

  const reference = storage().ref('/profiles/' + user.uid + '.png');

  async function getProfile() {
    const profile_reference = storage()
      .ref('/profiles/' + user.uid + '.png')
      .getDownloadURL()
      .then(url => {
        console.log(url);
        setImageUrl(url);
      })
      .catch(e => console.log('Errors while downloading => ', e));
  }

  async function UpLoadProfile() {
    const options = {
      mediaType: 'photo',
    };

    // const result = await launchImageLibrary(options);
    launchImageLibrary(options, result => {
      // console.log(result);
      if (!result.didCancel) UploadFile(result.assets[0].uri);
    })
      .then(response => {
        console.log(response);
      })
      .catch(e => console.log('Errors while downloading => ', e));
    // console.log(result.assets);
  }

  async function UploadFile(url) {
    await reference.putFile(url);
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      {/*Top Large Image */}
      <TouchableOpacity onPress={UpLoadProfile}>
        <Image source={{uri: imageUrl}} style={styles.sideMenuProfileIcon} />
      </TouchableOpacity>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Visit Us"
          onPress={() => Linking.openURL('https://google.com/')}
        />
        <View style={styles.customItem}>
          <Text
            onPress={() => {
              // Linking.openURL('https://google.com/');
              UpLoadProfile();
              // Alert.alert('Clicked');
            }}>
            Rate Us
          </Text>
          <Image source={{uri: 'test'}} style={styles.iconStyle} />
        </View>
      </DrawerContentScrollView>
      <TouchableOpacity
        style={{
          marginTop: 10,
          backgroundColor: '#30887a',
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 5,
          borderColor: '#3eaa9b',
          borderWidth: 2,
          width: 200,
        }}
        onPress={() => {
          logout();
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Log Out</Text>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'grey',
        }}>
        CSE 4637
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginTop: 30,
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomSidebarMenu;
