import React, { useEffect, useLayoutEffect, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../reduxStore/store";
import SongPlayingComponent from "./SongPlayingComponent";
import { updateCurrentPlaylistInfo, updateCurrentSongInfo } from "../reduxStore/currentSongSlice";
import { playThisSong } from "../services/SongsManipulation";
import { addToSystemPlaylist } from "../reduxStore/playlistsSlice";
import PlayPauseComponent from "./PlayPauseComponent";
import TrackPlayer from "react-native-track-player";


const TrackLists = (props: any) => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const dispatch = useDispatch();

    const [currSongInfo, setCurrSongInfo] = useState({})
    const [categoryName, setCategoryName] = useState('');
    const [allSongsForThisCategory, setAllSongsForThisCategory] = useState([]);


    const currentSongState = useSelector((state: RootState) => state.currSong.currentSongState)
    const songId = useSelector((state: RootState) => state.currSong.currSongInfo?.id)
    const currentPlaylistName = useSelector((state: RootState) => state.currSong.currentPlaylistName)

    const navigateToTrackView = async (currSong: any, playlist: any, index: number, name: String) => {

        await playThisSong(currSong.url, currSong.artwork, currSong.artist, currSong.title, playlist, index, currentPlaylistName, name)

        dispatch(updateCurrentPlaylistInfo({
            playlistName: name,
            songs: playlist,
            currSongIndex: index
        }))

        let playbackState = await TrackPlayer.getPlaybackState();

        dispatch(updateCurrentSongInfo({
            artist: currSong?.artist,
            artwork: currSong?.artwork,
            title: currSong?.title,
            id: currSong.id,
            url: currSong?.url,
            playbackState: playbackState.state
        }))

        dispatch(addToSystemPlaylist({ songInfo: currSong }))

        navigation.navigate("SongInfo")
    }


    const RenderFlatList = (item: any) => {

        return (
            <View style={{
                paddingHorizontal: "5%",
                paddingVertical: "2%"
            }}>

                <TouchableHighlight
                    onPress={() => {
                        try {
                            navigateToTrackView(item.item, allSongsForThisCategory, item.index, categoryName)
                            

                        } catch (error) {
                            console.log("Move failed: ", error)
                        }

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
                                    <PlayPauseComponent
                                        songInfo={item.item} playlistName={categoryName} playlistInfo={allSongsForThisCategory}
                                        songIndex={item.index} size={Dimensions.get("screen").width * 0.08} color="#FFFFFF5D"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }




    useLayoutEffect(() => {
        let catName = props?.route?.params?.category
        let songsList = props?.route?.params?.tracks
        setCategoryName(catName);
        setAllSongsForThisCategory(songsList)

    }, [props?.route?.params?.category, props?.route?.params?.tracks])

    return (
        <SafeAreaView style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#002941"
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
                        <Text style={{
                            color: "#FFFFFF7D",
                            fontFamily: "NotoSans-Bold",
                            fontWeight: "500",
                            fontSize: 30,
                            textAlignVertical: "center",
                            lineHeight: 35,
                        }}>{categoryName}</Text>
                    </View>
                    <View></View>
                </View>
                <FlatList
                    data={allSongsForThisCategory}
                    renderItem={RenderFlatList}

                />

            </View>

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

export default TrackLists;