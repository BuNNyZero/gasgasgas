import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import ShoppingCart from "../ShopingCart/ShoppingCart";

const ProductListCustomer = (props) => {
  const [productList, setProductList] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const customerId = sessionStorage.getItem("customerId");
  const [address, setAddress] = useState("");

  useEffect(() => {
    axios
      .get(`${getBaseURL()}api/products`)
      .then((res) => {
        res.data.forEach((product) => {
          product.quantity = 0;
        });
        axios
          .get(`${getBaseURL()}api/cart/${customerId}`)
          .then((responseCart) => {
            let productsInCart = responseCart.data;
            setCartProducts(productsInCart);
            setProductList(res.data);
          })
          .catch((err) => console.log("Error occurred"));
      })
      .catch((err) => console.log("Error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = (product) => {
    if (product.quantity > 0) {
      let updatedCartList = [...cartProducts];
      let existingProductIndex = updatedCartList.findIndex(
        (p) => p.productId === product.productId
      );

      if (existingProductIndex !== -1) {
        updatedCartList[existingProductIndex].quantity += product.quantity;
      } else {
        updatedCartList.push({ ...product });
      }

      axios
        .post(`${getBaseURL()}api/cart/add`, {
          customerId,
          productId: product.productId,
          quantity: product.quantity,
          isPresent: existingProductIndex !== -1,
        })
        .then((res) => {
          setCartProducts(updatedCartList);
          const updatedProductList = productList.map((p) => ({
            ...p,
            quantity: 0,
          }));
          setProductList(updatedProductList);
        })
        .catch((error) => console.log("Error adding to cart:", error));
    }
  };

  const removeProduct = (productId) => {
    axios
      .delete(`${getBaseURL()}api/cart/remove/${productId}/${customerId}`)
      .then((res) => {
        console.log("Deleted successfully");
        let updatedCartList = cartProducts.filter(
          (product) => product.productId !== productId
        );
        setCartProducts(updatedCartList);
      })
      .catch((err) => {
        console.log("Error occurred");
      });
  };

  const updateProductQuantity = (e, productId) => {
    const updatedList = productList.map((product) => {
      if (product.productId === productId) {
        product.quantity = parseInt(e.target.value);
      }
      return product;
    });
    setProductList(updatedList);
  };

  const buyProducts = () => {
    const token = sessionStorage.getItem("jwt_token");

    if (!token) {
      alert("Authorization token is missing");
      return;
    }

    if (address !== "") {
      let customerPayload = { address };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .post(`${getBaseURL()}api/cart/buy/${customerId}`, customerPayload, config)
        .then((res) => {
          setCartProducts([]);
          setAddress("");
          alert("Order placed successfully");
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert("Authorization failed. Please log in again.");
          } else {
            console.error("Error:", error);
          }
        });
    } else {
      alert("Please enter your address");
    }
  };

  const updateAddress = (updatedAddress) => {
    setAddress(updatedAddress);
  };

  return (
    <>
      <div className="product-list-container">
        <div>
          <h1>Products</h1>
        </div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Image</th> {/* เพิ่มคอลัมน์รูปภาพ */}
              <th>Name</th>
              <th>Price</th>
              <th>No. of Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>
                  <img
                    src={product.imageUrl || "data:image/jpeg;base64,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"} // URL ของรูปภาพ
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                  <input
                    type="number"
                    value={product.quantity}
                    min="0"
                    placeholder="Quantity"
                    onChange={(e) => updateProductQuantity(e, product.productId)}
                  />
                </td>
                <td>
                  <button onClick={() => addToCart(product)}>Add to Cart</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ShoppingCart
        cartProducts={cartProducts}
        removeProduct={removeProduct}
        buyProducts={buyProducts}
        address={props.address}
        updateAddress={updateAddress}
      />
    </>
  );
};

export default ProductListCustomer;
