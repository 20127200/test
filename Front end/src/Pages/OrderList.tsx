import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useGetAllOrdersQuery, useUpdateOrderMutation } from "../Apis/orderApi";
import { useGetShoppingCartQuery } from "../Apis/shoppingCartApi";
import { useGetMenuItemByIdQuery } from "../Apis/menuItemApi";
import { withAdminAuth } from "../HOC";

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

const OrderList = () => {
  // Sử dụng hook API để lấy tất cả đơn hàng
  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetAllOrdersQuery(undefined);

  //const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]); // Thêm state để lưu danh sách đơn hàng

  const { data: shoppingCartData } = useGetShoppingCartQuery(expandedOrderId!, {
    skip: !expandedOrderId,
  });
  // const { data: shoppingCartData } = useGetShoppingCartQuery(selectedOrderId!, {
  //   skip: !selectedOrderId,
  // });
  console.log("Shopping Cart Data:", shoppingCartData);

  const [updateOrder] = useUpdateOrderMutation();

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

  // Lọc ra các đơn hàng không có status là "Cart"
  // const filteredOrders = ordersData.data
  //   .filter((order: Order) => order.orderStatus !== "Cart")
  //   .sort(
  //     (a: Order, b: Order) =>
  //       new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //   );

  // Tính toán các đơn hàng hiện tại hiển thị trên trang
  // const indexOfLastOrder = currentPage * itemsPerPage;
  // const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  // const currentOrders = filteredOrders.slice(
  //   indexOfFirstOrder,
  //   indexOfLastOrder
  // );

  // // Tính tổng số trang
  // const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Tính toán các đơn hàng hiện tại hiển thị trên trang
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  //  console.log("Filtered Orders: ", filteredOrders);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Chỉ hiển thị ngày tháng năm
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    console.log("Clicked:", orderId, newStatus);
    try {
      const response = await updateOrder({
        orderId,
        orderInfo: { orderStatus: newStatus },
      });
      console.log("API Response:", response);
      // Cập nhật trạng thái trong state orders
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // const handleViewDetails = (orderId: string) => {
  //   setSelectedOrderId(orderId);
  //   console.log("Selected Order ID:", orderId);
  // };
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleCancelClick = (orderId: string) => {
    const userConfirmed = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này?"
    );
    if (userConfirmed) {
      handleStatusChange(orderId, "Canceled");
    }
  };

  const handleStartCookingClick = (orderId: string) => {
    const userConfirmed = window.confirm(
      "Đây là nhiệm vụ của nhà bếp. Bạn có chắc là muốn thực hiện thay?"
    );
    if (userConfirmed) {
      handleStatusChange(orderId, "Cooking");
    }
  };

  const handleReadyForPickupClick = (orderId: string) => {
    const userConfirmed = window.confirm(
      "Đây là nhiệm vụ của nhà bếp. Bạn có chắc là muốn thực hiện thay?"
    );
    if (userConfirmed) {
      handleStatusChange(orderId, "Ready for pickup");
    }
  };

  const handleCompleteClick = (orderId: string) => {
    const userConfirmed = window.confirm(
      "Đây là nhiệm vụ của shipper. Bạn có chắc là muốn làm thay không?"
    );
    if (userConfirmed) {
      handleStatusChange(orderId, "Completed");
    }
  };

  //================================================Phần 3======================================================================
  return (
    <div className="container mt-5">
      <h2>Order List</h2>
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
            <th>Action</th>
            <th>Details</th>
            <th>Fail</th>
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
                <td>{order.totalAmount || "N/A"}</td>
                <td>{order.paymentMethod || "N/A"}</td>
                <td>{order.paymentStatus || "N/A"}</td>
                <td>{order.orderStatus || "N/A"}</td>
                <td>
                  {order.orderStatus === "Pending" && (
                    <>
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() =>
                          handleStatusChange(order._id, "Accepted")
                        }
                      >
                        Accept
                      </button>
                    </>
                  )}
                  {order.orderStatus === "Accepted" && (
                    <>
                      <button
                        className="btn btn-primary mr-2"
                        // onClick={() => handleStatusChange(order._id, "Cooking")}
                        onClick={() => handleStartCookingClick(order._id)}
                      >
                        Start Cooking
                      </button>
                    </>
                  )}
                  {order.orderStatus === "Cooking" && (
                    <>
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() =>
                          handleStatusChange(order._id, "Ready for pickup")
                        }
                      >
                        Ready for Pickup
                      </button>
                    </>
                  )}
                  {order.orderStatus === "Ready for pickup" && (
                    <>
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() =>
                          handleStatusChange(order._id, "Delivering")
                        }
                      >
                        Delivering
                      </button>
                    </>
                  )}
                  {order.orderStatus === "Delivering" && (
                    <>
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() =>
                          handleStatusChange(order._id, "Completed")
                        }
                      >
                        Completed
                      </button>
                    </>
                  )}
                  {order.orderStatus === "Completed" && (
                    <span className="badge badge-success">Completed</span>
                  )}
                  {order.orderStatus === "Canceled" && (
                    <span className="badge badge-danger">Canceled</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-info ml-2"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    {expandedOrderId === order._id ? "Hide" : "Details"}
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    //onClick={() => handleStatusChange(order._id, "Canceled")}
                    onClick={() => handleCancelClick(order._id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
              {expandedOrderId === order._id && (
                <tr>
                  <td colSpan={11}>
                    <OrderDetails orderId={order._id} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Hiển thị các nút phân trang */}
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

export default withAdminAuth(OrderList);
