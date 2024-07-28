import { WISHLIST_URL } from "../constants";
import { apiSlice } from '../apiSlice';


export const wishlistApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Query to get all wishlist items
        /*
        getWishlistItems: builder.query({
            queryFn: async () => {
                const response = await fetch('/api/wishlist');
                if (!response.ok) throw new Error('Failed to fetch wishlist items');
                return response.json();
            },
            providesTags: ['WishlistItems'],
        }),
         */

        // Query to get wishlist items for a specific user
        getWishlistItemsForUser: builder.query({
            query: (userId) => `${WISHLIST_URL}/user/${userId}`,
            providesTags: (result, error, userId) => result ? [{ type: 'WishlistItems', id: userId }] : [],
        }),

        // Query to get a wishlist item by ID
        getWishlistItemById: builder.query({
            query: (id) => `${WISHLIST_URL}/${id}`,
            transformResponse: (response, meta) => response.wishlistItem,
            providesTags: (result, error, id) => [{ type: 'WishlistItems', id }],
        }),

        // Mutation to add a new wishlist item
        addWishlistItem: builder.mutation({
            query: (newItem) => ({
                url: `${WISHLIST_URL}`,
                method: 'POST',
                body: newItem,
            }),
            invalidatesTags: ['WishlistItems'],
        }),

        // Mutation to update a wishlist item
        updateWishlistItem: builder.mutation({
            query: ({ id, updateData }) => ({
                url: `${WISHLIST_URL}/${id}`,
                method: 'PUT',
                body: updateData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'WishlistItems', id }],
        }),

        // Mutation to delete a wishlist item
        deleteWishlistItem: builder.mutation({
            query: (id) => ({
                url: `${WISHLIST_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'WishlistItems', id }],
        }),

        deleteAllWishlistItemsForUser: builder.mutation({
            query: ({userId}) => ({
                url: `${WISHLIST_URL}/user/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['WishlistItems'],
        }),

      //  Mutation to delete a wishlist item for a specific user
        deleteWishlistItemForUser: builder.mutation({
            query: ({ userId, wishlistItemId }) => ({
                url: `${WISHLIST_URL}/user/${userId}/${wishlistItemId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['WishlistItems'], // Adjust based on your caching strategy
        }),
        deleteWishlistItemByEvent: builder.mutation({
            query: ({ userId, eventId }) => ({
                url: `${WISHLIST_URL}/user/${userId}/event/${eventId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['WishlistItems'], // Adjust based on your caching strategy
        }),

    }),
});

export const {
    //useGetWishlistItemsQuery,
    useGetWishlistItemsForUserQuery,
    useGetWishlistItemByIdQuery,
    useAddWishlistItemMutation,
    useUpdateWishlistItemMutation,
    useDeleteWishlistItemMutation,
    useDeleteWishlistItemForUserMutation,
    useDeleteWishlistItemByEventMutation,
    useDeleteAllWishlistItemsForUserMutation
} = wishlistApiSlice;
