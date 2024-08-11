import {createEntityAdapter} from "@reduxjs/toolkit";
import {apiSlice} from "../apiSlice";

const codesAdapter = createEntityAdapter({})
const initialState = codesAdapter.getInitialState()

export const codesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCodeByEmail: builder.query({
            query: (id) => '/api/codes',
            providesTags: (result, error, id) => [{type: 'Code', id: id}],
            transformResponse: (response, meta) => {
                const loadedCodes = response.map(code => {
                    code.id = code._id;
                    return code;
                });
                const formattedData = codesAdapter.setAll(initialState, loadedCodes);
                return { response: formattedData, status: meta.response.status };
            },
        }),
        addNewCode: builder.mutation({
            query: (newCode) => ({
                url: '/api/codes',
                method: 'POST',
                body: newCode
            }),
            invalidatesTags: [{ type: 'Code', id: 'LIST' }],
            transformResponse: (response, meta) => {
                return { response: response, status: meta.response.status };
            }
        }),
        checkCodeValidity: builder.mutation({
            query: (queryBody) => ({
                url: '/api/codes/check',
                method: 'POST',
                body: queryBody
            }),
            invalidatesTags: [{ type: 'Code', id: 'LIST' }],
            transformResponse: (response, meta) => {
                return { response: response, status: meta.response.status };
            }
        }),
    })
})

export const {
    useGetCodeByEmailQuery,
    useAddNewCodeMutation,
    useCheckCodeValidityMutation
} = codesApiSlice