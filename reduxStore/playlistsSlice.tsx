import { createSlice } from "@reduxjs/toolkit";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type playlistData = {
    name: string;
    totalNumberOfSongs: number;
    totalDuration: number;
    createdAt: any;
    id: string;
    songs: Array<{}>;
    songsId: Array<number>;

}

const initialState = {
    playlistMetaData: {
        numPlaylists: 0,
        playlistsData: new Array<playlistData>(),

    },
    recentlyPlayedSongs:{
        songs: new Array<any>(),
        totalSongs: 0
    }
}


export const playlistsSlice = createSlice({
    name: 'playlists',
    initialState: initialState,
    reducers: {

        createNewPlaylist: (state, action) => {
            state.playlistMetaData.numPlaylists += 1;
            let currentlyStoredPlaylists = state.playlistMetaData.playlistsData
            currentlyStoredPlaylists.splice(0, 0, {
                name: action.payload.playlistName,
                totalNumberOfSongs: 0,
                totalDuration: 0,
                createdAt: new Date().getTime(),
                id: uuidv4(),
                songs: new Array(),
                songsId: new Array()
            })
            state.playlistMetaData.playlistsData = currentlyStoredPlaylists
        },

        deletePlaylist: (state, action) => {
            // state.playlistMetaData.numPlaylists -= 1;
            let playlistId = action.payload.playlistDetails.id
            let playlistIndex = state.playlistMetaData.playlistsData.findIndex((a) => { return a.id == playlistId })
            state.playlistMetaData.playlistsData.splice(playlistIndex, 1)
        },

        addSingleSongToPlaylist: (state, action) => {
            
            let playlistToBeAddedToName = action.payload.playlistName;
            let songToBeAddedTo = action.payload.songInfo;

            state.playlistMetaData.playlistsData.map(
                (a) => {
                    if (a.name == playlistToBeAddedToName) {
                        a.totalNumberOfSongs += 1
                        a.songsId.splice(0, 0, songToBeAddedTo.id)
                        a.songs.splice(0, 0, songToBeAddedTo)
                        a.totalDuration += songToBeAddedTo.duration

                        return
                    }
                }
            )
        },

        addMultipleSongsToPlaylist: (state, action) => {
            let playlistToBeAddedToId = action.payload.playlistId;

            let songsIdsToBeAdded = new Array();
            let songsToBeAdded = action.payload.songInfo;

            let totalDurationToAdd = 0

            songsToBeAdded.map(
                (a: any) => {
                    songsIdsToBeAdded.push(a.id)
                    totalDurationToAdd + a.duration
                }
            )

            let currentStateOfThisPlaylist = state.playlistMetaData.playlistsData.filter((a) => { return a.id == playlistToBeAddedToId })

            let alreadyAddedSongId = currentStateOfThisPlaylist[0].songsId
            let alreadyAddedSongInfo = currentStateOfThisPlaylist[0].songs

            alreadyAddedSongId = songsIdsToBeAdded.concat(alreadyAddedSongId)

            alreadyAddedSongInfo = songsToBeAdded.concat(alreadyAddedSongInfo)

            state.playlistMetaData.playlistsData.map(
                (a) => {
                    if (a.id == playlistToBeAddedToId) {
                        a.songs = alreadyAddedSongInfo
                        a.songsId = alreadyAddedSongId
                        a.totalNumberOfSongs += songsIdsToBeAdded.length
                        a.totalDuration += totalDurationToAdd
                    }
                }
            )
        },

        addToSystemPlaylist: (state, action) => {
            try {
            const songToBeAdded = action.payload.songInfo;

            state.recentlyPlayedSongs.totalSongs += 1
            if (!state.recentlyPlayedSongs.songs.find((a) => {
                return a?.url == songToBeAdded.url}))
            state.recentlyPlayedSongs.songs.splice(0, 0, songToBeAdded)

            if (state.recentlyPlayedSongs.songs.length > 9) {
                state.recentlyPlayedSongs.songs.splice(9, 1)
            }
            state.recentlyPlayedSongs.totalSongs = state.recentlyPlayedSongs.songs.length
        } catch (error) {
                console.log("Error in adding to syatem playlist: ", error)
        }
        }
    }
})

export const { createNewPlaylist, deletePlaylist, addSingleSongToPlaylist, addMultipleSongsToPlaylist, addToSystemPlaylist } = playlistsSlice.actions

export const getPlaylistDetailsWithId = (id: any) => (state: { playlistsStored: { playlistMetaData: { playlistsData: any[]; }; }; }) => {
    return state.playlistsStored.playlistMetaData.playlistsData.filter(
        (a) => {
            return a.id == id
        }
    )[0]
}

export const getNumSongsInPlaylistWithId = (id: any) => (state: { playlistsStored: { playlistMetaData: { playlistsData: any[]; }; }; }) => {
    return state.playlistsStored.playlistMetaData.playlistsData.filter(
        (a) => {
            return (a.id == id)
        }
    )[0].totalNumberOfSongs
}


export const getIdsOfSongsInPlaylistWithId = (id: any) => (state: { playlistsStored: { playlistMetaData: { playlistsData: any[]; }; }; }) => {
    return state.playlistsStored.playlistMetaData.playlistsData.filter(
        (a) => {
            return (a.id == id)
        }
    )[0].songsId
}


export default playlistsSlice.reducer