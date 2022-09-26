import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React from 'react';
import Header from '../../../components/Header';
import Terms from '../../../assets/driver/termsandconditions.png';
import TextComponent from '../../../components/TextComponent';
import SimpleHeader from '../../../components/SimpleHeader';
import { Colors } from '../../../Styles';
import { useSelector } from 'react-redux';

const TermsAndCondtions = () => {

  const content = useSelector(state => state.General.content);

  return (
    <View style={styles.mainContainer}>
      <Header
        headerLeft={true}
        title={'Terms and conditions'}
      />
      <ScrollView>
      <View style={styles.img__View}>
        <Image style={styles.img} source={Terms} />
      </View>
      <View style={styles.None_View}>
        <TextComponent
          style={{ color: Colors.BLACK }}
          text={content.termsCondition}
        />
      </View>
      </ScrollView>
    </View>
  );
};

export default TermsAndCondtions;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  img__View: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  img: {
    resizeMode: 'contain',
    height: 300,
    width: 300,
  },
  None_View: {
    width: '80%',
    alignSelf: 'center',
  },
});
