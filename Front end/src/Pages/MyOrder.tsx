import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useGetOrderByIdQuery } from "../Apis/orderApi";
import { useGetShoppingCartQuery } from "../Apis/shoppingCartApi";
import { useGetMenuItemByIdQuery } from "../Apis/menuItemApi";
import { withAuth } from "../HOC";

interface Order {
  _id: string;
  createdAt: string;
  orderDate: string;
  totalAmount: number;
  orderStatus: string;
  shippingMethod: string;
  paymentMethod: string;
  trackingNumber: number;
  shippingAddress: string;
  paymentStatus: string;
  note: string;
  address: string;
}

const MyOrder = () => {
  const user = JSON.parse(sessionStorage.getItem("userId") || "{}");
  const userId = user._id;

  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetOrderByIdQuery(userId || "");

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (ordersData) {
      // Chỉ set orders khi nhận được dữ liệu từ API
      const filteredOrders = ordersData.data
        .filter((order: Order) => order.orderStatus !== "Cart")
        .sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setOrders(filteredOrders);
    }
  }, [ordersData]);

  if (isLoading) return <div>Loading...</div>;

  if (!ordersData) return <div>No orders found</div>;

  // Tính toán các đơn hàng hiện tại hiển thị trên trang
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="container mt-5">
      <h2>My Orders</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Tracking Number</th>
            <th>Created Date</th>
            <th>Ordered Date</th>
            <th>Address</th>
            <th>Total</th>
            <th>Payment Method</th>
            <th>Payment Status</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order: Order) => (
            <React.Fragment key={order._id}>
              <tr>
                <td>{order.trackingNumber || "N/A"}</td>
                <td>{formatDate(order.createdAt) || "Invalid Date"}</td>
                <td>{formatDate(order.orderDate) || "Invalid Date"}</td>
                <td>{order.shippingAddress || "N/A"}</td>
                <td>{order.totalAmount.toLocaleString() || "N/A"}</td>
                <td>{order.paymentMethod || "N/A"}</td>
                <td>{order.paymentStatus || "N/A"}</td>
                <td>{order.orderStatus || "N/A"}</td>
                <td>
                  <button
                    className="btn btn-info ml-2"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    {expandedOrderId === order._id ? "Hide" : "Details"}
                  </button>
                </td>
              </tr>
              {expandedOrderId === order._id && (
                <tr>
                  <td colSpan={9}>
                    <OrderDetails orderId={order._id} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-secondary mr-2"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`btn ${
              currentPage === index + 1 ? "btn-primary" : "btn-light"
            } mx-1`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="btn btn-secondary ml-2"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const OrderDetails: React.FC<{ orderId: string }> = ({ orderId }) => {
  const { data: shoppingCartData } = useGetShoppingCartQuery(orderId);

  if (
    !shoppingCartData ||
    !Array.isArray(shoppingCartData.data) ||
    shoppingCartData.data.length === 0
  ) {
    return <div>No items found for this order.</div>;
  }

  return (
    <ul>
      {shoppingCartData.data.map((item: any) => (
        <ProductDetail
          key={item._id}
          productId={item.productid}
          quantity={item.quantity}
          priceone={item.priceone}
          totalprice={item.price}
        />
      ))}
    </ul>
  );
};

const ProductDetail: React.FC<{
  productId: string;
  quantity: number;
  priceone: number;
  totalprice: number;
}> = ({ productId, quantity, priceone, totalprice }) => {
  const { data, error, isLoading } = useGetMenuItemByIdQuery(productId);

  if (isLoading) return <li>Loading...</li>;
  if (error || !data) return <li>Error loading product details</li>;

  return (
    <li>
      {data.data.name} - Số lượng: {quantity} - Giá :{" "}
      {priceone.toLocaleString()} VND - Tổng tiền: {totalprice.toLocaleString()}{" "}
      VND
    </li>
  );
};

export default withAuth(MyOrder);
