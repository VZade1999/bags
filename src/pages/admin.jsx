import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModalComponent from "../components/UI/admin/ModalComponent";
import Category from "../components/UI/admin/Category";
import ProductList from "../components/UI/admin/ProductList";
import { parseCookies } from "nookies"; // Use this to parse cookies
import { jwtDecode } from "jwt-decode";

const Admin = () => {
  const [show, setShow] = useState(false);
  const [propsData, setPropsData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = parseCookies();
    const authCode = cookies.authCode; // Replace 'authCode' with your actual cookie name

    if (!authCode) {
      // No authCode present, redirect to login page
      navigate("/login");
    } else {
      try {
        // Decode the authCode (assuming it's a JWT)
        const decoded = jwtDecode(authCode);
        const userRole = decoded.role;

        if (userRole !== "admin") {
          // Role is not admin, redirect to /bags
          navigate("/bags");
        }
      } catch (error) {
        // Handle decoding error or invalid token
        console.error("Invalid authCode:", error);
        navigate("/login");
      }
    }
  }, [navigate]);

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
