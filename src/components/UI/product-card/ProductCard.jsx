import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import "../../../styles/product-card.css";

const ProductCard = (props) => {
  const { id, title, desc, image01, colors, weight, packingCharges } =
    props.item;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Handle image carousel for multiple images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? image01?.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === image01?.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Select color and price based on color index
  const selectedColor = colors[0];
  const { price } = selectedColor;

  return (
    <div className="product__item">
      <Col lg="12" md="12" sm="12" xs="12">
        <span className="product__price justify-content-end fs-4">
          ₹{price}
        </span>
        <div className="product__img">
          {image01?.length > 1 && (
            <button className="slider-arrow left" onClick={handlePrevImage}>
              &lt;
            </button>
          )}
          <img
            src={`https://bagsbe-production.up.railway.app/${image01[currentImageIndex]}`}
            alt="product-img"
          />
          {image01?.length > 1 && (
            <button className="slider-arrow right" onClick={handleNextImage}>
              &gt;
            </button>
          )}
        </div>
      </Col>

      <Col lg="12" md="12" sm="12" xs="12">
        <div className="product__content">
          <h5 className="d-flex justify-content-start">
            <span>{title}</span>
          </h5>
          <div className="d-flex justify-content-between align-items-center">
            <span>
              <Link to={`/foods/${id}`}>{desc}</Link>
            </span>
            <Link to={`/foods/${id}`}>
              <button className="addTOCart__btn py-2">View Bag</button>
            </Link>
          </div>
        </div>
      </Col>
    </div>
  );
};

export default ProductCard;
