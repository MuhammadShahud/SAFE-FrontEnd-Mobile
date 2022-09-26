import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import { Colors } from '../../../Styles'
import Header from '../../../components/Header'
import SubHeader from '../../../components/SubHeader'
import { useNavigation } from '@react-navigation/native'
import BookingRequest from './BookingRequest'
import Notification from './Notification'

 const DriverBookingNotification = () => {

    const navigation = useNavigation();
    const [SelectedIndex, setSelectedIndex] = useState(0)
    const [SelectedItem, setSelectedItem] = useState('Booking Requests');
    const [hideNotification, sethideNotification] = useState(false)
    const [HeaderList, setHeaderList] = useState(['Booking Requests' ,'Notifications'])

    const getComponent = (name) => {
        switch (name) {
            case "Booking Requests":
                return <BookingRequest/>
            case "Notifications":
                return <Notification />
            default:
                break;
        }
    }

  return (
    <View style={styles.Main_Container}>
    <Header
      headerRight={true}
      headerLeft={true}
      title={SelectedItem}
      isNotificationHide={true}
    //   isNotificationHide={hideNotification}
    />
    <SubHeader
        onPress={(item, ind) => {
            if(item == 'Notifications'){
                sethideNotification(true)
            }
            else{
                sethideNotification(false)
            }
                setSelectedItem(item)
                setSelectedIndex(ind)
            }}
        index={SelectedIndex}
        list={HeaderList}
    />
    {
        getComponent(SelectedItem)
    }

    </View>
  )
}

const styles = StyleSheet.create({
    Main_Container : {
        flex: 1,
        backgroundColor: Colors.WHITE
      },
})

export default DriverBookingNotification;