import React, { useEffect, useState } from "react";
import { GetApi } from "../../../api/api";
import ModalComponent from "./ModalComponent";
const OrderList = () => {
  const [orders, setOrders] = useState([]);

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

  return (
    <>
      <div className="d-flex flex-column p-4">
        <h4>Order List</h4>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Customer Address</th>
              <th scope="col">Customer Phone</th>
              <th scope="col">Order Created At</th>
              <th scope="col">Order Price</th>
              <th scope="col">Order Quantity</th>
              <th scope="col">Payment Status</th>
              <th scope="col">View Order</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order, index) => {
              return (
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
                  <td>
                    {order.payment?.hasOwnProperty("razorpay_payment_id")
                      ? "Completed"
                      : "Pending"}
                  </td>
                  <td onClick={() => handleShow(order)} style={{ cursor: "pointer" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                      width="30"
                      height="30"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </td>
                </tr>
              );
            })}
            <ModalComponent show={show} data={propsData} handleClose={handleClose} />
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrderList;
