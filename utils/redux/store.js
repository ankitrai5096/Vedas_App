// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from '../redux/authReducer'; 

// Configuration for persistence
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], 
};

const persistedReducer = persistReducer(persistConfig, authReducer);

// Create Redux store with persisted reducer
const store = configureStore({
  reducer: {
    auth: persistedReducer,  
  },
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
