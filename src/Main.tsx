import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Playlists from './Playlists';
import Icon from 'react-native-vector-icons/Ionicons'
import Discover from './Discover';
import { Text, View } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService } from '../services/PlaybackService';

const Tab = createBottomTabNavigator();

const Main = () => {

    return (
        

        <Tab.Navigator initialRouteName='Home' sceneContainerStyle={{

        }}>
            <Tab.Screen name="Home" component={Home} options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (focused ?
                    <Icon name="home" size={25} color="rgba(255, 255, 255, 0.7)" />
                    :
                    <Icon name="home-outline" size={25} color="#FFFFFF5D" />
                ),
                title: "Home",
                tabBarLabelStyle: {
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: "400",
                    lineHeight: 16,
                },
                tabBarActiveTintColor: "rgba(255, 255, 255, 0.7)",
                tabBarInactiveTintColor: "#FFFFFF5D",
                tabBarStyle: { backgroundColor: "#002941", padding: "1%" },
            }}
            />

            <Tab.Screen name="Discover" component={Discover} options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (focused ?
                    <Icon name="compass" size={25} color="rgba(255, 255, 255, 0.7)" />
                    :
                    <Icon name="compass-outline" size={25} color="#FFFFFF5D" />
                ),
                title: "Discover",
                tabBarLabelStyle: {
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: "400",
                    lineHeight: 16,

                },
                tabBarActiveTintColor: "rgba(255, 255, 255, 0.7)",
                tabBarInactiveTintColor: "#FFFFFF5D",
                tabBarStyle: { backgroundColor: "#002941", padding: "1%" }
            }}
            />

            <Tab.Screen name="My Playlists" component={Playlists} options={{
                headerShown: false,

                tabBarIcon: ({ focused }) => (focused ?
                    <Icon name="musical-note" size={25} color="rgba(255, 255, 255, 0.7)" />
                    :
                    <Icon name="musical-note-outline" size={25} color="#FFFFFF5D" />

                ),
                title: "My Playlists",
                tabBarLabelStyle: {
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: "400",
                    lineHeight: 16,
                },
                tabBarActiveTintColor: "rgba(255, 255, 255, 0.7)",
                tabBarInactiveTintColor: "#FFFFFF5D",
                tabBarStyle: { backgroundColor: "#002941", padding: "1%" }

            }} />
        </Tab.Navigator>
        

    )

}

export default Main;