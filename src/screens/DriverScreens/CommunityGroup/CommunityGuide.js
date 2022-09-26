import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import Community from '../../../assets/driver/community.png';
import TextComponent from '../../../components/TextComponent';
import { useSelector } from 'react-redux';

const CommunityGuide = () => {

  const content = useSelector(state => state.General.content)

  return (
    <View style={styles.mainContainer}>
      <Header title={'Community Group'} headerRight={true} headerLeft={true} />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.pad}>
          <Image style={styles.img} source={Community} />
        </View>
        <TextComponent
          style={styles.heading}
          text={"SAFE's Community Guideline"}
        />
        <View style={styles.wid}>
          <TextComponent
            text={content.communityGroup}
          />
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default CommunityGuide;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  pad: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 310,
  },
  img: {
    width: 250,
    height: 250,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  wid: {
    width: '80%',
    alignSelf: 'center',
  },
});
