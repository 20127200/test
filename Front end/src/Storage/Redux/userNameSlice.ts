import { createSlice } from "@reduxjs/toolkit";
import { userModel } from "../../Interfaces";

export const initialState: userModel = {
  sdt: "",
  email: "",
  name: "",
  username: "",
  password: "",
  shippingAddress: "",
  role: "customer",
  isAdmin:false ,
  status: "active",
  };
  
  export const userAuthSlice = createSlice({
    name: "userAuth",
    initialState: initialState,
    reducers: {
      setLoggedInUser: (state, action) => {
        state.sdt = action.payload.sdt;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.username = action.payload.username;
        state.password = action.payload.password;
        state.shippingAddress = action.payload.shippingAddress;
        state.role = action.payload.role || state.role;
        state.isAdmin = false;
        state.status = action.payload.status || state.status;
        state._id = action.payload._id;
      },
    },
  });
  
  export const { setLoggedInUser } = userAuthSlice.actions;
  export const userAuthReducer = userAuthSlice.reducer;