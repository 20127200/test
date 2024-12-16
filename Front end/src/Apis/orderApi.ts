import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Tạo API bằng createApi
const orderApi = createApi({
  reducerPath: 'orderApi', // Định danh cho slice API này
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/order', // Địa chỉ cơ sở cho các request API
  }),
  endpoints: (builder) => ({
    // Tạo order mới
    createOrder: builder.mutation({
      query: (orderInfo) => ({
        url: 'createOrder',
        method: 'POST',
        body: orderInfo, // Dữ liệu đơn hàng được gửi trong body của request
      }),
    }),
    
    // Cập nhật đơn hàng
    updateOrder: builder.mutation({
      query: ({ orderId, orderInfo }) => ({
        url: `update/${orderId}`, // Đường dẫn API kèm theo orderId
        method: 'PATCH',
        body: orderInfo, // Dữ liệu cập nhật đơn hàng
      }),
    }),
    
    // Lấy giỏ hàng
    getCart: builder.query({
      query: (userId) => ({
        url: `getCart/${userId}`, // Đường dẫn API kèm theo userId
      }),
    }),
    
    // Lấy danh sách tất cả đơn hàng
    getAllOrders: builder.query({
      query: () => ({
        url: 'getListAll', // Đường dẫn API để lấy tất cả đơn hàng
      }),
    }),
    
    // Lấy đơn hàng theo ID
    getOrderById: builder.query({
      query: (userId) => ({
        url: `getOrderById/${userId}`, // Đường dẫn API kèm theo orderId
      }),
    }),

    getOrderByDate: builder.query({
      query: (dateString) => ({
        url: `getOrderByDate/${dateString}`, // Đường dẫn API kèm theo ngày
      }),
    }),
    
    // Lấy đơn hàng theo trạng thái
    getOrderByStatus: builder.query({
      query: (status) => ({
        url: `getOrderByStatus/${status}`, // Đường dẫn API kèm theo trạng thái đơn hàng
      }),
    }),
  }),
});

// Export các hooks do createApi tạo ra để sử dụng trong component
export const {
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useGetCartQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderByDateQuery,
  useGetOrderByStatusQuery
} = orderApi;

export default orderApi;
