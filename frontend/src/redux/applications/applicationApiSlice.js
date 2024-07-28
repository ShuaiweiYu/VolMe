import {apiSlice} from "../apiSlice";

import {APPLICATIONS_URL} from "../constants";

export const applicationApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createApplication: builder.mutation({
            query: ({eventID, volunteerID, files,isDraft}) => ({
                url: `${APPLICATIONS_URL}/apply/${eventID}`,
                method: "POST",
                body: {volunteerID, files,isDraft},
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            invalidatesTags: ["Applications"]
        }),
        updateApplication: builder.mutation({
            query: ({eventID, volunteerID, files,isDraft}) => ({
                url: `${APPLICATIONS_URL}/apply/${eventID}`,
                method: "PUT",
                body: {volunteerID, files,isDraft},
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            invalidatesTags: ["Applications"]
        }),
        deleteApplication: builder.mutation({
            query: (applicationID) => ({
                url: `${APPLICATIONS_URL}/${applicationID}`,
                method: "DELETE",
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            invalidatesTags: ["Applications"]
        }),
        setApplicationStatus: builder.mutation({
            query: ({applicationID, status}) => ({
                    url: `${APPLICATIONS_URL}/status/${applicationID}`,
                    method: "PUT",
                    body: status
                }
            ),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            invalidatesTags: ["Applications"]
        }),
        setApplicationPresented: builder.mutation({
            query: ({applicationID, isPresented}) => ({
                url: `${APPLICATIONS_URL}/presented/${applicationID}`,
                method: "PUT",
                body: isPresented
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            invalidatesTags: ["Applications"]
        }),
        getApplicationByID: builder.query({
            query: (applicationID) => ({
                url: `${APPLICATIONS_URL}/detail/${applicationID}`,
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta, arg) => {
                return {response: response, status: meta.response.status};
            },
        }),
        getApplicationsByVolunteer: builder.query({
            query: ({volunteerID, page}) => ({
                url: `${APPLICATIONS_URL}/list/volunteer/${volunteerID}?page=${page}`,
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            providesTags: ["Applications"]
        }),
        getApplicationsByEvent: builder.query({
            query: ({eventID, page}) => ({
                url: `${APPLICATIONS_URL}/list/event/${eventID}?page=${page}`,
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            providesTags: ["Applications"]
        }),
        getPendingApplicationsByEvent: builder.query({
            query: ({eventID, page}) => ({
                url: `${APPLICATIONS_URL}/list/event/${eventID}?page=${page}&status=PENDING`
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            providesTags: ["Applications"]
        }),
        getDeclinedApplicationsByEvent: builder.query({
            query: ({eventID, page}) => ({
                url: `${APPLICATIONS_URL}/list/event/${eventID}?page=${page}&status=DECLINED`
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            providesTags: ["Applications"]
        }),
        getAcceptedApplicationsByEvent: builder.query({
            query: ({eventID, page}) => ({
                url: `${APPLICATIONS_URL}/list/event/${eventID}?page=${page}&status=ACCEPTED`
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            providesTags: ["Applications"]
        }),
        getAllApplications: builder.query({
            query: ({page}) => `${APPLICATIONS_URL}/listall?page=${page}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            },
            providesTags: ["Applications"]
        })
    })
})

export const {
    useCreateApplicationMutation,
    useUpdateApplicationMutation,
    useDeleteApplicationMutation,
    useSetApplicationStatusMutation,
    useSetApplicationPresentedMutation,
    useGetApplicationByIDQuery,
    useGetApplicationsByVolunteerQuery,
    useGetApplicationsByEventQuery,
    useGetPendingApplicationsByEventQuery,
    useLazyGetPendingApplicationsByEventQuery,
    useGetDeclinedApplicationsByEventQuery,
    useLazyGetDeclinedApplicationsByEventQuery,
    useGetAcceptedApplicationsByEventQuery,
    useLazyGetAcceptedApplicationsByEventQuery,
    useGetAllApplicationsQuery,
} = applicationApiSlice