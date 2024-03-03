import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../reduxStore/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrackPlayer, { Event, PlaybackActiveTrackChangedEvent, State, Track, useTrackPlayerEvents } from 'react-native-track-player';

import Main from './Main';
import Home from './Home';
import TrackLists from './TrackLists';
import SongInfo from './SongInfo';
import Playlists from './Playlists';
import SongsInPlaylistView from './SongsInPlaylistView';
import TrackListWithEdit from './TracklistWithEdit';
import { updateCurrentPlaylistInfo, updateCurrentSongInfo, updatePlaybackState } from '../reduxStore/currentSongSlice';
import { addToSystemPlaylist } from '../reduxStore/playlistsSlice';



const Stack = createNativeStackNavigator();

function MAinApp(): React.JSX.Element {

  const setUpTrackPlayer = async () => {
    await TrackPlayer.setupPlayer()
  }


  useEffect(() => {
    setUpTrackPlayer()
  }, [])

  const dispatch = useDispatch();

  

  const events = [
    Event.PlaybackState,
    Event.PlaybackError,
    Event.PlaybackActiveTrackChanged
  ];

  const [playerState, setPlayerState] = useState<State>()
  const [songBeingPlayed, setSongBeingPlayed] = useState<any>()

  useTrackPlayerEvents(events, (event) => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {

      dispatch(updatePlaybackState({ playbackState: event.state }))
      if (event.state == State.Ready) {


        if (songBeingPlayed) {

          dispatch(updateCurrentPlaylistInfo({
            playlistName: songBeingPlayed?.track?.album,
            songs: new Array(),
            currSongIndex: songBeingPlayed?.index
          }))

          dispatch(updateCurrentSongInfo({
            artist: songBeingPlayed?.track?.artist,
            artwork: songBeingPlayed?.track?.artwork,
            title: songBeingPlayed?.track?.title,
            id: 0,
            url: songBeingPlayed?.track?.url,
            album: songBeingPlayed.track?.album
          }))

          let songInfo1 = songBeingPlayed?.track
          if (songInfo1) {
            songInfo1.album = "Recently Played"
          }

          if (songInfo1) {
            dispatch(addToSystemPlaylist({ songInfo: songInfo1 }))
          }

        }
      }
    }

    if (event.type == Event.PlaybackActiveTrackChanged) {
      setSongBeingPlayed(event)
    }

  });

  const isPlaying = playerState === State.Playing;



  return (
    // <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen name="Main" component={Main} options={{
          headerTitle: "",
          headerShown: false,
          headerBackVisible: false
        }} />
        <Stack.Screen name="Playlists" component={Playlists} options={{
          headerTitle: "",
          headerShown: false,
          headerBackVisible: false
        }} />
        <Stack.Screen name="Home" component={Home} options={{
          headerTitle: "",
          headerShown: false,
          headerBackVisible: false
        }} />
        <Stack.Screen name="TrackLists" component={TrackLists} options={{
          headerTitle: "",
          headerShown: false,
          headerBackVisible: false
        }} />
        <Stack.Screen name="SongInfo" component={SongInfo} options={{
          headerTitle: "",
          headerShown: false,
          headerBackVisible: false
        }} />
        <Stack.Screen name="SongsInPlaylistView" component={SongsInPlaylistView} options={{
          headerTitle: "",
          headerShown: false,
          headerBackVisible: false
        }} />
        <Stack.Screen name="TrackListWithEdit" component={TrackListWithEdit} options={{
          headerTitle: "",
          headerShown: false,
          headerBackVisible: false
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MAinApp;
