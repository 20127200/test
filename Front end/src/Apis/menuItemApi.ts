import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const menuItemApi = createApi({
    reducerPath: "menuItemApi",
    baseQuery: fetchBaseQuery({
      baseUrl: "http://localhost:3000/api/",
    }),
    tagTypes: ["MenuItems"],
    endpoints: (builder) => ({  getMenuItems: builder.query({
        query: () => ({
          url: "bakeGood/listAll",
        }),
        providesTags: ["MenuItems"],
      }),
      getMenuItemById: builder.query({
        query: (id) => ({
          url: `bakeGood/getDetail/${id}`,
        }),
        providesTags: ["MenuItems"],
      }),
            // Tìm kiếm sản phẩm theo từ khóa
            searchMenuItems: builder.query({
              query: (key) => ({
                url: `bakeGood/search/${key}`,
              }),
              providesTags: ["MenuItems"],
            }),
            // Lọc sản phẩm theo danh mục
            filterMenuItemsByCategory: builder.query({
              query: (category) => ({
                url: `bakeGood/filter/${category}`,
              }),
              providesTags: ["MenuItems"],
            }),
            // Tạo mới một sản phẩm
            createMenuItem: builder.mutation({
              query: (newItem) => ({
                url: `bakeGood/create`,
                method: "POST",
                body: newItem,
              }),
              invalidatesTags: ["MenuItems"],
            }),
    }),
  });
  export const { useGetMenuItemsQuery, useGetMenuItemByIdQuery, useCreateMenuItemMutation, useFilterMenuItemsByCategoryQuery, useSearchMenuItemsQuery} = menuItemApi;
  export default menuItemApi;
