import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import { Container, Row, Col } from "reactstrap";
import Image from "../../../assets/images/product_common.png";
import "../../../styles/product-card.css";

const ProductCard = (props) => {
  const { id, title, price, quantity, desc, stock } = props.item;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems); // To get the current cart items

  const handleDecrement = () => {
    dispatch(cartActions.removeItem(id));
  };

  const addToCart = () => {
    const cartItem = cartItems.find((item) => item.id === id); // Find if the item is already in the cart
    const currentQuantity = cartItem ? cartItem.quantity : 0; // Get current quantity in the cart

    if (currentQuantity + 1 > stock) {
      alert(`Only ${stock} ${title} available now.`);
      return;
    }

    dispatch(
      cartActions.addItem({
        id,
        title,
        Image,
        price,
        desc,
      })
    );
  };

  return (
    <div className="product__item">
      <Col lg="12" md="12" sm="12" xs="12">
        <span className="product__price justify-content-end fs-4 ">
          ₹{price}
        </span>
        <div className="product__img ">
          <img src={Image} alt="product-img" className="w-75" />
        </div>
      </Col>
      <Col lg="12" md="12" sm="12" xs="12">
        <div className="product__content">
          <h5 className="d-flex justify-content-start">
            <span>{title}</span>
          </h5>
          <div className="d-flex justify-content-between">
            <span>{desc}</span>
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
                <span onClick={addToCart}>
                  <i className="ri-add-line"> </i>
                </span>
                <span className="ps-3">{quantity}</span>
                <span className="ps-3" onClick={handleDecrement}>
                  <i className="ri-subtract-line"> </i>
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
