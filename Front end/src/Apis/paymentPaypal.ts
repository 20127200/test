import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const paypalApi = createApi({
  reducerPath: 'paypalApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api', 
  }),
  endpoints: (builder) => ({
    createPayPalOrder: builder.mutation({
      query: (orderInfo) => ({
        url: 'createPayPalOrder',
        method: 'POST',
        body: orderInfo,
      }),
    }),
    capturePayPalOrder: builder.mutation({
      query: (orderId) => ({
        url: 'capturePayPalOrder',
        method: 'POST',
        body: { orderId },
      }),
    }),
  }),
});

export const { useCreatePayPalOrderMutation, useCapturePayPalOrderMutation } = paypalApi;
export default paypalApi;
