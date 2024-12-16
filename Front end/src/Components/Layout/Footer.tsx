import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

let logo = require("../../Assests/Images/logo.png");

const navStyle = {
  backgroundColor: "#ff6600",
  borderBottom: "1px solid #dcdcdc",
  padding: "10px 20px",
};
function Footer() {
  return (
    <footer className="footer text-white" style={navStyle}>
      <div className="container py-4">
        <div className="row">
          <div className="col-md-3">
            <img src={logo} alt="Logo" style={{ height: "50px" }} />
            <p>227 Nguyen Van Cu</p>
            <p>Dist. 5, HCMC, Vietnam</p>
            <p>alt.f4.21clc@gmail.com</p>
            <p>+84-12-345678</p>
          </div>
          <div className="col-md-3">
            <h5>Account</h5>
            <p>My account</p>
            <p>Login/Sign up</p>
            <p>Cart</p>
          </div>
          <div className="col-md-3">
            <h5>Support</h5>
            <p>Privacy Policy</p>
            <p>Term Of Use</p>
            <p>FAQ</p>
            <p>Contact</p>
          </div>
          <div className="col-md-3">
            <h5>Follow Us</h5>
            <p>
              <i className="bi bi-facebook me-2"></i>Facebook
            </p>
            <p>
              <i className="bi bi-instagram me-2"></i>Instagram
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
