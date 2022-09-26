import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextComponent from './TextComponent';

const Search = () => {
  return (
    <View style={style.Main_Container}>
      <View style={style.Filter_View_Style}>
        <TouchableOpacity style={[style.Filter_Button_Style, {width: '30%'}]}>
          <Text style={style.Text_Style}>Date From</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[style.Filter_Button_Style, {width: '30%'}]}>
          <Text style={style.Text_Style}>Date To</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[style.Filter_Button_Style, {width: '35%'}]}>
          <Text style={style.Text_Style}>Location</Text>
        </TouchableOpacity>
      </View>

      <View style={style.Search_Container_Style}>
        <MaterialIcons name="search" color={Colors.BLACK} size={17} />

        <TextComponent text={'Search'} style={style.Search_Text_Style} />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  Main_Container: {
    backgroundColor: Colors.WHITE,
    width: '90%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: Colors.ORANGE,
  },
  Filter_View_Style: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  Filter_Button_Style: {
    borderColor: Colors.LIGHT_GRAY_1,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 5,
    paddingVertical: 5,
  },
  Text_Style: {
    color: Colors.LIGHT_GRAY_1,
  },
  Search_Container_Style: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Search_Text_Style: {
    paddingLeft: 5,
  },
});

export default Search;
