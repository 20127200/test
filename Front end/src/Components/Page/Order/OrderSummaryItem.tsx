import React, { useEffect, useState } from "react";
import { To, useLocation, useNavigate } from "react-router-dom";
import { useGetMenuItemByIdQuery } from "../../../Apis/menuItemApi";
import { useCreateOrderMutation } from "../../../Apis/orderApi";
import { toast } from "react-toastify";
import {
  useAddShoppingCartItemMutation,
  useDeleteShoppingCartItemMutation,
} from "../../../Apis/shoppingCartApi";

interface ProductDetailProps {
  productId: string;
  onUpdate: (name: string, productId: string) => void;
}

function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  //const { customerDetails, selectedItems } = location.state;
  const [createOrder] = useCreateOrderMutation(); // Hook for creating an order
  const [deleteShoppingCart] = useDeleteShoppingCartItemMutation();
  const [addShoppingCartItem] = useAddShoppingCartItemMutation();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const { customerDetails, selectedItems } = location.state || {
    customerDetails: {},
    selectedItems: [],
  };
  const [productNames, setProductNames] = useState<Record<string, string>>({});

  const handleUpdate = (name: string, productId: string) => {
    setProductNames((prev) => {
      if (prev[productId] !== name) {
        const updatedNames = { ...prev, [productId]: name };
        return updatedNames;
      }
      return prev;
    });
  };

  console.log("hhah", productNames["667626b48b3cee3c59945a5a"]);

  console.log(
    "item duoc lua chon",
    selectedItems.map((item: { productid: any }) => item.productid)
  );
  console.log(
    "id của sản phẩm",
    selectedItems.map((item: { _id: any }) => item._id)
  );

  console.log(
    "item duoc lua chon",
    selectedItems.map((item: { productid: any }) => item.productid)
  );
  console.log(
    "id của sản phẩm",
    selectedItems.map((item: { _id: any }) => item._id)
  ); // Tính tổng giá trị đơn hàng
  const grandTotal = selectedItems.reduce(
    (total: number, item: { priceone: number; quantity: number }) => {
      return total + item.priceone * item.quantity;
    },
    0
  );

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

    return { street, district, city };
  };

  const getShippingFee = (address: string, grandTotal: number) => {
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

  // Tính phí giao hàng
  const shippingFee = getShippingFee(
    customerDetails.shippingAddress,
    grandTotal
  );
  const finalTotal = grandTotal + shippingFee;
  //sessionStorage.setItem("finalTotal", finalTotal);

  // useEffect(() => {
  //   // const products = selectedItems.map(
  //   //   (item: { productid: string; priceone: number; quantity: number }) => ({
  //   //     name: item.productid,
  //   //     price: item.priceone,
  //   //     quantity: item.quantity,
  //   //   })
  //   // );

  //   const products = selectedItems.map(
  //     (item: { productid: string; priceone: number; quantity: number }) => ({
  //       name: productNames[String(item.productid)] || item.productid,
  //       price: item.priceone,
  //       quantity: item.quantity,
  //     })
  //   );

  //   console.log("bú lồn: ", products);

  //   sessionStorage.setItem("finalTotal", finalTotal.toString());
  //   sessionStorage.setItem("products", JSON.stringify(products));
  //   sessionStorage.setItem("shippingFee", shippingFee.toString());
  // }, [finalTotal]);

  useEffect(() => {
    // Chỉ lưu vào sessionStorage khi tất cả tên sản phẩm đã được cập nhật
    if (Object.keys(productNames).length === selectedItems.length) {
      const products = selectedItems.map(
        (item: { productid: string; priceone: number; quantity: number }) => ({
          name: productNames[String(item.productid)] || item.productid,
          price: item.priceone,
          quantity: item.quantity,
        })
      );

      // sessionStorage.setItem("finalTotal", finalTotal.toString());
      // sessionStorage.setItem("products", JSON.stringify(products));
      // sessionStorage.setItem("shippingFee", shippingFee.toString());
      const storedProducts = JSON.parse(
        sessionStorage.getItem("products") || "[]"
      );
      const storedFinalTotal = Number(sessionStorage.getItem("finalTotal"));
      const storedShippingFee = Number(sessionStorage.getItem("shippingFee"));

      if (
        JSON.stringify(storedProducts) !== JSON.stringify(products) ||
        storedFinalTotal !== finalTotal ||
        storedShippingFee !== shippingFee
      ) {
        sessionStorage.setItem("finalTotal", finalTotal.toString());
        sessionStorage.setItem("products", JSON.stringify(products));
        sessionStorage.setItem("shippingFee", shippingFee.toString());
        console.log("Data updated in sessionStorage.");
      }
    }
  }, [finalTotal, productNames, selectedItems]);

  useEffect(() => {
    const clearSessionStorage = () => {
      sessionStorage.removeItem("selectedItems");
      sessionStorage.removeItem("finalTotal");
      sessionStorage.removeItem("shippingFee");
      sessionStorage.removeItem("products");
      console.log("Session storage cleared.");
    };

    window.addEventListener("beforeunload", clearSessionStorage);
    window.addEventListener("popstate", clearSessionStorage);

    return () => {
      window.removeEventListener("beforeunload", clearSessionStorage);
      window.removeEventListener("popstate", clearSessionStorage);
    };
  }, []);

  const ProductDetail: React.FC<ProductDetailProps> = ({
    productId,
    onUpdate,
  }) => {
    console.log("Product ID: ", productId);

    const { data, error, isLoading } = useGetMenuItemByIdQuery(productId);

    // useEffect(() => {
    //   if (data) {
    //     onUpdate(data.data?.name || "Unknown Item", productId);
    //   }
    // }, [data, productId, onUpdate]);
    useEffect(() => {
      if (data) {
        const productName = data.data?.name || "Unknown Item";
        // Chỉ gọi onUpdate nếu tên sản phẩm thực sự thay đổi
        if (productNames[productId] !== productName) {
          onUpdate(productName, productId);
        }
      }
    }, [data, productId, onUpdate]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading product details</p>;
    if (!data || !data.data) return <p>No product details found</p>;

    return <p>{data.data?.name || "Unknown Item"}</p>;
  };

  const dollar = (finalTotal / 23000).toFixed(2);

  let MY_BANK = {
    BANK_ID: "TPBank",
    ACCOUNT_NO: "04346328101",
    ACCOUNT_NAME: "John Doe",
  };

  const qrUrl = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${
    MY_BANK.ACCOUNT_NO
  }-qr_only.png?amount=${finalTotal}&addInfo=Payment&accountName=${encodeURIComponent(
    MY_BANK.ACCOUNT_NAME
  )}`;

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
    if (method === "QR") {
      setShowQRCode(true);
    } else {
      setShowQRCode(false);
    }
  };

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
        userid: customerDetails._id, // Assuming customerDetails contains the user ID
        shippingAddress: customerDetails.shippingAddress,
        totalAmount: finalTotal,
        orderStatus: "Pending",
        paymentMethod: "PayPal",
        paymentStatus: "Paid",
        orderDate: customerDetails.deliveryDate,
      };
      const result = await createOrder(orderInfo).unwrap();
      sessionStorage.setItem("Order creation result:", JSON.stringify(result));

      //const orderId = result.data._id; // Lấy _id của đơn hàng vừa tạo
      // console.log("Order cham _id", result._id);
      // console.log("Order cham data _id", result.data._id);

      // console.log("Order saved successfully:", result);

      const orderId = result.data._id; // Lấy _id của đơn hàng vừa tạo
      sessionStorage.setItem("DTH:", orderId);

      for (const item of selectedItems) {
        const cartItemInfo = {
          orderid: orderId,
          productid: item.productid,
          quantity: item.quantity,
          priceone: item.priceone,
          price: item.priceone * item.quantity,
        };
        await addShoppingCartItem(cartItemInfo).unwrap(); // Gọi API để lưu chi tiết đơn hàng
      }

      // Tiếp tục với các bước xử lý tiếp theo, như lưu chi tiết đơn hàng

      toast.success("Thanh toán thành công! Đơn hàng đã được tạo.");

      for (const item of selectedItems) {
        await deleteShoppingCart({ _id: item._id }).unwrap();
      }

      sessionStorage.removeItem("selectedItems");
      sessionStorage.removeItem("finalTotal");
      sessionStorage.removeItem("shippingFee");
      // Redirect to the home page after successful payment
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      console.error("Failed to save the order:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-success">Thanh toán</h3>
      <div className="row">
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Chọn phương thức thanh toán</h5>
            {/* <div className="form-check mt-3">
              <input
                className="form-check-input"
                type="radio"
                id="payment-qr"
                name="paymentMethod"
                value="QR"
                onChange={() => handlePaymentMethodChange("QR")}
              />
              <label className="form-check-label" htmlFor="payment-qr">
                Thanh toán bằng mã QR
              </label>
            </div> */}
            <div className="form-check mt-3">
              <input
                className="form-check-input"
                type="radio"
                id="payment-paypal"
                name="paymentMethod"
                value="PayPal"
                onChange={() => handlePaymentMethodChange("PayPal")}
              />
              <label className="form-check-label" htmlFor="payment-paypal">
                Thanh toán tiền bằng PayPal
              </label>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card p-3">
            <div className="d-flex flex-column">
              <h6>
                {customerDetails.name} | {customerDetails.sdt}
              </h6>
              <div>{customerDetails.shippingAddress}</div>
              <div>
                Ngày giao hàng mong muốn: {customerDetails.deliveryDate}
              </div>
            </div>
            <hr />
            {selectedItems.map(
              (item: {
                _id: string;
                productid: string;
                priceone: number;
                quantity: number;
              }) => (
                <div key={item._id}>
                  <div
                    className="d-flex justify-content-between"
                    style={{ margin: 0 }}
                  >
                    <div>
                      <ProductDetail
                        productId={item.productid}
                        onUpdate={handleUpdate}
                      />
                    </div>
                  </div>
                  <div
                    className="d-flex justify-content-between"
                    style={{ margin: 0 }}
                  >
                    <div>{`${item.priceone.toLocaleString()} VND`}</div>
                    <div>{`x ${item.quantity}`}</div>
                    <div>
                      {`${(
                        item.priceone * item.quantity
                      ).toLocaleString()} VND`}
                    </div>
                  </div>
                  <br></br>
                </div>
              )
            )}
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
              <strong>{finalTotal.toLocaleString()} VND</strong>
            </div>
            <small>(Đã bao gồm VAT nếu có)</small>
            <hr />
            {/* {selectedPaymentMethod === "PayPal" && (
              //<PaymentPaypal onSuccess={handlePaymentSuccess} />
            )} */}
            {/* {showQRCode && (
              <div className="mt-3 text-center">
                <h5>Mã QR Thanh Toán</h5>
                <img
                  src={qrUrl}
                  alt="QR Code for Payment"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: "200px",
                  }}
                />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
function addShoppingCartItem(cartItemInfo: {
  orderid: any; // Sử dụng _id của đơn hàng vừa tạo
  productid: any;
  quantity: any;
  priceone: any;
  price: number;
}) {
  throw new Error("Function not implemented.");
}
