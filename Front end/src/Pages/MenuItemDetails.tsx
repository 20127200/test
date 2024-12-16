import React, { useState, useEffect, useRef } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { cartItemModel, menuItemModel, price } from "../Interfaces";
import { MainLoader } from "../Components/Page/Common";
import { useGetMenuItemByIdQuery } from "../Apis/menuItemApi";
import {
  useAddShoppingCartItemMutation,
  useGetShoppingCartQuery,
  useUpdateShoppingCartMutation,
} from "../Apis/shoppingCartApi";
import CartItem from "../Components/Page/Cart/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Storage/Redux/store";
import { AddToCartPayload } from "../Interfaces/addToCartPayLoad";
import { toast } from "react-toastify";

function MenuItemDetails() {
  //const { id } = useParams();
  const { id } = useParams();
  const { data: menuItemData, isLoading } = useGetMenuItemByIdQuery(id);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  console.log("menu: ", menuItemData?.data?._id);

  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [updateShoppingCart] = useUpdateShoppingCartMutation();

  const [addToCart] = useAddShoppingCartItemMutation();

  const [selectedPackage, setSelectedPackage] = useState<price | null>(null);
  const [priceValue, setPriceValue] = useState<number | null>(null); // Biến trạng thái để lưu giá tiền

  const packageRef = useRef<HTMLDivElement>(null);
  const quantityRef = useRef<HTMLDivElement>(null);
  const [clickTimeout, setClickTimeout] = useState<number | null>(null);

  //const orderId = localStorage.getItem("orderId") || "";
  const orderId = sessionStorage.getItem("orderId") || "";
  console.log("orderId", orderId);

  const selectedPackageRef = useRef(selectedPackage);

  const userData = sessionStorage.getItem("userId");
  // useEffect(() => {
  //   selectedPackageRef.current = selectedPackage;
  // }, [selectedPackage]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       packageRef.current &&
  //       !packageRef.current.contains(event.target as Node) &&
  //       quantityRef.current &&
  //       !quantityRef.current.contains(event.target as Node)
  //     ) {
  //       setSelectedPackage(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [packageRef, quantityRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        packageRef.current &&
        !packageRef.current.contains(event.target as Node) &&
        quantityRef.current &&
        !quantityRef.current.contains(event.target as Node)
      ) {
        // Không đặt lại `selectedPackage` khi click bên ngoài
        //setSelectedPackage(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [packageRef, quantityRef]);

  const handleQuantity = (counter: number) => {
    let newQuantity = quantity + counter;
    if (newQuantity == 0) {
      newQuantity = 1;
    }
    setQuantity(newQuantity);
  };

  // useEffect(() => {
  //   if (menuItemData?.data?.prices?.length > 0) {
  //     // Tìm gói có giá thấp nhất
  //     const cheapestPackage = menuItemData.data.prices.reduce(
  //       (min: { price: number }, p: { price: number }) =>
  //         p.price < min.price ? p : min
  //     );

  //     // Cập nhật trạng thái với gói rẻ nhất
  //     setSelectedPackage(cheapestPackage);
  //     setPriceValue(cheapestPackage.price);
  //   }
  // }, [menuItemData]);

  const handlePackageClick = (price: price) => {
    // if (clickTimeout) {
    //   clearTimeout(clickTimeout);
    //   setClickTimeout(null);
    //   if (selectedPackage === price) {
    //     setSelectedPackage(null);
    //   }
    // } else {
    //   setClickTimeout(
    //     window.setTimeout(() => {
    //       setSelectedPackage(price);
    //       console.log(
    //         `Gói sản phẩm được chọn: ${price.name}, Giá: ${price.price}`
    //       );
    //       setClickTimeout(null);
    //     }, 300)
    //   );
    // }
    setSelectedPackage(price);
    //setPriceValue(price.price); // Cập nhật giá trị của giá tiền khi chọn gói
    console.log(`Gói sản phẩm được chọn: ${price.name}, Giá: ${price.price}`);
  };

  console.log("gia tien: ", selectedPackage?.price);
  const { data: cartItems } = useGetShoppingCartQuery(orderId);

  console.log("test demo: ", cartItems);

  const handleAddToCart = async () => {
    if (!userData) {
      navigate("/login");
      return;
    }
    //e: { preventDefault: () => void }
    //e.preventDefault();
    // if (!selectedPackageRef.current) {
    //   console.log("Không có gói sản phẩm nào được chọn.");
    //   return;
    // }
    console.log("Thêm vào giỏ hàng được gọi");
    setIsAddingToCart(true);

    const priceOne = Number(selectedPackage?.price ?? 0);
    const totalPrice = priceOne * quantity;

    // try {
    //   const response = await addToCart({
    //     orderid: orderId,
    //     productid: id,
    //     quantity: quantity,
    //     priceone: selectedPackage?.price,
    //     price: totalPrice,
    //   });
    //   console.log("Add to cart response:", response);
    // } catch (error) {
    //   console.error("Failed to add to cart:", error);
    // } finally {
    //   setIsAddingToCart(false);
    // }

    try {
      // Lấy danh sách sản phẩm trong giỏ hàng hiện tại
      //  const { data: cartItems } = useGetShoppingCartQuery(orderId);

      // Tìm sản phẩm đã tồn tại trong giỏ hàng
      const existingCartItem = cartItems.data?.find(
        (item: { productid: string | undefined; priceone: number }) =>
          item.productid === id && item.priceone === priceOne
      );

      if (existingCartItem) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        const newQuantity = existingCartItem.quantity + quantity;
        const newPrice = newQuantity * priceOne;

        await updateShoppingCart({
          _id: existingCartItem._id,
          quantity: newQuantity,
          priceone: priceOne,
          price: newPrice,
        });

        console.log("Sản phẩm đã được cập nhật trong giỏ hàng.");
        toast.success("Đã cập nhật sản phẩm trong giỏ hàng!");
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới sản phẩm
        const totalPrice = quantity * priceOne;

        await addToCart({
          orderid: orderId,
          productid: id,
          quantity: quantity,
          priceone: priceOne,
          price: totalPrice,
        });

        console.log("Sản phẩm đã được thêm vào giỏ hàng.");
        toast.success("Thêm vào giỏ hàng thành công!");
      }
    } catch (error) {
      console.error("Không thể thêm vào giỏ hàng:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    } finally {
      setIsAddingToCart(false);
    }
  };
  const price = selectedPackage?.price ?? 0;
  const handleBuyNow = () => {
    // if (!selectedPackage) {
    //   alert("Vui lòng chọn gói sản phẩm trước khi mua ngay!");
    //   return;
    // }
    // Điều hướng đến trang PaymentQuick

    navigate("/paymentQuick", {
      state: {
        selectedProduct: {
          name: menuItemData.data?.name,
          quantity: quantity,
          price: price, // Sử dụng giá trị mặc định 0 nếu undefined
          total: price * quantity, // Sử dụng giá trị mặc định 0 nếu undefined
        },
      },
    });
  };

  return (
    <div className="container pt-4 pt-md-5">
      {!isLoading ? (
        <div className="row align-items-center">
          <div className="col-md-7">
            <div className="d-flex align-items-center">
              <h2 className="text-success me-3">{menuItemData.data?.name}</h2>
              <span className="text-danger h4 ms-3">
                {selectedPackage ? (
                  `${selectedPackage.price.toLocaleString()} ₫`
                ) : (
                  <>
                    {menuItemData.data?.prices
                      .map((price: price) => price.price.toLocaleString())
                      .join(" ₫ - ")}{" "}
                    ₫
                  </>
                )}
              </span>
            </div>
            <span className="d-block mb-2">
              <span
                className="badge text-bg-dark pt-2"
                style={{ height: "40px", fontSize: "20px" }}
              >
                {menuItemData.data?.category}
              </span>
              <span
                className="badge text-bg-light pt-2 ms-2 fst-italic"
                style={{ height: "40px", fontSize: "20px" }}
              >
                Hoàn thành trong {menuItemData.data?.totalTimeToCook} phút
              </span>
            </span>
            <p style={{ fontSize: "20px" }} className="pt-2">
              {menuItemData.data?.description}
            </p>
            {/* Phần hiển thị gói phân loại */}
            <div className="mb-3" ref={packageRef}>
              {menuItemData.data?.prices.map((price: price, index: number) => (
                <button
                  key={index}
                  className={`btn btn-outline-secondary me-2 ${
                    selectedPackage === price ? "active" : ""
                  }`}
                  onClick={() => handlePackageClick(price)}
                >
                  {price.name}
                </button>
              ))}
            </div>
            {/* Hiển thị giá tiền */}
            <div className="d-flex align-items-center mb-2" ref={quantityRef}>
              <div
                className="pb-2 p-3"
                style={{
                  border: "1px solid #333",
                  borderRadius: "30px",
                  width: "150px",
                }}
              >
                <i
                  className="bi bi-dash p-1"
                  style={{ fontSize: "25px", cursor: "pointer" }}
                  onClick={() => handleQuantity(-1)}
                />
                <span className="h3 mt-3 px-3">{quantity}</span>
                <i
                  className="bi bi-plus p-1"
                  style={{ fontSize: "25px", cursor: "pointer" }}
                  onClick={() => handleQuantity(+1)}
                />
              </div>
            </div>
            <div className="d-flex">
              <button
                className="btn btn-success me-2 flex-fill"
                disabled={isAddingToCart || !selectedPackage}
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
              {/* <button className="btn btn-secondary flex-fill">
                <NavLink
                  className="nav-link active"
                  aria-current="page"
                  to="/"
                  onClick={() => navigate(-1)}
                >
                  Back to Home
                </NavLink>
              </button> */}
              <button
                className="btn btn-primary flex-fill"
                onClick={handleBuyNow}
                disabled={!selectedPackage} // Chỉ cho phép bấm nếu đã chọn gói sản phẩm
              >
                Mua Ngay
              </button>
            </div>
          </div>
          <div className="col-md-5 d-flex justify-content-center align-items-center">
            <img
              src={menuItemData.data?.image}
              style={{ borderRadius: "50%", maxWidth: "100%" }}
              alt="No content"
              onClick={() => navigate(-1)}
            />
          </div>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center"
          style={{ width: "100%" }}
        >
          <MainLoader />
        </div>
      )}
    </div>
  );
}

export default MenuItemDetails;
