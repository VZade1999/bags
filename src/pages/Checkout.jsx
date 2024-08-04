import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { GetApi, PostApi } from "../api/api";
import Logo from "../assets/images/logo_png.png";
import { cartActions } from "../store/shopping-cart/cartSlice";
import "../styles/checkout.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deliverycharge, setdeliverycharges] = useState([]);
  const [customerdata, setCustomerdata] = useState({
    useremail: "",
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
  });
  console.log(customerdata);

  useEffect(() => {
    const authCode = Cookies.get("authCode");
    if (!authCode) {
      navigate("/login");
      return;
    }
    const decodedToken = jwtDecode(authCode);
    setCustomerdata((prevData) => ({
      ...prevData,
      useremail: decodedToken.email || "",
    }));

    window.scrollTo(0, 0);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const getDeliveryCharges = async () => {
      try {
        const chargesResponse = await GetApi("/deliverycharges");
        setdeliverycharges(
          chargesResponse.data[chargesResponse.data.length - 1]
        );
        console.log(chargesResponse);
      } catch (error) {
        console.log(error);
      }
    };

    getDeliveryCharges();
  }, []);

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItem = useSelector((state) => state.cart.cartItems);
  const cartQuantity = useSelector((state) => state.cart.totalQuantity);
  const shippingCost = Number(deliverycharge.deliveryCost);

  const totalAmount = cartTotalAmount + Number(shippingCost);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomerdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const bagBookingResponse = await PostApi(
        "/bagbooking",
        {
          total: 1,
        },
        true
      );
      if (!bagBookingResponse.response?.data?.status) {
        navigate("/login");
      }

      if (bagBookingResponse.data.message.status === "created") {
        var option = {
          key: "rzp_live_miuq50dflMActu",
          amount: totalAmount * 100,
          currency: "INR",
          name: "Devesh Bags",
          description: "Test Transaction",
          image: Logo,
          order_id: bagBookingResponse.data.message.id,
          handler: async function (response) {
            alert("Payment successful");
            try {
              const createOrderResponse = await PostApi("/createorder", {
                customerdata: customerdata,
                cartItem: cartItem,
                totalAmount: totalAmount,
                cartQuantity: cartQuantity,
                paymentJson: response,
              }, true);
              if (createOrderResponse.data.status) {
                alert("Order Places Successfully");
                setCustomerdata({
                  name: "",
                  email: "",
                  phone: "",
                  country: "",
                  city: "",
                  address: "",
                  postalCode: "",
                });

                dispatch(cartActions.clearCart());
              } else {
                alert(createOrderResponse.data.message);
              }
            } catch (error) {
              alert(error);
            }
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature);
          },
          modal: {
            ondismiss: function () {
              alert("Payment was not completed, please try again.");
            },
          },
          prefill: {
            name: "Devesh Bags",
            email: "deveshbags@gmail.com",
            contact: "09096850150",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#050C9C",
          },
        };
        const rzp = new window.Razorpay(option);
        rzp.open();
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Helmet title="Checkout">
      <CommonSection title="Checkout" />
      <section>
        <Container>
          <Row>
            <Col lg="8" md="6">
              <h6 className="mb-4">Shipping Address</h6>
              <form className="checkout__form" onSubmit={submitHandler}>
                <div className="form__group">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    name="name"
                    value={customerdata.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form__group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    name="email"
                    value={customerdata.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="number"
                    placeholder="Phone number"
                    required
                    name="phone"
                    value={customerdata.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="text"
                    placeholder="Address"
                    required
                    name="address"
                    value={customerdata.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="text"
                    placeholder="Country"
                    required
                    name="country"
                    value={customerdata.country}
                    onChange={handleChange}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="text"
                    placeholder="City"
                    required
                    name="city"
                    value={customerdata.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="number"
                    placeholder="Postal code"
                    required
                    name="postalCode"
                    value={customerdata.postalCode}
                    onChange={handleChange}
                  />
                </div>
                <button
                  style={{
                    pointerEvents: cartTotalAmount === 0 ? "none" : "auto",
                    color: cartTotalAmount === 0 ? "grey" : "white",
                  }}
                  type="submit"
                  className="addTOCart__btn"
                >
                  Make Payment
                </button>
              </form>
            </Col>

            <Col lg="4" md="6">
              <div className="checkout__bill text-white">
                <h6 className="d-flex align-items-center justify-content-between mb-3">
                  Subtotal:{" "}
                  <span>
                    Rs<span className="ps-2">{cartTotalAmount}</span>
                  </span>
                </h6>
                <h6 className="d-flex align-items-center justify-content-between mb-3">
                  Shipping:{" "}
                  <span>
                    Rs<span className="ps-2">{shippingCost}</span>
                  </span>
                </h6>
                <div className="checkout__total">
                  <h5 className="d-flex align-items-center justify-content-between">
                    Total:{" "}
                    <span>
                      Rs<span className="ps-2">{totalAmount}</span>
                    </span>
                  </h5>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;
