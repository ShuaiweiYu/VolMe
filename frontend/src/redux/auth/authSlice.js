import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        token: null,
        userId: null
    },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, userId, role } = action.payload
            state.token = accessToken
            state.userId = userId
            state.role = role
        },
        logOut: (state, action) => {
            state.token = null
            state.userId = null
            state.role = null
        },
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token

export const selectCurrentUserId = (state) => state.auth.userId