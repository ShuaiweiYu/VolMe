import { createSlice } from '@reduxjs/toolkit'

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        amount: 0,
        itemId: null,
        isSubscribing: false,
        isYearlyPayment: false
    },
    reducers: {
        setAmount: (state, action) => {
            const { amount } = action.payload
            state.amount = amount
        },
        setItemId: (state, action) => {
            const { itemId } = action.payload
            state.itemId = itemId
        },
        setIsSubscribing: (state, action) => {
            const { isSubscribing } = action.payload
            state.isSubscribing = isSubscribing
        },
        setIsYearlyPayment: (state, action) => {
            const { isYearlyPayment } = action.payload
            state.isYearlyPayment = isYearlyPayment
        }
    }
})

export const { 
    setAmount, 
    setItemId,
    setIsSubscribing,
    setIsYearlyPayment
} = paymentSlice.actions

export default paymentSlice.reducer

export const selectCurrentAmount = (state) => state.payment.amount

export const selectCurrentItemId = (state) => state.payment.itemId

export const selectCurrentIsSubscribing = (state) => state.payment.isSubscribing

export const selectCurrentIsYearlyPayment = (state) => state.payment.isYearlyPayment