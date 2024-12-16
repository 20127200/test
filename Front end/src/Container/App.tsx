import React from "react";
import {
  Header,
  Footer,
  HeaderAdmin,
  HeaderChef,
  HeaderShipper,
} from "../Components/Layout";
import {
  Home,
  MenuItemDetails,
  NotFound,
  ShoppingCart,
  Login,
  Register,
  AuthenticationTest,
  AuthenticationTestAdmin,
  AccessDenied,
  AdminPage,
  ShipperPage,
  ChefPage,
  SearchResultsPage,
  Item,
  MyOrder,
} from "../Pages";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetShoppingCartQuery } from "../Apis/shoppingCartApi";
import { setShoppingCart } from "../Storage/Redux/shoppingCartSlice";
import { setLoggedInUser } from "../Storage/Redux/userNameSlice";
import { json } from "stream/consumers";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // Load user from local storage if exists
    // const userData = localStorage.getItem("userId");
    const userData = sessionStorage.getItem("userId");
    console.log("userData: ", userData);
    if (userData) {
      dispatch(setLoggedInUser(JSON.parse(userData)));
    }
  }, [dispatch]);

  // useEffect(() => {
  //   // Load user from local storage if exists
  //   const userOrder = localStorage.getItem("orderId");
  //   console.log("userData: ", userOrder);
  //   if (userOrder) {
  //     dispatch(setShoppingCart(JSON.parse(userOrder)));
  //   }
  // }, [dispatch]);

  //demo 1
  //const orderId = localStorage.getItem("orderId");

  const orderId = sessionStorage.getItem("orderId");
  console.log("order: ", orderId);
  const { data, isLoading, error } = useGetShoppingCartQuery(
    //"66a466c8df540ff0e4564994"
    orderId
  );

  console.log("toi la gay", data);
  useEffect(() => {
    if (!isLoading && !error) {
      console.log("Fetched cart data:", data?.data);
      dispatch(setShoppingCart(data?.data));
    }
  }, [data, isLoading, error, dispatch]);

  const noHeaderFooterRoutes = [
    "/login",
    "/register",
    "/admin",
    "/shipper",
    "/chef",
  ];

  const adminRoutes = ["/admin", "/admin/item"];
  const chefRoutes = ["/chef"];
  const shipperRoutes = ["/shipper"];

  return (
    // <div className="text-success">
    //   {!noHeaderFooterRoutes.includes(location.pathname) && <Header />}
    //   <div className="pb-5">
    //     <Routes>
    //       <Route path="/" element={<Home />}></Route>
    //       <Route
    //         path="/menuItemDetails/:id"
    //         element={<MenuItemDetails />}
    //       ></Route>
    //       <Route path="/shoppingCart" element={<ShoppingCart />}></Route>
    //       <Route path="/login" element={<Login />}></Route>
    //       <Route path="/register" element={<Register />}></Route>
    //       <Route
    //         path="/authentication"
    //         element={<AuthenticationTest />}
    //       ></Route>
    //       <Route
    //         path="/authorization"
    //         element={<AuthenticationTestAdmin />}
    //       ></Route>
    //       <Route path="/denied" element={<AccessDenied />}></Route>
    //       <Route path="/payment" element={<Payment />}></Route>
    //       <Route path="/paymentQuick" element={<PaymentQuick />}></Route>
    //       <Route path="/admin" element={<AdminPage />}></Route>
    //       <Route path="/shipper" element={<ShipperPage />}></Route>
    //       <Route path="/chef" element={<ChefPage />}></Route>
    //       <Route path="*" element={<NotFound />}></Route>
    //     </Routes>
    //   </div>
    //   {!noHeaderFooterRoutes.includes(location.pathname) && <Footer />}
    // </div>
    <div className="text-success">
      {adminRoutes.includes(location.pathname) ? (
        <HeaderAdmin />
      ) : chefRoutes.includes(location.pathname) ? (
        <HeaderChef />
      ) : shipperRoutes.includes(location.pathname) ? (
        <HeaderShipper />
      ) : (
        !noHeaderFooterRoutes.includes(location.pathname) && <Header />
      )}
      <div className="pb-5">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/menuItemDetails/:id"
            element={<MenuItemDetails />}
          ></Route>
          <Route path="/shoppingCart" element={<ShoppingCart />}></Route>
          <Route path="/myorder" element={<MyOrder />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route
            path="/authentication"
            element={<AuthenticationTest />}
          ></Route>
          <Route
            path="/authorization"
            element={<AuthenticationTestAdmin />}
          ></Route>
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/denied" element={<AccessDenied />}></Route>
          <Route path="/admin" element={<AdminPage />}></Route>
          <Route path="/admin/item" element={<Item />}></Route>
          <Route path="/shipper" element={<ShipperPage />}></Route>
          <Route path="/chef" element={<ChefPage />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
      {!noHeaderFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default App;
