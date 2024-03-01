import React, { useEffect, useLayoutEffect, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import TrackPlayer, { State } from 'react-native-track-player';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SongPlayingComponent from "./SongPlayingComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";

import * as allSongs from '../data/allSongs.json'
import { addMultipleSongsToPlaylist, addSingleSongToPlaylist, getIdsOfSongsInPlaylistWithId, getNumSongsInPlaylistWithId } from "../reduxStore/playlistsSlice";



const TrackListWithEdit = (props: any) => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();


    const [currSongInfo, setCurrSongInfo] = useState({})

    const [selectedSongs, setSelectedSongs] = useState(new Array());

    const [selectedSongsId, setSelectedSongsId] = useState(new Array());

    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const [categoryName, setCategoryName] = useState('');
    const [allSongsForThisCategory, setAllSongsForThisCategory] = useState(new Array());
    const currentSongState = useSelector((state: RootState) => state.currSong.currentSongState)
    const [thisPlaylistId, setThisPlaylistId] = useState('')

    const [allSongsData, setAllSongsData] = useState(new Array());
    const dispatch = useDispatch();

    const allSongsId = useSelector(getIdsOfSongsInPlaylistWithId(props?.route?.params?.playlistId))

    
    const selectThisSong = (songData: any) => {
        let prevSelection = new Array();
        prevSelection = selectedSongsId;
        if (prevSelection.indexOf(songData.id) != -1) {
            prevSelection.splice(prevSelection.indexOf(songData.id), 1)
        } else {
            prevSelection.push(songData.id)
        }

        setSelectedSongsId(prevSelection)
        forceUpdate()
    }

    const RenderFlatList = (item: any) => {
        // console.log("item: ", item)
        return (
            <View style={{
                paddingHorizontal: "5%",
                paddingVertical: "2%"
            }}>



                <TouchableHighlight
                    // onPress={() => {
                    //     try {
                    //         console.log("I am trying to move");
                    //         setCurrSongInfo(item.item)
                    //         setShowBanner(true)
                    //         // navigation.navigate("SongInfo", {songInfo: item.item})
                    //         navigation.navigate(
                    //             "SongInfo", {
                    //             "category": categoryName,
                    //             "tracks": allSongsForThisCategory,
                    //             "songInfo": item.item,
                    //             index: item.index
                    //         }
                    //         )
                    //     } catch (error) {
                    //         console.log("Move failed: ", error)
                    //     }

                    // }}

                    onPress={() => {
                        selectThisSong(item.item)
                    }}
                >
                    <View style={{
                        paddingVertical: "2%",
                        paddingHorizontal: "1%",
                        // backgroundColor: "#0000005D",
                        borderRadius: 5,
                        // height: Dimensions.get("screen").height * 0.1
                    }}>
                        <View style={{
                            flexDirection: "row",
                        }}>
                            <View style={{
                                paddingHorizontal: "2%",
                            }}>
                                <Image source={(item.item.artwork && item.item.artwork != "") ? { uri: item.item.artwork } : { uri: 'https://cdn.pixabay.com/photo/2013/07/12/18/17/equalizer-153212_1280.png' }}
                                    style={TrackListStyle.artworkStyle}
                                />

                            </View>
                            <View style={{
                                flexDirection: "row",
                                paddingHorizontal: "2%",
                                justifyContent: "space-between",
                                width: Dimensions.get("screen").width * 0.78
                            }}>
                                <View style={{
                                    maxWidth: Dimensions.get("screen").width * 0.6
                                }}>
                                    <Text
                                        numberOfLines={1}
                                        style={TrackListStyle.titleTrack}>{item.item.title}</Text>
                                    <View>
                                        <Text style={TrackListStyle.artistName}>{item.item.artist}</Text>
                                    </View>

                                </View>

                                <View>
                                    {/* {
                                        (selectedSongsId.indexOf(item.item.id) != -1) 
                                        ?
                                        <Icon name="checkmark-circle-outline" size={Dimensions.get("screen").width * 0.08} color="#FFFFFF5D" />
                                        :
                                        <Icon name="ellipse-outline" size={Dimensions.get("screen").width * 0.08} color="#FFFFFF5D" />
                                    } */}

                                    <Icon
                                        name={(selectedSongsId.indexOf(item.item.id) != -1) ? "checkmark-circle-outline" : "ellipse-outline"}
                                        size={Dimensions.get("screen").width * 0.08} color="#FFFFFF5D" />

                                </View>

                            </View>

                        </View>
                    </View>
                </TouchableHighlight>

            </View>
        )

    }




    useLayoutEffect(() => {

        console.log("props are: ", props?.route?.params)

        let catName = props?.route?.params?.playlistName
        

        setCategoryName(catName);
        setThisPlaylistId(props?.route?.params?.playlistId)
        console.log("songs already in this playlist: ", allSongsId)

        let tempArray = new Array();

        allSongs.categories.map(
            (a) => {
                a.categories.map(
                    (b) => {
                        b.songs.map(
                            (c) => {
                                if (tempArray.find((item) => { return item.id == c.id }) || allSongsId.includes(c.id)) {

                                } else 
                                    tempArray.push(c)
                            }
                        )
                    }
                )
            }
        )
        setAllSongsForThisCategory(tempArray)

    }, [navigation])


    const addSongsToPlaylist = () => {

        let allSongsInfo = new Array();
        allSongsInfo = allSongsForThisCategory.filter(
            (a) => {
                return selectedSongsId.includes(a.id)
            }
        )

        if (selectedSongsId.length == 0) {


        }
        else {
            dispatch(addMultipleSongsToPlaylist({
                playlistName: categoryName,
                playlistId: thisPlaylistId,
                songInfo: allSongsInfo
            }))

        }

        navigation.goBack();

    }


    return (
        <SafeAreaView style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#002941"
        }}>

            <View style={{
                flex: 1
            }}>

                <View style={{
                    height: "100%",
                    width: "100%",
                    flex: 1,

                }}>
                    <View style={{
                        padding: "5%",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Icon name="chevron-back" size={35} color="#FFFFFF5D" />
                        </Pressable>

                        <View>
                            {/* <Text style={{
                            color: "#FFFFFF7D",
                            fontFamily: "NotoSans-Bold",
                            fontWeight: "500",
                            fontSize: 30,
                            textAlignVertical: "center",
                            lineHeight: 35,
                        }}>{categoryName}</Text> */}
                        </View>
                        <View>
                            <TouchableHighlight onPress={addSongsToPlaylist}>
                                <Text style={{
                                    color: "#FFFFFF7D",
                                    fontFamily: "NotoSans-Bold",
                                    fontWeight: "500",
                                    fontSize: 20,
                                    textAlignVertical: "center",
                                    lineHeight: 35,
                                }}>{`Add`}</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <FlatList
                        data={allSongsForThisCategory}
                        renderItem={RenderFlatList}
                    />

                </View>


                {/* <View style={{
                flex: -1,
                // backgroundColor: "pink",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                display: (showBanner) ? "flex" : "none"

            }}>
                <View style={{
                    paddingVertical: "5%",
                    // padding: "2%",
                    width: Dimensions.get("screen").width * 0.9,
                    alignSelf:"center"


                }}>
                    <Pressable style={{
                    }}
                        onPress={() => navigation.navigate("SongInfo", { songInfo: currSongInfo })}
                    >
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>

                            <View style={{
                                
                            }}>
                                <Image source={(currSongInfo.artwork == "" || currSongInfo.artwork == null) ?
                                    { uri: 'https://cdn.pixabay.com/photo/2013/07/12/18/17/equalizer-153212_1280.png' } : { uri: currSongInfo.artwork }}
                                    style={{
                                        height: Dimensions.get("screen").width * 0.1,
                                        aspectRatio: 1,
                                        borderRadius: Dimensions.get("screen").width * 0.1 * 0.5
                                    }} />

                            </View>

                            <View style={{
                                // flex: 4
                                width: Dimensions.get("screen").width * 0.4,
                                // alignItems: "center",
                                paddingLeft: "3%"
                            }}>

                                <Text style={{
                                    color: "#FFFFFF7D",
                                    fontFamily: "NotoSans-Bold",
                                    fontWeight: "500",
                                    fontSize: 20,
                                    textAlignVertical: "center",
                                    lineHeight: 25,

                                }}>{currSongInfo.title}</Text>
                                <Text style={{
                                    color: "#FFFFFF7D",
                                    fontFamily: "NotoSans-Medium",
                                    fontWeight: "500",
                                    fontSize: 12,
                                    textAlignVertical: "center",
                                    lineHeight: 15,

                                }}>{currSongInfo.artist}</Text>



                            </View>

                            <View style={{
                                // flex: 2
                                width: Dimensions.get("screen").width * 0.3
                            }}>

                                <View style={{
                                    justifyContent: "space-evenly",
                                    flexDirection: "row"
                                }}>

                                    <Icon name="pause" size={30} color="#FFFFFF5D" />
                                    <Icon name="play-skip-forward" size={30} color="#FFFFFF5D" />

                                </View>

                            </View>

                        </View>

                    </Pressable>

                </View>

            </View> */}



                {
                    (currentSongState) ?
                        <View style={{
                            flex: -1
                        }}>
                            <SongPlayingComponent />
                        </View>
                        : null
                }
            </View>

        </SafeAreaView>
    )
}

const TrackListStyle = StyleSheet.create({
    headers2: {
        fontFamily: "NotoSans-Bold",
        fontSize: 25,
        lineHeight: 31,
        fontWeight: "500",
        color: "#FFFFFF8D"
    },
    titleTrack: {
        fontFamily: "NotoSans-Medium",
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "400",
        color: "#FFFFFF",

    },
    artistName: {
        fontFamily: "NotoSans-Medium",
        fontSize: 10,
        lineHeight: 14,
        // fontWeight: "400",
        color: "#FFFFFF8D"
    },
    artworkStyle: {
        height: Dimensions.get("screen").width * 0.08,
        width: Dimensions.get("screen").width * 0.08,
        borderRadius: Dimensions.get("screen").width * 0.08 * 0.5
    }
})

export default TrackListWithEdit;