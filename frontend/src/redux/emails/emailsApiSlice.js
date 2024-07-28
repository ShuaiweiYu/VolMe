import {apiSlice} from "../apiSlice"

export const emailsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        sendRegistrationConfirmationEmail: builder.mutation({
            query: (body) => ({
                url:"/emails/registration",
                method:"POST",
                body: body
            }),
            transformResponse: (response, meta) => {
                return { response: response, status: meta.response.status };
            }
        }),
        sendPasswordResetEmail: builder.mutation({
            query: (body) => ({
                url:"/emails/password-reset",
                method:"POST",
                body: body
            }),
            transformResponse: (response, meta) => {
                return { response: response, status: meta.response.status };
            }
        }),
        sendApplicationNotificationEmail: builder.mutation({
            query: (body) => ({
                url:"/emails/application-notification",
                method:"POST",
                body: body
            }),
            transformResponse: (response, meta) => {
                return { response: response, status: meta.response.status };
            }
        }),
        sendApplicationAcceptedEmail: builder.mutation({
            query: (body) => ({
                url:"/emails/application-accepted",
                method:"POST",
                body: body
            }),
            transformResponse: (response, meta) => {
                return { response: response, status: meta.response.status };
            }
        }),
        sendApplicationDeclinedEmail: builder.mutation({
            query: (body) => ({
                url:"/emails/application-declined",
                method:"POST",
                body: body
            }),
            transformResponse: (response, meta) => {
                return { response: response, status: meta.response.status };
            }
        }),
        sendApplicationWithdrawEmail: builder.mutation({
            query: (body) => ({
                url:"/emails/application-withdraw",
                method:"POST",
                body: body
            }),
            transformResponse: (response, meta) => {
                return { response: response, status: meta.response.status };
            }
        }),
        sendContactEmail: builder.mutation({
            query: (body) => ({
                url:"/emails/contact",
                method:"POST",
                body: body
            }),
            transformResponse: (response, meta) => {
                return { response: response, status: meta.response.status };
            }
        })
    })
})

export const {
    useSendRegistrationConfirmationEmailMutation,
    useSendPasswordResetEmailMutation,
    useSendApplicationNotificationEmailMutation,
    useSendApplicationAcceptedEmailMutation,
    useSendApplicationDeclinedEmailMutation,
    useSendApplicationWithdrawEmailMutation,
    useSendContactEmailMutation
} = emailsApiSlice