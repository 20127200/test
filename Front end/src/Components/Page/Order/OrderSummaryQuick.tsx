import React, { useState, useEffect } from "react";
import { parseAddress } from "../../../Helpers";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../../../Apis/orderApi";
import { toast } from "react-toastify";
import { useAddShoppingCartItemMutation } from "../../../Apis/shoppingCartApi";

function OrderQuick() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProduct } = location.state || { selectedProduct: null };
  const [addShoppingCartItem] = useAddShoppingCartItemMutation();

  const [createOrder] = useCreateOrderMutation(); // Hook for creating an order

  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    sdt: "",
    shippingAddress: "",
    street: "",
    district: "",
    city: "",
    newAddress: "",
  });

  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [displayInfo, setDisplayInfo] = useState({
    name: "",
    sdt: "",
    address: "",
  });

  const [shippingFee, setShippingFee] = useState(0);
  const [grandTotal, setGrandTotal] = useState(
    selectedProduct ? selectedProduct.price * selectedProduct.quantity : 0
  );

  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(""); // New state for delivery date

  const cities: string[] = ["TP.HCM", "Ngoại Thành"];
  const districts: Record<string, string[]> = {
    "TP.HCM": [
      "Quận 1",
      "Quận 2",
      "Quận 3",
      "Quận 4",
      "Quận 5",
      "Quận 6",
      "Quận 7",
      "Quận 8",
      "Quận 9",
      "Quận 10",
      "Quận 11",
      "Quận 12",
      "Tân Bình",
      "Tân Phú",
      "Bình Tân",
      "Bình Thạnh",
      "Gò Vấp",
      "Phú Nhuận",
      "Thủ Đức",
      "Nhà Bè",
      "Cần Giờ",
      "Củ Chi",
      "Hóc Môn",
      "Bình Chánh",
    ],
    "Ngoại Thành": [],
  };

  const shippingFees: Record<string, number> = {
    "Quận 1": 15000,
    "Quận 3": 15000,
    "Quận 4": 15000,
    "Quận 10": 15000,
    "Quận 11": 15000,
    "Tân Bình": 15000,
    "Phú Nhuận": 15000,
    "Quận 2": 20000,
    "Quận 6": 20000,
    "Quận 7": 20000,
    "Quận 8": 20000,
    "Quận 9": 20000,
    "Quận 12": 20000,
    "Bình Thạnh": 20000,
    "Gò Vấp": 20000,
    "Tân Phú": 20000,
    "Thủ Đức": 20000,
    "Bình Tân": 20000,
    "Nhà Bè": 25000,
    "Cần Giờ": 25000,
    "Củ Chi": 25000,
    "Hóc Môn": 25000,
    "Bình Chánh": 25000,
    "Bình Dương": 50000,
    "Đồng Nai": 50000,
    "Long An": 50000,
  };

  const getShippingFee = (address: string) => {
    const { district, city } = parseAddress(address);

    if (city === "Ngoại Thành") {
      return grandTotal * 0.3; // 30% of total order for outside city
    } else if (district === "Quận 5") {
      return 0; // Free shipping for Quận 5
    } else if (district) {
      return shippingFees[district] || 25000; // Specific district shipping fee or default 25k
    } else {
      return 25000; // Default shipping fee if not identified
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      sessionStorage.setItem(
        "selectedProduct",
        JSON.stringify(selectedProduct)
      );
      sessionStorage.setItem("finalTotal", grandTotal.toString());
      sessionStorage.setItem("shippingFee", shippingFee.toString());
      const userDataString = sessionStorage.getItem("userId");
      if (userDataString) {
        try {
          const parsedUserData = JSON.parse(userDataString);
          const { street, district, city } = parseAddress(
            parsedUserData.shippingAddress
          );
          setUserData({
            ...parsedUserData,
            street,
            district,
            city,
          });
          setDisplayInfo({
            name: parsedUserData.name,
            sdt: parsedUserData.sdt,
            address: parsedUserData.shippingAddress,
          });

          const fee = getShippingFee(parsedUserData.shippingAddress);
          setShippingFee(fee);
        } catch (error) {
          console.error("Error parsing userData from sessionStorage:", error);
        }
      }
    }
  }, [grandTotal, selectedProduct]);

  useEffect(() => {
    // Tính toán ngày tối thiểu (sau 2 ngày từ ngày hiện tại)
    const today = new Date();
    const minDeliveryDate = new Date(today);
    minDeliveryDate.setDate(today.getDate() + 2); // Cộng thêm 2 ngày

    // Chuyển đổi ngày thành định dạng YYYY-MM-DD để sử dụng trong input[type="date"]
    const minDateString = minDeliveryDate.toISOString().split("T")[0];

    // Đặt thuộc tính min cho input ngày giao hàng
    const dateInput = document.getElementById("deliveryDate");
    if (dateInput) {
      dateInput.setAttribute("min", minDateString);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setUserData((prevState) => {
      const newState = { ...prevState, city: selectedCity, district: "" };
      return newState;
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value;
    setUserData((prevState) => {
      const newState = { ...prevState, district: selectedDistrict };
      return newState;
    });
  };

  const handleConfirmAddress = () => {
    const { street, district, city } = userData;
    const fullAddress = `${street}${district ? `, ${district}` : ""}${
      city ? `, ${city}` : ""
    }`;

    setUserData((prevState) => ({
      ...prevState,
      newAddress: fullAddress,
      deliveryDate: deliveryDate,
    }));
    setDisplayInfo({
      name: userData.name,
      sdt: userData.sdt,
      address: fullAddress,
    });

    const fee = getShippingFee(fullAddress);
    setShippingFee(fee);
  };

  useEffect(() => {
    if (useDefaultAddress) {
      setDisplayInfo({
        name: userData.name,
        sdt: userData.sdt,
        address: userData.shippingAddress,
      });
      const fee = getShippingFee(userData.shippingAddress);
      setShippingFee(fee);
    }
  }, [useDefaultAddress, userData]);

  const total = grandTotal + shippingFee;

  const handlePaymentSuccess = async (
    details: { payer: { name: { given_name: string } } },
    data: { orderID: any }
  ) => {
    console.log("Transaction completed by ", details.payer.name.given_name);
    console.log("Transaction details: ", details);
    console.log("Order ID: ", data.orderID);
    alert("Transaction completed by " + details.payer.name.given_name);

    try {
      // Call the createOrder API to save the order to the database
      console.log("Attempting to create order...");
      const orderInfo = {
        userid: userData._id, // Assuming userData contains the user ID
        shippingAddress: displayInfo.address,
        deliveryDate: deliveryDate,
        totalAmount: total,
        orderStatus: "Completed",
        paymentMethod: "PayPal",
        paymentStatus: "Paid",
      };
      const result = await createOrder(orderInfo).unwrap();
      sessionStorage.setItem("Order creation result:", JSON.stringify(result));

      //const orderId = result.data._id; // Lấy _id của đơn hàng vừa tạo
      // console.log("Order cham _id", result._id);
      // console.log("Order cham data _id", result.data._id);

      // console.log("Order saved successfully:", result);

      const orderId = result.data._id; // Lấy _id của đơn hàng vừa tạo
      sessionStorage.setItem("DTH:", orderId);

      const cartItemInfo = {
        orderid: orderId,
        productid: selectedProduct._id,
        quantity: selectedProduct.quantity,
        priceone: selectedProduct.price,
        price: selectedProduct.price * selectedProduct.quantity,
      };

      await addShoppingCartItem(cartItemInfo).unwrap();

      // Tiếp tục với các bước xử lý tiếp theo, như lưu chi tiết đơn hàng

      toast.success("Thanh toán thành công! Đơn hàng đã được tạo.");

      sessionStorage.removeItem("selectedProduct");
      sessionStorage.removeItem("finalTotal");
      sessionStorage.removeItem("shippingFee");

      // Chuyển hướng về trang chủ sau 3 giây
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      console.error("Failed to save the order:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Thanh toán</h3>
      <div className="row">
        <div className="col-md-8">
          <div className="card p-3">
            <h5>Chọn địa chỉ giao hàng</h5>
            <form>
              <div className="form-group mt-3">
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="addressOption"
                    value="default"
                    id="default-address"
                    checked={useDefaultAddress}
                    onChange={() => setUseDefaultAddress(true)}
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="default-address">
                    Sử dụng địa chỉ mặc định
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="addressOption"
                    value="custom"
                    checked={!useDefaultAddress}
                    onChange={() => setUseDefaultAddress(false)}
                    className="form-check-input"
                  />
                  <label className="form-check-label">
                    Sử dụng địa chỉ khác
                  </label>
                </div>
              </div>
              {useDefaultAddress ? (
                <>
                  <div className="form-group mt-3">
                    Địa chỉ
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Address.."
                      name="shippingAddress"
                      value={userData.shippingAddress}
                      readOnly
                    />
                  </div>

                  {/* Thêm lựa chọn ngày giao hàng cho địa chỉ mặc định */}
                  <div className="form-group mt-3">
                    <label htmlFor="deliveryDate">Ngày giao hàng</label>
                    <input
                      type="date"
                      id="deliveryDate"
                      className="form-control"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group mt-3">
                    Địa chỉ
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Address.."
                      name="street"
                      value={userData.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <select
                        className="form-control"
                        name="city"
                        value={userData.city}
                        onChange={handleCityChange}
                        required
                      >
                        <option value="">Chọn thành phố</option>
                        {cities.map((city, index) => (
                          <option key={index} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <select
                        className="form-control"
                        name="district"
                        value={userData.district}
                        onChange={handleDistrictChange}
                        required={userData.city !== "Ngoại Thành"}
                        disabled={userData.city === "Ngoại Thành"}
                      >
                        <option value="">Chọn quận/huyện</option>
                        {userData.city &&
                          districts[userData.city].map((district, index) => (
                            <option key={index} value={district}>
                              {district}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Thay đổi tên và số điện thoại */}
                  <div className="form-group mt-3">
                    Tên người nhận
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tên người nhận"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mt-3">
                    Số điện thoại
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Số điện thoại"
                      name="sdt"
                      value={userData.sdt}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Thêm lựa chọn ngày giao hàng */}
                  <div className="form-group mt-3">
                    <label htmlFor="deliveryDate">Ngày giao hàng</label>
                    <input
                      type="date"
                      id="deliveryDate"
                      className="form-control"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={handleConfirmAddress}
                  >
                    Xác nhận
                  </button>

                  <div className="form-group mt-3">
                    Địa chỉ đầy đủ
                    <input
                      type="text"
                      className="form-control"
                      name="newAddress"
                      value={userData.newAddress}
                      readOnly
                    />
                  </div>
                </>
              )}

              <h5>Chọn phương thức thanh toán</h5>
              <div className="mb-3">
                {/* <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="payment-cash"
                    name="paymentMethod"
                    value="Cash"
                    onChange={() => setPaymentMethod("Cash")}
                  />
                  <label className="form-check-label " htmlFor="payment-cash">
                    Thanh toán tiền mặt khi nhận hàng
                  </label>
                </div> */}
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="payment-paypal"
                    name="paymentMethod"
                    value="PayPal"
                    onChange={() => setPaymentMethod("PayPal")}
                  />
                  <label className="form-check-label" htmlFor="payment-paypal">
                    Thanh toán tiền bằng PayPal
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <div className="d-flex flex-column">
              <h6>
                {displayInfo.name} | {displayInfo.sdt}
              </h6>
              <div>{displayInfo.address}</div>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <div>{selectedProduct.name}</div>
              {/* <div>{`x ${selectedProduct.quantity}`}</div>
              <div>{`${selectedProduct.price.toLocaleString()} VND`}</div> */}
            </div>
            <div className="d-flex justify-content-between">
              <div>{`${selectedProduct.price.toLocaleString()} VND `}</div>
              <div>{`x ${selectedProduct.quantity}`}</div>
              <div>{`${grandTotal.toLocaleString()} VND`}</div>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Tạm tính</span>
              <span>{grandTotal.toLocaleString()} VND</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Phí vận chuyển</span>
              <span>{shippingFee.toLocaleString()} VND</span>
            </div>
            <div className="d-flex justify-content-between">
              <strong>Tổng tiền</strong>
              <strong>{total.toLocaleString()} VND</strong>
            </div>
            <small>(Đã bao gồm VAT nếu có)</small>
            <hr />
            {/* {paymentMethod === "PayPal" && (
              <PaymentPaypalQuick
                finalTotal={total}
                products={[selectedProduct]}
                shippingFee={shippingFee}
                onSuccess={handlePaymentSuccess}
              />
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderQuick;
function addShoppingCartItem(cartItemInfo: {
  orderid: any;
  productid: any;
  quantity: any;
  priceone: any;
  price: number;
}) {
  throw new Error("Function not implemented.");
}
