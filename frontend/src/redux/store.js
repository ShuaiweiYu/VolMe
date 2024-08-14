import { configureStore } from '@reduxjs/toolkit';
import {apiSlice} from "./apiSlice";
import authReducer from './auth/authSlice';
import paymentReducer from './payment/paymentSlice'
import wishlistSlice from "./wishlist/wishlistSlice";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        payment: paymentReducer,
        wishlist: wishlistSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: false
});

export default store;