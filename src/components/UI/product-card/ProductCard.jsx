import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import "../../../styles/product-card.css";
import Image from "../../../assets/images/product_common.png";

// Utility function to truncate description
const truncateDescription = (desc, maxLength) => {
  if (desc.length <= maxLength) {
    return desc;
  }
  return desc.substring(0, maxLength) + "...";
};

const ProductCard = (props) => {
  const { id, title, price, quantity, desc, stock } = props.item;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const handleDecrement = () => {
    dispatch(cartActions.removeItem(id));
  };

  const addToCart = () => {
    const cartItem = cartItems.find((item) => item.id === id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    if (currentQuantity + 1 > stock) {
      alert(`Only ${stock} ${title} available now.`);
      return;
    }

    dispatch(
      cartActions.addItem({
        id,
        title,
        price,
        image01: Image, // Ensure that the image is correctly referenced
        desc,
      })
    );
  };

  // Set maximum length for the description preview
  const maxDescLength = 15; // Adjust this value based on your design needs
  const truncatedDesc = truncateDescription(desc, maxDescLength);

  return (
    <div className="product__item">
      <Col lg="12" md="12" sm="12" xs="12">
        <span className="product__price justify-content-end fs-4">
          ₹{price}
        </span>
        <div className="product__img">
          <img src={Image} alt="product-img" className="w-75" />
        </div>
      </Col>
      <Col lg="12" md="12" sm="12" xs="12">
        <div className="product__content">
          <h5 className="d-flex justify-content-start">
            <span>
              <Link to={`/foods/${id}`}>{title}</Link>
            </span>
          </h5>
          <div className="d-flex justify-content-between">
            <span>
              <Link to={`/foods/${id}`}>{truncatedDesc}</Link>
            </span>
            {stock === 0 ? (
              <button className="addTOCart__btn py-2 bg-danger">
                Out of Stock
              </button>
            ) : quantity === 0 ? (
              <button className="addTOCart__btn py-2" onClick={addToCart}>
                Add to Cart
              </button>
            ) : (
              <div className="d-flex addTOCart__btn custom_btn">
                <span className="" onClick={handleDecrement}>
                  <i className="ri-subtract-line"> </i>
                </span>
                <span className="px-3">{quantity}</span>
                <span onClick={addToCart}>
                  <i className="ri-add-line"> </i>
                </span>
                
                
              </div>
            )}
          </div>
        </div>
      </Col>
    </div>
  );
};

export default ProductCard;
