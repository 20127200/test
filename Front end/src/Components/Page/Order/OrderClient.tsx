import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderSummary = () => {
  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title text-success">Order Summary</h3>
          <hr />
          <div className="mb-3">
            <strong>Name :</strong> test1
          </div>
          <div className="mb-3">
            <strong>Email :</strong> test@gmail.com
          </div>
          <div className="mb-3">
            <strong>Phone :</strong> 343
          </div>
          <h4 className="text-success mt-4">Menu Items</h4>
          <hr />
          {/* Add your menu items here */}
          <div className="d-flex justify-content-between">
            <span>Total:</span>
            <span className="text-danger">$</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
