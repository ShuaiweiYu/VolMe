import {apiSlice} from "../apiSlice";
import {MESSAGE_URL} from "../constants";

export const messageApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        sendMessage: builder.mutation({
            query: ({ id, message }) => ({
                url: `${MESSAGE_URL}/send/${id}`,
                method: "POST",
                body: message,
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            invalidatesTags: ["Messages"]
        }),
        getMessages :builder.query({
            query: (id) => ({
                url: `${MESSAGE_URL}/${id}`,
                method: "GET",
            }),
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            providesTags: ["Messages"]
        }),

    }),


});

export const {useSendMessageMutation,useGetMessagesQuery} = messageApiSlice;
