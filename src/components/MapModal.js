import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, Dimensions, Image, Platform, ActivityIndicator } from 'react-native';
import { Colors } from '../Styles';
import { useNavigation } from '@react-navigation/native';
import Car from '../assets/rider/CarMarker.png';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import TextComponent from './TextComponent';
import { getCurrentAddress } from '../configs/AxiosConfig'

const MapModal = props => {
    useEffect(() => {
        currentLocation()
    }, [])

    const navigation = useNavigation()
    const [selectedDate, setselectedDate] = useState(moment().format('YYYY-MM-DD'))
    const Today = moment().format('YYYY-MM-DD')
    const [region, setregion] = useState()

    const currentLocation = () => {
        const getLocation = () => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setregion({
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.033274563211676025,
                        longitudeDelta: 0.032282180190086365,

                    })
                },
                error => {
                    console.log("Response---->", error);
                },
                {
                    enableHighAccuracy: false,
                    distanceFilter: 0,
                    interval: 1000,
                    fastestInterval: 2000,
                },
            );
        }

        if (Platform.OS == 'android') {
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                interval: 10000,
                fastInterval: 5000,
            })
                .then(data => {
                    getLocation();
                })
                .catch(err => {
                    console.log(err);
                });
        } else if (Platform.OS == 'ios') {
            getLocation()
        }
    }

    return (
        <Modal animationType="fade" transparent={true} visible={props?.visible}>
            <View style={styles.Main_Container}>
                <View style={styles.Sub_Container}>

                    <View style={{ height: 400, marginTop: 10, justifyContent: 'center' }}>
                        {region ? <>
                            <TextComponent
                                text={'Pick Location'}
                                style={styles.Heading_Style}
                            />

                            <MapView
                                provider={PROVIDER_GOOGLE}
                                // showsUserLocation={true}
                                initialRegion={region}
                                style={styles.map}
                                onRegionChangeComplete={(region) => props?.getLocation(region)}
                            >
                            </MapView>
                            <View style={{ position: "absolute", top: "42.5%", left: "41%" }}>
                                <Image
                                    source={Car}
                                    style={{ width: 50, height: 50, resizeMode: 'contain' }}
                                />
                            </View>
                        </>
                            : <ActivityIndicator size={'large'} color={Colors.BLACK} />}
                    </View>

                    <View style={styles.Button_Main_View}>
                        <TouchableOpacity
                            onPress={props?.notvisible}
                            style={styles.Button_Sub_View_Style}>
                            <Text style={{ color: Colors.WHITE, fontWeight: 'bold' }}>Add</Text>
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
        // position: 'absolute'
    },
    Button_Main_View: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginHorizontal: 30,
        marginVertical: 10
    },
    Button_Sub_View_Style: {
        borderWidth: 1,
        backgroundColor: Colors.BLUE,
        borderRadius: 7,
        padding: 5,
        width: 80,
        marginRight: 10,
        alignItems: 'center'
    },
    map: {
        // position: "absolute",
        width: Dimensions.get("window").width * 0.88,
        height: 350,
        flex: 1,
    },
    Heading_Style: {
        fontWeight: 'bold',
        // marginLeft: 20,
        textAlign: 'center',
        fontSize: 18
    },
});

export default MapModal;