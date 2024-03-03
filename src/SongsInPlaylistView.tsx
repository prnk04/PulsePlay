import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Dimensions, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux';
import { getNumSongsInPlaylistWithId, getPlaylistDetailsWithId } from '../reduxStore/playlistsSlice';
import { RootState } from '../reduxStore/store';
import { playThisSong } from '../services/SongsManipulation';
import PlayPauseComponent from './PlayPauseComponent';
import SongPlayingComponent from './SongPlayingComponent';

const SongsInPlaylistView = (props: any) => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const dispatch = useDispatch();

    const [currPlaylistName, setCurrPlaylistName] = React.useState('');
    const [allSongsInThisPlaylist, setAllSongsInThisPlaylist] = React.useState(new Array());

    const numSongs = useSelector(getNumSongsInPlaylistWithId(props?.route?.params?.playlistId))
    const currentPlaylistName = useSelector((state: RootState) => state.currSong.currentPlaylistName)
    const thisPlaylistData = useSelector(getPlaylistDetailsWithId(props?.route?.params?.playlistId))
    const currentSongState = useSelector((state: RootState) => state.currSong.currentSongState)
    const songId = useSelector((state: RootState) => state.currSong.currSongInfo?.id)


    React.useLayoutEffect(() => {
        
        setCurrPlaylistName(props?.route?.params?.playlistName)
        setAllSongsInThisPlaylist(thisPlaylistData?.songs)
        
    }, [props?.route?.params?.playlistName, thisPlaylistData?.songs])


    useEffect(() => {
        setAllSongsInThisPlaylist(thisPlaylistData?.songs)
    }, [thisPlaylistData?.songs])

    const navigateToShowSongs = () => {
        navigation.navigate("TrackListWithEdit", { playlistName: thisPlaylistData?.name, playlistId: props?.route?.params?.playlistId })
    }

    const navigateToTrackView = async (currSong: any, playlist: any, index: number, name: String) => {
        
        await playThisSong(currSong.url, currSong.artwork, currSong.artist, currSong.title, playlist, index, currentPlaylistName, name)

        // dispatch(updateCurrentPlaylistInfo({
        //     playlistName: name,
        //     songs: playlist,
        //     currSongIndex: index
        // }))
        // let playbackState = await TrackPlayer.getPlaybackState();

        // dispatch(updateCurrentSongInfo({
        //     artist: currSong?.artist,
        //     artwork: currSong?.artwork,
        //     title: currSong?.title,
        //     id: currSong.id,
        //     url: currSong?.url,
        //     playbackState: playbackState.state
        // }))

        // dispatch(addToSystemPlaylist({ songInfo: currSong }))


        navigation.navigate("SongInfo")
    }

    const RenderFlatlistData = (item: any) => {
    
        return (
            <View style={{
                paddingHorizontal: "5%",
                paddingVertical: "2%"
            }}>
                <TouchableHighlight
                    onPress={() => { 
                        navigateToTrackView(item.item, thisPlaylistData?.songs, item.index, thisPlaylistData?.name)
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
                                <PlayPauseComponent
                                        songInfo={item.item} playlistName={thisPlaylistData?.name} playlistInfo={thisPlaylistData?.songs}
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
                            data={allSongsInThisPlaylist}
                            renderItem={(item) => RenderFlatlistData(item)}
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
