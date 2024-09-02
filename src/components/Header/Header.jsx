import React, { useRef, useEffect, useState } from "react";
import { Container } from "reactstrap";
import logo from "../../assets/images/main_logo.png";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cartUiActions } from "../../store/shopping-cart/cartUiSlice";
import { logout } from "../../store/userSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "../../styles/header.css";

const nav__links = [
  { display: "Home", path: "/home" },
  { display: "Bags", path: "/bags" },
  { display: "Cart", path: "/cart" },
  { display: "Contact", path: "/contact" },
];

const Header = () => {
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  const [userEmail, setUserEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  const toggleCart = () => {
    dispatch(cartUiActions.toggle());
  };

  useEffect(() => {
    // Decode the token and extract email
    const token = Cookies.get("authCode");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const handleScroll = () => {
    if (headerRef.current) {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("header__shrink");
      } else {
        headerRef.current.classList.remove("header__shrink");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("authCode");
    dispatch(logout());
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(!showDropdown);
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="nav__wrapper d-flex align-items-center justify-content-between">
          <div className="logo pt-3">
            <img src={logo} alt="logo" />
          </div>

          {/* ======= menu ======= */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <div className="menu d-flex align-items-center gap-5">
              {nav__links.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className={(navClass) =>
                    navClass.isActive ? "active__menu" : ""
                  }
                >
                  {item.display}
                </NavLink>
              ))}
            </div>
          </div>

          {/* ======== nav right icons ========= */}
          <div className="nav__right d-flex align-items-center gap-4">
            <span className="cart__icon" onClick={toggleCart}>
              <i className="ri-shopping-basket-line"></i>
              <span className="cart__badge">{totalQuantity}</span>
            </span>

            <span
              className="user"
              title={isLoggedIn && userEmail ? userEmail : "Login"}
              onClick={toggleDropdown} // Toggle dropdown on click
            >
              <i className="ri-user-line"></i>
            </span>

            <span className="mobile__menu" onClick={toggleMenu}>
              <i className="ri-menu-line"></i>
            </span>
          </div>

          {/* ======== user dropdown menu ========= */}
          {showDropdown && (
            <div className="user-dropdown">
              {isLoggedIn ? (
                <>
                  <Link to="/login" onClick={handleLogout} className="dropdown-item" >Log Out</Link>
                    
              
                  <Link to="/myorders" onClick={closeDropdown} className="dropdown-item">
                    My Orders
                  </Link>
                </>
              ) : (
                <Link to="/login" onClick={closeDropdown} className="dropdown-item">
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
