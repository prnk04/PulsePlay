import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './reduxStore/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrackPlayer, {  } from 'react-native-track-player';

import MAinApp from './src/MainApp';


const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {

  const setUpTrackPlayer = async () => {
    await TrackPlayer.setupPlayer()
  }


  useEffect(() => {
    setUpTrackPlayer()
  }, [])

  return (
    <Provider store={store}>
      {/* <NavigationContainer>
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
      </NavigationContainer> */}

      <MAinApp></MAinApp>
    </Provider>
  );
}

export default App;
