import {apiSlice} from "../apiSlice";
import {DOCUMENTS_URL} from "../constants";

export const documentApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createDocument: builder.mutation({
            query: (newDocument) => ({
                url: `${DOCUMENTS_URL}/create`, method: "POST", body: newDocument,
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            }, invalidatesTags: ["Documents"]
        }),
        getDocumentsByUserIdAndEventId: builder.query({
            query: ({userId, eventId}) => ({
                url: `${DOCUMENTS_URL}/list/${userId}/${eventId}`, method: "GET",
            }),
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            }, invalidatesTags: ["Documents"]
        }),
        getDocumentsByUserId: builder.query({
            query: userId => ({
                url: `${DOCUMENTS_URL}/list/${userId}`,
                method: 'GET',
            }),
            validateStatus: (response, result) => response.status === 200 && !result.isError,
            transformResponse: (response, meta) => ({
                response: response,
                status: meta.response.status,
            }),
            invalidatesTags: ['Documents'],
        }),
        getDocumentById: builder.query({
            query: documentId => ({
                url: `${DOCUMENTS_URL}/${documentId}`,
                method: 'GET',
            }),
            validateStatus: (response, result) => response.status === 200 && !result.isError,
            transformResponse: (response, meta) => ({
                response: response,
                status: meta.response.status,
            }),
            invalidatesTags: ['Documents'],
        }),
        deleteDocument: builder.mutation({
            query: (documentId) => ({
                url: `${DOCUMENTS_URL}/delete/${documentId}`, method: "DELETE",
            }), validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            }, transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            }, invalidatesTags: ["Documents"]
        }),
    })
})

export const {
    useCreateDocumentMutation,
    useDeleteDocumentMutation,
    useGetDocumentByIdQuery,
    useLazyGetDocumentByIdQuery,
    useGetDocumentsByUserIdQuery,
    useGetDocumentsByUserIdAndEventIdQuery,
    useLazyGetDocumentsByUserIdAndEventIdQuery
} = documentApiSlice
