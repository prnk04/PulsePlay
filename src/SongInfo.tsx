import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Dimensions, Image, Modal, Pressable, SafeAreaView, Text, TouchableHighlight, View, TextInput } from 'react-native';
import TrackPlayer, { State, useProgress } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';

import { RootState } from '../reduxStore/store';
import { updateCurrentPlaylistInfo, updateCurrentSongInfo } from '../reduxStore/currentSongSlice';
import { addSingleSongToPlaylist, addToSystemPlaylist, createNewPlaylist } from '../reduxStore/playlistsSlice';


const SongInfo = () => {

    const navigation = useNavigation();

    const dispatch = useDispatch();

    const [showModalToAddSongToPlaylist, setShowModalToAddSongToPlaylist] = useState(false);
    const [playlistNameToBeAddedTo, setPlaylistNameToBeAddedTo] = useState('')
    const [showRedBorder, setShowRedBorder] = useState(false)
    const [showIcons, setShowIcons] = useState(false)

    const currentSongState = useSelector((state: RootState) => state.currSong.currentSongState)
    const artworkURL = useSelector((state: RootState) => state.currSong.currSongInfo?.artwork)
    const songName = useSelector((state: RootState) => state.currSong.currSongInfo?.title)
    const artistName = useSelector((state: RootState) => state.currSong.currSongInfo?.artist)
    const songId = useSelector((state: RootState) => state.currSong.currSongInfo?.id)
    const songURL = useSelector((state: RootState) => state.currSong.currSongInfo?.url)
    const currSongInfo = useSelector((state: RootState) => state.currSong.currSongInfo)
    const currentPlaylistName = useSelector((state: RootState) => state.currSong.currentPlaylistName)
    const allPlaylists = useSelector((state: RootState) => state.playlistsStored.playlistMetaData.playlistsData)

    const prevPlaylistInfo = useSelector((state: RootState) => state.currSong.currPlaylistInfo?.songs)
    const prevSongIndex = useSelector((state: RootState) => state.currSong.currPlaylistInfo?.currPlayingSongIndex)
    const prevPlaylistName = useSelector((state: RootState) => state.currSong?.currPlaylistInfo?.name)
    const prevPlayedSongState = useSelector((state: RootState) => state.currSong?.currentSongState)

    const [iconName, setIconName] = useState('pause')

    const progress = useProgress();

    useLayoutEffect(() => {
        if (prevPlayedSongState == State.Playing || prevPlayedSongState == State.Buffering || prevPlayedSongState == State.Loading || prevPlayedSongState == State.Loading) {
            setIconName('pause')
        } else if (prevPlayedSongState == State.Ended || prevPlayedSongState == State.Paused || prevPlayedSongState == State.Stopped) {
            setIconName('play')
        }

    }, [prevPlayedSongState])

    // const updateData = async (event: PlaybackActiveTrackChangedEvent) => {

    //     let nowState = await TrackPlayer.getPlaybackState()

    //     dispatch(updateCurrentSongInfo({
    //         artist: event?.track?.artist,
    //         artwork: event?.track?.artwork,
    //         title: event?.track?.title,
    //         id: event?.track?.id,
    //         playbackState: nowState.state,
    //         url: event?.track?.url
    //     }))

    //     dispatch(updateCurrentPlaylistInfo({
    //         playlistName: prevPlaylistName,
    //         songs: prevPlaylistInfo,
    //         currSongIndex: event?.index
    //     }))

    //     dispatch(addToSystemPlaylist({ songInfo: event?.track }))
    // }

    // useEffect(() => {
    //     TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
    //         updateData(event)
    //     })
    // })


    const playOrPauseSong = async () => {
        try {

            let playbackState = await TrackPlayer.getPlaybackState();

            if (playbackState.state == State.Playing) {
                await TrackPlayer.pause();
            }

            else if (playbackState.state == State.Paused) {
                await TrackPlayer.play();
            }

            // let nowState = await TrackPlayer.getPlaybackState()
            // let thisTrackInfo = await TrackPlayer.getActiveTrack()

            // if ((nowState.state == State.None || nowState.state == State.Paused || nowState.state == State.Stopped || nowState.state == State.Error)
            // ) {
            //     setIconName('play')
            // } else {
            //     setIconName('pause')
            // }

            // dispatch(updateCurrentSongInfo({
            //     artist: thisTrackInfo?.artist,
            //     artwork: thisTrackInfo?.artwork,
            //     title: thisTrackInfo?.title,
            //     id: songId,
            //     url: thisTrackInfo?.url,
            //     playbackState: nowState.state
            // }))

            // dispatch(addToSystemPlaylist({ songInfo: thisTrackInfo }))

        } catch (error) {
            console.log("There was an error while playing or pausing this song on Song Info: ", error)

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
                url: currSong?.url
            }))

            dispatch(updateCurrentPlaylistInfo({
                playlistName: prevPlaylistName,
                songs: prevPlaylistInfo,
                currSongIndex: newIndex
            }))

            dispatch(addToSystemPlaylist({ songInfo: currSong }))

        } catch (error) {
            console.log("song info error: ", error)
        }

    }

    const playPrevSong = async () => {

        let currSongPos = await TrackPlayer.getActiveTrackIndex();

        let newIndex = 0
        if (currSongPos == 0) {
            await TrackPlayer.seekTo(0);
            TrackPlayer.play();
        } else {
            newIndex -= 1
            await TrackPlayer.skipToPrevious();
            let currSong = await TrackPlayer.getActiveTrack();

            await TrackPlayer.play();

            let songState = await TrackPlayer.getPlaybackState();

            dispatch(updateCurrentSongInfo({
                artist: currSong?.artist,
                artwork: currSong?.artwork,
                title: currSong?.title,
                id: currSong?.id,
                playbackState: songState.state,
                url: currSong?.url
            }))

            dispatch(updateCurrentPlaylistInfo({
                playlistName: prevPlaylistName,
                songs: prevPlaylistInfo,
                currSongIndex: newIndex
            }))

            dispatch(addToSystemPlaylist({ songInfo: currSong }))
        }

    }

    const createPlaylist = () => {
        let modifiedSongIfo = {
            artist: currSongInfo.artist,
            artwork: currSongInfo.artwork,
            duration: 0,
            id: currSongInfo.id,
            title: currSongInfo.title,
            url: currSongInfo.url
        }

        let existingPlaylistNames = new Array();
        allPlaylists.map(
            (a) => existingPlaylistNames.push(a.name.trim().toLowerCase())
        )

        if (existingPlaylistNames.includes(playlistNameToBeAddedTo.trim().toLowerCase())) {
            Alert.alert("Playlist exists");
            setShowRedBorder(true)
            return
        }

        setPlaylistNameToBeAddedTo("")

        try {
            dispatch(createNewPlaylist({ playlistName: playlistNameToBeAddedTo }))
            dispatch(addSingleSongToPlaylist({
                playlistName: playlistNameToBeAddedTo,
                songInfo: modifiedSongIfo
            }))

            setShowModalToAddSongToPlaylist(false);
            Alert.alert('Song Added')
        } catch (error) {
            console.log("error in dispatching: ", error)
        }
    }

    const addSongToThisPlaylist = (tobeAddedTo: any) => {

        let modifiedSongIfo = {
            artist: currSongInfo.artist,
            artwork: currSongInfo.artwork,
            duration: 0,
            id: currSongInfo.id,
            title: currSongInfo.title,
            url: currSongInfo.url
        }

        dispatch(addSingleSongToPlaylist({
            playlistName: tobeAddedTo,
            songInfo: modifiedSongIfo
        }))

        setShowModalToAddSongToPlaylist(false);
        Alert.alert('Song Added')

    }

    return (
        <SafeAreaView style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#002941",
        }}>

            <View style={{
                height: "100%",
                width: "100%"
            }}>
                <View style={{
                    padding: "5%",
                    flex: 1
                }}>

                    {/* header view */}
                    <View style={{
                        flex: 1
                    }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>

                            <View>
                                <Pressable onPress={() => navigation.goBack()}>
                                    <Icon name="chevron-back" size={35} color="#FFFFFF" />
                                </Pressable>
                            </View>

                            <View>
                                <Pressable onPress={() => setShowModalToAddSongToPlaylist(true)}>
                                    <Icon name="add" size={35} color="#FFFFFF" />
                                </Pressable>
                            </View>

                        </View>
                    </View>


                    {/* body view */}

                    <View style={{
                        paddingVertical: "5%",
                        flex: 5,

                    }}>
                        <View style={{
                            alignSelf: "center",

                        }}>
                            <View style={{
                                shadowColor: 'white',
                                shadowOffset: { width: -2, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                backgroundColor: '#0000000D'
                            }}>
                                <Image
                                    source={(artworkURL && artworkURL != "") ? { uri: artworkURL } : { uri: 'https://cdn.pixabay.com/photo/2013/07/12/18/17/equalizer-153212_1280.png' }}
                                    style={{
                                        height: Dimensions.get("screen").height * 0.3,
                                        width: Dimensions.get("screen").height * 0.3,
                                        borderRadius: Dimensions.get("screen").height * 0.3 * 0.5,
                                        alignSelf: "center",
                                        opacity: 0.7,
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{
                            paddingVertical: "5%",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <View style={{
                                paddingTop: "2%"
                            }}>
                                <Text style={{
                                    color: "#FFFFFF",
                                    fontFamily: "NotoSans-Bold",
                                    fontWeight: "500",
                                    fontSize: 25,
                                    textAlignVertical: "center",
                                    lineHeight: 35,

                                }}
                                    numberOfLines={1}
                                >{songName}</Text>
                            </View>
                            <View>
                                <Text style={{
                                    color: "#FFFFFF",
                                    fontFamily: "NotoSans-Medium",
                                    fontWeight: "500",
                                    fontSize: 15,
                                    textAlignVertical: "center",
                                    lineHeight: 25,

                                }}>{artistName}</Text>
                            </View>
                        </View>

                        <View>
                            <Slider
                                maximumValue={Dimensions.get("window").width * 0.9}
                                minimumValue={0}
                                style={{ width: (Dimensions.get("window").width * 0.9), height: 20 }}
                                value={(Number(progress.position * ((Dimensions.get("window").width * 0.9) / progress.duration))) || 0}
                                minimumTrackTintColor="#FFFFFF"
                                disabled
                            />
                        </View>
                    </View>

                    <View style={{
                        flex: 3,
                        alignContent: "center",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        paddingVertical: "5%",
                    }}>

                        <View>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                width: Dimensions.get("screen").width * 0.8
                            }}>

                                <View style={{
                                    alignContent: "center",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <TouchableHighlight onPress={playPrevSong}>
                                        <Icon name="play-skip-back" size={Dimensions.get("screen").height * 0.04} color="#FFFFFF" />
                                    </TouchableHighlight>
                                </View>
                                <View style={{
                                    height: Dimensions.get("screen").height * 0.1,
                                    width: Dimensions.get("screen").height * 0.1,
                                    borderRadius: Dimensions.get("screen").height * 0.1 * 0.5,
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    alignContent: "center",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <Pressable onPress={() => playOrPauseSong()}>
                                        {/* {
                                            (currentSongState == "playing") ?
                                                <Icon name="pause" size={Dimensions.get("screen").height * 0.05} color="white" />
                                                :
                                                <Icon name="play" size={Dimensions.get("screen").height * 0.05} color="white" />

                                        } */}

                                        <Icon name={iconName} size={Dimensions.get("screen").height * 0.05} color="white" />

                                    </Pressable>
                                </View>
                                <View style={{
                                    alignContent: "center",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <TouchableHighlight onPress={skipNext}>
                                        <Icon name="play-skip-forward" size={Dimensions.get("screen").height * 0.04} color="#FFFFFF" />
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>


            <Modal visible={showModalToAddSongToPlaylist}
                animationType='slide'
                transparent

            >
                <SafeAreaView style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#002941"

                }}>
                    <TouchableHighlight onPress={() => {
                        setPlaylistNameToBeAddedTo(''); setShowRedBorder(false);
                        setShowModalToAddSongToPlaylist(false);
                        setShowIcons(false)

                    }} style={{
                        width: "100%",
                        height: "100%",

                    }}>
                        <View style={{
                            width: "100%",
                            backgroundColor: "#0029417D",
                            alignSelf: "flex-end"
                        }}>
                            <Pressable onPress={() => {
                                setPlaylistNameToBeAddedTo(''); setShowRedBorder(false);
                                setShowModalToAddSongToPlaylist(false);
                                setShowIcons(false)
                            }}>
                                <View style={{
                                    paddingVertical: "5%",
                                    alignContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    borderWidth: 1,
                                    backgroundColor: "#0000003D"
                                }}>
                                    <View style={{
                                        paddingHorizontal: "5%",
                                        alignSelf: "flex-start",
                                        flex: 1
                                    }}>
                                        <Icon name="chevron-down-outline" size={Dimensions.get("screen").width * 0.08}
                                            color="#FFFFFF7D"
                                        />
                                    </View>
                                    <View style={{
                                        alignSelf: "center",
                                        flex: 1,

                                    }}>
                                        <Text style={{
                                            fontFamily: "NotoSans-Medium",
                                            fontSize: 20,
                                            lineHeight: 30,
                                            fontWeight: "500",
                                            color: "white",
                                            textAlignVertical: "center"
                                        }}>Add to</Text>
                                    </View>
                                    <View style={{
                                        flex: 1
                                    }} />
                                </View>
                            </Pressable>
                            <View style={{
                                paddingHorizontal: "5%",
                                paddingVertical: "2%"
                            }}>

                                <View>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        paddingVertical: "3%"
                                    }}>
                                        <TextInput style={{
                                            fontFamily: "NotoSans-Medium",
                                            fontWeight: "500",
                                            lineHeight: 30,
                                            fontSize: 20,
                                            color: "#FFFFFF",
                                            borderBottomColor: (showRedBorder) ? "red" : "transparent",
                                            borderBottomWidth: (showRedBorder) ? 1 : 0
                                        }}
                                            value={playlistNameToBeAddedTo}
                                            onChangeText={(text) => { setPlaylistNameToBeAddedTo(text); setShowRedBorder(false) }}
                                            placeholder='Create new playlist'
                                            placeholderTextColor="#FFFFFF7D"
                                            onFocus={() => setShowIcons(true)}
                                            autoFocus={false}
                                        />
                                        {
                                            showIcons ?


                                                <View style={{
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    width: Dimensions.get("screen").width * 0.2


                                                }}>
                                                    <Pressable
                                                        onPress={createPlaylist}
                                                    >
                                                        <Icon name="checkmark-outline" size={35} color="#FFFFFF" />
                                                    </Pressable>
                                                    <Pressable
                                                        onPress={() => { setPlaylistNameToBeAddedTo(""); setShowRedBorder(false) }}
                                                    >
                                                        <Icon name="close" size={35} color="#FFFFFF" />
                                                    </Pressable>
                                                </View>
                                                : null
                                        }

                                    </View>
                                </View>

                                {
                                    allPlaylists.map(
                                        (a) => {
                                            return (
                                                <TouchableHighlight onPress={() => addSongToThisPlaylist(a.name)} key={'Pressable_' + a.id}>
                                                    <View style={{
                                                        paddingVertical: "3%"
                                                    }}
                                                        key={'View_' + a.id}>
                                                        <Text style={{
                                                            fontFamily: "NotoSans-Medium",
                                                            fontSize: 20,
                                                            lineHeight: 30,
                                                            fontWeight: "500",
                                                            color: "white",
                                                            textAlignVertical: "center"
                                                        }}
                                                            key={'Text_' + a.id}>{a.name}</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            )
                                        }
                                    )
                                }
                            </View>
                        </View>
                    </TouchableHighlight>
                </SafeAreaView>
            </Modal>

        </SafeAreaView>
    )


}

export default SongInfo;


