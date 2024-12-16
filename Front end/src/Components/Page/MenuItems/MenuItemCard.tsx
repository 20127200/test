import React, { useRef } from "react";
import { menuItemModel } from "../../../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MiniLoader } from "../Common";
import { price } from "../../../Interfaces";
import {
  useAddShoppingCartItemMutation,
  useGetShoppingCartQuery,
  useUpdateShoppingCartMutation,
} from "../../../Apis/shoppingCartApi";
import { toastNotify } from "../../../Helpers";

interface Props {
  menuItem: menuItemModel;
}

function MenuItemCard({ menuItem }: Props) {
  useEffect(() => {
    document.body.style.backgroundColor = "#f5f5f5";
  }, []);

  console.log("MenuItemsList props:", menuItem);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [hoveredPrice, setHoveredPrice] = useState<price | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<price | null>(null);
  //const orderId = localStorage.getItem("orderId") || "";
  const orderId = sessionStorage.getItem("orderId") || "";
  const cardRef = useRef<HTMLDivElement>(null); // Tạo tham chiếu tới thẻ sản phẩm

  const [addToCart] = useAddShoppingCartItemMutation();
  const [updateShoppingCart] = useUpdateShoppingCartMutation();
  const { data: cartItems } = useGetShoppingCartQuery(orderId);

  const userData = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        console.log("Click outside detected, resetting selectedPackage.");
        setSelectedPackage(null); // Reset trạng thái khi click ngoài phạm vi thẻ
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cardRef]);

  const handlePackageClick = (price: price) => {
    setSelectedPackage(price);
    console.log(`Gói sản phẩm được chọn: ${price.name}, Giá: ${price.price}`);
  };
  const displayPackage = selectedPackage || hoveredPrice;

  const handleAddToCart = async () => {
    if (!userData) {
      navigate("/login");
      return;
    }

    if (!selectedPackage) {
      console.error("Chưa chọn gói sản phẩm.");
      return;
    }

    setIsAddingToCart(true);

    try {
      const priceOne = Number(selectedPackage?.price ?? 0);
      const totalPrice = priceOne * 1; // Sử dụng số lượng mặc định là 1 từ `MenuItemCard`

      // const existingCartItem = cartItems.data?.find(
      //   (item: { productid: string | undefined; priceone: number }) =>
      //     item.productid === menuItem._id && item.priceone === priceOne
      // );
      const differentPriceItem = cartItems.data?.find(
        (item: { productid: string | undefined; priceone: number }) =>
          item.productid === menuItem._id && item.priceone !== priceOne
      );

      if (differentPriceItem) {
        toastNotify(
          "Không thể thêm sản phẩm với giá khác vào giỏ hàng.",
          "error"
        );
        console.error("Không thể thêm sản phẩm với giá khác vào giỏ hàng.");
      } else {
        const existingCartItem = cartItems.data?.find(
          (item: { productid: string | undefined; priceone: number }) =>
            item.productid === menuItem._id && item.priceone === priceOne
        );

        if (existingCartItem) {
          const newQuantity = existingCartItem.quantity + 1; // Tăng số lượng lên 1
          const newPrice = newQuantity * priceOne;

          await updateShoppingCart({
            _id: existingCartItem._id,
            quantity: newQuantity,
            priceone: priceOne,
            price: newPrice,
          });

          toastNotify("Sản phẩm đã được cập nhật trong giỏ hàng");
          console.log("Sản phẩm đã được cập nhật trong giỏ hàng.");
        } else {
          await addToCart({
            orderid: orderId,
            productid: menuItem._id,
            quantity: 1,
            priceone: priceOne,
            price: totalPrice,
          });
          toastNotify("Sản phẩm đã được thêm vào giỏ hàng.");
          console.log("Sản phẩm đã được thêm vào giỏ hàng.");
        }
      }
    } catch (error) {
      toastNotify("Không thể thêm vào giỏ hàng:");
      console.error("Không thể thêm vào giỏ hàng:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="d-flex col-md-4 col-12 p-4" ref={cardRef}>
      <div
        className="card"
        style={{ boxShadow: "0 1px 7px 0 rgb(0 0 0 / 50%)" }}
      >
        <div className="card-body pt-2">
          <div className="row col-10 offset-1 p-4">
            <Link to={`/menuItemDetails/${menuItem._id}`}>
              <img
                src={menuItem.image}
                style={{ borderRadius: "50%" }}
                alt=""
                className="w-100 mt-5 image-box"
              />
            </Link>
          </div>
          <i
            className="bi bi-clock btn btn-success"
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              padding: "5px 10px",
              borderRadius: "3px",
              outline: "none !important",
              cursor: "pointer",
            }}
          >
            &nbsp; {menuItem.totalTimeToCook} phút
          </i>

          {isAddingToCart ? (
            <div
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
              }}
            >
              <MiniLoader />
            </div>
          ) : (
            <i
              className="bi bi-cart btn btn-outline-secondary"
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                padding: "5px 10px",
                borderRadius: "3px",
                outline: "none !important",
                cursor: "pointer",
              }}
              onClick={handleAddToCart}
            ></i>
          )}
          <div className="text-center">
            <Link
              to={`/menuItemDetails/${menuItem._id}`}
              style={{ textDecoration: "none", color: "green" }}
            >
              <p className="card-title m-0 text-success fs-3">
                {menuItem.name}
              </p>
            </Link>
            <p className="badge bg-secondary" style={{ fontSize: "12px" }}>
              {menuItem.category}
            </p>
            {/* Giá tiền */}
            {/* <div className="d-flex justify-content-center ">
              {hoveredPrice ? (
                <div className="price-item-price text-danger fw-bold">
                  {hoveredPrice.price} VND
                </div>
              ) : (
                <div className="price-item-price text-danger fw-bold">
                  {menuItem.prices
                    .map((price) => price.price.toLocaleString())
                    .join(" VND - ")}{" "} 
                  VND
                </div>
                //menuItem
              )}
            </div> */}
            <div className="d-flex justify-content-center">
              <div className="price-item-price text-danger fw-bold">
                {displayPackage
                  ? displayPackage.price.toLocaleString()
                  : menuItem.prices
                      .map((price) => price.price.toLocaleString())
                      .join(" VND - ")}{" "}
                VND
              </div>
            </div>
            <p className="card-text" style={{ textAlign: "center" }}>
              {menuItem.description}
            </p>
            <div className="d-flex justify-content-center">
              {menuItem.prices.map((price: price, index: number) => (
                <div key={index} className="price-item">
                  <div>
                    <button
                      className={`btn btn-outline-secondary me-2 ${
                        hoveredPrice === price ? "active" : ""
                      } ${selectedPackage === price ? "active" : ""}`}
                      // onMouseEnter={() => setHoveredPrice(price)}
                      // onMouseLeave={() => setHoveredPrice(null)}
                      // onClick={() => handlePackageClick(price)}
                      onMouseEnter={() =>
                        !selectedPackage && setHoveredPrice(price)
                      }
                      onMouseLeave={() => setHoveredPrice(null)}
                      onClick={() => handlePackageClick(price)}
                    >
                      {price.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;
