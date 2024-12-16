import React, { useState } from "react";
import { CartPickUpDetails, CartSummary } from "../Components/Page/Cart";
import { withAuth } from "../HOC";

function ShoppingCart() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  return (
    // <div className="row w-100" style={{ margin: "10px" }}>
    //   <div className="col-lg-6 col-12" style={{ fontWeight: 300 }}>
    //     <CartSummary
    //     // selectedItems={selectedItems}
    //     // setSelectedItems={setSelectedItems}
    //     />
    //   </div>
    //   <div className="col-lg-6 col-12 p-4">
    //     {/* <CartPickUpDetails /> */}
    //     <CartPickUpDetails selectedItems={selectedItems} />
    //   </div>
    // </div>
    <CartSummary />
  );
}

export default withAuth(ShoppingCart);
