import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PostApi } from "../api/api";
import { login } from ".././store/userSlice";
import Cookies from "js-cookie";

const Login = () => {
  // State to store form input values
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email) {
      alert("Email is required");
    } else if (!password) {
      alert("Password is required");
    } else {
      console.log("Form data submitted:", formData);
      const loginResponse = await PostApi("/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log(loginResponse);
      if (loginResponse?.data?.status) {
        const authCode = loginResponse.data.message;
        Cookies.set("authCode", authCode, { expires: 7 });
        dispatch(login())
        alert("Login Successful");
        navigate(from, { replace: true });
      } else {
        alert("Login Failed");
      }
    }
  };

  return (
    <Helmet title="Login">
      <CommonSection title="Login" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              <form className="form mb-5" onSubmit={submitHandler}>
                <div className="form__group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="addTOCart__btn">
                  Login
                </button>
              </form>
              <Link to="/register">
                Don't have an account? Create an account
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;
