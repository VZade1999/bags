import React, { useEffect, useState } from "react";
import { GetApi } from "../../../api/api";
import { useNavigate } from "react-router-dom";
import ModalComponent from "./ModalComponent";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import * as XLSX from "xlsx";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [order, setorder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = parseCookies();
    const authCode = cookies.authCode;

    if (!authCode) {
      navigate("/login");
    } else {
      try {
        const decoded = jwtDecode(authCode);
        const userRole = decoded.role;

        if (userRole !== "admin") {
          navigate("/bags");
        }
      } catch (error) {
        console.error("Invalid authCode:", error);
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const getAllOrders = async () => {
      try {
        const orderResponse = await GetApi("/orderlist");
        setOrders(orderResponse?.data?.reverse());
      } catch (error) {
        console.log(error);
      }
    };
    getAllOrders();
  }, []);

  const [show, setShow] = useState(false);
  const [propsData, setPropsData] = useState("");

  const handleShow = (data) => {
    setShow(true);
    setPropsData(data);
  };

  const handleClose = () => setShow(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  const filteredOrders = orders
    .filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = order.customerData.name
        .toLowerCase()
        .includes(searchLower);
      const phoneMatch = order.customerData.phone
        .toLowerCase()
        .includes(searchLower);
      return nameMatch || phoneMatch;
    })
    .filter((order) => {
      const orderDate = new Date(order.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return (
        (!startDate || orderDate >= start) && (!endDate || orderDate <= end)
      );
    });

  // Group and aggregate orders by ID
  const aggregatedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order._id]) {
      acc[order._id] = {
        ...order,
        cartItems: [],
      };
    }
    acc[order._id].cartItems = [
      ...acc[order._id].cartItems,
      ...order.cartItems,
    ];
    return acc;
  }, {});

  // Prepare data for Excel export
  const excelData = Object.values(aggregatedOrders).flatMap((order) =>
    order.cartItems.map((cartItem) => ({
      "Order ID": order._id,
      "Customer Name": order.customerData.name,
      "Customer Address": `${order.customerData.address}, ${order.customerData.city}, ${order.customerData.postalCode}`,
      "Customer Phone": order.customerData.phone,
      "Order Created At": order.createdAt,
      "Order Price": order.totalAmount,
      "Order Quantity": order.cartQuantity,
      "Order Status": order.status || "N/A",
      "Payment Status": order.payment?.hasOwnProperty("razorpay_payment_id")
        ? "Completed"
        : "Pending",
      "Cart Item Title": cartItem.title,
      "Cart Item Description": cartItem.description,
      "Cart Item Price": cartItem.price,
      "Cart Item Quantity": cartItem.quantity,
      "Cart Item Total Price": cartItem.totalPrice,
    }))
  );

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Report");
    XLSX.writeFile(wb, "order_report.xlsx");
  };

  const handlePrint = (order) => {
    if (!order) return;
  
    // Sample GST rate
    const gstRate = 0.18; // 18%
    const subtotal = order.subtotal;
    const gstAmount = subtotal * gstRate;
    const totalPayment = order.totalAmount;
  
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
      width: 48%; /* Adjust as needed */
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
      max-width: 150px; /* Adjust size as needed */
      margin-bottom: 10px;
      width: 40px;
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
        ${order.cartItems.map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.title}</td>
          <td>${item.description}</td>
          <td>₹${item.price}</td>
          <td>${item.quantity}</td>
          <td>₹${item.totalPrice}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div>
    <h3>Order Summary</h3>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Order Placed At:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
    <p><strong>Order Status:</strong> ${order.status || "N/A"}</p>
    <p><strong>Subtotal:</strong> ₹${subtotal}</p>
    <p><strong>Shipping Charges:</strong> ₹${order.Shipping.toFixed(2)}</p>
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
    <>
      <div className="d-flex flex-column p-4">
        <h4>Order List</h4>
        <div className="mb-3">
          <button className="btn btn-primary mb-3" onClick={handleExportExcel}>
            Export Report
          </button>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search by customer name or phone number..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="d-flex mb-3">
            <input
              type="date"
              className="form-control me-2"
              placeholder="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <input
              type="date"
              className="form-control"
              placeholder="End Date"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
          <button className="btn btn-secondary" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Customer Address</th>
              <th scope="col">Customer Phone</th>
              <th scope="col">Order Created At</th>
              <th scope="col">Order Price</th>
              <th scope="col">Order Quantity</th>
              <th scope="col">Order Status</th>
              <th scope="col">Payment Status</th>
              <th scope="col">View Order</th>
     
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{order.customerData.name}</td>
                <td>
                  {order.customerData.address}, {order.customerData.city},{" "}
                  {order.customerData.postalCode}
                </td>
                <td>{order.customerData.phone}</td>
                <td>{order.createdAt}</td>
                <td>{order.totalAmount}</td>
                <td>{order.cartQuantity}</td>
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
                  {order.status || "N/A"}
                </td>
               
                
                <td>
                  {order.payment?.hasOwnProperty("razorpay_payment_id")
                    ? "Completed"
                    : "Pending"}
                </td>
            
                <td
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    onClick={() => handleShow(order)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="pe-2"
                    width="30"
                    height="30"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <svg
                    className="ps-2"
                    onClick={()=>handlePrint(order)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    width="30"
                    height="30"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                    />
                  </svg>
                </td>
              </tr>
            ))}
            <ModalComponent
              show={show}
              data={propsData}
              handleClose={handleClose}
            />
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrderList;
