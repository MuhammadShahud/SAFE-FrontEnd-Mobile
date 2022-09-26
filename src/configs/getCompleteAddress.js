import { Platform } from 'react-native'

import Geocoder from 'react-native-geocoder';
import { GOOGLE_MAPS_APIKEY } from './APIs'

import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';


Geocoder.fallbackToGoogle(GOOGLE_MAPS_APIKEY);

export const getCompleteAddress = async (lat, long) => {
    try {
        let position = {
            lat: lat,
            lng: long
        }
        let res = await Geocoder.geocodePosition(position)
        if (res) {
            position = { ...position, Address: res[0]?.formattedAddress }
            return position;
        }

    } catch (error) {

    }
}

export const currentLocation = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const getLocation = () => {
                Geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        let response = null;
                        getCompleteAddress(latitude, longitude).then(
                            data => {
                                response = {
                                    ...data,
                                    latitude: latitude,
                                    longitude: longitude
                                }
                                resolve(response)
                            }
                        ).catch()

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
        } catch (error) {

        }
    })

}

