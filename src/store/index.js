import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import usersReducer from "../reducers/UsersSlice"
export const store = configureStore({
    reducer: {
        //counter : counterReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        users: usersReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware)
})