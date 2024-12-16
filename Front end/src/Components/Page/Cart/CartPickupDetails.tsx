import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetShoppingCartQuery } from "../../../Apis/shoppingCartApi";
import { setShoppingCart } from "../../../Storage/Redux/shoppingCartSlice";
import { RootState } from "../../../Storage/Redux/store";
import { useNavigate } from "react-router-dom";
import { cartItemModel } from "../../../Interfaces";

interface CartPickUpDetailsProps {
  selectedItems?: string[];
}

const CartPickUpDetails: React.FC<CartPickUpDetailsProps> = ({
  selectedItems = [],
}) => {
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

  const [deliveryDate, setDeliveryDate] = useState(""); // State cho ngày giao hàng

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

  const parseAddress = (address: string) => {
    const cityList = ["TP.HCM", "Ngoại Thành"];
    const districtList = [
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
    ];

    let city = cityList.find((city) => address.includes(city)) || "";
    let district =
      districtList.find((district) => address.includes(district)) || "";

    let street = address;
    if (city) {
      street = street.replace(city, "").trim();
    }
    if (district) {
      street = street.replace(district, "").trim();
    }

    street = street.replace(/,\s*$/, "").replace(/,+/g, "").trim();
    return { street, district, city };
  };

  const [useDefaultAddress, setUseDefaultAddress] = useState(true);

  useEffect(() => {
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
      } catch (error) {
        console.error("Error parsing userData from sessionStorage:", error);
      }
    }
  }, []);

  const dispatch = useDispatch();

  // Lấy orderId từ sessionStorage
  const orderId = sessionStorage.getItem("orderId");

  // Gọi API để lấy dữ liệu giỏ hàng
  const { data, error } = useGetShoppingCartQuery(orderId);

  useEffect(() => {
    if (data && !isLoading && !error) {
      dispatch(setShoppingCart(data?.data)); // Cập nhật dữ liệu giỏ hàng vào store
    }
  }, [data, error, dispatch]);

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
    }));
  };

  const shoppingCartFromStore: cartItemModel[] = useSelector(
    (state: RootState) => {
      const items = state.shoppingCartStore.cartItems;
      return Array.isArray(items) ? items : [];
    }
  );

  const [isLoading, setIsLoading] = useState(false);

  let grandTotal = 0;
  let totalItems = 0;

  shoppingCartFromStore.forEach((cartItem) => {
    if (selectedItems.includes(cartItem._id)) {
      totalItems += cartItem.quantity ?? 0;
      grandTotal += (cartItem.price ?? 0) * (cartItem.quantity ?? 0);
    }
  });
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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!deliveryDate) {
      alert("Vui lòng chọn ngày giao hàng.");
      setIsLoading(false);
      return;
    }

    try {
      navigate("/payment", {
        state: {
          customerDetails: {
            ...userData,
            shippingAddress: useDefaultAddress
              ? userData.shippingAddress
              : userData.newAddress,
            deliveryDate: deliveryDate,
          },
          selectedItems: shoppingCartFromStore.filter((item) =>
            selectedItems.includes(item._id)
          ),
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border pb-5 pt-3">
      <h1 style={{ fontWeight: "300" }} className="text-center text-success">
        Pickup Details
      </h1>
      <hr />
      <form className="col-10 mx-auto" onSubmit={handleSubmit}>
        <div className="form-group mt-3">
          <div className="form-check form-check-inline">
            <input
              type="radio"
              name="addressOption"
              value="default"
              checked={useDefaultAddress}
              onChange={() => setUseDefaultAddress(true)}
              className="form-check-input"
            />
            <label className="form-check-label">Sử dụng địa chỉ mặc định</label>
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
            <label className="form-check-label">Sử dụng địa chỉ khác</label>
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
        <div className="form-group mt-3">
          Tên khách hàng
          <input
            type="text"
            className="form-control"
            placeholder="name..."
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          Số điện thoại
          <input
            type="number"
            className="form-control"
            placeholder="phone"
            name="sdt"
            value={userData.sdt}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          <div className="card p-3" style={{ background: "ghostwhite" }}>
            <h5>Grand Total : {grandTotal.toLocaleString()}đ</h5>
            <h5>No of items : {totalItems}</h5>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-lg btn-success form-control mt-3"
          disabled={isLoading || totalItems === 0}
        >
          {isLoading ? "Loading..." : "Đặt hàng"}
        </button>
      </form>
    </div>
  );
};

export default CartPickUpDetails;
