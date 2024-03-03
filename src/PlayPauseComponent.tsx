import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Dimensions, TouchableHighlight, View } from 'react-native';
import TrackPlayer, { Event, State, Track } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentPlaylistInfo, updateCurrentSongInfo } from '../reduxStore/currentSongSlice';
import { addToSystemPlaylist } from '../reduxStore/playlistsSlice';
import { RootState } from '../reduxStore/store';

const PlayPauseComponent = (props: any) => {

    const [stateOfPlayback, setStateOfPlayback] = useState<State>(State.None)
    const [playlistInfoFromProps, setPlaylistInfoFromProps] = useState(props?.playlistInfo)
    const [playlistNameFromProps, setPlaylistNameFromProps] = useState(props?.playlistName)
    const [songInfoFromProps, setSongInfoFromProps] = useState(props?.songInfo)
    const [songIndexFromProps, setSongIndexFromProps] = useState(props?.songIndex)
    const [currentplayedSong, setCurrentlyPlayedSong] = useState<Track>()
    const [iconName, setIconName] = useState('play-circle')

    const prevPlayedPlaylistName = useSelector((state: RootState) => state.currSong.currentPlaylistName)
    const prevPlayedSongInfo = useSelector((state: RootState) => state.currSong.currSongInfo)
    const prevPlayedSongState = useSelector((state: RootState) => state.currSong.currentSongState)

    const dispatch = useDispatch();


    useLayoutEffect(() => {

        TrackPlayer.getPlaybackState()
            .then(
                (playbackState) => {
                    setStateOfPlayback(playbackState.state)
                }
            )

        TrackPlayer.getActiveTrack()
            .then(
                (activeTrack) => {
                    if (activeTrack) {
                        setCurrentlyPlayedSong(activeTrack)
                    }
                }
            )
    }, [props])

    useLayoutEffect(() => {
        
        if (prevPlayedSongInfo?.url == songInfoFromProps?.url) {
            if (prevPlayedSongState == State.Playing || prevPlayedSongState == State.Buffering || prevPlayedSongState == State.Loading || prevPlayedSongState == State.Loading) {
                setIconName('pause-circle')
            } else if (prevPlayedSongState == State.Ended || prevPlayedSongState == State.None || prevPlayedSongState == State.Paused || prevPlayedSongState == State.Stopped) {
                setIconName('play-circle')
            }
        } else {
            setIconName('play-circle')
        }
    }, [prevPlayedSongState, prevPlayedSongInfo?.url])


    const changePlaybackState = async () => {
        try {
            let playbackState = await TrackPlayer.getPlaybackState();

            if (playbackState.state == State.None) {
                // there is no song playing: load this playlist and play this song
                let p = await TrackPlayer.setQueue(playlistInfoFromProps);
                TrackPlayer.skip(songIndexFromProps);
                await TrackPlayer.play();
            }

            else if(playbackState.state == State.Ready) {
                await TrackPlayer.play();
            }

            else if (playbackState.state == State.Playing) {
                // check if the songs are the same
                let thisTrackInfo = await TrackPlayer.getActiveTrack()

                if (thisTrackInfo?.url == songInfoFromProps?.url) {
                    // same song is getting played; check the playlist

                    if (prevPlayedPlaylistName == props?.playlistName) {
                        await TrackPlayer.pause();
                    }
                    else {
                        await TrackPlayer.reset();
                       let p = await TrackPlayer.add(playlistInfoFromProps);
                        await TrackPlayer.skip(songIndexFromProps);
                        await TrackPlayer.play();
                    }

                } else {
                    if (prevPlayedPlaylistName == props?.playlistName) {
                        await TrackPlayer.pause();
                        await TrackPlayer.skip(songIndexFromProps);
                        await TrackPlayer.play();
                    } else {
                        await TrackPlayer.reset();
                        await TrackPlayer.add(playlistInfoFromProps);
                        await TrackPlayer.skip(songIndexFromProps);
                        await TrackPlayer.play();

                    }
                }
            }

            else if (playbackState.state == State.Paused) {
                // check if the songs are the same
               let thisTrackInfo = await TrackPlayer.getActiveTrack()

                if (thisTrackInfo?.url == songInfoFromProps?.url) {
                    // same song is getting played; check the playlist

                    if (prevPlayedPlaylistName == props?.playlistName) {
                        await TrackPlayer.play();
                    }
                    else {
                        await TrackPlayer.reset();
                        await TrackPlayer.add(playlistInfoFromProps);
                        await TrackPlayer.skip(songIndexFromProps);
                        await TrackPlayer.play();
                    }

                } else {

                    if (prevPlayedPlaylistName == props?.playlistName) {
                        await TrackPlayer.pause();
                        await TrackPlayer.skip(songIndexFromProps);
                        await TrackPlayer.play();
                    } else {
                        await TrackPlayer.reset();
                        await TrackPlayer.add(playlistInfoFromProps);
                        await TrackPlayer.skip(songIndexFromProps);
                        await TrackPlayer.play();
                    }
                }
            }
            else if (playbackState.state == State.Ended) {
                
            }

            let nowState = await TrackPlayer.getPlaybackState()
            setStateOfPlayback(nowState.state)

            let thisTrackInfo = await TrackPlayer.getActiveTrack()
            setCurrentlyPlayedSong(thisTrackInfo)


            if ((nowState.state == State.None || nowState.state == State.Paused || nowState.state == State.Stopped )
                && thisTrackInfo?.url == songInfoFromProps.url) {
                setIconName('play-circle')
            } else {
                setIconName('pause-circle')
            }

        } catch (error) {
            console.log("PlayPauseComponent: There was an error while playing or pausing this song: ", error)

        }
    }
    
    // useEffect(() => {
    //     console.log("playlist from props is: ", props?.playlistInfo)
    // }, [])

    return (
        <View>
            <TouchableHighlight onPress={changePlaybackState}>
                <Icon name={iconName} size={(props?.size) ? props?.size : Dimensions.get("screen").width * 0.08} color={(props?.color) ? props?.color : "#FFFFFF5D"} />
            </TouchableHighlight>
        </View>
    )

}

export default PlayPauseComponent;