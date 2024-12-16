import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { userModel } from "../../Interfaces";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import {
  initialState,
  setLoggedInUser,
} from "../../Storage/Redux/userNameSlice";
import { MainLoader } from "../Page/Common";
let logo = require("../../Assests/Images/logo.png");

const HeaderChef: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(path);
    }, 300);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("orderId");
    sessionStorage.removeItem("userRole");
    dispatch(setLoggedInUser({ ...initialState }));
    navigate("/login");
  };

  if (isLoading) {
    return <MainLoader />;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow p-3">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            className="me-3"
            style={{ height: "50px", width: "50px" }}
          />
          <span className="navbar-brand mb-0 h1">KITCHEN DEPARTMENT</span>
        </div>
        {/* <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                to="/chef/orderlist"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                ORDER LIST
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/chef/cooking"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                COOKING
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/chef/completed"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                COMPLETED ORDERS
              </NavLink>
            </li>
          </ul>
        </div> */}
        <div
          className="d-flex align-items-center"
          style={{ marginLeft: "auto", listStyle: "none" }}
        >
          {userData._id && (
            <>
              <li className="nav-item">
                <span
                  className="nav-link active"
                  style={{
                    cursor: "default",
                    background: "transparent",
                    border: 0,
                    color: "black",
                    marginRight: "10px",
                  }}
                >
                  Welcome, {userData.name}
                </span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-success rounded-pill text-white"
                  style={{
                    border: "none",
                    height: "40px",
                    width: "100px",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HeaderChef;
