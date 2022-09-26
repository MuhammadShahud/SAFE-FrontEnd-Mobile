import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import ChatHeader from '../../../components/ChatHeader';
import ChatTextInput from '../../../components/ChatTextInput';
import { Colors } from '../../../Styles';
import TextComponent from '../../../components/TextComponent';
import person3 from '../../../assets/driver/person1.png';
import Ladies from '../../../assets/driver/ladies.png';
import { ChatMiddleware } from '../../../redux/Middlewares/ChatMiddleware'
import { useDispatch, useSelector } from 'react-redux'
import { APIs, img_url } from '../../../configs/APIs'
import moment from 'moment';
import Pusher from 'pusher-js/react-native';
import ChatActions from '../../../redux/Actions/ChatActions';
import ImagePicker from 'react-native-image-crop-picker';



const ChatMessage = (props) => {
  const navigation = useNavigation();
  const chat_list_id = props?.route?.params?.chat_list_id;
  const userDetails = props?.route?.params?.userDetails;
  // const chat_list_id = 2

  // const userDetails = {
  //   name: "John",
  //   phone: 29173987
  // }
  const dispatch = useDispatch()
  const Chatmessages = useSelector((state) => state.Chat.chatMessages)
  const PaginatedObj = useSelector((state) => state.Chat.chatPagination)
  const user = useSelector((state) => state.Auth.user)

  const [name, setName] = useState('Ebony');
  const [phonenumber, setPhoneNumber] = useState('Ebony');
  const [message, setmessage] = useState('')
  const [sendMessage, setsendMessage] = useState(false)

  const chatchannel = useRef(null)

  useEffect(() => {
    fetch()
    initiatePusher()
    return () => {
      if (chatchannel?.current) {
        chatchannel?.current?.unsubscribe()
      }
    }
  }, [chat_list_id])


  const initiatePusher = () => {
    let pusher = new Pusher('ba024c85e694c4822cf6', { cluster: 'ap2' });
    chatchannel.current = pusher.subscribe(chat_list_id?.toString());
    chatchannel.current.bind('App\\Events\\Message', data => {
      if (chat_list_id == data?.ride_id) {
        setmessage('')
        setsendMessage(false)
        dispatch(ChatActions.updateChat(data?.data))
      }
    });
  }

  const renderChat = ({ item }) => {
    if (item?.from_user?.id == user?.user?.id) {
      return (
        <View style={style.To_User_Chat_Container}>
          <Image
            source={item?.from_user?.image ? { uri: img_url + item?.from_user?.image } : person3}
            style={style.User_Image_Style}
          />
          <View style={{ width: '75%' }}>
            {item?.type == 'text' ?
              <TextComponent
                text={item?.message}
                style={{
                  textAlign: 'right',
                  marginHorizontal: 10,
                  padding: 12,
                  borderColor: Colors.PURPLE,
                  borderWidth: 1,
                  borderRadius: 10,
                }}
              /> :
              item?.type == 'image' ?
                <Image
                  source={{ uri: img_url + item?.messages_files[0].name }}
                  style={{
                    height: 150,
                    width: 150,
                    alignSelf: 'flex-end',
                    marginHorizontal: 10,
                    padding: 12,
                    borderColor: Colors.PURPLE,
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                />

                : null}
            <Text style={{ paddingVertical: 10, color: Colors.LIGHT_GRAY_1 }}>
              {moment(item?.created_at).format('LT')}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={style.From_User_Chat_Container}>
          <Image
            source={item?.from_user?.image ? { uri: img_url + item?.from_user?.image } : person3}
            style={style.User_Image_Style}
          />

          <View style={{ width: '75%' }}>
            {item?.type == 'text' ?
              <Text
                style={{
                  textAlign: 'left',
                  marginHorizontal: 10,
                  padding: 12,
                  borderColor: Colors.BLUE,
                  backgroundColor: Colors.BLUE,
                  borderRadius: 10,
                  color: Colors.WHITE,
                }}>
                {item.message}
              </Text>
              :
              item?.type == 'image' ?
                <Image
                  source={{ uri: img_url + item?.messages_files[0].name }}
                  style={{
                    height: 150,
                    width: 150,
                    alignSelf: 'flex-start',
                    marginHorizontal: 10,
                    padding: 12,
                    borderColor: Colors.BLUE,
                    backgroundColor: Colors.BLUE,
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                />

                : null}
            <Text
              style={{
                paddingVertical: 10,
                textAlign: 'right',
              }}>
              {moment(item?.created_at).format('LT')}
            </Text>
          </View>
        </View>
      );
    }
  };

  const fetch = () => {
    const data = {
      chat_list_id: chat_list_id,
      url: APIs.chatMessages
    }
    dispatch(ChatMiddleware.chatMessages(data))
  }

  const sendMessages = () => {
    const data = {
      ride_id: chat_list_id,
      user_id: userDetails?.id,
      type: 'text',
      message: message,
      file: ''
    }
    setsendMessage(true)
    dispatch(ChatMiddleware.sendMessage(data))
      .then(() => { setmessage(''), setsendMessage(false) })
      .catch(() => setsendMessage(false))

  }

  const OnEndReached = () => {
    const data = {
      chat_list_id: chat_list_id,
      url: PaginatedObj?.links?.next
    }
    if (PaginatedObj?.links?.next) {
      dispatch(ChatMiddleware.chatMessages(data))
    }
  }

  const pickImageProfile = () => {
    Alert.alert("Select Option", "Where do you want to pick image from", [{
      text: "Cancel",
    }, {
      text: "Camera",
      onPress: () => {
        ImagePicker.openCamera({
          compressImageQuality: 0.8,
          mediaType: "photo",
        }).then((image) => {
          let nameArr = image.path.split("/");
          let Pname = nameArr[nameArr.length - 1]
          let name = image.filename ? image.filename : Pname;
          let img = {
            name,
            size: image.size,
            type: image.mime,
            uri: image.path
          }
          UploadImage(img)
        })
      }
    }, {
      text: "Library",
      onPress: () => {
        ImagePicker.openPicker({
          compressImageQuality: 0.8,
          mediaType: "photo",
        }).then((image) => {
          let nameArr = image.path.split("/");
          let Pname = nameArr[nameArr.length - 1]
          let name = image.filename ? image.filename : Pname;
          let img = {
            name,
            size: image.size,
            type: image.mime,
            uri: image.path
          }
          UploadImage(img)
        })
      }
    }])
  }

  const UploadImage = (img) => {
    setmessage(img.name)
    const data = {
      ride_id: chat_list_id,
      user_id: userDetails?.id,
      type: 'image',
      message: '',
      file: img
    }
    setsendMessage(true)
    dispatch(ChatMiddleware.sendMessage(data))
      .then(() => { setmessage(''), setsendMessage(false) })
      .catch(() => { setsendMessage(false), setmessage('') })

  }

  return (
    <View style={style.Main_Container}>
      <ChatHeader image={userDetails?.image ? { uri: img_url + userDetails?.image } : person3} name={userDetails?.first_name} phone={userDetails.phone} />
      {PaginatedObj ?
        <FlatList
          data={Chatmessages}
          keyExtractor={(item, index) => item?.id}
          renderItem={renderChat}
          inverted={Chatmessages.length > 0 ? true : false}
          onEndReachedThreshold={0.6}
          onEndReached={() => OnEndReached()}
        />
        :
        <View style={{ flex: 1 }}>
          <ActivityIndicator size={'large'} color={Colors.BLACK} />
        </View>}

      <ChatTextInput
        value={message}
        onChangeText={(text) => setmessage(text)}
        onPressSendMessage={() => sendMessages()}
        onPressAttachment={() => pickImageProfile()}
        isMessage={sendMessage}
      />
    </View>
  );
};

const style = StyleSheet.create({
  Main_Container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  To_User_Chat_Container: {
    width: '95%',
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
    marginTop: 7,
    marginLeft: 10,
  },
  From_User_Chat_Container: {
    width: '95%',
    flexDirection: 'row',
    marginTop: 7,
    marginLeft: 10,
  },
  User_Image_Style: {
    height: 50,
    width: 50,
    borderRadius: 25,
    resizeMode: 'contain',
  },
});

export default ChatMessage;
