import React, {useState} from 'react';
import {View, Modal, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Colors} from '../Styles';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const CalendarModal = props => {

  const navigation = useNavigation()
  const [selectedDate, setselectedDate] = useState(moment().format('YYYY-MM-DD'))
  const Today = moment().format('YYYY-MM-DD')
  return (
    <Modal animationType="fade" transparent={true} visible={props?.visible}>
      <View style={styles.Main_Container}>
        <View style={styles.Sub_Container}>
          
            <Calendar
            initialDate={moment().format('YYYY-MM-DD')}
            minDate={moment().format('YYYY-MM-DD')}
            onDayPress={day => {
              props?.onDayPress(day)
                // console.log('selected day', day.dateString);
                setselectedDate(day.dateString)
            }}
            renderArrow={direction => 
            direction == 'right' ? 
            <MaterialCommunityIcons name='chevron-right' size={20} color={Colors.BLACK}/> 
            : 
            <MaterialCommunityIcons name='chevron-left' size={20} color={Colors.BLACK}/>}
            onPressArrowLeft={subtractMonth => subtractMonth()}
            onPressArrowRight={addMonth => addMonth()}
            disableAllTouchEventsForDisabledDays={true}
            markedDates={{
                [Today] : {selected: true, selectedColor: Colors.BLUE},
                [selectedDate] : {selected: true, selectedColor: Colors.BLUE},
            }}
            />

            <View style={styles.Button_Main_View}>
                <TouchableOpacity 
                onPress={props?.notvisible}
                style={styles.Button_Sub_View_Style}>
                    <Text style={{color: Colors.BLUE, fontWeight: 'bold'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={props?.onPressOk}
                style={[styles.Button_Sub_View_Style,{backgroundColor: Colors.BLUE}]}>
                    <Text style={{color: Colors.WHITE_2, fontWeight: 'bold'}}>OK</Text>
                </TouchableOpacity>
            </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  Main_Container: {
    flex: 1,
    backgroundColor: Colors.RGBA_BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Sub_Container: {
    backgroundColor: Colors.WHITE,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    paddingBottom: 20,
    position: 'absolute'
  },
  Button_Main_View: {
    flexDirection: 'row', 
    alignSelf: 'flex-end', 
    marginHorizontal: 30, 
    marginVertical: 10
  },
  Button_Sub_View_Style: {
    borderWidth: 1, 
    borderColor: Colors.BLUE, 
    borderRadius: 7, 
    padding: 5, 
    width: 80, 
    marginRight: 10, 
    alignItems: 'center'
  }
});

export default CalendarModal;