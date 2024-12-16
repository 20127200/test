import React, { useState } from "react";
import { useGetMenuItemByIdQuery } from "../../../Apis/menuItemApi";
import { cartItemModel } from "../../../Interfaces";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
} from "../../../Storage/Redux/shoppingCartSlice";
import {
  useDeleteShoppingCartItemMutation,
  useUpdateShoppingCartMutation,
} from "../../../Apis/shoppingCartApi";
import { Link } from "react-router-dom";

interface CartItemProps {
  cartItem: cartItemModel;
  selectedItems: string[]; // Add prop for selected items
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>; // Add prop for setter function
}

const CartItem: React.FC<CartItemProps> = ({
  cartItem,
  selectedItems,
  setSelectedItems,
}) => {
  const dispatch = useDispatch();
  const [updateShoppingCart] = useUpdateShoppingCartMutation();
  const { data, isLoading, error } = useGetMenuItemByIdQuery(
    cartItem.productid
  );
  const [deleteShoppingCart] = useDeleteShoppingCartItemMutation();
  const [selectAll, setSelectAll] = useState<boolean>(false);

  console.log("CartItem object: ", cartItem); // Debugging line to see the entire cartItem object
  console.log("Product ID: ", data); // Debugging line to see the productid
  //console.log("CartItem object lala: ", cartItem.data?._id); // Debugging line to see the entire cartItem object

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product details</div>;

  const handleQuantity = (quantity: number, cartItem: cartItemModel) => {
    const newQuantity = cartItem.quantity + quantity;

    console.log("ngu cho", cartItem.quantity);

    console.log("handleQuantity called with updateQuantityBy:", quantity);
    console.log("newQuantity calculated:", newQuantity);
    console.log("ngu cho 2", cartItem.priceone * newQuantity);
    if ((quantity === -1 && cartItem.quantity === 1) || quantity === 0) {
      // Xóa mục khỏi giỏ hàng
      updateShoppingCart({
        _id: cartItem._id,
        quantity: 0,
        priceone: cartItem.priceone,
        price: cartItem.price,
      });

      deleteShoppingCart({ _id: cartItem._id });
      dispatch(removeFromCart({ _id: cartItem._id }));
    } else {
      // Cập nhật số lượng với số lượng mới
      updateShoppingCart({
        _id: cartItem._id,
        quantity: newQuantity,
        priceone: cartItem.priceone,
        price: newQuantity * cartItem.priceone,
      });
      dispatch(
        updateQuantity({
          _id: cartItem._id,
          quantity: newQuantity,
        })
      );
    }
  };
  const handleSelectItem = () => {
    if (selectedItems.includes(cartItem._id)) {
      setSelectedItems(selectedItems.filter((id) => id !== cartItem._id));
    } else {
      setSelectedItems([...selectedItems, cartItem._id]);
    }
  };

  return (
    <div
      className="d-flex flex-sm-row flex-column align-items-center custom-card-shadow rounded m-3 p-3 border border-1 border-warning"
      style={{ background: "beige" }}
    >
      <div className="d-flex align-items-center p-3">
        <div className="form-check me-3">
          <input
            className="form-check-input border border-1 border-warning"
            type="checkbox"
            checked={selectedItems.includes(cartItem._id)}
            onChange={handleSelectItem}
          />
        </div>
        <Link to={`/menuItemDetails/${cartItem.productid}`}>
          <img
            src={data.data?.image}
            alt=""
            width="150px"
            height="150px"
            className="rounded-circle"
          />
        </Link>
      </div>
      <div className="d-flex flex-column p-2 mx-3" style={{ flex: 1 }}>
        <div className="d-flex flex-column justify-content-center align-items-start mb-2">
          <span style={{ fontWeight: 300 }}>{data.data?.name}</span>
          <span className="text-danger">
            {data.data?.price || cartItem.priceone}đ
          </span>
          <div
            className="d-flex justify-content-between align-items-center p-2 rounded-pill custom-card-shadow"
            style={{ width: "100px", height: "43px" }}
          >
            <span style={{ color: "rgba(22,22,22,.7)" }} role="button">
              <i
                className="bi bi-dash-circle-fill"
                onClick={() => handleQuantity(-1, cartItem)}
              ></i>
            </span>
            <b>{cartItem.quantity}</b>
            <span style={{ color: "rgba(22,22,22,.7)" }} role="button">
              <i
                className="bi bi-plus-circle-fill"
                onClick={() => handleQuantity(1, cartItem)}
              ></i>
            </span>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <span
          style={{ fontSize: "1.5rem", fontWeight: "bold", color: "green" }}
        >
          {cartItem.quantity * cartItem.priceone}đ
        </span>
        <button
          className="btn btn-danger mx-1 mt-2"
          onClick={() => handleQuantity(0, cartItem)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
