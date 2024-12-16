import { configureStore } from "@reduxjs/toolkit";
import { menuItemReducer } from "./menuItemSlice";
import { authApi, menuItemApi, orderApi, paypalApi } from "../../Apis";
import shoppingCartApi from "../../Apis/shoppingCartApi";
import { shoppingCartReducer } from "./shoppingCartSlice";
import { userAuthReducer } from "./userNameSlice";
const store = configureStore({
    reducer: {
        menuItemStore: menuItemReducer,
        shoppingCartStore : shoppingCartReducer, // Đây là nơi shoppingCartStore được cấu hình
        userAuthStore : userAuthReducer,
        [menuItemApi.reducerPath]: menuItemApi.reducer,
        [shoppingCartApi.reducerPath]: shoppingCartApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [paypalApi.reducerPath]: paypalApi.reducer,
        [orderApi.reducerPath] : orderApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(menuItemApi.middleware).concat(shoppingCartApi.middleware).concat(authApi.middleware).concat(paypalApi.middleware).concat(orderApi.middleware),
    });

export type RootState = ReturnType<typeof store.getState>;

export default store;
 