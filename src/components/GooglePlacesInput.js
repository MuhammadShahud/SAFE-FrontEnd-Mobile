import React, { useState, useRef } from 'react'
import { View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../Styles';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from '../configs/APIs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SubmitButton from './SubmitButton';


export default function GooglePlacesInput(props) {
    return (
        <Modal animationType="fade" transparent={true} visible={props?.visible}>
            <View style={styles.Main_Container}>
                <View style={styles.Sub_Container}>
                    <TouchableOpacity
                        onPress={props?.notvisible}
                        style={{ alignSelf: 'flex-end', right: 20, top: 10 }}>
                        <MaterialCommunityIcons
                            name="close-thick"
                            color={Colors.BLUE}
                            size={20}
                        />
                    </TouchableOpacity>
                    <View style={{ marginHorizontal: 10 }} >
                        <Text style={{ fontSize: 16, color: Colors.BLACK, fontWeight: 'bold', marginVertical: 10 }}>Add Location</Text>
                        <GooglePlacesAutocomplete
                            ref={props?.ref}
                            textInputProps={{
                                placeholderTextColor: '#fff',
                            }}
                            GooglePlacesDetailsQuery={{ fields: "geometry" }}
                            placeholder={props?.placeholder}
                            onPress={(data, details = null) => props?.Onpress(props?.index, data, details?.geometry?.location)}
                            // onPress={(data, details = null) => {
                            //     // 'details' is provided when fetchDetails = true
                            //     console.log(data, details?.geometry?.location?.lat);
                            // }}
                            styles={{
                                textInputContainer: { color: Colors.WHITE },
                                textInput: styles.TextStyle
                            }}
                            fetchDetails={true}

                            query={{
                                key: GOOGLE_MAPS_APIKEY,
                                language: 'en',
                            }}
                        />
                        <TouchableOpacity style={{
                            height: 35,
                            width: 70,
                            backgroundColor: Colors.BLUE,
                            alignSelf: 'center',
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                            onPress={props?.notvisible}
                        >
                            <Text style={{ fontSize: 12, color: Colors.WHITE }}>Confirm</Text>

                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

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
        // alignItems: 'center',
        position: 'absolute',
        paddingBottom: 30
    },
    Description_Style: {
        textAlign: 'center',
        paddingVertical: 25,
        fontWeight: 'bold',
        fontSize: 20,
    },
    Button_Style: {
        backgroundColor: Colors.BLUE,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
    },
    Button_Style_Text: {
        color: Colors.WHITE_2,
        paddingHorizontal: 5,
        fontWeight: 'bold',
    },

    TextStyle: {
        backgroundColor: Colors.BLUE,
        borderRadius: 10,
        paddingHorizontal: 15,
        width: '80%',
        fontSize: 11,
        color: Colors.WHITE
    }
});