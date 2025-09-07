import React, { useState, useEffect } from "react";
import "./styles.css";
import "./mobile.css";
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Auth from "./components/auth";
import Sidebar from "./components/sideBar";
import DeleteItems from "./components/deleteItems";
import AddProduct from "./components/addProduct";
import Fail from "./components/fail";
import Forget from "./components/Forget";
import ResetPassword from "./components/resetPassword";
import Checkout from "./components/checkout";
import Success from "./components/success";
import NotFound from "./components/404";
import Contact from "./components/contact";
import Order from "./components/order";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import VerifyEmail from "./components/verifyEmail";
import RegistrationSuccess from "./components/registrationSuccess";

export default function App() {
  const [display, setDisplay] = useState(0);

  const changeDisplay = () => {
    setDisplay(display ^ 1);
  };

  // منع التمرير عند فتح الـ Sidebar
  useEffect(() => {
    if (display === 1) {
      document.body.style.overflow = "hidden";
      document.documentElement.scrollTop = 0;
    } else {
      document.body.style.overflow = "";
    }
  }, [display]);

  // رسالة عند عدم وجود الإنترنت
  useEffect(() => {
    if (!navigator.onLine) alert("You Are Offline");
  }, [navigator.onLine]);

  return (
    <Router>
      {display === 1 ? (
        <Sidebar display={display} changeDisplay={changeDisplay} />
      ) : (
        <>
          <Navbar display={display} changeDisplay={changeDisplay} />
          <Switch>
            <Route exact path="/" component={Menu} />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/addproduct" component={AddProduct} />
            <Route path="/forget" component={Forget} />
            <Route exact path="/auth" component={Auth} />
            <Route exact path="/registration-success" component={RegistrationSuccess} />
            <Route exact path="/verify-email/:id/:verificationToken" component={VerifyEmail} />
            <Route exact path="/checkout" component={Checkout} />
            <Route exact path="/success" component={Success} />
            <Route exact path="/fail" component={Fail} />
            <Route exact path="/deleteitems" component={DeleteItems} />
            <Route exact path="/reset-password" component={ResetPassword} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/order" component={Order} />
            <Route path="/" component={NotFound} />
          </Switch>
        </>
      )}
    </Router>
  );
}