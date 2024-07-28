import { apiSlice } from '../apiSlice';

export const paymentItemApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPaymentItems: builder.query({
            query: () => ({
                url: '/api/paymentItems/items',
                method: 'GET',
            }),
        }),
        getPaymentItemById: builder.query({
            query: (itemId) => ({
                url: `/api/paymentItems/items/${itemId}`,
                method: 'GET',
            }),
        }),
        createPaymentItem: builder.mutation({
            query: (body) => ({
                url: '/api/paymentItems/items',
                method: 'POST',
                body: body,
            }),
        }),
        deletePaymentItem: builder.mutation({
            query: (id) => ({
                url: '/api/paymentItems/items',
                method: 'DELETE',
                body: { id },
            }),
        }),
        setDiscount: builder.mutation({
            query: ({ itemId, discountData }) => ({
                url: `/api/paymentItems/items/${itemId}`,
                method: 'PUT',
                body: discountData,
            }),
        }),
    }),
});

export const {
    useGetPaymentItemsQuery,
    useLazyGetPaymentItemByIdQuery,
    useCreatePaymentItemMutation,
    useDeletePaymentItemMutation,
    useSetDiscountMutation,
} = paymentItemApiSlice;
