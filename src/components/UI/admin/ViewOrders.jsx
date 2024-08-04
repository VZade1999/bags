import React from "react";

const ViewOrders = ({ orderdata }) => {
  console.log(orderdata);
  return (
    <>
      <h3 className="px-3 py-1 text-primary pb-0 mb-0">View Order</h3>
      <span className="ps-3 text-success pb-3">Order Id: #12345</span>
      <div className="d-flex flex-column">
        <div>
          <div className="d-flex">
            <p className="px-3 ">
              Customer Name : {orderdata.customerData.name}{" "}
            </p>
            <p className="px-3">
              Customer Email:{" "}
              <a href={`mailto:${orderdata.customerData.email}`}>
                {orderdata.customerData.email}
              </a>
            </p>
            <p className="px-3">
              Customer Phone Number:{" "}
              <a href={`tel:${orderdata.customerData.phone}`}>
                {orderdata.customerData.phone}
              </a>
            </p>
          </div>
          <div>
            <p className="px-3">
              Customer Address:
              <a
                className="px-3"
                href={`https://www.google.com/maps/search/?api=1&query=${orderdata.customerData.postalCode}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {orderdata.customerData.address}, {orderdata.customerData.city},{" "}
                {orderdata.customerData.country},{" "}
                {orderdata.customerData.postalCode}.
              </a>
            </p>
            <p className="px-3">Order Created At : {orderdata.createdAt}</p>
            <p className="px-3">Order Updated At : {orderdata.updatedAt}</p>
          </div>
        </div>
        <div className="w-100">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Product Name</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderdata.cartItems?.map((product, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{product.title}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.quantity * product.price}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between">
          <div>
            <div className="d-flex justify-content-start">
              <div className="d-flex flex-column">
                <tbody className="table">
                  <thead>
                    <tr></tr>
                    <tr></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pe-5">Sub-Total</td>
                      <td className="ps-5">{orderdata.totalAmount - 30}</td>
                    </tr>
                    <tr>
                      <td>Delivery</td>
                      <td className="ps-5">30</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td className="ps-5">{orderdata.totalAmount}</td>
                    </tr>
                  </tbody>
                </tbody>
              </div>
            </div>
          </div>
          <div>
            <form>
            <div className="d-flex pt-5 pe-5 mt-2">
              <label className="pe-3">Change Status</label>
              <select className="form-select w-100">
                <option>Order Received</option>
                <option>Accept Order</option>
                <option>Ready For Ship</option>
                <option>On the Way</option>
                <option>Delivered</option>
              </select>
              <div className="px-3 pt-1">
                <button className="btn btn-primary py-2 ">Save</button>
              </div>
            </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewOrders;
