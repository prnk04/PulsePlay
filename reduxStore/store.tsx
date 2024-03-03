import { combineReducers, configureStore } from "@reduxjs/toolkit";
import currSongReducer from './currentSongSlice'
import playlistsReducer from './playlistsSlice'
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';


const rootReducer = combineReducers({
  currSong: currSongReducer,
  playlistsStored: playlistsReducer
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['currSong']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Ignore non-serializable values in state
    }),
})

export const persistor = persistStore(store);



// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch