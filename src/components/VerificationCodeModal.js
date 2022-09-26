import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../Styles';
import SubmitButton from './SubmitButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OTPTextInput from 'react-native-otp-textinput';
import TextComponent from './TextComponent';

const VerificationCodeModal = props => {
  const [Code, setCode] = useState('');

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
              color: '#000',
              fontWeight: 'bold',
              fontSize: 18,
              paddingTop: 10,
            }}
          />
          <TextComponent
            text={props?.description}
            style={{color: '#000', textAlign: 'center'}}
          /> */}

          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: 18,
              paddingTop: 10,
            }}>
            {props?.title}
          </Text>
          <Text style={{color: '#000', textAlign: 'center'}}>
            {props?.description}
          </Text>

          <OTPTextInput
            defaultValue={Code}
            handleTextChange={val => setCode(val)}
            inputCount={4}
            inputCellLength={1}
            tintColor={Colors.BLUE}
            offTintColor={Colors.LIGHT_GRAY_1}
            containerStyle={{
              marginBottom: 20,
              marginTop: 20,
            }}
            textInputStyle={{
              borderWidth: 1,
              borderColor: Colors.BLUE,
              borderRadius: 10,
              color: Colors.BLACK,
            }}
          />

          <SubmitButton
            text={'Verify'}
            onPress={()=>props?.onPress(Code)}
            icon={true}
            iconname={'check-circle'}
          />
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
});

export default VerificationCodeModal;
