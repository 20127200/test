import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cartItemModel, shoppingCartModel } from "../../Interfaces";

const initialState : shoppingCartModel =  {
  cartItems: [],
};
  
  export const shoppingCartSlice = createSlice({
    name: "cartItems",
    initialState: initialState,
    reducers: {
      setShoppingCart: (state, action) => {
        state.cartItems = action.payload;
      },
      updateQuantity: (state, action) => {
        state.cartItems = state.cartItems?.map((item) => {
            if (item._id === action.payload._id){
                item.quantity = action.payload.quantity;
            }
            console.log("Day la item: ",item);
            return item;
        })
      },
      removeFromCart: (state, action) => {
        state.cartItems = state.cartItems?.filter((item) => {
            if (item._id === action.payload._id){
                return null;
            }
            return item;
        })
      },
    
    }
  });
  
  export const { setShoppingCart,updateQuantity,removeFromCart } = shoppingCartSlice.actions;
  export const shoppingCartReducer = shoppingCartSlice.reducer;