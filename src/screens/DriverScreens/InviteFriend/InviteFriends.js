import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from '../../../Styles';
import Header from '../../../components/Header';
import Invite from '../../../assets/driver/invite.png';
import TextComponent from '../../../components/TextComponent';
import SubmitButton from '../../../components/SubmitButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InviteFriends = () => {
  return (
    <View style={styles.mainContainer}>
      <Header title={'Invite Friend'} headerRight={true} headerLeft={true} />
      <View style={styles.Before_After_Main_View_Style}>
        <View style={styles.pad}>
          <Image style={styles.img} source={Invite} />
          <Text style={styles.heading}>Invite Friend</Text>
          <TextComponent
            style={{fontSize: 18, textAlign: 'center'}}
            text={
              'Share a Referral Link and Invite Your Friends to Download the app'
            }
          />
          <TouchableOpacity style={styles.CopyTo}>
            <Ionicons color={Colors.LIGHT_GRAY} name="link-outline" size={30} />
            <Text style={styles.link}>www.Safeapp.com/appstore/download</Text>
          </TouchableOpacity>
          <SubmitButton text={'Invite Friend'} />
        </View>
      </View>
    </View>
  );
};

export default InviteFriends;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  Before_After_Main_View_Style: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
  },
  img: {
    width: 250,
    height: 250,
  },
  pad: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  heading: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#C0C0C0',
    marginVertical: 15,
  },
  CopyTo: {
    backgroundColor: Colors.LIGHT_GRAY_2,
    width: '90%',
    height: 45,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    fontSize: 13,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
});
