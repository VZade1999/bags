import React, { useEffect, useState } from "react";
import { GetApi } from "../../../api/api";
import { useNavigate } from "react-router-dom";
import ModalComponent from "./ModalComponent";
import { parseCookies } from "nookies";
import {jwtDecode} from "jwt-decode";
import * as XLSX from "xlsx";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
    .filter(order => {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = order.customerData.name.toLowerCase().includes(searchLower);
      const phoneMatch = order.customerData.phone.toLowerCase().includes(searchLower);
      return nameMatch || phoneMatch;
    })
    .filter(order => {
      const orderDate = new Date(order.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return (
        (!startDate || orderDate >= start) &&
        (!endDate || orderDate <= end)
      );
    });

  // Group and aggregate orders by ID
  const aggregatedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order._id]) {
      acc[order._id] = {
        ...order,
        cartItems: []
      };
    }
    acc[order._id].cartItems = [...acc[order._id].cartItems, ...order.cartItems];
    return acc;
  }, {});

  // Prepare data for Excel export
  const excelData = Object.values(aggregatedOrders).flatMap(order => 
    order.cartItems.map(cartItem => ({
      "Order ID": order._id,
      "Customer Name": order.customerData.name,
      "Customer Address": `${order.customerData.address}, ${order.customerData.city}, ${order.customerData.postalCode}`,
      "Customer Phone": order.customerData.phone,
      "Order Created At": order.createdAt,
      "Order Price": order.totalAmount,
      "Order Quantity": order.cartQuantity,
      "Order Status": order.status || "N/A",
      "Payment Status": order.payment?.hasOwnProperty("razorpay_payment_id") ? "Completed" : "Pending",
      "Cart Item Title": cartItem.title,
      "Cart Item Description": cartItem.description,
      "Cart Item Price": cartItem.price,
      "Cart Item Quantity": cartItem.quantity,
      "Cart Item Total Price": cartItem.totalPrice
    }))
  );

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Report");
    XLSX.writeFile(wb, "order_report.xlsx");
  };

  return (
    <>
      <div className="d-flex flex-column p-4">
        <h4>Order List</h4>
        <div className="mb-3">
          <button
            className="btn btn-primary mb-3"
            onClick={handleExportExcel}
          >
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
          <button
            className="btn btn-secondary"
            onClick={handleClearFilters}
          >
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
                  className="p-1 px-3 rounded"
                  style={{
                    backgroundColor:
                      order.status === "Order Rejected" ? "#E31837" : "transparent",
                    color: order.status === "Order Rejected" ? "white" : "black",
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
                  onClick={() => handleShow(order)}
                  style={{ cursor: "pointer" }}
                >
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
