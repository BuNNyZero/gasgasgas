import React, { useState } from "react";
import CustomerProductList from "../ProductList/CustomerProductList";
import CustomerOrders from "./CustomerOrders";
import "./CustomerContainer.scss";

const CustomerContainer = (props) => {
  const [isProductsActive, setIsProductsActive] = useState(true);

  const changeList = () => {
    setIsProductsActive(!isProductsActive);
  };

  return (
    <div>
      <td className="imgs"><img className="im" src="https://fi.lnwfile.com/_/fi/_raw/74/p0/92.jpg"></img></td>
    <div className="customer-container">
      <div>
        {isProductsActive ? (
          <>
            <button onClick={changeList}>Get My Past Orders</button>
            <div className="list-container">
              <CustomerProductList />
            </div>
          </>
        ) : (
          <>
            <button onClick={changeList}>Product List</button>
            <div className="list-container">
              <CustomerOrders />
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default CustomerContainer;
