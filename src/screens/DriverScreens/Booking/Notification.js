import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import TextComponent from '../../../components/TextComponent'
import { Colors } from '../../../Styles'
import { useDispatch, useSelector } from 'react-redux'
import { RideMiddleware } from '../../../redux/Middlewares/RideMiddleware'
import { APIs } from '../../../configs/APIs'
import moment from 'moment'

export default function Notification() {

  const dispatch = useDispatch();
  const notifications = useSelector(state => state.Ride.notifications)
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation()

  useEffect(() => {
    dispatch(RideMiddleware.getNotifications({
      next_page_url: APIs.Notification
    }))
  }, [])

  const renderNotificationList = ({ item }) => {

    return (
      <View style={{ backgroundColor: Colors.WHITE, marginVertical: 5, width: '90%', alignSelf: 'center', borderRadius: 10, elevation: 2, flexDirection: 'row', alignItems: 'center', padding: 12, justifyContent: 'space-between' }}>
        <View style={{ backgroundColor: item?.status ? Colors.ORANGE : Colors.LIGHT_GRAY_1, height: 10, width: 10, borderRadius: 5 }} />
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <TextComponent
            text={item?.title}
            style={{ fontWeight: 'bold', fontSize: 18 }}
          />
          <Text style={{ color: Colors.GRAY }}>{item?.body}</Text>
        </View>
        <Text style={{ color: Colors.GRAY }}>{moment(item?.created_at).format('LTS')}</Text>
      </View>
    )

  }

  const onEndReached = () => {
    if (notifications?.next_page_url) {
      dispatch(RideMiddleware.getNotifications({
        next_page_url: notifications?.next_page_url
      }))
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    dispatch(RideMiddleware.getNotifications({
      next_page_url: APIs.Notification
    }))
    setRefreshing(false)
  }

  return (
    <FlatList
      style={{ marginTop: 5 }}
      data={notifications?.data}
      keyExtractor={item => item?.id}
      renderItem={renderNotificationList}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  )
}

const styles = StyleSheet.create({})