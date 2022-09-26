import { StyleSheet, ScrollView, View, Image } from 'react-native';
import React from 'react';
import Header from '../../../components/Header';
import Privacy from '../../../assets/driver/privacy.png';
import TextComponent from '../../../components/TextComponent';
import SimpleHeader from '../../../components/SimpleHeader';
import { Colors } from '../../../Styles';
import { useSelector } from 'react-redux';

const PrivacyPolicy = () => {
  const content = useSelector(state => state.General.content);

  return (
    <View style={styles.mainContainer}>
      <Header
        headerLeft={true}
        title={'Privacy Policy'}
      />
      <ScrollView>
      <View style={styles.img__View}>
        <Image style={styles.img} source={Privacy} />
      </View>
      <View style={styles.None_View}>
        {/* <TextComponent
          style={{color: Colors.WHITE}}
          text={
            'All you need to do is fill up the blank spaces and then you will receive an email with your personalized terms and conditions.'
          }
        /> */}
        <TextComponent
          style={{ color: Colors.BLACK }}
          text={content.privacyPolicy}
        />
      </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

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
