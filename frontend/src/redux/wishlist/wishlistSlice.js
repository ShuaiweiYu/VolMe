import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        open: false
    },
    reducers: {
        openWishlistDrawer: (state, action) => {
            state.open = true;
        },
        closeWishlistDrawer: (state, action) => {
            state.open = false;
        }
    }
})

export const {
    openWishlistDrawer,
    closeWishlistDrawer
} = wishlistSlice.actions

export default wishlistSlice.reducer

export const selectCurrentWishlistStatus = (state) => state.wishlist.open