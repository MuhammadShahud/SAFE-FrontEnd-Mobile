import React, {useState} from 'react';
import {View, Modal, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Colors} from '../Styles';
import SubmitButton from './SubmitButton';
import Input from './TextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextComponent from './TextComponent';

const EnterNewPassword = props => {
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <Modal animationType="slide" transparent={true} visible={props?.visible}>
      <View style={style.Main_Container}>
        <View style={style.Sub_Container}>
          <TouchableOpacity
            onPress={props?.notvisible}
            style={{alignSelf: 'flex-end', right: 20, top: 20}}>
            <MaterialCommunityIcons
              name="close-thick"
              color={Colors.BLACK}
              size={20}
            />
          </TouchableOpacity>

          {/* <TextComponent
            text={props?.title}
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              paddingTop: 10,
            }}
          />
          <TextComponent
            text={props?.description}
            style={{textAlign: 'center'}}
          /> */}
          <Text style={{fontWeight: 'bold', fontSize: 18, paddingTop: 10}}>
            {props?.title}
          </Text>
          <Text style={{textAlign: 'center'}}>{props?.description}</Text>

          {/* <TextComponent text={'Email'} style={style.TextInputHeader} /> */}
          <Text style={style.TextInputHeader}>Password</Text>
          <View style={style.InputView}>
            <Input
              value={password}
              placeholder={'***********'}
              placeholderTextColor={Colors.GRAY}
              onChangeText={text => setPassword(text)}
              icon={'lock-closed'}
              icon1={'eye'}
              eye={true}
              secure={true}
            />
          </View>

          <Text style={style.TextInputHeader}>Confirm Password</Text>
          <View style={style.InputView}>
            <Input
              value={confirmPassword}
              placeholder={'***********'}
              placeholderTextColor={Colors.GRAY}
              onChangeText={text => setConfirmPassword(text)}
              icon={'lock-closed'}
              icon1={'eye'}
              eye={true}
              secure={true}
            />
          </View>

          <SubmitButton text={'Reset Password'} onPress={()=>props?.onPress(password,confirmPassword)} />
        </View>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  Main_Container: {
    flex: 1,
    backgroundColor: Colors.RGBA_BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Sub_Container: {
    backgroundColor: Colors.WHITE,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    paddingBottom: 20,
  },
  InputView: {
    color: '#000',
    width: '100%',
    marginBottom: 15,
  },
  TextInputHeader: {
    width: '90%',
    paddingLeft: 20,
    fontWeight: 'bold',
    paddingBottom: 5,
    paddingTop: 10,
  },
});

export default EnterNewPassword;
