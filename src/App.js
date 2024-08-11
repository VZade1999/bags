import Layout from "./components/Layout/Layout";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./store/userSlice";
import Cookies from "js-cookie";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const authCode = Cookies.get("authCode");
    if (authCode) {
      dispatch(login());
    }
  }, [dispatch]);
  return <Layout />;
}

export default App;
