import {apiSlice} from "../apiSlice";

export const paymentApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createOrder: builder.mutation({
            query: (body) => ({
                url: '/api/payment/order/create-order',
                method: 'POST',
                body: body
            })
        }),
        captureOrder: builder.mutation({
            query: (body) => ({
                url: '/api/payment/order/capture-order',
                method: 'POST',
                body: body
            })
        }),
        createProduct: builder.mutation({
            query: (body) => ({
                url: '/api/payment/subscription/create-product',
                method: 'POST',
                body: body
            })
        }),
        createPlan: builder.mutation({
            query: (body) => ({
                url: '/api/payment/subscription/create-plan',
                method: 'POST',
                body: body
            })
        }),
        cancelSubscription: builder.mutation({
            query: (body) => ({
                url: '/api/payment/subscription/cancel',
                method: 'POST',
                body: body
            })
        }),
        checkSubscriptionValidity: builder.mutation({
            query: (body) => ({
                url: '/api/payment/subscription/isValid',
                method: 'POST',
                body: body
            })
        })
    })
})

export const {
    useCreateOrderMutation,
    useCaptureOrderMutation,
    useCreateProductMutation,
    useCreatePlanMutation,
    useCancelSubscriptionMutation,
    useCheckSubscriptionValidityMutation
} = paymentApiSlice