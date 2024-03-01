import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Dimensions, FlatList, Image, ListRenderItemInfo, Pressable, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentPlaylistInfo, updateCurrentSongInfo } from '../reduxStore/currentSongSlice';
import { addToSystemPlaylist, getNumSongsInPlaylistWithId, getPlaylistDetailsWithId } from '../reduxStore/playlistsSlice';
import { RootState } from '../reduxStore/store';
import { playThisSong } from '../services/SongsManipulation';
import SongPlayingComponent from './SongPlayingComponent';

const SongsInPlaylistView = (props: any) => {

    const [currPlaylistName, setCurrPlaylistName] = React.useState('');
    // const [numSongs, setNumSongs] = React.useState(0)

    const numSongs = useSelector(getNumSongsInPlaylistWithId(props?.route?.params?.playlistId))

    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const currentPlaylistName = useSelector((state: RootState) => state.currSong.currentPlaylistName)


    const dispatch = useDispatch();
    

    
    const thisPlaylistData = useSelector(getPlaylistDetailsWithId(props?.route?.params?.playlistId))
    const [allSongsInThisPlaylist, setAllSongsInThisPlaylist] = React.useState(new Array());

    const currentSongState = useSelector((state: RootState) => state.currSong.currentSongState)

    const artworkURL = useSelector((state: RootState) => state.currSong.currSongInfo?.artworkURL)
    const songName = useSelector((state: RootState) => state.currSong.currSongInfo?.songName)
    const artistName = useSelector((state: RootState) => state.currSong.currSongInfo?.artistName)
    const songId = useSelector((state: RootState) => state.currSong.currSongInfo?.id)
    const songURL = useSelector((state: RootState) => state.currSong.currSongInfo?.url)


    React.useLayoutEffect(() => {

        setCurrPlaylistName(props?.route?.params?.playlistName)

        setAllSongsInThisPlaylist(thisPlaylistData?.songs)

    }, [navigation])

    useEffect(() => {
        setAllSongsInThisPlaylist(thisPlaylistData?.songs)
    })

    const navigateToShowSongs = () => {
        navigation.navigate("TrackListWithEdit", { playlistName: currPlaylistName, playlistId: props?.route?.params?.playlistId })
    }

    const RenderFlatlistData = (item: any) => {
        return (
            <View style={{
                paddingHorizontal: "5%",
                paddingVertical: "2%"
            }}>
                <TouchableHighlight
                    onPress={() => {
                        try {
                            dispatch(updateCurrentSongInfo({
                                artistName: item.item.artist,
                                artworkURL: item.item.artwork,
                                songName: item.item.title,
                                id: item.item.id,
                                songState: "play",
                                url: item.item.url
                            }))

                            playThisSong(item.item.url, item.item.artwork, item.item.artist, item.item.title, allSongsInThisPlaylist, item.index, currPlaylistName, currentPlaylistName)

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
                                    style={SongsInPlaylistStyle.artworkStyle}
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
                                        style={SongsInPlaylistStyle.titleTrack}>{item.item.title}</Text>
                                    <View>
                                        <Text style={SongsInPlaylistStyle.artistName}>{item.item.artist}</Text>
                                    </View>
                                </View>

                                <View>
                                    <TouchableHighlight 
                                    onPress={() => playOrPauseSong(item.item, item.index, currPlaylistName)}
                                    >
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

    const playOrPauseSong = (currsong: any,  index: number, playlistName: string) => {
        let currSongId = currsong.id;
        console.log("songs in this playlist: ", allSongsInThisPlaylist)

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

        dispatch(updateCurrentPlaylistInfo({
            playlistName: playlistName,
            songs: allSongsInThisPlaylist,
            currSongIndex: index
        }))

        playThisSong(currsong.url, currsong.artwork, currsong.artist, currsong.title, allSongsInThisPlaylist, index, currPlaylistName, currentPlaylistName)
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
                    // flex: 1,
                    paddingHorizontal: "5%"
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignContent: "center",
                        alignItems: "center",
                        paddingVertical: "2%"
                    }}>

                        <View>
                            <Pressable onPress={() => navigation.goBack()}>
                                <Icon name="chevron-back" size={35} color="#FFFFFF5D" />
                            </Pressable>
                        </View>

                        <View>
                            <Text style={{
                                color: "#FFFFFF5D",
                                fontSize: 25,
                                lineHeight: 35,
                                fontFamily: "NotoSans-Medium",
                                // textAlign: "center",
                                // paddingVertical: "7%",
                                paddingHorizontal: "10%"
                            }}>{currPlaylistName}</Text>

                        </View>

                        <View>
                            <Pressable onPress={() => navigateToShowSongs()}>
                                <Icon name="add" size={35} color="#FFFFFF5D" />
                            </Pressable>
                        </View>

                    </View>
                </View>


                {
                    (numSongs > 0) ? 
                    <FlatList
                    data = {allSongsInThisPlaylist}
                    renderItem = {(item) => RenderFlatlistData(item)}
                    />
                    :
                        <View style={{
                            height: "100%",
                            width: "100%"
                        }}>
                            <TouchableHighlight onPress={navigateToShowSongs}>

                                <View style={{
                                    height: Dimensions.get("screen").height * 0.8,
                                    width: "100%",
                                    alignContent: "center",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    {/* <Icon name="add" size={100} color="#FFFFFF" style={{
                                    opacity: 0.5
                                }} /> */}
                                    <Text style={{
                                        color: "#FFFFFF5D",
                                        fontSize: 30,
                                        lineHeight: 40,
                                        fontFamily: "NotoSans-ExtraBold",
                                        textAlign: "center",
                                        paddingVertical: "7%",
                                        paddingHorizontal: "10%"
                                    }}>{`Add songs to this playlist`}</Text>
                                </View>
                            </TouchableHighlight>

                        </View>
                }

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


        </SafeAreaView>
    )

}

export default SongsInPlaylistView;

const SongsInPlaylistStyle = StyleSheet.create({
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
