import React, { useEffect, useState } from "react";
import { PostApi } from "../api/api";
import { jwtDecode } from "jwt-decode";
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
        console.log(response.data);
        setMyorderlist(response.data?.message.reverse() || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    getMyOrders();
  }, [navigate]);

  const handlePrint = (order) => {
    console.log(order);
    if (!order) return;

    // Sample GST rate
    const gstRate = 0.18; // 18%
    const subtotal = order.subtotal;
    const gstAmount = subtotal * gstRate;
    const totalPayment = subtotal + gstAmount;

    const printWindow = window.open("", "", "width=1600,height=900");
    const printContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Invoice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 30px;
      background-color: #f9f9f9;
      color: #333;
    }
    .header {
      text-align: center;
      background-color: #01448b;
      color: white;
      padding: 20px;
      border-radius: 8px;
    }
    .details-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .details-container > div {
      width: 48%;
      background-color: #ffffff;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h3 {
      color: #014292;
    }
    p {
      margin: 5px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #01448b;
      color: white;
    }
    td {
      background-color: #f9f9f9;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      padding: 10px;
      background-color: #01448b;
      color: white;
      border-radius: 8px;
    }
    .footer a {
      color: white;
      text-decoration: none;
    }
    .thank-you {
      font-weight: bold;
      color: #01448b;
      text-align: center;
      margin-top: 20px;
      font-size: 18px;
    }
    .vendor-logo {
      display: block;
      max-width: 150px;
      margin-bottom: 10px;
      width: 100%;
      max-width: 150px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Order Invoice</h1>
  </div>

  <div class="details-container">
    <div class="customer-details">
      <h3>Customer Details</h3>
      <p><strong>Name:</strong> ${order.customerData.name}</p>
      <p><strong>Email:</strong> ${order.customerData.email}</p>
      <p><strong>Phone:</strong> ${order.customerData.phone}</p>
      <p>
        <strong>Address:</strong> ${order.customerData.address},<br/>
        ${order.customerData.city},<br/> ${order.customerData.postalCode}.
      </p>
      <p><strong>Country:</strong> ${order.customerData.country}</p>
    </div>
    <div class="vendor-details">
      <h3>Vendor Details</h3>
      <img src="https://bni-india.in/web/open/appsCmsImageDownload?imageObjectId=6619fdf0e4b0a05c4452b8d4" alt="Vendor Logo" class="vendor-logo">
      <p><strong>Vendor Name:</strong> Devesh Bags</p>
      <p><strong>Mobile Number:</strong> 090968 50150</p>
      <p>
        <strong>Address:</strong> Plot No.5484/2C, Gopalkrishna Chinmay Part
        2nd,<br/> Opp. Renuka Temple, Abhay Nagar, Sangli Maharashtra.
      </p>
      <p><strong>Email:</strong> example@gmail.com</p>
      <p>
        <strong>Website:</strong>
        <a href="http://www.deveshbags.com">www.deveshbags.com</a>
      </p>
      <p><strong>GST Number:</strong> 123456789012345</p>
    </div>
  </div>

  <div>
    <h3>Products Details</h3>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total Price</th>
        </tr>
      </thead>
      <tbody>
        ${order.cartItems
          .map(
            (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.title}</td>
          <td>${item.description}</td>
          <td>₹${item.price}</td>
          <td>${item.quantity}</td>
          <td>₹${item.totalPrice}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <div>
    <h3>Order Summary</h3>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Order Placed At:</strong> ${new Date(
      order.createdAt
    ).toLocaleString()}</p>
    <p><strong>Order Status:</strong> ${order.status || "N/A"}</p>
    <p><strong>Subtotal:</strong> ₹${subtotal}</p>
    <p><strong>Shipping Charges:</strong> ₹${order.Shipping}</p>
    <p><strong>GST (18%):</strong> ₹${gstAmount.toFixed(2)}</p>
    <p><strong>Total Payment:</strong> ₹${totalPayment.toFixed(2)}</p>
  </div>

  <div class="thank-you">
    <strong>Thank You...! Order Again</strong>
  </div>

  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} Devesh Bags. All rights reserved.</p>
    <p>For more information, visit our website: <a href="http://www.deveshbags.com">www.deveshbags.com</a></p>
  </div>
</body>
</html>
`;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="d-flex flex-column">
      <h4>Order List</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Order ID</th>
            <th scope="col">Item Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price</th>
            <th scope="col">GST</th>
            <th scope="col">Delivery Charges</th>
            <th scope="col">Total</th>
            <th scope="col">Order Status</th>
            <th scope="col">Payment Status</th>
            <th scope="col">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {myorderlist.length > 0 ? (
            myorderlist.map((order, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{order._id || "N/A"}</td>
                <td>{order.cartItems?.[0]?.title || "N/A"}</td>
                <td>{order.cartItems?.[0]?.quantity || "N/A"}</td>
                <td>{order.subtotal || "N/A"}</td>
                <td>{order.GST || "N/A"}</td>
                <td>{order.Shipping || "N/A"}</td>
                <td>{order.totalAmount || "N/A"}</td>
                <div>
                  <td
                    className="rounded"
                    style={{
                      backgroundColor:
                        order.status === "Order Rejected"
                          ? "#E31837"
                          : "transparent",
                      color:
                        order.status === "Order Rejected" ? "white" : "black",
                    }}
                  >
                    <div className="p-2">{order.status || "N/A"}</div>
                  </td>
                </div>

                <td>
                  {order.payment?.hasOwnProperty("razorpay_payment_id")
                    ? "Completed"
                    : "Pending"}
                </td>
                <td>
                  <svg
                    className="ps-2"
                    onClick={() => handlePrint(order)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    width="40"
                    height="40"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                    />
                  </svg>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Myorders;
