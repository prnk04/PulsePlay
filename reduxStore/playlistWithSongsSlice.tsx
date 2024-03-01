import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    songsInPlaylist: new Array({
        name: "",
        songs: new Array()
    })
}

/**
 * functions:
 * add song to playlist: calculate duration; add duration and count on other slice
 * delete song from playlist: calculate duration; update duration and count on other slice
 * delete the playlist
 */

export const playlistWithSongsSlice = createSlice({
    name: 'playlistWithSongs',
    initialState,
    reducers: {
        
        addMultipleSongToPlaylist: (state, action) => {

            
            // state.songsInPlaylist.map(
            //     (a) => {
            //         if (a.name == action.payload.playlistName) {
            //             console.log("exists: ", a.songs.find(function(item: string){return item.toLowerCase().trim() == action.payload.song.toLowerCase().trim()}))
            //             if (!a.songs.find(function(item: string){return item.toLowerCase().trim() == action.payload.song.toLowerCase().trim()}))
            //             a.songs.splice(0,0,action.payload.song)
            //         }
            //     }
            // )

            // state.userPlaylists[action.payload.playlistName].push(action.payload.songName)

        },
        addSingleSongToPlaylist: (state, action) => {

            state.songsInPlaylist.push({
                name: action.payload.playlistName,
                songs: action.payload.songs
            })

            
            // state.songsInPlaylist.map(
            //     (a) => {
            //         if (a.name == action.payload.playlistName) {
            //             console.log("exists: ", a.songs.find(function(item: string){return item.toLowerCase().trim() == action.payload.song.toLowerCase().trim()}))
            //             if (!a.songs.find(function(item: string){return item.toLowerCase().trim() == action.payload.song.toLowerCase().trim()}))
            //             a.songs.splice(0,0,action.payload.song)
            //         }
            //     }
            // )

            // state.userPlaylists[action.payload.playlistName].push(action.payload.songName)

        },
        createPlaylistAndAddSong: (state, action) => {
            let newSongs = new Array();
            newSongs.push(action.payload.song)
            state.songsInPlaylist.push({
                "name": action.payload.playlistName,
                "songs": newSongs
            })
        }
    }

})

export const { addMultipleSongToPlaylist, addSingleSongToPlaylist, createPlaylistAndAddSong } = playlistWithSongsSlice.actions

export default playlistWithSongsSlice.reducer