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
import { jwtDecode } from "jwt-decode"; // Corrected import
import axios from "axios"; //
import L from "leaflet";
import "leaflet-routing-machine";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deliverycharge, setdeliverycharges] = useState([]);
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
  const [isReseller, setIsReseller] = useState(false); // Add state to track if the user is a reseller
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

    // Check if the user is a reseller
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
        setdeliverycharges(
          chargesResponse.data[chargesResponse.data.length - 1]
        );
      } catch (error) {
        console.log(error);
      }
    };

    getDeliveryCharges();
  }, []);

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItem = useSelector((state) => state.cart.cartItems);
  console.log(cartItem);
  const productWeight = cartItem.map((product) => {
    return product.weight * product.quantity;
  });
  const sum = productWeight.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const cartQuantity = useSelector((state) => state.cart.totalQuantity);
  //const productWeight = Number(cartItem.weight) * cartQuantity;
  function roundUpToNearestThousand(value) {
    return Math.ceil(value / 1000) * 1000;
  }
  const deliveryChargesPerKG = 100;
  const shippingCost = Number(
    deliverycharge.deliveryCost * distance +
      (roundUpToNearestThousand(sum) / 1000) * deliveryChargesPerKG
  );

  // Adjust the cart total amount if the user is a reseller
  const adjustedCartTotalAmount = isReseller
    ? (cartTotalAmount) * 0.8 // Apply 20% discount for resellers
    : cartTotalAmount;

  const GSTamount = Number(adjustedCartTotalAmount * 0.18).toFixed(2);
  const GSTamountNumber = Number(GSTamount);
  const totalAmount = (
    adjustedCartTotalAmount +
    shippingCost +
    GSTamountNumber
  ).toFixed(2);

  const getLatLngFromPostalCode = async (postalCode) => {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${postalCode}`
    );
    const { lat, lon } = response.data[0];
    return { lat, lon };
  };

  // Function to get distance using Google Maps Distance Matrix API
  const getDistance = async (postalCode) => {
    try {
      const userLocation = await getLatLngFromPostalCode(postalCode);
      const fixedLocation = await getLatLngFromPostalCode("416416");

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.lat, userLocation.lon),
          L.latLng(fixedLocation.lat, fixedLocation.lon),
        ],
        createMarker: function () {
          return null;
        },
        routeWhileDragging: false,
        showAlternatives: false,
        addWaypoints: false,
      });

      routingControl.on("routesfound", function (e) {
        const route = e.routes[0];
        const distanceInKm = (route.summary.totalDistance / 1000).toFixed(2);
        setDistance(distanceInKm);
        console.log(`Distance: ${distanceInKm} km`);
      });

      // Trigger the routing calculation manually
      routingControl.route();
    } catch (error) {
      console.error("Error calculating distance:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomerdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // If postalCode field is updated, fetch the distance
    if (name === "postalCode" && value.length === 6) {
      getDistance(value);
    }
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
                  cartQuantity: cartQuantity,
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
                    <span className="ps-2">{GSTamount}</span>
                  </span>
                </h6>
                <h6 className="d-flex align-items-center justify-content-between mb-3">
                  Shipping:{" "}
                  {customerdata.postalCode.length < 6 ? (
                    <>
                      {" "}
                      <span className="h6">Enter Postal code</span>{" "}
                    </>
                  ) : (
                    <>
                      <span className="ps-2">Rs {shippingCost.toFixed(2)}</span>
                    </>
                  )}
                </h6>
                <div className="checkout__total">
                  <h5 className="d-flex align-items-center justify-content-between">
                    Total:{" "}
                    {customerdata.postalCode.length < 6 ? (
                      <>
                        {" "}
                        <span className="h6">Enter Postal code</span>{" "}
                      </>
                    ) : (
                      <>
                        <span className="ps-2">Rs {totalAmount}</span>
                      </>
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
