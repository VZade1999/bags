import React, { useEffect, useState } from "react";
import { PostApi } from "../api/api";
import { jwtDecode } from "jwt-decode"; // Corrected import
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Myorders = () => {
  const navigate = useNavigate();
  const [myorderlist, setMyorderlist] = useState([]);
  console.log(myorderlist); // For debugging

  useEffect(() => {
    const authCode = Cookies.get("authCode");
    if (!authCode) {
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(authCode);
    console.log(decodedToken); // For debugging

    const getMyOrders = async () => {
      try {
        const response = await PostApi(
          "/myorderlist",
          { useremail: decodedToken.email },
          true
        );

        // Make sure to adjust this based on your actual API response structure
  console.log(response.data)
        setMyorderlist(response.data?.message || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    getMyOrders();
  }, [navigate]);

  return (
    <div className="d-flex flex-column p-4">
      <h4>Order List</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Item Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price</th>
            <th scope="col">Delivery Charges</th>
            <th scope="col">Total</th>
            <th scope="col">Order Status</th>
            <th scope="col">Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {myorderlist.length > 0 ? (
            myorderlist.map((order, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{order.cartItems?.[0]?.title || "N/A"}</td>{" "}
                {/* Adjust based on your data */}
                <td>{order.cartItems?.[0]?.quantity || "N/A"}</td>
                <td>{order.cartItems?.[0]?.price || "N/A"}</td>
                <td>{order.deliveryCharges || "N/A"}</td>
                <td>{order.totalAmount || "N/A"}</td>
                <td>
                  {order.payment?.hasOwnProperty("razorpay_payment_id")
                    ? "Completed"
                    : "Pending"}
                </td>
                <td style={{ cursor: "pointer" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                    width="30"
                    height="30"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Myorders;
