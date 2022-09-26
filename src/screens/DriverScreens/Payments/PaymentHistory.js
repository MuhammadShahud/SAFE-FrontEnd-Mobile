import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import TextComponent from '../../../components/TextComponent';
import { PaymentMiddleware } from '../../../redux/Middlewares/PaymentMiddleware';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const PaymentHistory = () => {
  const [refreshing, setrefreshing] = useState(false)
  const [loader, setloader] = useState(true)
  const navigation = useNavigation();


  const history = useSelector((state) => state.Payment.paymentHistory)
  const dispatch = useDispatch()

  useEffect(() => {
    setloader(true)
    dispatch(PaymentMiddleware.getPaymentHistory())
      .then(() => setloader(false))
      .catch(() => setloader(false))
  }, [])

  const onRefresh = () => {
    setrefreshing(true)
    dispatch(PaymentMiddleware.getPaymentHistory())
    setrefreshing(false)
  }

  const renderUserList = ({ item }) => {
    return (
      <View style={styles.Before_After_Main_View_Style}>
        <TextComponent style={styles.name} text={item?.rider.first_name + " " + item?.rider.last_name} />
        <View style={[styles.direction, { width: '90%' }]}>
          <TextComponent style={styles.font} text={'Account title'} />
          <TextComponent style={styles.font} text={'Account Number'} />
        </View>
        <View style={styles.direction}>
          <Text style={styles.silver}>{item?.payment_method?.title ? item?.payment_method?.title : "No title available"}</Text>
          <Text style={styles.silver}>{item?.payment_method?.number?.toString().substr(0, 4) + "**************"}</Text>
        </View>
        <View style={styles.dates__new}>
          <View style={[styles.btw, { marginVertical: 4 }]}>
            <TextComponent style={styles.font} text={'Date'} />
            <TextComponent style={styles.font} text={'Total'} />
          </View>
          <View style={styles.btw}>
            <Text style={styles.silver}>{moment(item?.created_at).format('ll')}</Text>
            <Text style={styles.big}>{item?.total_amount}$</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Header title={'Payment History'} headerRight={true} headerLeft={true} />
      {!loader ?
        <FlatList
          data={history}
          keyExtractor={id => id?.id}
          renderItem={renderUserList}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: Colors.LIGHT_GRAY }}>Payments not found</Text>
            </View>
          }
        />
        :
        <ActivityIndicator size={'large'} color={Colors.BLACK} />
      }
    </View>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  Before_After_Main_View_Style: {
    width: '85%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    padding: 10,
    marginVertical: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 15,
    marginHorizontal: 10,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  silver: {
    color: '#808080',
    fontSize: 12,
  },
  font: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  btw: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  big: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dates__new: {
    width: '78%',
    alignSelf: 'center',
  },
});
