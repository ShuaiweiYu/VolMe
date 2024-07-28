import {createEntityAdapter} from "@reduxjs/toolkit";
import {apiSlice} from "../apiSlice";

const usersAdapter = createEntityAdapter({})
const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: (response, meta) => {
                // 格式化用户数据
                const loadedUsers = response.map(user => {
                    user.id = user._id;
                    return user;
                });
                const formattedData = usersAdapter.setAll(initialState, loadedUsers);
                // 返回数据和状态码
                return {response: formattedData, status: meta.response.status};
            },
            providesTags: (result, error, arg) => {
                // 在方法中，首先判断了 result?.ids 是否存在。这个 ids 字段通常表示返回的数据中包含了哪些实体的 ID。
                if (result?.ids) {
                    // 如果存在 ids 字段，则说明请求成功并且返回了一组数据。此时，会生成一个包含了所有实体的缓存标签数组。每个标签对象的类型为 User，ID 为实体的 ID。
                    return [
                        {type: 'User', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'User', id}))
                    ]
                    // 如果不存在 ids 字段，则说明请求失败或者返回的数据为空。此时，会生成一个仅包含一个标签对象的数组，该标签对象的类型为 User，ID 为 LIST。
                } else return [{type: 'User', id: 'LIST'}]
            }
        }),
        getUserByEmailAddress: builder.query({
            query: (emailAddress) => `/users/${emailAddress}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            providesTags: (result, error, emailAddress) => [{type: 'User', id: emailAddress}],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            }
        }),
        getUserByUserId: builder.query({
            query: (userId) => `/users/id/${userId}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            providesTags: (result, error, userId) => [{type: 'User', id: userId}],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            }
        }),
        addNewOrganizer: builder.mutation({
            query: (newOrganizer) => ({
                url: '/users/organizers',
                method: 'POST',
                body: newOrganizer
            }),
            invalidatesTags: [{type: 'User', id: 'LIST'}],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            }
        }),
        addNewVolunteer: builder.mutation({
            query: (newVolunteer) => ({
                url: '/users/volunteers',
                method: 'POST',
                body: newVolunteer
            }),
            invalidatesTags: [{type: 'User', id: 'LIST'}],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            }
        }),
        updateUser: builder.mutation({
            query: ({userId, updateData}) => ({
                url: `/users/${userId}`,
                method: 'PUT',
                body: updateData
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: 'User', id: userId },
                { type: 'User', id: 'LIST' }
            ],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            }
        }),
        validateUser: builder.mutation({
            query: ({userId, updateData}) => ({
                url: `/users/validate/${userId}`,
                method: 'PUT',
                body: updateData
            }),
            invalidatesTags: [{type: 'User', id: 'LIST'}],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            }
        }),
        updateUserCredential: builder.mutation({
            query: ({userId, updateData}) => ({
                url: `/users/credential/${userId}`,
                method: 'PUT',
                body: updateData
            }),
            invalidatesTags: [{type: 'User', id: 'LIST'}],
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            }
        }),
        deleteUserById: builder.mutation({
            query: (userId) => ({
                url: `/users/id/${userId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{type: 'User', id: 'LIST'}], //  ensures that the cache for the user list (LIST) is invalidated, so the UI can refresh accordingly.
            transformResponse: (response, meta) => {
                return {response: response, status: meta.response.status};
            }
        }),
        getConversationOverview: builder.query({
                query: (userId) => ({
                    url: `/users/${userId}/conversations`,
                }),
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
                //    providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
                transformResponse: (response, meta) => {
                    return {response: response, status: meta.response.status};
                }

            })
    })
})

export const {
    useGetUsersQuery,
    useGetUserByEmailAddressQuery,
    useLazyGetUserByEmailAddressQuery,
    useGetUserByUserIdQuery,
    useLazyGetUserByUserIdQuery,
    useAddNewOrganizerMutation,
    useAddNewVolunteerMutation,
    useUpdateUserMutation,
    useValidateUserMutation,
    useUpdateUserCredentialMutation,
    useDeleteUserByIdMutation,
    useGetConversationOverviewQuery
} = usersApiSlice