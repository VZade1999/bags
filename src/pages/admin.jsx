import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModalComponent from ".././components/UI/admin/ModalComponent";
import Category from ".././components/UI/admin/Category";
import ProductList from "../components/UI/admin/ProductList";

const Admin = () => {
  const [show, setShow] = useState(false);
  const [propsData, setPropsData] = useState("");

  const handleShow = (data) => {
    setShow(true);
    setPropsData(data);
  };
  const handleClose = () => setShow(false);

  return (
    <>
      <h1 className="d-flex text-primary justify-content-center pt-3">
        This is admin Console
      </h1>
      <div className="d-flex">
        <div className="w-75">
          <Category />
        </div>

        <div className="d-flex pe-5">
          <div className="pt-3 ps-3">
            <button
              className="btn btn-secondary px-5"
              onClick={() => handleShow("addbags")}
            >
              Add Bag
            </button>
          </div>
          <Link to="orderlist">
            {" "}
            <div className="pt-3 ps-3">
              <button className="btn btn-secondary px-5">Check Order</button>
            </div>
          </Link>

          <div className="pt-3 ps-3">
            <button className="btn btn-secondary px-5">Check Users</button>
          </div>
        </div>
      </div>
      <ModalComponent show={show} data={propsData} handleClose={handleClose} />
      <div className="p-5 border border-gray">
        <ProductList />
      </div>
    </>
  );
};

export default Admin;
