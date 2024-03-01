import React, { useEffect, useLayoutEffect, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import TrackPlayer, { State } from 'react-native-track-player';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootState } from "../reduxStore/store";
import { useDispatch, useSelector } from "react-redux";
import SongPlayingComponent from "./SongPlayingComponent";
import { updateCurrentSongInfo } from "../reduxStore/currentSongSlice";
import { playThisSong } from "../services/SongsManipulation";
import { addToSystemPlaylist } from "../reduxStore/playlistsSlice";


const TrackLists = (props: any) => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [showBanner, setShowBanner] = useState(false)

    const [currSongInfo, setCurrSongInfo] = useState({})

    const currentSongState = useSelector((state: RootState) => state.currSong.currentSongState)

    const artworkURL = useSelector((state: RootState) => state.currSong.currSongInfo?.artworkURL)
    const songName = useSelector((state: RootState) => state.currSong.currSongInfo?.songName)
    const artistName = useSelector((state: RootState) => state.currSong.currSongInfo?.artistName)
    const songId = useSelector((state: RootState) => state.currSong.currSongInfo?.id)
    const songURL = useSelector((state: RootState) => state.currSong.currSongInfo?.url)

    const currentPlaylistName = useSelector((state: RootState) => state.currSong.currentPlaylistName)

    const currPlaylist = useSelector((state: RootState) => state.currSong.currPlaylistInfo.songs)
    const currSongIndex = useSelector((state: RootState) => state.currSong.currPlaylistInfo.currPlayingSongIndex)


    const dispatch = useDispatch();

    let data = [
        {
            id: '1',
            url: 'https://www.chosic.com/wp-content/uploads/2021/07/The-Epic-Hero-Epic-Cinematic-Keys-of-Moon-Music.mp3',
            title: 'Keys of moon',
            artist: 'The Epic Hero',
            artwork: 'https://picsum.photos/id/1003/200/300',
            album: '',
            duration: 149,
        },
        {
            id: '2',
            url: 'https://www.chosic.com/wp-content/uploads/2021/07/Raindrops-on-window-sill.mp3',
            title: 'Raindrops on window sill',
            artist: '',
            artwork: 'https://picsum.photos/id/10/200/300',
            album: 'Chosic',
            duration: 119,
        },
        {
            id: '3',
            url: 'https://www.chosic.com/wp-content/uploads/2021/07/purrple-cat-equinox.mp3',
            title: 'Equinox',
            artist: 'Purple Cat',
            artwork: 'https://picsum.photos/id/1016/200/300',
            album: '',
            duration: 140,
        },
        {
            id: '4',
            url: 'https://www.chosic.com/wp-content/uploads/2021/04/And-So-It-Begins-Inspired-By-Crush-Sometimes.mp3',
            title: 'And So It Begins',
            artist: '',
            artwork: 'https://picsum.photos/id/1019/200/300',
            album: 'Artificial Music',
            duration: 208,
        },
        {
            "id": 186374,
            "duration": 90,
            "artwork": "https:\/\/cdn.pixabay.com\/audio\/2024\/01\/29\/13-19-29-218_200x200.png",
            "url": "https:\/\/cdn.pixabay.com\/audio\/2024\/01\/16\/audio_e2b992254f.mp3",
            artist: 'Oleksandr',
            album: '',
            "title": "Better Day",
        }
    ]

    // const playThisSong = async (songInfo: any) => {
    //     try {

    //         console.log("this song is: ", songInfo)
    //         const playbackState = await TrackPlayer.getPlaybackState();
    //         // if (state === State.Playing) {
    //         //     console.log('The player is playing');
    //         // };

    //         console.log("Playback state: ", playbackState)
    //         if (playbackState.state == State.Ready) {
    //             console.log("Will play song")
    //             TrackPlayer.add(songInfo)
    //             let playing = await TrackPlayer.play()
    //             console.log("playing is: ", playing)

    //         } else if (playbackState.state == State.Playing) {
    //             console.log("Changing song");
    //             await TrackPlayer.remove(0);
    //             let tracks = await TrackPlayer.getTrack(0);
    //             console.log("tracks: ", tracks)

    //             let xyz = await TrackPlayer.getActiveTrack()
    //             console.log("xyz is: ", xyz)

    //             TrackPlayer.add(songInfo);
    //             await TrackPlayer.play();
    //         }
    //         else if (playbackState.state == State.Paused) {
    //             console.log("Changing song");
    //             await TrackPlayer.remove(0);
    //             let tracks = await TrackPlayer.getTrack(0);
    //             console.log("tracks: ", tracks)

    //             let xyz = await TrackPlayer.getActiveTrack()
    //             console.log("xyz is: ", xyz)

    //             TrackPlayer.add(songInfo);
    //             await TrackPlayer.play();
    //         }
    //     } catch (error) {
    //         console.log("Error while playing song: ", error)
    //     }
    // }

    const convertTime = (durationInSec: number) => {
        let durationInMinutes = ""

        let mins = (durationInSec / 60).toFixed()
        let secs = durationInSec % 60



        durationInMinutes = ((mins.length > 1) ? mins.toString() : '0' + mins.toString()) + ":" +
            ((secs > 9) ? secs.toString() : '0' + secs.toString());
        return durationInMinutes

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
                            setCurrSongInfo(item.item)
                            setShowBanner(true)
                            // navigation.navigate("SongInfo", {songInfo: item.item})

                            dispatch(updateCurrentSongInfo({
                                artistName: item.item.artist,
                                artworkURL: item.item.artwork,
                                songName: item.item.title,
                                id: item.item.id,
                                songState: "play",
                                url: item.item.url
                            }))
                            dispatch(addToSystemPlaylist({ songInfo: item.item }))

                            playThisSong(item.item.url, item.item.artwork, item.item.artist, item.item.title, allSongsForThisCategory, item.index,categoryName, currentPlaylistName )

                            navigation.navigate(
                                "SongInfo"
                            )

                        } catch (error) {
                            console.log("Move failed: ", error)
                        }

                    }}
                >
                    <View style={{
                        paddingVertical: "2%",
                        paddingHorizontal: "1%",
                        // backgroundColor: "#0000005D",
                        borderRadius: 5,
                        // height: Dimensions.get("screen").height * 0.1
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
                                    <TouchableHighlight onPress={() => playOrPauseSong(item.item, item.index)}>
                                        {
                                            (songId == item.item.id && currentSongState == "play") ?
                                                <Icon name="pause-circle" size={Dimensions.get("screen").width * 0.08} color="#FFFFFF5D" />
                                                :
                                                <Icon name="play-circle" size={Dimensions.get("screen").width * 0.08} color="#FFFFFF5D" />

                                        }
                                    </TouchableHighlight>
                                    {/* <Icon name="play-circle" size={Dimensions.get("screen").width * 0.08} color="#FFFFFF5D" /> */}
                                </View>

                            </View>

                        </View>
                    </View>
                </TouchableHighlight>

            </View>
        )

    }


    const playOrPauseSong = (currsong: any, index: any) => {
        let currSongId = currsong.id;

        if (songId == currSongId && currentSongState == "play") {
            dispatch(updateCurrentSongInfo({
                artistName: currsong.artist,
                artworkURL: currsong.artwork,
                songName: currsong.title,
                id: currsong.id,
                songState: "pause",
                url: currsong.url
            }))

            dispatch(addToSystemPlaylist({ songInfo: currsong }))
        }
        else {

            dispatch(updateCurrentSongInfo({
                artistName: currsong.artist,
                artworkURL: currsong.artwork,
                songName: currsong.title,
                id: currsong.id,
                songState: "play",
                url: currsong.url
            }))
        }

        playThisSong(currsong.url, currsong.artwork, currsong.artist, currsong.title, allSongsForThisCategory, index, categoryName, currentPlaylistName)
    }

    const [categoryName, setCategoryName] = useState('');
    const [allSongsForThisCategory, setAllSongsForThisCategory] = useState([]);

    useLayoutEffect(() => {
        let catName = props?.route?.params?.category
        let songsList = props?.route?.params?.tracks
        setCategoryName(catName);
        setAllSongsForThisCategory(songsList)

    }, [navigation])

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
            {/* <View style={{
                flex: -1,
                // backgroundColor: "pink",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                display: (showBanner) ? "flex" : "none"

            }}>
                <View style={{
                    paddingVertical: "5%",
                    // padding: "2%",
                    width: Dimensions.get("screen").width * 0.9,
                    alignSelf:"center"


                }}>
                    <Pressable style={{
                    }}
                        onPress={() => navigation.navigate("SongInfo", { songInfo: currSongInfo })}
                    >
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>

                            <View style={{
                                
                            }}>
                                <Image source={(currSongInfo.artwork == "" || currSongInfo.artwork == null) ?
                                    { uri: 'https://cdn.pixabay.com/photo/2013/07/12/18/17/equalizer-153212_1280.png' } : { uri: currSongInfo.artwork }}
                                    style={{
                                        height: Dimensions.get("screen").width * 0.1,
                                        aspectRatio: 1,
                                        borderRadius: Dimensions.get("screen").width * 0.1 * 0.5
                                    }} />

                            </View>

                            <View style={{
                                // flex: 4
                                width: Dimensions.get("screen").width * 0.4,
                                // alignItems: "center",
                                paddingLeft: "3%"
                            }}>

                                <Text style={{
                                    color: "#FFFFFF7D",
                                    fontFamily: "NotoSans-Bold",
                                    fontWeight: "500",
                                    fontSize: 20,
                                    textAlignVertical: "center",
                                    lineHeight: 25,

                                }}>{currSongInfo.title}</Text>
                                <Text style={{
                                    color: "#FFFFFF7D",
                                    fontFamily: "NotoSans-Medium",
                                    fontWeight: "500",
                                    fontSize: 12,
                                    textAlignVertical: "center",
                                    lineHeight: 15,

                                }}>{currSongInfo.artist}</Text>



                            </View>

                            <View style={{
                                // flex: 2
                                width: Dimensions.get("screen").width * 0.3
                            }}>

                                <View style={{
                                    justifyContent: "space-evenly",
                                    flexDirection: "row"
                                }}>

                                    <Icon name="pause" size={30} color="#FFFFFF5D" />
                                    <Icon name="play-skip-forward" size={30} color="#FFFFFF5D" />

                                </View>

                            </View>

                        </View>

                    </Pressable>

                </View>

            </View> */}

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