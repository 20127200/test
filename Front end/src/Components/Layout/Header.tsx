import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MainLoader } from "../Page/Common";
import { cartItemModel, userModel } from "../../Interfaces";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import {
  initialState,
  setLoggedInUser,
} from "../../Storage/Redux/userNameSlice";
import { setShoppingCart } from "../../Storage/Redux/shoppingCartSlice";
import { setSearchItem } from "../../Storage/Redux/menuItemSlice";

let logo = require("../../Assests/Images/logo.png");

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchItem(e.target.value));
    setValue(e.target.value);
  };

  const shoppingCartFromStore: cartItemModel[] = useSelector(
    (state: RootState) => state.shoppingCartStore.cartItems ?? []
  );

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  console.log(userData._id);

  const navStyle = {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #dcdcdc",
    padding: "10px 20px",
  };

  const liStyle = {
    marginRight: "20px",
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOrderCompleted) {
      const timer = setTimeout(() => {
        setIsOrderCompleted(false); // Tắt animation sau 3 giây
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOrderCompleted]);

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
    dispatch(setShoppingCart({ ...initialState }));
    navigate("/login");
  };

  if (isLoading) {
    return <MainLoader />;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg" style={navStyle}>
        <div className="container-fluid">
          <NavLink
            className="navbar-brand"
            to="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/");
            }}
          >
            <img src={logo} alt="Logo" style={{ height: "50px" }} />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item" style={liStyle}>
                <NavLink className="nav-link active" aria-current="page" to="/">
                  Home
                </NavLink>
              </li>
              {/* <li className="nav-item dropdown" style={liStyle}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Menu
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Cake 1
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Cake 2
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Cake 3
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Cake 4
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Cake 5
                    </a>
                  </li>
                </ul>
              </li> */}
              {/* <li className="nav-item" style={{ marginRight: "20px" }}>
                <a className="nav-link" href="#">
                  About us
                </a>
              </li> */}
            </ul>
            <form
              className="d-flex"
              role="search"
              style={{ marginRight: "20px" }}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={value}
                onChange={handleChange}
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
            <NavLink
              className="nav-link active"
              aria-current="page"
              to="/shoppingCart"
            >
              <i className="bi bi-cart3" style={{ marginLeft: "1px" }}></i>{" "}
              {shoppingCartFromStore?.length
                ? `(${shoppingCartFromStore.length})`
                : ""}
            </NavLink>

            <div
              className="d-flex align-items-center"
              style={{ marginLeft: "auto", listStyle: "none" }}
            >
              <NavLink
                className="nav-link active"
                aria-current="page"
                to="/myorder"
              >
                <i
                  className="bi bi-box-seam"
                  style={{ marginRight: "20px" }}
                ></i>
              </NavLink>
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
              {!userData._id && (
                <>
                  <li className="nav-item text-black">
                    <NavLink className="nav-link" to="/register">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-item" to="/login">
                      <button
                        className="btn btn-success btn-outlined rounded-pill text-white mx-2"
                        style={{
                          border: "none",
                          height: "40px",
                          width: "100px",
                        }}
                      >
                        Login
                      </button>
                    </NavLink>
                  </li>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
function useSearchMenuItemsQuery(
  searchKey: string,
  arg1: { skip: boolean }
): { data: any; isLoading: any; error: any } {
  throw new Error("Function not implemented.");
}
