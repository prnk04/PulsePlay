import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Modal, Pressable, SafeAreaView, Text, TextInput, TouchableHighlight, View } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../reduxStore/store';
import { createNewPlaylist, deletePlaylist } from '../reduxStore/playlistsSlice';
import SongPlayingComponent from './SongPlayingComponent';

const Playlists = () => {

    const [newPlaylistName, setNewPlaylistName] = React.useState('')
    const [userPlaylistsExist, setUsersPlayListsExist] = React.useState(true)
    const [showPromptToCreateNewPlaylist, setShowPromptToCreateNewPlaylist] = useState(false)
    const [showRedBorder, setShowRedBorder] = useState(false)

    const currentSongState = useSelector((state: RootState) => state.currSong.currentSongState)


    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const dispatch = useDispatch();

    const [, updateState] = React.useState({});

    const storedPlaylists = useSelector((state: RootState) => state.playlistsStored.playlistMetaData.playlistsData)
    const numStoredPlaylists = useSelector((state: RootState) => state.playlistsStored.playlistMetaData.numPlaylists)


    const [showModalToRemovePlaylist, setShowModalToRemovePlaylist] = useState(false)
    const [playlistToDelete, setPlaylistToDelete] = useState<any>({})


    const AddNewPlaylist = () => {
        return (
            <View style={{
                flexDirection: "row",
                // justifyContent: "space-around",
                paddingHorizontal: "2%",
                paddingBottom: "5%",
                paddingTop: "2%",

                alignItems: "center",
                justifyContent: "center"

            }}>
                <View style={{
                    justifyContent: "space-between",
                    flexDirection: "row",

                    paddingLeft: "2%",
                    width: Dimensions.get("screen").width * 0.9
                }}>
                    <View style={{
                    }}>
                        <TextInput style={{
                            fontFamily: "NotoSans-Medium",
                            fontWeight: "500",
                            lineHeight: 31,
                            fontSize: 25,
                            color: "#FFFFFF",
                            borderBottomColor: (showRedBorder) ? "red" : "transparent",
                            borderBottomWidth: (showRedBorder) ? 1 : 0
                        }}
                            value={newPlaylistName}
                            onChangeText={(text) => { setNewPlaylistName(text); setShowRedBorder(false) }}
                            placeholder='Playlist name...'
                            placeholderTextColor="#FFFFFF7D"
                            autoFocus={true}
                        // onFocus = {() => setShowRedBorder(false)}


                        />

                    </View>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: Dimensions.get("screen").width * 0.2

                    }}>
                        <Pressable onPress={() => createPlaylist(newPlaylistName)}>
                            <Icon name="checkmark-outline" size={35} color="#FFFFFF" />
                        </Pressable>
                        <Pressable onPress={() => { setNewPlaylistName(""); setShowPromptToCreateNewPlaylist(false) }}>
                            <Icon name="close" size={35} color="#FFFFFF" />
                        </Pressable>
                    </View>
                </View>
            </View>
        )
    }

    const createPlaylist = (playlistName: string) => {
        // let existingPlaylists = playListData;

        let lastIndex = storedPlaylists.length

        let existingPlaylistNames = new Array();
        storedPlaylists.map(
            (a) => existingPlaylistNames.push(a.name.trim().toLowerCase())
        )

        if (existingPlaylistNames.includes(playlistName.trim().toLowerCase())) {
            Alert.alert("Playlist exists");
            setShowRedBorder(true)
            return
        }

        setShowPromptToCreateNewPlaylist(false)
        setNewPlaylistName("")


        try {
            dispatch(createNewPlaylist({ playlistName: playlistName }))
        } catch (error) {
            console.log("error in dispatching: ", error)
        }
    }

    const removePlaylist = () => {
        setShowModalToRemovePlaylist(false)
        dispatch(deletePlaylist({ playlistDetails: playlistToDelete }));
        setPlaylistToDelete({})
    }

    const displayThisPlaylist = (item: any) => {
        navigation.navigate("SongsInPlaylistView", { playlistName: item.name, playlistId: item.id, numberOfSongs: item.totalSongs })
    }

    const RenderPlaylists = (item: any) => {
        return (
            <View>
                <TouchableHighlight style={{
                    paddingHorizontal: "2%",
                    paddingVertical: "3%",
                }}
                    onPress={() => displayThisPlaylist(item)}
                    onLongPress={() => {
                        setShowModalToRemovePlaylist(true)
                        setPlaylistToDelete(item)
                    }}
                >
                    <View style={{
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <View style={{
                            flexDirection: "row",
                            paddingHorizontal: "4%",
                            paddingBottom: "5%",

                            alignItems: "center",
                            justifyContent: "center"

                        }}>
                            <View style={{
                                justifyContent: "space-between",
                                flexDirection: "row",

                                paddingLeft: "5%",
                                width: Dimensions.get("screen").width * 0.9
                            }}>
                                <View style={{
                                }}>
                                    <Text style={{
                                        fontFamily: "NotoSans-Medium",
                                        fontSize: 16,
                                        lineHeight: 20,
                                        fontWeight: "400",
                                        color: "#FFFFFF"
                                    }}>{item.name}</Text>
                                    <View style={{
                                        paddingVertical: "1%",
                                        flexDirection: "row"
                                    }}>
                                        <Text style={{
                                            fontFamily: "NotoSans-Medium",
                                            // fontWeight: "200",
                                            lineHeight: 20,
                                            fontSize: 12,
                                            color: "#FFFFFF8D"
                                        }}>{item.totalNumberOfSongs.toString() + ` songs`}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Icon name="chevron-forward-outline" size={30} color="#FFFFFF3D" />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }



    return (
        <SafeAreaView style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#002941"
        }}>
            <View style={{
                height: "100%",
                width: "100%",
                flex: 1
            }}>
                <View style={{
                    height: Dimensions.get("screen").height * 0.05,
                    width: "100%",
                    justifyContent: "center",
                    alignContent: "flex-end",
                    alignItems: "flex-end",
                    paddingHorizontal: "5%"
                }}>
                    <Pressable onPress={() => setShowPromptToCreateNewPlaylist(true)}>
                        <Icon name='add-outline' size={35} color="#FFFFFF" />
                    </Pressable>
                </View>

                {
                    userPlaylistsExist ?
                        <View style={{
                            paddingHorizontal: "4%"
                        }}>

                            <View style={{
                                paddingBottom: "5%"
                            }}>
                                <Text style={{
                                    color: "white",
                                    fontFamily: "NotoSans-Bold",
                                    fontSize: 25,
                                    lineHeight: 31
                                }}>
                                    {`Your Playlists`}
                                </Text>
                            </View>

                            {
                                showPromptToCreateNewPlaylist ?
                                    <AddNewPlaylist />
                                    :
                                    null
                            }

                            <FlatList
                                data={storedPlaylists}
                                renderItem={(item) => RenderPlaylists(item.item)}
                            />
                        </View>
                        :

                        <View style={{
                            height: Dimensions.get("screen").height * 0.8,
                            width: "100%",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Icon name="sad-outline" size={100} color="#FFFFFF" style={{
                                opacity: 0.5
                            }} />
                            <Text style={{
                                color: "#FFFFFF5D",
                                fontSize: 30,
                                lineHeight: 40,
                                fontFamily: "NotoSans-ExtraBold",
                                textAlign: "center",
                                paddingVertical: "7%"
                            }}>{`You do not have any playlists`}</Text>
                        </View>
                }

            </View>

            {/* Footer view */}
            <View style={{
                flex: -1
            }}>
                {
                    (currentSongState) ?
                        <SongPlayingComponent />
                        :
                        null
                }
            </View>

            <Modal visible={showModalToRemovePlaylist}
                transparent

                animationType='slide'>
                <View style={{
                    height: "100%",
                    width: "100%",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0029419D"

                }}>
                    <View style={{
                        backgroundColor: "#0000009D",
                        width: Dimensions.get("screen").width * 0.9,
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: "2%",
                        borderRadius: 10
                    }}>
                        <View>
                            <View style={{
                                paddingVertical: "5%",
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <Text style={{
                                    fontFamily: "NotoSans-Medium",
                                    fontSize: 25,
                                    lineHeight: 35,
                                    color: "#FFFFFF8D"
                                }}>{`Delete ` + playlistToDelete?.name + `?`}</Text>

                            </View>

                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: "5%"
                            }}>

                                <TouchableHighlight style={{
                                    borderWidth: 1,
                                    width: Dimensions.get("screen").width * 0.4,
                                    paddingVertical: "5%",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#0000005D",
                                    borderColor: "#0000005D"
                                }} onPress={() => {
                                    setShowModalToRemovePlaylist(false);
                                    setPlaylistToDelete({})
                                }}>
                                    <Text style={{
                                        fontFamily: "NotoSans-Medium",
                                        fontSize: 20,
                                        lineHeight: 30,
                                        color: "#FFFFFF7D"
                                    }}>Cancel</Text>
                                </TouchableHighlight>

                                <TouchableHighlight onPress={removePlaylist} style={{
                                    borderWidth: 1,
                                    width: Dimensions.get("screen").width * 0.4,
                                    paddingVertical: "5%",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#0000003D",
                                    borderColor: "#0000003D"
                                }}>

                                    <Text style={{
                                        fontFamily: "NotoSans-Medium",
                                        fontSize: 20,
                                        lineHeight: 30,
                                        color: "#FFFFFF5D"
                                    }}>Delete</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </View>

            </Modal>
        </SafeAreaView>
    )

}

export default Playlists;