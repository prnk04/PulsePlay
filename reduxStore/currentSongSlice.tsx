import { createSlice } from '@reduxjs/toolkit'
import TrackPlayer, { State } from 'react-native-track-player';

const initialState = {
    currSongInfo: {
        artist: "",
        artwork: "",
        title: "",
        id: -1,
        url: "",
        album: ""
    },
    currentSongState: "",
    recentlyPlayedSongsInfo: new Array(),
    currPlaylistInfo: {
        name: "",
        songs: new Array(),
        currPlayingSongIndex: -1
    },
    currentPlaylistName: ""
}


export const currentSongSlice = createSlice({
    name: 'currentSongs',
    initialState,
    reducers: {

        updateCurrentSongInfo: (state, action) => {
            // state.currSongInfo = action.payload.currSongInfo
            state.currSongInfo.artist = action.payload.artist;
            state.currSongInfo.artwork = action.payload.artwork;
            state.currSongInfo.title = action.payload.title;
            state.currSongInfo.id = action.payload.id;
            state.currSongInfo.url = action.payload.url;
            // state.currentSongState = action.payload.playbackState;
            state.currSongInfo.album = action.payload.album;
        },

        updatePlaybackState: (state, action) => {
            state.currentSongState = action.payload.playbackState
        },

        updateCurrentPlaylistInfo: (state, action) => {
            state.currPlaylistInfo.name = action.payload.playlistName
            state.currPlaylistInfo.songs = action.payload.songs
            state.currPlaylistInfo.currPlayingSongIndex = action.payload.currSongIndex

            state.currentPlaylistName = action.payload.playlistName
        },

        addToRecentlyPlayed: (state, action) => {
            let x = state.recentlyPlayedSongsInfo

            let tempVar = {
                artistName: action.payload.artistName,
                artworkURL: action.payload.artworkURL,
                songName: action.payload.songName,
                id: action.payload.id,
                url: action.payload.url
            }

            x.push(tempVar)
        }

    }

})

export const { updateCurrentSongInfo, addToRecentlyPlayed, updateCurrentPlaylistInfo, updatePlaybackState } = currentSongSlice.actions

export default currentSongSlice.reducer