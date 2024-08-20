import {EVENT_URL} from "../constants";
import {apiSlice} from "../apiSlice";

export const eventApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEvents: builder.query({
            query: ({page, keyword, location, startDate, endDate, language, category}) => ({
                url: `${EVENT_URL}?page=${page}`,
                params: {keyword, location, startDate, endDate, language, category},
            }),
            keepUnusedDataFor: 5,
            providesTags: ["Events"],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),
        getEventById: builder.query({
            query: (eventId) => `${EVENT_URL}/event/${eventId}`,
            providesTags: (result, error, eventId) => [
                {type: "Event", id: eventId},
            ],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),
        getEventsByOrganiser: builder.query({
            query: (organiserId) => `${EVENT_URL}/organiser/${organiserId}`,
            providesTags: (result, error, eventId) => [
                {type: "Event", id: eventId},
            ],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
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
            query: ({eventID, eventData}) => ({
                url: `${EVENT_URL}/${eventID}`,
                method: "PUT",
                body: eventData,
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
            query: ({eventID, userID, rating, comment}) => ({
                url: `${EVENT_URL}/review/${eventID}`,
                method: "POST",
                body: {userID, rating, comment}
            }),
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
        }),
        deleteReview: builder.mutation({
            query: ({eventID, reviewID}) => ({
                url: `${EVENT_URL}/review/${eventID}`,
                method: "DELETE",
                body: {reviewID}
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
        getEventCity: builder.query({
            query: () => `${EVENT_URL}/city`,
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
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useCreateReviewMutation,
    useDeleteReviewMutation,
    useGetEventCountByIdMutation,
    useGetEventCityQuery
} = eventApiSlice


