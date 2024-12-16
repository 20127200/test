import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import { cartItemModel } from "../../../Interfaces";
import CartItem from "./CartItem"; // Import CartItem component
import CartPickUpDetails from "./CartPickupDetails";
import { Link } from "react-router-dom";
import { useGetShoppingCartQuery } from "../../../Apis/shoppingCartApi";
import { setShoppingCart } from "../../../Storage/Redux/shoppingCartSlice";

function CartSummary() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const dispatch = useDispatch();

  // Lấy orderId từ sessionStorage
  const orderId = sessionStorage.getItem("orderId");

  // Gọi API để lấy dữ liệu giỏ hàng
  const { data, isLoading, error } = useGetShoppingCartQuery(orderId);

  console.log("haha", data?.data);

  useEffect(() => {
    if (data && !isLoading && !error) {
      dispatch(setShoppingCart(data?.data)); // Cập nhật dữ liệu giỏ hàng vào store
    }
  }, [data, isLoading, error, dispatch]);

  // const shoppingCartFromStore: cartItemModel[] = useSelector(
  //   (state: RootState) => state.shoppingCartStore.cartItems ?? []
  // );
  const shoppingCartFromStore: cartItemModel[] = useSelector(
    (state: RootState) => {
      const items = state.shoppingCartStore.cartItems;
      return Array.isArray(items) ? items : [];
    }
  );
  console.log("Cart items in store:", shoppingCartFromStore); // Debugging line

  if (!shoppingCartFromStore || shoppingCartFromStore.length === 0) {
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card text-center shadow-sm p-3 mb-5 rounded "
          style={{ maxWidth: "500px", backgroundColor: "#F6FB7A" }}
        >
          <div className="card-body">
            <h4 className="card-title" style={{ color: "#387F39" }}>
              Giỏ hàng của bạn đang trống
            </h4>
            <p className="card-text text-muted" style={{ color: "#88D66C" }}>
              Hãy tiếp tục mua sắm để tìm thêm các sản phẩm yêu thích!
            </p>
            <Link
              to="/"
              className="btn btn-info btn-lg"
              style={{ color: "#1A3636" }}
            >
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-lg-6 col-12">
          <h4 className="text-center text-success">Cart Summary</h4>
          {shoppingCartFromStore.map(
            (cartItem: cartItemModel, index: number) => (
              <CartItem
                key={index}
                cartItem={cartItem}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            )
          )}
        </div>
        <div className="col-lg-6 col-12">
          <CartPickUpDetails selectedItems={selectedItems} />
        </div>
      </div>
    </div>
  );
}

export default CartSummary;
