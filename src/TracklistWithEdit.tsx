import React, { useLayoutEffect, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../reduxStore/store";
import { addMultipleSongsToPlaylist, getIdsOfSongsInPlaylistWithId } from "../reduxStore/playlistsSlice";
import SongPlayingComponent from "./SongPlayingComponent";
import * as allSongs from '../data/allSongs.json';



const TrackListWithEdit = (props: any) => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const dispatch = useDispatch();

    const [selectedSongsId, setSelectedSongsId] = useState(new Array());
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [categoryName, setCategoryName] = useState('');
    const [allSongsForThisCategory, setAllSongsForThisCategory] = useState(new Array());
    const [thisPlaylistId, setThisPlaylistId] = useState('')

    const currentSongState = useSelector((state: RootState) => state.currSong.currentSongState)
    const allSongsId = useSelector(getIdsOfSongsInPlaylistWithId(props?.route?.params?.playlistId))


    const selectThisSong = (songData: any) => {
        let prevSelection = new Array();
        prevSelection = selectedSongsId;
        let updatedSongData = songData
        updatedSongData.album = categoryName
        
        if (prevSelection.indexOf(updatedSongData.id) != -1) {
            
            prevSelection.splice(prevSelection.indexOf(updatedSongData.id), 1)
        } else {
            prevSelection.push(updatedSongData.id)
        }

        setSelectedSongsId(prevSelection)
        forceUpdate()
    }

    const RenderFlatList = (item: any) => {
        return (
            <View style={{
                paddingHorizontal: "5%",
                paddingVertical: "2%"
            }}>
                <TouchableHighlight
                    onPress={() => {
                        selectThisSong(item.item)
                    }}
                >
                    <View style={{
                        paddingVertical: "2%",
                        paddingHorizontal: "1%",
                        borderRadius: 5,
                    }}>
                        <View style={{
                            flexDirection: "row",
                        }}>
                            <View style={{
                                paddingHorizontal: "2%",
                            }}>
                                <Image source={(item.item.artwork && item.item.artwork != "") ? { uri: item.item.artwork } : { uri: 'https://cdn.pixabay.com/photo/2013/07/12/18/17/equalizer-153212_1280.png' }}
                                    style={TrackListStyle.artworkStyle}
                                />

                            </View>
                            <View style={{
                                flexDirection: "row",
                                paddingHorizontal: "2%",
                                justifyContent: "space-between",
                                width: Dimensions.get("screen").width * 0.78
                            }}>
                                <View style={{
                                    maxWidth: Dimensions.get("screen").width * 0.6
                                }}>
                                    <Text
                                        numberOfLines={1}
                                        style={TrackListStyle.titleTrack}>{item.item.title}</Text>
                                    <View>
                                        <Text style={TrackListStyle.artistName}>{item.item.artist}</Text>
                                    </View>

                                </View>

                                <View>
                                    <Icon
                                        name={(selectedSongsId.indexOf(item.item.id) != -1) ? "checkmark-circle-outline" : "ellipse-outline"}
                                        size={Dimensions.get("screen").width * 0.08} color="#FFFFFF5D" />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    useLayoutEffect(() => {
        let catName = props?.route?.params?.playlistName
        setCategoryName(catName);
        setThisPlaylistId(props?.route?.params?.playlistId)

        let tempArray = new Array();

        allSongs.categories.map(
            (a) => {
                a.categories.map(
                    (b) => {
                        b.songs.map(
                            (c) => {
                                if (tempArray.find((item) => { return item.id == c.id }) || allSongsId.includes(c.id)) {

                                } else
                                    tempArray.push(c)
                            }
                        )
                    }
                )
            }
        )
        setAllSongsForThisCategory(tempArray)

    }, [props?.route?.params?.playlistName, props?.route?.params?.playlistId])


    const addSongsToPlaylist = () => {

        let allSongsInfo = new Array();
        allSongsInfo = allSongsForThisCategory.filter(
            (a) => {
                return selectedSongsId.includes(a.id)
            }
        )

        if (selectedSongsId.length != 0) {
            dispatch(addMultipleSongsToPlaylist({
                playlistName: categoryName,
                playlistId: thisPlaylistId,
                songInfo: allSongsInfo
            }))
        }

        navigation.goBack();

    }


    return (
        <SafeAreaView style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#002941"
        }}>

            <View style={{
                flex: 1
            }}>

                <View style={{
                    height: "100%",
                    width: "100%",
                    flex: 1,

                }}>
                    <View style={{
                        padding: "5%",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Icon name="chevron-back" size={35} color="#FFFFFF5D" />
                        </Pressable>

                        <View>
                        </View>
                        <View>
                            <TouchableHighlight onPress={addSongsToPlaylist}>
                                <Text style={{
                                    color: "#FFFFFF7D",
                                    fontFamily: "NotoSans-Bold",
                                    fontWeight: "500",
                                    fontSize: 20,
                                    textAlignVertical: "center",
                                    lineHeight: 35,
                                }}>{`Add`}</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <FlatList
                        data={allSongsForThisCategory}
                        renderItem={RenderFlatList}
                    />

                </View>

                {
                    (currentSongState) ?
                        <View style={{
                            flex: -1
                        }}>
                            <SongPlayingComponent />
                        </View>
                        : null
                }
            </View>

        </SafeAreaView>
    )
}

const TrackListStyle = StyleSheet.create({
    headers2: {
        fontFamily: "NotoSans-Bold",
        fontSize: 25,
        lineHeight: 31,
        fontWeight: "500",
        color: "#FFFFFF8D"
    },
    titleTrack: {
        fontFamily: "NotoSans-Medium",
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "400",
        color: "#FFFFFF",

    },
    artistName: {
        fontFamily: "NotoSans-Medium",
        fontSize: 10,
        lineHeight: 14,
        // fontWeight: "400",
        color: "#FFFFFF8D"
    },
    artworkStyle: {
        height: Dimensions.get("screen").width * 0.08,
        width: Dimensions.get("screen").width * 0.08,
        borderRadius: Dimensions.get("screen").width * 0.08 * 0.5
    }
})

export default TrackListWithEdit;