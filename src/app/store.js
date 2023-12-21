import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSliceReducer from '../features/auth/authSlice'

export const store = configureStore({
    reducer : {
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth : authSliceReducer
    },
    middleware : getDefaultMiddleWare => {
        return getDefaultMiddleWare().concat(apiSlice.middleware)
    },
    devTools : true
})

setupListeners(store.dispatch)