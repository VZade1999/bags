import React from "react";
import axios from "axios";
import { PostApi } from "../../../api/api";

const ViewOrders = ({ orderdata }) => {
  const [orderStatus, setOrderStatus] = React.useState(orderdata.status);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleStatusChange = (e) => {
    setOrderStatus(e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await PostApi(
        "/order/update-status",
        {
          orderId: orderdata._id,
          status: orderStatus,
        },
        true
      );
      if (response.data.status) {
        alert(`Order Status updated as ${orderStatus}`);
      }
      // Optionally, you can update the UI or show a success message
    } catch (error) {
      console.error("Error updating order status:", error);
      // Optionally, handle error or show an error message
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = orderdata.cartItems?.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(filteredItems);

  return (
    <>
      <h3 className="px-3 py-1 text-primary pb-0 mb-0">View Order</h3>
      <span className="ps-3 text-success pb-3">Order Id: {orderdata._id}</span>
      <div className="d-flex flex-column">
        <div>
          <div className="d-flex">
            <p className="px-3">Customer Name: {orderdata.customerData.name}</p>
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
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Product Name</th>
                <th scope="col">Product Description</th>
                <th scope="col">Colour</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems?.map((product, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img
                      src={`https://bagsbe-production.up.railway.app/${product.image}`}
                      alt={product.title} // Add alt text for accessibility
                      style={{
                        width: "50px", // Adjust the width of the image
                        height: "50px", // Adjust the height of the image
                        objectFit: "cover", // Ensures the image fits nicely within the dimensions
                        borderRadius: "5px", // Optional: Slightly round the image corners
                      }}
                    />
                  </td>

                  <td>{product.title}</td>
                  <td>{product.description}</td>
                  <td
                    style={{
                      padding: "10px", // Padding around the color circle
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: product.color, // Color from the product data
                        width: "30px", // Width of the color circle
                        height: "30px", // Height of the color circle
                        borderRadius: "50%", // Make the div a circle
                        margin: "0 auto", // Center the circle inside the cell
                      }}
                    ></div>
                  </td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.quantity * product.price}</td>
                </tr>
              ))}
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
                      <td className="ps-5">{orderdata.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="pe-5">GST</td>
                      <td className="ps-5">{orderdata.GST}</td>
                    </tr>
                    <tr>
                      <td className="pe-5">Shipping Charges</td>
                      <td className="ps-5">{orderdata.Shipping.toFixed(2)}</td>
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
            <form onSubmit={handleSave}>
              <div className="d-flex pt-5 pe-5 mt-2">
                <label className="pe-3">Change Status</label>
                <select
                  className="form-select w-100"
                  value={orderStatus}
                  onChange={handleStatusChange}
                >
                  <option>Order Rejected</option>
                  <option>Order Received</option>
                  <option>Order Accepted</option>
                  <option>Ready for ship</option>
                  <option>On the way</option>
                  <option>Order Delivered</option>
                </select>
                <div className="px-3 pt-1">
                  <button className="btn btn-primary py-2" type="submit">
                    Save
                  </button>
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
