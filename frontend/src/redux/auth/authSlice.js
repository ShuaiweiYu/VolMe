import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        token: localStorage.getItem("token"),
        userId: localStorage.getItem("userId")
    },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, userId, role } = action.payload
            state.token = accessToken
            state.userId = userId
            state.role = role
            localStorage.setItem("token", accessToken)
            localStorage.setItem("userId", userId)
        },
        logOut: (state, action) => {
            state.token = null
            state.userId = null
            state.role = null
            localStorage.removeItem("token")
            localStorage.removeItem("userId")
        },
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token

export const selectCurrentUserId = (state) => state.auth.userId