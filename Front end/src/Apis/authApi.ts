import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api",
    }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userRegisterData) => (
                {
                    url: "user/sign-up",
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: userRegisterData
                }
            )
              
        }),
        login: builder.mutation({
            query: (userCredentials) => ({
                url: "user/sign-in",
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: userCredentials
            })
        })
    })
});


export const {useRegisterMutation, useLoginMutation} = authApi;
export default authApi;

