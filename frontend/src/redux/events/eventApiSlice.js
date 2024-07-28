import { EVENT_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "../apiSlice";

export const eventApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEvents: builder.query({
            query: ({page,keyword,location,time,language} ) => ({
                url: `${EVENT_URL}?page=${page}`,
                params: { keyword,location,time,language },
            }),
            keepUnusedDataFor: 5,
            providesTags: ["Events"],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),

        getEventById: builder.query({
            query: ( eventId ) => `${EVENT_URL}/${eventId}`,
            providesTags: (result, error, eventId) => [
                { type: "Event", id: eventId },
            ],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),
        getEventsByOrganiser: builder.query({
            query: ( organiserId ) => `${EVENT_URL}/organiser/${organiserId}`,
            providesTags: (result, error, eventId) => [
                { type: "Event", id: eventId },
            ],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),

        allEvents: builder.query({
            query: () => `${EVENT_URL}/allEvents`,
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),

        getEventDetails: builder.query({
            query: (eventID) => ({
                url: `${EVENT_URL}/${eventID}`,
            }),
            keepUnusedDataFor: 5,
        }),

        createEvent: builder.mutation({
            query: (eventData) => ({
                url: `${EVENT_URL}`,
                method: "POST",
                body: eventData,
            }),
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            invalidatesTags: ["Event"],

        }),

        updateEvent: builder.mutation({
            query: ({ eventID, eventData }) => ({
                url: `${EVENT_URL}/${eventID}`,
                method: "PUT",
                body: eventData,
            }),
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),

        uploadEventImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: "POST",
                body: data,
            }),
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),

        deleteEvent: builder.mutation({
            query: (eventId) => ({
                url: `${EVENT_URL}/${eventId}`,
                method: "DELETE",
            }),
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            invalidatesTags: ["Event"]

        }),

        createReview: builder.mutation({
            query: ( { eventID, userID, rating, comment } ) => ({
                url: `${EVENT_URL}/${eventID}`,
                method: "POST",
                body: { userID, rating, comment }
            }),
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),

        deleteReview: builder.mutation({
            query: ( { eventID, reviewID } ) => ({
                url: `${EVENT_URL}/${eventID}`,
                method: "DELETE",
                body: { reviewID }
            }),
            transformResponse: (response, meta) => {
                return { response: response, status: meta.response.status };
            },
        }),

        getTopEvents: builder.query({
            query: () => `${EVENT_URL}/top`,
            keepUnusedDataFor: 5,
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),

        getNewEvents: builder.query({
            query: () => `${EVENT_URL}/new`,
            keepUnusedDataFor: 5,
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),

        getFilteredProducts: builder.query({
            query: ({ checked, radio }) => ({
                url: `${EVENT_URL}/filtered-products`,
                method: "POST",
                body: { checked, radio },
            }),
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),
        getEventCountById: builder.mutation({
            query: (data) => ({
                url: `${EVENT_URL}/count`,
                method: "POST",
                body: data,
            }),
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),
    })
})

export const {
    useGetEventByIdQuery,
    useGetEventsByOrganiserQuery,
    useGetEventsQuery,
    useGetEventDetailsQuery,
    useAllEventsQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useCreateReviewMutation,
    useDeleteReviewMutation,
    useGetTopEventsQuery,
    useGetNewEventsQuery,
    useUploadEventImageMutation,
    useGetFilteredEventsQuery,
    useGetEventCountByIdMutation
} = eventApiSlice


