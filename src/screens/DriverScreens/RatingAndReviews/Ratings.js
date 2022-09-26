import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../../Styles';
import Header from '../../../components/Header';
import TextComponent from '../../../components/TextComponent';
import Ladies from '../../../assets/driver/ladies.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from 'react-native-stars';
import person from '../../../assets/driver/Person2.png';
import { GeneralMiddleware } from '../../../redux/Middlewares/GeneralMiddleware';
import { APIs } from '../../../configs/APIs';
import { useDispatch, useSelector } from 'react-redux';

const Ratings = () => {
  const [UserList, setUserList] = useState([
    {
      id: '1',
      name: 'John Dave',
      aTitle: 'Peter Boss',
      accountNumber: '1233**** ******* ********',
      Image: person,
    },
    {
      id: '2',
      name: 'Stacy Doe',
      aTitle: 'Steven Herb',
      accountNumber: '1233**** ******* ********',
      Image: Ladies,
    },
    {
      id: '3',
      name: 'Alex John',
      aTitle: 'Peter Boss',
      accountNumber: '1233**** ******* ********',
      Image: person,
    },
    {
      id: '4',
      name: 'Stacy Doe',
      aTitle: 'Steven Herb',
      accountNumber: '1233**** ******* ********',
      Image: Ladies,
    },
    {
      id: '5',
      name: 'Alex John',
      aTitle: 'Peter Boss',
      accountNumber: '1233**** ******* ********',
      Image: person,
    },
  ]);

  const dispatch = useDispatch();
  const ratings = useSelector(state => state.General.ratings)
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(GeneralMiddleware.getRatings({
      next_page_url: APIs.RatingAndReviews
    }))
  }, [])

  const renderUserList = ({ item }) => {
    return (
      <View style={styles.Before_After_Main_View_Style}>
        <View style={styles.pad}>
          <View style={{ flexDirection: 'row' }}>
            <Image style={styles.logologo} source={item?.from_user?.image} />
            <Text style={styles.txt}>{item?.from_user?.username}</Text>
          </View>
          <View>
            <TextComponent style={styles.Dollars} text={"$" + item?.ride?.estimated_price} />
          </View>
        </View>
        <View style={{ width: '70%', alignSelf: 'center' }}>
          <View style={styles.direction}>
            <Ionicons
              color={Colors.BLUE}
              name="cloud-circle-outline"
              size={20}
            />
            <TextComponent
              style={{ fontSize: 12 }}
              text={item?.ride?.ride_locations[0]?.address}
            />
          </View>
          <View style={styles.direction}>
            <Ionicons color={Colors.BLUE} name="location" size={20} />
            <TextComponent
              style={{ fontSize: 12 }}
              text={item?.ride?.ride_locations[item?.ride?.ride_locations.length - 1].address}
            />
          </View>
          <View style={{ marginRight: 100, marginVertical: 5 }}>
            <Stars
              default={item?.rating}
              count={5}
              disabled={false}
              fullStar={
                <Ionicons
                  name={'star'}
                  style={[styles.myStarStyle]}
                  size={20}
                />
              }
              emptyStar={
                <Ionicons
                  name={'star-outline'}
                  style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                  size={20}
                />
              }
              halfStar={
                <Ionicons
                  name={'star-half'}
                  style={[styles.myStarStyle]}
                  size={20}
                />
              }
            />
          </View>
        </View>
      </View>

    );
  };

  const onEndReached = () => {
    if (ratings?.next_page_url) {
      dispatch(GeneralMiddleware.getRatings({
        next_page_url: ratings?.next_page_url
      }))
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    dispatch(GeneralMiddleware.getRatings({
      next_page_url: APIs.RatingAndReviews
    }))
    setRefreshing(false)
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <Header title={'Ratings'} headerRight={true} headerLeft={true} />
        <FlatList
          data={ratings?.data}
          keyExtractor={item => item?.id}
          renderItem={renderUserList}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </ScrollView>
    </View>
  );
};

export default Ratings;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  Before_After_Main_View_Style: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 5,
    padding: 5,
  },
  pad: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.BLUE,
  },
  logologo: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  Dollars: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  direction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myStarStyle: {
    color: '#f7b82c',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: 'white',
  },
});
