import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currSongInfo: {
        artistName: "",
        artworkURL: "",
        songName: "",
        id: -1,
        url: ""
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
            // state.currSongInfo = action.payload.currSongInfo;
            state.currSongInfo.artistName = action.payload.artistName;
            state.currSongInfo.artworkURL = action.payload.artworkURL;
            state.currSongInfo.songName = action.payload.songName;
            state.currSongInfo.id = action.payload.id;
            state.currSongInfo.url = action.payload.url;

            state.currentSongState = action.payload.songState;
        },

        updateCurrentPlaylistInfo: (state, action) => {
        //     state.currPlaylistInfo.name = action.payload.playlistName,
        //     state.currPlaylistInfo.songs = action.payload.songs,
        //     state.currPlaylistInfo.currPlayingSongIndex = action.payload.currSongIndex
        // },
        state.currentPlaylistName = action.payload
        },

        addToRecentlyPlayed: (state, action) => {
            let x = state.recentlyPlayedSongsInfo

            let tempVar = {
                artistName : action.payload.artistName,
                artworkURL : action.payload.artworkURL,
                songName : action.payload.songName,
                id : action.payload.id,
                url: action.payload.url
            }
            
            

            x.push(tempVar)
        }
        
    }

})

export const {updateCurrentSongInfo, addToRecentlyPlayed, updateCurrentPlaylistInfo } = currentSongSlice.actions

export default currentSongSlice.reducer