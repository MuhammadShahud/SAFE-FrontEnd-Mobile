import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../Styles'
import DashedLine from 'react-native-dashed-line'
import { FlatList } from 'react-native-gesture-handler'
import SelectDropdown from 'react-native-select-dropdown'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import GooglePlacesInput from './GooglePlacesInput';

import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import TextComponent from './TextComponent';
import { getCompleteAddress } from '../configs/getCompleteAddress'

const WhereToModal = (props) => {

    useEffect(() => {
        currentLocation()
    }, [])


    const [WhereTo, setWhereTo] = useState('')
    const [DropOff, setDropOff] = useState('')
    const [DropOffList, setDropOffList] = useState(['1'])
    const [Refresh, setRefresh] = useState(false)
    const StatusList = ['Child Name', 'Peter', 'John'];
    const [isModal, setisModal] = useState(false)
    const [id, setid] = useState()

    const [Address, setAddress] = useState()

    const currentLocation = () => {
        const getLocation = () => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    getCompleteAddress(latitude, longitude).then(
                        data => setAddress(data)
                    )
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
    const addAddress = (index, data, detail) => {
        let response = {
            id: index,
            lat: detail?.lat,
            lng: detail?.lng,
            Address: data?.description
        }
        if (index != 'Current') {
            let list = [...DropOffList]
            list.splice(index, 1, response)
            setDropOffList(list)
        } else {
            setAddress(response)
        }
    }

    const renderDropOffList = ({ item, index }) => {
        return (
            <View>

                <View style={{ width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>

                    <MaterialCommunityIcons name='map-marker' color={(index < DropOffList.length - 1) ? Colors.BLUE : Colors.ORANGE} size={25} />

                    <View style={{ flex: 1 }}>

                        <TouchableOpacity style={styles.TextInput_Style} onPress={() => { setisModal(true), setid(index) }}>
                            <TextComponent style={{ color: Colors.LIGHT_GRAY_1, fontSize: 12 }} text={item?.Address ? item?.Address : 'Enter Drop-off Location'} />
                        </TouchableOpacity>


                        {/* <TextInput
                            value={DropOff}
                            placeholder='Enter Drop-off Location'
                            placeholderTextColor={Colors.BLACK}
                            onChangeText={(val) => setDropOff(val)}
                            style={styles.TextInput_Style}
                        /> */}
                        {(index < DropOffList.length - 1) ?
                            <TouchableOpacity
                                onPress={() => {
                                    DropOffList.splice(index, 1)
                                    setRefresh(!Refresh)
                                }}
                                style={[styles.TextInput_Style_Button, { borderRadius: 15 }]}>
                                <MaterialCommunityIcons name='close' color={Colors.WHITE_2} size={25} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => {
                                    DropOffList.push('1')
                                    setRefresh(!Refresh)
                                }}
                                style={[styles.TextInput_Style_Button, { borderRadius: 7 }]}>
                                <MaterialCommunityIcons name='plus' color={Colors.WHITE_2} size={25} />
                            </TouchableOpacity>
                        }
                    </View>

                    {props?.hideDropDown == 'Children' ? <SelectDropdown
                        data={StatusList}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                        }}
                        defaultValue={'Child Name'}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item;
                        }}
                        buttonStyle={{
                            backgroundColor: Colors.LIGHT_GRAY_2,
                            borderRadius: 10,
                            alignSelf: 'center',
                            marginBottom: 5,
                            width: 100,
                        }}
                        buttonTextStyle={{
                            fontSize: 8
                        }}
                        renderDropdownIcon={() => {
                            return (
                                <View>
                                    <MaterialIcons
                                        name="keyboard-arrow-down"
                                        color={Colors.BLUE}
                                        size={25}
                                    />
                                </View>
                            );
                        }}
                    /> : null}

                </View>

                {index < DropOffList.length - 1 ?
                    <DashedLine dashLength={5} dashThickness={5} dashStyle={{ borderRadius: 5 }} dashGap={5} dashColor={Colors.LIGHT_GRAY} axis='vertical' style={{ width: '85%', height: 30, alignSelf: 'center' }} />
                    :
                    null}

            </View>
        )
    }
    return (
        <View>
            <View style={{ width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name='map-marker' color={Colors.BLUE} size={25} />
                <TouchableOpacity style={styles.TextInput_Style} onPress={() => { setisModal(true), setid("Current") }}>
                    <TextComponent style={{ color: Colors.LIGHT_GRAY_1, fontSize: 12 }} text={Address?.Address} numberOfLines={1} />
                </TouchableOpacity>

            </View>

            <DashedLine dashLength={5} dashThickness={5} dashStyle={{ borderRadius: 5 }} dashGap={5} dashColor={Colors.LIGHT_GRAY} axis='vertical' style={{ width: '85%', height: 30, alignSelf: 'center' }} />
            <FlatList
                data={DropOffList}
                renderItem={renderDropOffList}
            />

            <GooglePlacesInput
                index={id}
                visible={isModal}
                notvisible={() => setisModal(false)}
                Onpress={(index, data, details) => { addAddress(index, data, details) }}
                placeholder={'Search here'}
            />

        </View>
    )
}

const styles = StyleSheet.create({

    TextInput_Style_Button: {
        position: 'absolute',
        alignSelf: 'flex-end',
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        top: 5,
        right: 15,
        backgroundColor: Colors.BLUE,
    },
    TextInput_Style: {
        backgroundColor: Colors.LIGHT_GRAY_2,
        borderRadius: 10,
        paddingHorizontal: 15,
        flex: 1,
        marginHorizontal: 5,
        fontSize: 11,
        height: 40,
        justifyContent: 'center'
    },



})

export default WhereToModal