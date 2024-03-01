import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Modal, Pressable, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, TextInput, Touchable, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import * as listOfTrendingSongs from '../data/trendingsongs.json'
import { useSelector, useDispatch } from 'react-redux'
import { spotifyLogin } from '../services/spotifyRequests';

import * as allSongs from '../data/allSongs.json'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SongPlayingComponent from './SongPlayingComponent';
import { RootState } from '../reduxStore/store';




const Discover = () => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const currentSongState = useSelector((state: RootState) => state.currSong.currentSongState)

    const RenderCategories = () => {
        return (
            <View>
                {allSongs.categories.map(
                    (a) => {
                        let categoryName = a.type
                        return (
                            <View key={'View1_' + categoryName} style={{
                                paddingHorizontal: "5%",
                                paddingVertical: "4%"
                            }} >
                                <Text key={'Text_' + categoryName}
                                    style={DiscoverStyle.sectionHeaderTextStyle}
                                >{categoryName}</Text>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    flexWrap: "wrap",
                                    paddingVertical: "2%"
                                }}
                                key={'View2_' + categoryName}
                                >
                                    {
                                        a.categories.map(
                                            (b) => {
                                                return (
                                                    <View style={{
                                                        paddingVertical: "2%"
                                                    }}
                                                    key={'View1_' + b.name}
                                                    >
                                                        <Pressable onPress={() => {
                                                            navigation.navigate('TrackLists', { category: b.name, tracks: b.songs })
                                                        }}
                                                        key={'Pressable1_' + b.name}>
                                                            <View key={'View_' + b.name} style={{
                                                                width: Dimensions.get("screen").width * 0.4,
                                                                // backgroundColor: "#0474A4",
                                                                // backgroundColor: "rgba(0,0,0,0.3)",
                                                                backgroundColor: "rgba(255,255,255,0.1)",
                                                                paddingVertical: "10%",
                                                                alignContent: "center",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                            
                                                            >
                                                                <Text key={'Text' + b.name}
                                                                    style={DiscoverStyle.categoryTextStyle}
                                                                >{b.name}</Text>
                                                            </View>
                                                        </Pressable>
                                                    </View>
                                                )
                                            }
                                        )
                                    }
                                </View>
                            </View>
                        )
                    }
                )}
            </View>
        )

    }

    return (
        <SafeAreaView style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#002941"

        }}>
            <ScrollView style={{
                flex: 1
            }}>


                {/* Header view */}
                <View style={{
                    padding: "2%"
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <View style={{
                            paddingHorizontal: "3%"
                        }}>
                            <Text style={{
                                color: "#FFFFFF9D",
                                fontFamily: "NotoSans-ExtraBold",
                                fontWeight: "500",
                                fontSize: 25,
                                paddingVertical: "5%",
                                alignSelf: "center",
                                textAlign: "center",
                                textAlignVertical: "center",
                                lineHeight: 30,
                            }}>{`Discover songs`}</Text>
                        </View>
                        <View>
                        </View>
                    </View>
                </View>

                {/* View for Categories */}
                <RenderCategories />



            </ScrollView>
            {/* Footer view */}
            <View style={{
                flex: -1
            }}>
                {
                    (currentSongState) ?
                        <SongPlayingComponent />
                        :
                        null
                }
            </View>



        </SafeAreaView>
    )

}

const DiscoverStyle = StyleSheet.create({
    sectionHeaderTextStyle: {
        fontFamily: "NotoSans-ExtraBold",
        fontSize: 25,
        lineHeight: 31,
        fontWeight: "500",
        color: "#FFFFFF"
    },

    categoryTextStyle: {
        fontFamily: "NotoSans-ExtraBold",
        fontSize: 20,
        lineHeight: 31,
        fontWeight: "400",
        color: "#FFFFFF"
    }
})

export default Discover;