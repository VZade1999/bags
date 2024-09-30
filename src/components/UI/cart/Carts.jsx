import React from "react";
import { ListGroup } from "reactstrap";
import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import { cartUiActions } from "../../../store/shopping-cart/cartUiSlice";
import "../../../styles/shopping-cart.css";
import { cartActions } from "../../../store/shopping-cart/cartSlice";

const Carts = () => {
  const dispatch = useDispatch();
  const cartProducts = useSelector((state) => state.cart.cartItems);
  console.log(cartProducts);

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const totalAmount = calculateTotal(cartProducts);
  console.log("Total Amount:", totalAmount);

  const toggleCart = () => {
    dispatch(cartUiActions.toggle());
  };

  return (
    <div
      className={`cart__container ${cartProducts.length > 0 ? "active" : ""}`}
    >
      <ListGroup className="cart">
        <div className="cart__close d-flex justify-content-between">
          <button
            className="btn btn-secondary mb-3"
            onClick={()=>dispatch(cartActions.clearCart())}
          >
            {" "}
            Clear Cart
          </button>
          <span onClick={toggleCart}>
            <i className="ri-close-fill"></i>
          </span>
        </div>

        <div className="cart__item-list">
          {cartProducts.length === 0 ? (
            <h6 className="text-center mt-5">No item added to the cart</h6>
          ) : (
            cartProducts.map((item, index) => (
              <CartItem item={item} key={index} />
            ))
          )}
        </div>

        <div className="cart__bottom d-flex align-items-center justify-content-between">
          <h6>
            Subtotal : <span>Rs{totalAmount}</span>
          </h6>
          <button className="addTOCart__btn">
            <Link
              to="/checkout"
              onClick={toggleCart}
              style={{
                pointerEvents: totalAmount === 0 ? "none" : "auto",
                color: totalAmount === 0 ? "grey" : "inherit",
              }}
            >
              Proceed to checkout
            </Link>
          </button>
        </div>
      </ListGroup>
    </div>
  );
};

export default Carts;
