import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath : "api",
    tagTypes : ["Post"],
    baseQuery : fetchBaseQuery({baseUrl : "http://localhost:9000/"}),
    endpoints : builder => ({})
})