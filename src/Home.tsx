import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, Touchable, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import * as listOfTrendingSongs from '../data/trendingsongs.json'
import { useSelector, useDispatch } from 'react-redux'


import * as allSongs from '../data/allSongs.json'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SongPlayingComponent from './SongPlayingComponent';
import { updateCurrentPlaylistInfo, updateCurrentSongInfo } from '../reduxStore/currentSongSlice';
import { RootState } from '../reduxStore/store';
import { playThisSong } from '../services/SongsManipulation';
import { addToSystemPlaylist } from '../reduxStore/playlistsSlice';




const Home = () => {

    const [timeOfDay, setTimeOfDay] = useState("Hello");

    const dispatch = useDispatch()

    const [playSong, setPlaySong] = useState(false);

    const currentSongState = useSelector((state: RootState) => state.currSong.currentSongState)

    const artworkURL = useSelector((state: RootState) => state.currSong.currSongInfo?.artworkURL)
    const songName = useSelector((state: RootState) => state.currSong.currSongInfo?.songName)
    const artistName = useSelector((state: RootState) => state.currSong.currSongInfo?.artistName)
    const songId = useSelector((state: RootState) => state.currSong.currSongInfo?.id)
    const songURL = useSelector((state: RootState) => state.currSong.currSongInfo?.url)
    const currentPlaylistName = useSelector((state: RootState) => state.currSong.currentPlaylistName)


    // const navigation = useNavigation();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const recentlyPlayed = useSelector((state: RootState) => state.playlistsStored.recentlyPlayedSongs?.songs)
    const numSongsInRecentlyPlayed = useSelector((state: RootState) => state.playlistsStored.recentlyPlayedSongs?.totalSongs)

    const [recommended, setRecommended] = useState([
        { "artist": "Roman", "artwork": "https://cdn.pixabay.com/audio/2023/01/06/10-39-24-970_200x200.jpg", "duration": 76, "id": 132333, "title": "A Small Miracle", "url": "https://cdn.pixabay.com/audio/2023/01/06/audio_d74b2d0ff4.mp3" },
        { "artist": "Nver", "artwork": "https://cdn.pixabay.com/audio/2023/04/17/09-17-55-729_200x200.jpg", "duration": 121, "id": 146661, "title": "Futuristic Beat", "url": "https://cdn.pixabay.com/audio/2023/04/17/audio_ae4d57086a.mp3" },
        { "artist": "Aleksey", "artwork": "https://cdn.pixabay.com/audio/2022/08/02/19-23-38-897_200x200.jpg", "duration": 189, "id": 116199, "title": "Inspiring Cinematic Ambient", "url": "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3" },
        { "artist": "Zakhar", "artwork": "", "duration": 127, "id": 8697, "title": "Cinematic Fairy Tale Story (Main)", "url": "https://cdn.pixabay.com/audio/2021/09/25/audio_153f263349.mp3" },
        { "artist": "Zakhar", "artwork": "", "duration": 273, "id": 9835, "title": "Piano Moment", "url": "https://cdn.pixabay.com/audio/2021/10/25/audio_05570f2464.mp3" },
        { "artist": "FASSounds", "artwork": "https://cdn.pixabay.com/audio/2022/05/27/23-51-43-941_200x200.jpg", "duration": 147, "id": 112191, "title": "Lofi Study", "url": "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" },
        { "artist": "Oleksii", "artwork": "", "duration": 160, "id": 11157, "title": "Just Relax", "url": "https://cdn.pixabay.com/audio/2021/11/23/audio_64b2dd1bce.mp3" },
        { "artist": "AlexGrohl", "artwork": "https://cdn.pixabay.com/audio/2022/04/13/11-20-13-185_200x200.jpg", "duration": 110, "id": 15045, "title": "Electronic Rock (King Around Here)", "url": "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3" },
        { "artist": "StudioKolomna", "artwork": "https://cdn.pixabay.com/audio/2023/01/27/10-02-46-157_200x200.jpg", "duration": 72, "id": 136788, "title": "Risk", "url": "https://cdn.pixabay.com/audio/2023/01/27/audio_3d61eda8c6.mp3" },
        { "artist": "Sergei", "artwork": "", "duration": 212, "id": 14023, "title": "Moment", "url": "https://cdn.pixabay.com/audio/2022/01/11/audio_b21d9d6fa6.mp3" },
        { "artist": "Paolo", "artwork": "https://cdn.pixabay.com/audio/2023/08/31/14-35-42-339_200x200.jpg", "duration": 120, "id": 164472, "title": "The Best Jazz Club In New Orleans", "url": "https://cdn.pixabay.com/audio/2023/08/31/audio_d2149da47a.mp3" },
        { "artist": "Olexy", "artwork": "", "duration": 197, "id": 152722, "title": "Summer Walk", "url": "https://cdn.pixabay.com/audio/2023/06/06/audio_cbcfcb18e6.mp3" },
        { "artist": "Olexy", "artwork": "", "duration": 173, "id": 122841, "title": "The Beat of Nature", "url": "https://cdn.pixabay.com/audio/2022/10/14/audio_9939f792cb.mp3" }])


    const RenderRecentlyPlayed = (item: any, index: number) => {

        return (
            <View style={{
                paddingRight: "1%"
            }}>
                <TouchableHighlight onPress={() => {
                    navigateToTrackView(item, recentlyPlayed, index, "Recently Played");
                    playOrPauseSong(item, recentlyPlayed, index, "Recently Played")
                }
                }>
                    <View style={{
                        width: Dimensions.get("screen").width * 0.5,
                        paddingVertical: "7%",
                        paddingHorizontal: "1%",
                        backgroundColor: "#0000005D",
                        borderRadius: 5,
                        height: Dimensions.get("screen").height * 0.07
                    }}>
                        <View style={{
                            flexDirection: "row"
                        }}>
                            <View style={{
                                paddingHorizontal: "2%"
                            }}>
                                <Image source={(item.artwork && item.artwork != "") ? { uri: item.artwork } : { uri: 'https://cdn.pixabay.com/photo/2013/07/12/18/17/equalizer-153212_1280.png' }}
                                    style={Homestyle.artworkStyle}
                                />

                            </View>
                            <View style={{
                                flexDirection: "row",
                                paddingHorizontal: "2%",
                                // backgroundColor:"white"
                            }}>
                                <View style={{
                                    maxWidth: Dimensions.get("screen").width * 0.35
                                }}>
                                    <Text
                                        numberOfLines={1}
                                        style={Homestyle.titleTrack}>{item.title}</Text>
                                    <View>
                                        <Text style={Homestyle.artistName}>{item.artist}</Text>
                                        {/* <Text style={Homestyle.artistName}>{item.artist}</Text> */}
                                    </View>
                                </View>

                                {/* <View>
                            <Icon name="play-circle" size={25} />
                        </View> */}

                            </View>

                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    const RenderRecommended = (item: any, index: number) => {

        return (
            <View style={{
                paddingRight: "1%",
                paddingVertical: "2%"
            }}>
                <TouchableHighlight onPress={() => navigateToTrackView(item, recommended, index, "Recommended For You")}>
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
                                <Image source={(item.artwork && item.artwork != "") ? { uri: item.artwork } : { uri: 'https://cdn.pixabay.com/photo/2013/07/12/18/17/equalizer-153212_1280.png' }}
                                    style={Homestyle.artworkStyle}
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
                                        style={Homestyle.titleTrack}>{item.title}</Text>
                                    <View>
                                        <Text style={Homestyle.artistName}>{item.artist}</Text>
                                    </View>
                                </View>

                                <View>

                                    <TouchableHighlight onPress={() => playOrPauseSong(item, recommended, index, "Recommended For You")}>
                                        {
                                            (songId == item.id && currentSongState == "play") ?
                                                <Icon name="pause-circle" size={Dimensions.get("screen").width * 0.08} color="#FFFFFF5D" />
                                                :
                                                <Icon name="play-circle" size={Dimensions.get("screen").width * 0.08} color="#FFFFFF5D" />

                                        }
                                    </TouchableHighlight>


                                </View>

                            </View>

                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    const navigateToTrackView = (currSong: any, playlist: any, index: number, name: String) => {

        dispatch(updateCurrentSongInfo({
            artistName: currSong.artist,
            artworkURL: currSong.artwork,
            songName: currSong.title,
            id: currSong.id,
            songState: "play",
            url: currSong.url
        }))

        dispatch(addToSystemPlaylist({ songInfo: currSong }))
        

        playThisSong(currSong.url, currSong.artwork, currSong.artist, currSong.title, playlist, index, currentPlaylistName, name)
        .then(
            () => {
                dispatch(updateCurrentPlaylistInfo(name))
            }
        )

        navigation.navigate("SongInfo")
    }

    const playOrPauseSong = (currsong: any, playlist: any, index: number, playlistName: string) => {
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

            setPlaySong(true)
            dispatch(updateCurrentSongInfo({
                artistName: currsong.artist,
                artworkURL: currsong.artwork,
                songName: currsong.title,
                id: currsong.id,
                songState: "play",
                url: currsong.url
            }))
        }

        dispatch(updateCurrentPlaylistInfo({
            playlistName: playlistName,
            songs: playlist,
            currSongIndex: index
        }))

        playThisSong(currsong.url, currsong.artwork, currsong.artist, currsong.title, playlist, index, currentPlaylistName, playlistName)
        .then(
            () => {
                dispatch(updateCurrentPlaylistInfo(playlistName))
            }
        )
    }


    return (
        <SafeAreaView style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#002941",
            flex: 1

        }}>


            {/* Header view */}
            {/* <View style={{
                padding: "2%",
                flex: 0.15
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
                        }}>{timeOfDay + ` Priyanka!`}</Text>
                    </View>
                    <View>

                        <View style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            backgroundColor: "#871746",
                            alignContent: "center",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Pressable
                            // onPress={() => spotifyLogin()}
                            >
                                <Icon name='person-sharp' size={25} color="white" style={{
                                    alignSelf: "center"
                                }} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View> */}

            {/* Recently played songs */}
            {
                (numSongsInRecentlyPlayed > 0) ?
                    <View style={{
                        paddingHorizontal: "3%",
                        paddingVertical: "2%",
                        flex: 0.25
                    }}>
                        <View>
                            <Text style={Homestyle.headers2}>
                                {`Recently Played`}
                            </Text>
                        </View>
                        <View style={{
                            paddingVertical: "5%",
                            // paddingHorizontal: "5%"
                            marginHorizontal: -16
                        }}>

                            <FlatList data={recentlyPlayed}
                                renderItem={(item) => RenderRecentlyPlayed(item.item, item.index)}
                                horizontal={true}
                            />
                        </View>
                    </View>
                    : null
            }

            {/* Recommended Songs */}

            <View style={{
                paddingHorizontal: "3%",
                paddingTop: "5%",
                flex: 1
            }}>
                <View>
                    <Text style={Homestyle.headers2}>
                        {`Recommended Songs For You`}
                    </Text>
                </View>
                <View style={{
                    paddingVertical: "5%",
                    paddingHorizontal: "1%"
                }}>
                    <FlatList data={recommended}
                        renderItem={(item) => RenderRecommended(item.item, item.index)}
                        automaticallyAdjustContentInsets
                        contentInsetAdjustmentBehavior='automatic'

                    // horizontal={true}
                    />
                </View>
            </View>

            {/* Footer view */}
            {
                (currentSongState) ?
                    <SongPlayingComponent />
                    :
                    null
            }



        </SafeAreaView>
    )

}

const Homestyle = StyleSheet.create({
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

export default Home;