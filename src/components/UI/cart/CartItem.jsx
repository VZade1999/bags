import React from "react";
import { ListGroupItem } from "reactstrap";

import "../../../styles/cart-item.css";

import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";

const CartItem = ({ item }) => {
  console.log(item);
  const { id, title, price, image01, quantity, color, AvlQuantity } = item;

  const dispatch = useDispatch();

  // Calculate total price for this item
  const totalPrice = price * quantity;

  const incrementItem = () => {
    if(quantity>=AvlQuantity){
      window.alert(`The available quantity for "${title}" is ${AvlQuantity}. Please adjust the quantity.`)
    }else{    dispatch(
      cartActions.addItem({
        id,
        title,
        price,
        image01,
        color, // Ensure that the color is also passed when incrementing
      })
    );}

  };

  const decreaseItem = () => {
    dispatch(cartActions.removeItem({ id, color }));
  };

  const deleteItem = () => {
    dispatch(cartActions.removeItem(id));
  };

  return (
    <ListGroupItem className="border-0 cart__item">
      <div className="cart__item-info d-flex gap-2">
        <img
          src={`https://bagsbe-production.up.railway.app/${image01}`}
          alt="product-img"
        />

        <div className="cart__product-info w-100 d-flex align-items-center gap-4 justify-content-between">
          <div>
            <h6 className="cart__product-title">{title}</h6>
            <p className=" d-flex align-items-center gap-5 cart__product-price">
              {quantity}x <span>Rs {totalPrice}</span>{" "}
              <p className="cart__product-color">
                Color:{" "}
                <span
                  style={{
                    backgroundColor: color,
                    width: "20px",
                    height: "20px",
                    display: "inline-block",
                    border: "1px solid #000",
                  }}
                ></span>
              </p>
            </p>

            <div className="d-flex align-items-center justify-content-between increase__decrease-btn">
              <span className="increase__btn" onClick={incrementItem}>
                <i className="ri-add-line"></i>
              </span>
              <span className="quantity">{quantity}</span>
              <span className="decrease__btn" onClick={decreaseItem}>
                <i className="ri-subtract-line"></i>
              </span>
            </div>
          </div>

          <span className="delete__btn" onClick={deleteItem}>
            <i className="ri-close-line"></i>
          </span>
        </div>
      </div>
    </ListGroupItem>
  );
};

export default CartItem;
