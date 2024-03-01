import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    playlistMetadata: new Array()
}

/**
 * functions:
 * create new playlist: name, totalSongs: 0, id: curr playlists.length , duration: 0, 
 * update the playlist: new vals
 * delete the playlist
 */

export const playlistMetadataSlice = createSlice({
    name: 'playlistMetaData',
    initialState,
    reducers: {
        createNewPlaylist: (state, action) => {

            let playlistExists = state.playlistMetadata.find(
                function (item) {
                    return item.name?.toLowerCase() == action.payload.toLowerCase()

                }
            )

            if (!playlistExists)
                state.playlistMetadata.push({
                    "name": action.payload,
                    "totalSongs" : 0,
                    "id" : state.playlistMetadata.length,
                    "duration" : 0
                })
        },
        
    }

})

export const { createNewPlaylist } = playlistMetadataSlice.actions

export default playlistMetadataSlice.reducer;

export const getPlaylistMetadata = (state: any) => state.playlistMetadata