import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);
const getDefaultCart = () => {
  let cart = {};
  for (let i = 0; i < 300 + 1; i++) {
    cart[i] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
    
    fetch("https://orvela-ecommerce-api.onrender.com/allproducts")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setAll_Product(data))
      .catch((error) => {
        console.error("Error fetching all products:", error);
        // Handle error (e.g., set default state, show error message)
      });

    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch(`https://orvela-ecommerce-api.onrender.com/getcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({}), // Modify body as per your API requirements
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => setCartItems(data))
        .catch((error) => {
          console.error("Error fetching cart items:", error);
          // Handle error (e.g., set default state, show error message)
        });
    }
  }, []);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch(`https://orvela-ecommerce-api.onrender.com/addtocart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  };
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch(`https://orvela-ecommerce-api.onrender.com/removefromcart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
