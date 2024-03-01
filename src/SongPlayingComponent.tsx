import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import TrackPlayer from "react-native-track-player";
import Icon from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentSongInfo } from "../reduxStore/currentSongSlice";
import { addToSystemPlaylist } from "../reduxStore/playlistsSlice";
import { RootState } from "../reduxStore/store";
import { playThisSong } from "../services/SongsManipulation";

const SongPlayingComponent = (props: any) => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const currentSongState = useSelector((state: RootState) => state.currSong.currentSongState)

    const artworkURL = useSelector((state: RootState) => state.currSong.currSongInfo?.artworkURL)
    const songName = useSelector((state: RootState) => state.currSong.currSongInfo?.songName)
    const artistName = useSelector((state: RootState) => state.currSong.currSongInfo?.artistName)
    const songId = useSelector((state: RootState) => state.currSong.currSongInfo?.id)
    const songURL = useSelector((state: RootState) => state.currSong.currSongInfo?.url)

    const currPlaylist = useSelector((state: RootState) => state.currSong.currPlaylistInfo.songs)
    const currSongIndex = useSelector((state: RootState) => state.currSong.currPlaylistInfo.currPlayingSongIndex)

    const allState = useSelector((state: RootState) => state.currSong)
    const dispatch = useDispatch();
    const currentPlaylistName = useSelector((state: RootState) => state.currSong.currentPlaylistName)

    useEffect(() => {
        // console.log("stat is: ", allState)
    })

    const playOrPauseThisSong = () => {
        if (currentSongState == "play") {
            dispatch(updateCurrentSongInfo({
                artistName: artistName,
                artworkURL: artworkURL,
                songName: songName,
                id: songId,
                songState: "pause",
                url: songURL
            }))
        }
        else {
            dispatch(updateCurrentSongInfo({
                artistName: artistName,
                artworkURL: artworkURL,
                songName: songName,
                id: songId,
                songState: "play",
                url: songURL
            }))
        }

        playThisSong(songURL, artworkURL, artistName, songName, currPlaylist, currSongIndex, currentPlaylistName, currentPlaylistName)
    }

    const skipNext = async () => {
        
        let songsAlreadyInQueue = await TrackPlayer.getQueue();

        let currSongPos = await TrackPlayer.getActiveTrackIndex()

        if (currSongPos == songsAlreadyInQueue.length - 1) {
            await TrackPlayer.skip(0)

        } else {
            await TrackPlayer.skipToNext();
        }

        let currSong = await TrackPlayer.getActiveTrack();
        dispatch(updateCurrentSongInfo({
            artistName: currSong?.artist,
            artworkURL: currSong?.artwork,
            songName: currSong?.title,
            id: currSong?.id,
            songState: "play",
            url: currSong?.url
        }))
        await TrackPlayer.play();
        dispatch(addToSystemPlaylist({ songInfo: currSong }))


    }
    
    return(
        <View style = {{
            backgroundColor: "#0000003D",
        
        }}>
            <TouchableHighlight 
            onPress={() => {
                navigation.navigate("SongInfo")
            }}
            >
            <View style = {{
                paddingVertical: "2%",
                
            }}>
                <View style = {{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignContent: "center",
                    alignItems:"center"
                }}>
                    <View>
                        <Image source = {(artworkURL == "" || artworkURL == null) ?
                        { uri: 'https://cdn.pixabay.com/photo/2013/07/12/18/17/equalizer-153212_1280.png' } : {uri: artworkURL}} style = {{
                            height: Dimensions.get("screen").width * 0.15,
                            aspectRatio: 1,
                            borderRadius: Dimensions.get("screen").width * 0.15 * 0.5,
                        }}/>
                    </View>

                    <View style = {{
                        width: Dimensions.get("screen").width * 0.5
                    }}>
                        <Text style = {SongPlayingComponentStyle.songText} numberOfLines={1}>{songName}</Text>
                        <Text style = {SongPlayingComponentStyle.artistText} numberOfLines={1}>{artistName}</Text>

                    </View>

                    <View style = {{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: Dimensions.get("screen").width * 0.2
                    }}>
                        <TouchableHighlight onPress = {playOrPauseThisSong}>
                        {
                            (currentSongState && currentSongState == "play") ?
                            <Icon name="pause" size={Dimensions.get("screen").height * 0.03} color="#FFFFFF5D" />
                            :
                            <Icon name="play" size={Dimensions.get("screen").height * 0.03} color="#FFFFFF5D" />
                        }
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