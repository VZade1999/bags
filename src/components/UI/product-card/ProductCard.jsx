import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import { Container, Row, Col } from "reactstrap";
import Image from "../../../assets/images/product_common.png";
import "../../../styles/product-card.css";

const ProductCard = (props) => {
  const { id, title, price, quantity } = props.item;
  const dispatch = useDispatch();

  const handleDecrement = () => {
    dispatch(cartActions.removeItem(id));
  };

  const addToCart = () => {
    dispatch(
      cartActions.addItem({
        id,
        title,
        Image,
        price,
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
          <img src={Image} alt="product-img" className=" w-75 " />
        </div>
      </Col>
      <Col lg="12" md="12" sm="12" xs="12">
        <div className="product__content">
          <h5 className="d-flex justify-content-start">
            {/* <Link to={`/foods/${id}`}>{title}</Link> */}
            <span>{title}</span>
          </h5>
          <div className="d-flex justify-content-between">
            <span>{title}</span>

            {quantity === 0 ? (
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
