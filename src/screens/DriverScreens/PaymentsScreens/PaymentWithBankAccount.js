import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Header from '../../../components/Header';
import TextComponent from '../../../components/TextComponent';
import { Colors } from '../../../Styles';
import { useSelector } from 'react-redux';

const PaymentWithBankAccount = () => {
  const content = useSelector(state => state.General.payment_content)
  return (
    <View style={styles.mainContainer}>
      <Header
        title={'Payment with Bank'}
        headerRight={true}
        headerLeft={true}
      />
      <View style={styles.width__center}>
        <TextComponent
          text={content.bank_payment}
        />
      </View>
    </View>
  );
};

export default PaymentWithBankAccount;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  width__center: {
    width: '85%',
    alignSelf: 'center',
    marginVertical: 20,
  },
});
