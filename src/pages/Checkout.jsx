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
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deliverycharge, setDeliveryCharges] = useState([]);
  const [distance, setDistance] = useState(null);
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
  const [isReseller, setIsReseller] = useState(false);

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

    if (decodedToken.role === "reseller") {
      setIsReseller(true);
    }

    window.scrollTo(0, 0);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [navigate]);

  useEffect(() => {
    const getDeliveryCharges = async () => {
      try {
        const chargesResponse = await GetApi("/deliverycharges");
        setDeliveryCharges(
          chargesResponse.data[chargesResponse.data.length - 1]
        );
      } catch (error) {
        console.log(error);
      }
    };

    getDeliveryCharges();
  }, []);

  const cartItem = useSelector((state) => state.cart.cartItems);
  console.log(cartItem);
  const cartTotalAmount = cartItem.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const productWeight = cartItem.reduce(
    (total, item) => total + item.weight * item.quantity,
    0
  );
  const deliveryChargesPerKG = 100;
  const shippingCost =
    deliverycharge.deliveryCost * distance +
    Math.ceil(productWeight / 1000) * deliveryChargesPerKG;

  const adjustedCartTotalAmount = isReseller
    ? cartTotalAmount * 0.8
    : cartTotalAmount;
  const GSTamount = adjustedCartTotalAmount * 0.18;
  const totalAmount = (
    adjustedCartTotalAmount +
    shippingCost +
    GSTamount
  ).toFixed(2);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomerdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "postalCode" && value.length === 6) {
      getDistance(value);
    }
  };

  const getLatLngFromPostalCode = async (postalCode) => {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${postalCode}`
    );
    const { lat, lon } = response.data[0];
    return { lat, lon };
  };

  // Function to convert degrees to radians
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  // Haversine formula to calculate the distance between two lat/lon points
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  }
  const getDistance = async (postalCode) => {
    try {
      // Fetch lat/lon for user and fixed location
      const userLocation = await getLatLngFromPostalCode(postalCode);
      const fixedLocation = await getLatLngFromPostalCode("416416"); // Postal code for fixed location
      const distance = haversineDistance(
        userLocation.lat,
        userLocation.lon,
        fixedLocation.lat,
        fixedLocation.lon
      );
       setDistance(distance);
      console.log(`Distance: ${distance.toFixed(2)} km`);
    } catch (error) {
      console.error("Error calculating distance:", error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const bagBookingResponse = await PostApi(
        "/bagbooking",
        { total: 1 },
        true
      );
      if (!bagBookingResponse.response?.data?.status) {
        navigate("/login");
      }

      if (bagBookingResponse.data.message.status === "created") {
        const option = {
          key: "rzp_live_miuq50dflMActu",
          amount: totalAmount * 100,
          currency: "INR",
          name: "Devesh Bags",
          description: "Test Transaction",
          image: Logo,
          order_id: bagBookingResponse.data.message.id,
          handler: async function (response) {
            alert("Payment successful");
            navigate("/myorders");
            try {
              const createOrderResponse = await PostApi(
                "/createorder",
                {
                  customerdata: customerdata,
                  cartItem: cartItem,
                  subtotal: adjustedCartTotalAmount,
                  GST: GSTamount,
                  shippingCost: shippingCost,
                  totalAmount: totalAmount,
                  cartQuantity: cartItem.reduce(
                    (total, item) => total + item.quantity,
                    0
                  ),
                  paymentJson: response,
                },
                true
              );
              if (createOrderResponse.data.status) {
                alert("Order Placed Successfully");
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
          },
          modal: {
            ondismiss: function () {
              alert("Payment was not completed, please try again.");
              navigate("/checkout");
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
              <Link to="/paymentpolicyandreturnpolicy">
                <p className="pt-3 text-primary">
                  Payment Policy & Return Policy
                </p>
              </Link>
            </Col>

            <Col lg="4" md="6">
              <div className="checkout__bill text-white">
                <h6 className="d-flex align-items-center justify-content-between mb-3">
                  Subtotal:{" "}
                  <span>
                    Rs
                    <span className="ps-2">
                      {adjustedCartTotalAmount.toFixed(2)}
                    </span>
                  </span>
                </h6>
                <h6 className="d-flex align-items-center justify-content-between mb-3">
                  GST 18%:
                  <span>
                    Rs
                    <span className="ps-2">{GSTamount.toFixed(2)}</span>
                  </span>
                </h6>
                <h6 className="d-flex align-items-center justify-content-between mb-3">
                  Shipping:{" "}
                  {customerdata.postalCode.length < 6 ? (
                    <span className="h6">Enter Postal code</span>
                  ) : (
                    <span className="ps-2">Rs {shippingCost.toFixed(2)}</span>
                  )}
                </h6>
                <div className="checkout__total">
                  <h5 className="d-flex align-items-center justify-content-between">
                    Total:{" "}
                    {customerdata.postalCode.length < 6 ? (
                      <span className="h6">Enter Postal code</span>
                    ) : (
                      <span className="ps-2">Rs {totalAmount}</span>
                    )}
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
