import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const shoppingCartApi = createApi({
  reducerPath: "shoppingCartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
  }),
  tagTypes: ["ShoppingCarts"],
  endpoints: (builder) => ({
    getShoppingCart: builder.query({
      query: (orderId) => ({
        url: `orderItems/getListItem/${orderId}`,
        method: 'GET',
      }),
    
      providesTags: ["ShoppingCarts"],
    }),
    updateShoppingCart: builder.mutation({
      query: ({ _id, quantity, priceone, price }) => ({
        url: `orderItems/update/${_id}`,
        method: "PATCH",
        body: { _id, quantity, priceone, price },
      }),
      invalidatesTags: ["ShoppingCarts"],
    }),
    addShoppingCartItem: builder.mutation({
      query: ({ orderid, productid, quantity, priceone, price }) => ({
        url: `orderItems/addItem`,
        method: "POST",
        body: { orderid, productid, quantity, priceone, price },
      }),
      invalidatesTags: ["ShoppingCarts"],
    }),
    deleteShoppingCartItem : builder.mutation({
      query: ({_id}) => ({
        url: `orderItems/delete/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ShoppingCarts"],
    })
  }),
});

export const {
  useGetShoppingCartQuery, useUpdateShoppingCartMutation, useAddShoppingCartItemMutation, useDeleteShoppingCartItemMutation
} = shoppingCartApi;
export default shoppingCartApi;
