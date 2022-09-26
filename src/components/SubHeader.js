import { useNavigation } from '@react-navigation/native'
import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../Styles';


const SubHeader = props => {

    const navigation = useNavigation();

    return(

        <View style={style.HeaderList_Style}>
      {
        props?.list.map((item, index)=>{
              return(
                  <TouchableOpacity
                  onPress={()=>props?.onPress(item, index)}
                  style={{backgroundColor : index === props?.index ? Colors.BLUE : Colors.WHITE, flex: 1, height: 50, borderRadius: 12, justifyContent: 'center'}}
                  >
                      <Text style={[style.HeaderList_Text_Style,{color : index === props?.index ? Colors.WHITE : Colors.BLUE }]}>{item}</Text>
                  </TouchableOpacity>
                    )
          })
      }
      </View>

    )

}


const style = StyleSheet.create({
    HeaderList_Style: {
        backgroundColor: Colors.WHITE,
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 12,
        justifyContent: 'space-evenly',
        elevation: 5
    },
    HeaderList_Text_Style: {
        fontWeight: 'bold',
        fontSize: 13,
        borderBottomColor: Colors.ORANGE,
        padding: 5,
        textAlign: 'center',
    },
  })

export default SubHeader;
