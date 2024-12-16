import React from "react";
import { HeaderAdmin } from "../Components/Layout";
import OrderList from "./OrderList";

function AdminPage() {
  return (
    <div style={{ padding: "20px" }}>
      <OrderList />
    </div>
  );
}

export default AdminPage;
