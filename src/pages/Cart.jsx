import React from "react";

import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import "../styles/cart-page.css";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { cartActions } from "../store/shopping-cart/cartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  console.log(cartItems);
  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const totalAmount = calculateTotal(cartItems);

  return (
    <Helmet title="Cart">
      <CommonSection title="Your Cart" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              {cartItems.length === 0 ? (
                <h5 className="text-center">Your cart is empty</h5>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Title</th>
                      <th>Product Description</th>
                      <th>Price</th>
                      <th>Color</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <Tr item={item} key={item.id} />
                    ))}
                  </tbody>
                </table>
              )}

              <div className="mt-4">
                <h6>
                  Subtotal: Rs
                  <span className="cart__subtotal ps-2">{totalAmount}</span>
                </h6>
                <p>Taxes and shipping will calculate at checkout</p>
                <div className="cart__page-btn">
                  <button className="addTOCart__btn me-4">
                    <Link to="/bags">Continue Shopping</Link>
                  </button>
                  <button className="addTOCart__btn">
                    <Link
                      to="/checkout"
                      style={{
                        pointerEvents: totalAmount === 0 ? "none" : "auto",
                        color: totalAmount === 0 ? "grey" : "inherit",
                      }}
                    >
                      Proceed to checkout
                    </Link>
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

const Tr = (props) => {
  const { id, image01, title, price, quantity, desc, color, AvlQuantity } =
    props.item;
  const dispatch = useDispatch();

  const decreaseItem = () => {
    dispatch(cartActions.removeItem({ id, color }));
  };

  const incrementItem = () => {
    if (quantity >= AvlQuantity) {
      window.alert(
        `The available quantity for "${title}" is ${AvlQuantity}. Please adjust the quantity.`
      );
    } else {
      dispatch(
        cartActions.addItem({
          id,
          title,
          price,
          image01,
          color, // Ensure that the color is also passed when incrementing
        })
      );
    }
  };

  return (
    <tr>
      <td className="text-center cart__img-box">
        <img
          src={`https://bagsbe-production.up.railway.app/${image01}`}
          alt=""
        />
      </td>
      <td className="text-center">{title}</td>
      <td className="text-center">{desc}</td>
      <td className="text-center">Rs{price}</td>
      <td className="text-center">
        <span
          style={{
            backgroundColor: color, // Use the actual color code
            display: "inline-block",
            width: "30px", // Adjust the size
            height: "30px",
            border: "1px solid #000", // Optional border to make it more visible
          }}
        ></span>
      </td>
      <td className="text-center">{quantity * price}</td>
      <td className="text-center cart__item-del">
        <div className="d-flex align-items-center justify-content-between increase__decrease-btn">
          <span className="increase__btn" onClick={incrementItem}>
            <i className="ri-add-line"></i>
          </span>
          <span className="quantity">{quantity}</span>
          <span className="decrease__btn" onClick={decreaseItem}>
            <i className="ri-subtract-line"></i>
          </span>
        </div>
      </td>
    </tr>
  );
};

export default Cart;
