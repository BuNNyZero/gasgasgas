import React, { useState } from "react";
import AdminProductDetails from "../AdminProductDetails/AdminProductDetails";
import ProductList from "../ProductList/AdminProductList";
import AdminOrderList from "../Orders/AdminOrderList";
import OrderDetails from "../Orders/OrderDetails";
import "./AdminContainer.scss";

const AdminContainer = (props) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProductList, setShowProductList] = useState(false);  // เริ่มต้นที่ Order List เลย

  const handleProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const onBackClickToProductList = () => {
    setSelectedProduct(null);
    setSelectedOrder(null);
    setShowProductList(true);  // กลับไปแสดง Product List
  };

  const onBackClickToOrderDetails = () => {
    setSelectedProduct(null);
    setSelectedOrder(null);
    setShowProductList(false);  // กลับไปแสดง Order List
  };

  return (
    <div className="admin-container">
      {selectedProduct ? (
        <div className="details-container">
          <AdminProductDetails
            productId={selectedProduct.productId}
            onBackClick={onBackClickToProductList}
          />
        </div>
      ) : selectedOrder ? (
        <div className="details-container">
          <OrderDetails
            orderId={selectedOrder.orderId}
            onBackClick={onBackClickToOrderDetails}
          />
        </div>
      ) : (
        <div>
          {showProductList ? (
            <div className="product-list-container">
              <button onClick={() => setShowProductList(false)}>
                Get Order List
              </button>
              <ProductList handleProductDetails={handleProductDetails} />
            </div>
          ) : (
            <div className="order-list-container">
              <AdminOrderList handleOrderDetails={handleOrderDetails} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminContainer;
