import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

const initialState = []
export const fetchUsers = createAsyncThunk("fetchUsers/user", async () => {
    const response = await axios.get(USERS_URL)
    return response.data
})


const UsersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return action.payload
        })
    }
})

export const selectUserById = (state, userId) =>
    state.users.find(user => user.id === userId)

export const SelectAllUsers = (state) => state.users



export default UsersSlice.reducer