import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userPlaylists: new Array()
}

export const userPlaylistSlice = createSlice({
    name: 'userPlaylist',
    initialState,
    reducers: {
        createNewPlaylist: (state, action) => {

            let playlistExists = state.userPlaylists.find(
                function (item) {
                    return item.name?.toLowerCase() == action.payload.toLowerCase()

                }
            )

            if (!playlistExists)
                state.userPlaylists.push({
                    "name": action.payload,
                    "songs": new Array()
                })
        },
        addSongToPlaylist: (state, action) => {

            
            state.userPlaylists.map(
                (a) => {
                    if (a.name == action.payload.playlistName) {
                        if (!a.songs.find(function(item: string){return item.toLowerCase().trim() == action.payload.song.toLowerCase().trim()}))
                        a.songs.splice(0,0,action.payload.song)
                    }
                }
            )

            // state.userPlaylists[action.payload.playlistName].push(action.payload.songName)

        },
        createPlaylistAndAddSong: (state, action) => {
            let newSongs = new Array();
            newSongs.push(action.payload.song)
            state.userPlaylists.push({
                "name": action.payload.playlistName,
                "songs": newSongs
            })
        }
    }

})

export const { createNewPlaylist, addSongToPlaylist, createPlaylistAndAddSong } = userPlaylistSlice.actions

export default userPlaylistSlice.reducer