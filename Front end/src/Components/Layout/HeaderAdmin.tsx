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

const HeaderAdmin: React.FC = () => {
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
    //localStorage.removeItem("userId");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("orderId");
    sessionStorage.removeItem("userRole");
    dispatch(setLoggedInUser({ ...initialState }));
    navigate("/login");
  };

  if (isLoading) {
    return <MainLoader />;
  }

  console.log(userData._id);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow p-3">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            className="me-3"
            style={{ height: "50px", width: "50px" }} // Adjust size as needed
          />
          <span className="navbar-brand mb-0 h1">MANAGEMENT DEPARTMENT</span>
        </div>
        {/* <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                to="/admin/orderlist"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                ORDER LIST
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/item"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                REVENUE
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/productioncost"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                PRODUCTION COST
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
                <button // Use span instead of button for styling text
                  className="nav-link active"
                  style={{
                    cursor: "default",
                    background: "transparent",
                    border: 0,
                    color: "black",
                    marginRight: "10px", // Add margin to separate from logout
                  }}
                >
                  Welcome, {userData.name}
                </button>
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

export default HeaderAdmin;
