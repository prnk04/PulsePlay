import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import TrackPlayer, { State } from "react-native-track-player";
import Icon from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from "react-redux";

import { updateCurrentPlaylistInfo, updateCurrentSongInfo } from "../reduxStore/currentSongSlice";
import { addToSystemPlaylist } from "../reduxStore/playlistsSlice";
import { RootState } from "../reduxStore/store";

const SongPlayingComponent = () => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const dispatch = useDispatch();

    const [iconName, setIconName] = useState('pause')

    const artworkURL = useSelector((state: RootState) => state.currSong.currSongInfo?.artwork)
    const songName = useSelector((state: RootState) => state.currSong.currSongInfo?.title)
    const artistName = useSelector((state: RootState) => state.currSong.currSongInfo?.artist)
    const songId = useSelector((state: RootState) => state.currSong.currSongInfo?.id)
    const album = useSelector((state: RootState) => state.currSong.currSongInfo?.album)
    const prevPlayedSongState = useSelector((state: RootState) => state.currSong.currentSongState)
    const currPlaylistInfo = useSelector((state: RootState) => state.currSong?.currPlaylistInfo)
    const currSongInfo = useSelector((state: RootState) => state.currSong.currSongInfo)


    const playOrPauseThisSong = async () => {
        try {

            let playbackState = await TrackPlayer.getPlaybackState();

            if (playbackState.state == State.Playing) {
                await TrackPlayer.pause();
            }

            else if (playbackState.state == State.Paused) {
                await TrackPlayer.play();
            }

            let nowState = await TrackPlayer.getPlaybackState()
            let thisTrackInfo = await TrackPlayer.getActiveTrack()

            if ((nowState.state == State.None || nowState.state == State.Paused || nowState.state == State.Stopped || nowState.state == State.Error)
            ) {
                setIconName('play')
            } else {
                setIconName('pause')
            }

            // dispatch(updateCurrentSongInfo({
            //     artist: thisTrackInfo?.artist,
            //     artwork: thisTrackInfo?.artwork,
            //     title: thisTrackInfo?.title,
            //     id: songId,
            //     url: thisTrackInfo?.url,
            //     playbackState: nowState.state,
            //     album: thisTrackInfo?.album
            // }))

            // dispatch(addToSystemPlaylist({ songInfo: thisTrackInfo }))

        } catch (error) {
            console.log("There was an error while playing or pausing this song on Song Playing Component: ", error)

        }

    }

    const skipNext = async () => {
        try {
            let songsAlreadyInQueue = await TrackPlayer.getQueue();
            let currSongPos = await TrackPlayer.getActiveTrackIndex();

            let newIndex = 0
            if (currSongPos == songsAlreadyInQueue.length - 1) {
                await TrackPlayer.skip(0)

            } else {
                await TrackPlayer.skipToNext();
                newIndex += 1
            }
            await TrackPlayer.play();

            let currSong = await TrackPlayer.getActiveTrack();
            let nowState = await TrackPlayer.getPlaybackState()

            dispatch(updateCurrentSongInfo({
                artist: currSong?.artist,
                artwork: currSong?.artwork,
                title: currSong?.title,
                id: currSong?.id,
                playbackState: nowState.state,
                url: currSong?.url,
                album: currSong?.album
            }))

            dispatch(updateCurrentPlaylistInfo({
                playlistName: currPlaylistInfo?.name,
                songs: currPlaylistInfo?.songs,
                currSongIndex: newIndex
            }))

            dispatch(addToSystemPlaylist({ songInfo: currSong }))

        } catch (error) {
            console.log("song playing component error: ", error)
        }

    }

    // const updateData = async (event: PlaybackActiveTrackChangedEvent) => {
        
    //         let nowState = await TrackPlayer.getPlaybackState()

    //         dispatch(updateCurrentSongInfo({
    //             artist: event?.track?.artist,
    //             artwork: event?.track?.artwork,
    //             title: event?.track?.title,
    //             id: event?.track?.id,
    //             playbackState: nowState.state,
    //             url: event?.track?.url
    //         }))

    //         dispatch(updateCurrentPlaylistInfo({
    //             playlistName: currPlaylistInfo?.name,
    //             songs: currPlaylistInfo?.songs,
    //             currSongIndex: event?.index
    //         }))

    //         dispatch(addToSystemPlaylist({ songInfo: event?.track }))
    // }

    // useEffect(() => {
    //     TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
    //         updateData(event)   
    //     })
    // })

    useLayoutEffect(() => {
        if (prevPlayedSongState == State.Playing || prevPlayedSongState == State.Buffering || prevPlayedSongState == State.Loading || prevPlayedSongState == State.Loading) {
            setIconName('pause')
        } else if (prevPlayedSongState == State.Ended || prevPlayedSongState == State.None || prevPlayedSongState == State.Paused || prevPlayedSongState == State.Stopped) {
            setIconName('play')
        }
    }, [prevPlayedSongState])

    return (
        <View style={{
            backgroundColor: "#0000003D",

        }}>
            <TouchableHighlight
                onPress={() => {
                    navigation.navigate("SongInfo")
                }}
            >
                <View style={{
                    paddingVertical: "2%",

                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignContent: "center",
                        alignItems: "center"
                    }}>
                        <View>
                            <Image source={(artworkURL == "" || artworkURL == null) ?
                                { uri: 'https://cdn.pixabay.com/photo/2013/07/12/18/17/equalizer-153212_1280.png' } : { uri: artworkURL }} style={{
                                    height: Dimensions.get("screen").width * 0.15,
                                    aspectRatio: 1,
                                    borderRadius: Dimensions.get("screen").width * 0.15 * 0.5,
                                }} />
                        </View>

                        <View style={{
                            width: Dimensions.get("screen").width * 0.5
                        }}>
                            <Text style={SongPlayingComponentStyle.songText} numberOfLines={1}>{songName}</Text>
                            <Text style={SongPlayingComponentStyle.artistText} numberOfLines={1}>{artistName}</Text>

                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: Dimensions.get("screen").width * 0.2
                        }}>

                            <TouchableHighlight onPress={playOrPauseThisSong}>
                                <Icon name={iconName} size={Dimensions.get("screen").height * 0.03} color="#FFFFFF5D" />
                            </TouchableHighlight>

                            <TouchableHighlight onPress={skipNext}>
                                <Icon name="play-skip-forward" size={Dimensions.get("screen").height * 0.03} color="#FFFFFF5D" />
                            </TouchableHighlight>

                        </View>

                    </View>
                </View>
            </TouchableHighlight>
        </View>
    )

}

const SongPlayingComponentStyle = StyleSheet.create({
    artistText: {
        fontFamily: "NotoSans-Medium",
        fontSize: 12,
        lineHeight: 16,
        color: "#FFFFFF5D",

    },
    songText: {
        fontFamily: "NotoSans-Medium",
        fontSize: 16,
        lineHeight: 22,
        color: "#FFFFFF5D",

    }
})

export default SongPlayingComponent;