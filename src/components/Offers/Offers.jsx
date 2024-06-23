import React from "react";
import "./Offers.css";
import exlusive_image from "../assets/exclusive_image.png";

const Offers = () => {
  return (
    <div className="offers">
      <div className="offers-left">
        <h1>Exclusive</h1>
        <h1>Offers For You</h1>
        <p>Only On Best Sellers Products</p>
        <button>Check Now</button>
      </div>
      <div className="offers-right">
        <img src={exlusive_image} alt="exlusive product" />
      </div>
    </div>
  );
};

export default Offers;
