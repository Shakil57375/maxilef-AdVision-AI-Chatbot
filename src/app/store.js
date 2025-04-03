import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import authReducer from "../features/auth/authSlice";
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'

const persistConfig = {
  key: 'chat-app-root',
  storage,
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer)
 

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // Add the shared API slice
    auth: persistedAuthReducer, // Add the auth slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add API middleware
});

export default store;
export const persistor = persistStore(store);
