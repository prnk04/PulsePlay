import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './reduxStore/store';
import { NavigationContainer } from '@react-navigation/native';


import Home from './src/Home';
import Main from './src/Main';
import Playlists from './src/Playlists';
import SongInfo from './src/SongInfo';
import SongsInPlaylistView from './src/SongsInPlaylistView';
import TrackLists from './src/TrackLists';
import TrackListWithEdit from './src/TracklistWithEdit';
import TrackPlayer, { Capability } from 'react-native-track-player';
import { PlaybackService } from './services/PlaybackService';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();



export default function App() {

  const setUpTrackPlayer = async () => {
    TrackPlayer.registerPlaybackService(() => PlaybackService);
    
    await TrackPlayer.setupPlayer()

    TrackPlayer.updateOptions({
      // Media controls capabilities
      capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
      ],
  
      // Capabilities that will show up when the notification is in the compact form on Android
      compactCapabilities: [Capability.Play, Capability.Pause],
  
      android: {

      }
  });
  }

  useEffect(() => {
    setUpTrackPlayer()
  })

  const [fontsLoaded] = useFonts({
    'NotoSans-Medium': require('./assets/fonts/NotoSans-Medium.ttf'),
    'NotoSans-Bold': require('./assets/fonts/NotoSans-Bold.ttf'),
    'NotoSans-ExtraBold': require('./assets/fonts/NotoSans-ExtraBold.ttf')
  });




  

  return (
    <Provider store={store} >
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
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


