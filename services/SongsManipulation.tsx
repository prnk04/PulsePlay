import TrackPlayer, { State } from 'react-native-track-player';

const playThisSong = async (songURL: string, artworkURL: string, artistName: string, songName: string, 
    playlistSongs: any, index: any, currentPlaylistName: String, prevPlaylistName: String) => {
    /*
    - take the song id, playlist name and id as arguments
    - check if any song is being played:
        - yes: stop the song; play this song
        - no: play this song
    - store the song id and playlist id and name in redux store of currently playing song and recently playing song
    */



    const playbackState = await TrackPlayer.getPlaybackState();


    // console.log("what is the state of the track player: ", trackPlayerState)

    if (playbackState.state == State.None) {

        // TrackPlayer.load({
        //     url: songURL,
        //     artwork: artworkURL,
        //     artist: artistName,
        //     title: songName,
        // })
        // await TrackPlayer.play();

        console.log("On function we got: ", playlistSongs)
        TrackPlayer.add(playlistSongs);
        TrackPlayer.skip(index);
        TrackPlayer.play();
    }
    else if (playbackState.state == State.Playing) {
        // find id the song is the same:
        // if yes: pause it, remove this song and play the current song
        let currSongInfo = await TrackPlayer.getActiveTrack()
        

        if (currSongInfo?.url == songURL && prevPlaylistName == currentPlaylistName) {
                await TrackPlayer.pause()
        } else {
            // TrackPlayer.load({
            //     url: songURL,
            //     artwork: artworkURL,
            //     artist: artistName,
            //     title: songName,
            // })
            await TrackPlayer.reset();
            await TrackPlayer.add(playlistSongs);
            await TrackPlayer.skip(index);
            await TrackPlayer.play();
        }
    }
    else if (playbackState.state == State.Paused) {
        // find id the song is the same:
        // if yes: pause it, remove this song and pause the current song
        let currSongInfo = await TrackPlayer.getActiveTrack()

        if (currSongInfo?.url == songURL && prevPlaylistName == currentPlaylistName) {
            await TrackPlayer.play();
        }
        else {
            // TrackPlayer.load({
            //     url: songURL,
            //     artwork: artworkURL,
            //     artist: artistName,
            //     title: songName,
            // })
            await TrackPlayer.reset();
            await TrackPlayer.add(playlistSongs);
            await TrackPlayer.skip(index);
            await TrackPlayer.play();
        }


    }

    else if (playbackState.state == State.Ended) {
        console.log("song ended");
        await TrackPlayer.play();
        console.log("now going to play")
    }

}

const playNextSong = async () => {
    let songsAlreadyInQueue = await TrackPlayer.getQueue();
    
    let currSongPos = await TrackPlayer.getActiveTrackIndex()

    if (currSongPos == songsAlreadyInQueue.length - 1) {
        await TrackPlayer.skip(0)
        
    } else {
        await TrackPlayer.skipToNext();
    }
    await TrackPlayer.play();

}

const playPreviousSong = async() => {

    let songsAlreadyInQueue = await TrackPlayer.getQueue();
    
    let currSongPos = await TrackPlayer.getActiveTrackIndex();

    let currSongPlayState = await TrackPlayer.getProgress();
    console.log("curr song state: ", currSongPlayState);
    if (currSongPlayState.position > 1 || currSongPos == 0) {
        await TrackPlayer.seekTo(0);
        TrackPlayer.play();
    } else {
        await TrackPlayer.skipToPrevious();
        await TrackPlayer.play();
    }

}

export { playThisSong, playNextSong, playPreviousSong };