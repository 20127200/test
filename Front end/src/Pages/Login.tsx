import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MainLoader } from "../Components/Page/Common";
import "bootstrap/dist/css/bootstrap.min.css";
import { inputHelper, toastNotify } from "../Helpers";
import { useLoginMutation } from "../Apis/authApi";
import { apiResponse } from "../Interfaces";
import { setLoggedInUser } from "../Storage/Redux/userNameSlice";
import { setShoppingCart } from "../Storage/Redux/shoppingCartSlice";

function Login() {
  const [loginUser] = useLoginMutation();
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // try {
    //   const response: apiResponse = await loginUser({
    //     username: userInput.username,
    //     password: userInput.password,
    //   }).unwrap();
    //   // Xử lý dữ liệu trả về khi thành công
    //   console.log(response.data);
    //   //localStorage.setItem("userId", JSON.stringify(response.data));
    //   sessionStorage.setItem("userId", JSON.stringify(response.data));

    //   const orderId = response.existingOrder?._id?.toString() || "";
    //   //localStorage.setItem("orderId", orderId);

    //   sessionStorage.setItem("orderId", orderId);

    //   //sessionStorage.setItem("orderId", JSON.stringify(response.existingOrder));

    //   // localStorage.setItem(
    //   //   "orderId",
    //   //   JSON.stringify(response.existingOrder._id)
    //   // );
    //   dispatch(setLoggedInUser(response.data));
    //   //dispatch(setShoppingCart(response.existingOrder));
    //   //alert(response.message);
    //   // Điều hướng tới trang khác nếu cần
    //   //navigate("/");
    //   if (response.data && response.status === "OK") {
    //     toastNotify("Đăng nhập thành công");
    //   }
    //   window.location.replace("/");
    // } catch (error) {
    //   // Xử lý lỗi nếu có
    //   console.error("Đã có lỗi xảy ra: ", error);
    //   toastNotify("Đăng nhập thất bại", "error");
    //   window.location.reload();

    //   // alert("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.");
    // } finally {
    //   setLoading(false);
    // }
    // setLoading(false);
    try {
      console.log("Bắt đầu gọi API login");
      const response: apiResponse = await loginUser({
        username: userInput.username,
        password: userInput.password,
      }).unwrap();

      console.log("API đã phản hồi:", response);

      // Kiểm tra nếu response.data tồn tại và là JSON hợp lệ
      if (response.data && typeof response.data === "object") {
        console.log(response.data);
        sessionStorage.setItem("userId", JSON.stringify(response.data));
        sessionStorage.setItem("userRole", JSON.stringify(response.data.role));

        const orderId = response.existingOrder?._id?.toString() || "";
        sessionStorage.setItem("orderId", orderId);

        dispatch(setLoggedInUser(response.data));
        // dispatch(setShoppingCart(response.existingOrder));

        if (response.status === "OK") {
          // toastNotify("Đăng nhập thành công");
          // window.location.replace("/");
          switch (response.data.role) {
            case "Admin":
              window.location.replace("/admin");
              break;
            case "Customer":
              window.location.replace("/");
              break;
            case "Shipper":
              window.location.replace("/shipper");
              break;
            case "Chef":
              window.location.replace("/chef");
              break;
            default:
              window.location.replace("/");
          }
        } else {
          setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
          toastNotify("Đăng nhập thất bại", "error");
        }
      } else {
        throw new Error("Dữ liệu phản hồi không hợp lệ");
      }
    } catch (error) {
      console.error("Đã có lỗi xảy ra: ", error);
      setError("Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.");
      toastNotify("Đăng nhập thất bại", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1523294587484-bae6cc870010?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJha2VyeXxlbnwwfHwwfHx8MA%3D%3D")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Link to="/" style={{ position: "absolute", top: "20px", left: "20px" }}>
        <img
          src="https://img.icons8.com/ios-filled/50/000000/home.png"
          alt="Home Icon"
          style={{
            width: "55px",
            height: "55px",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
            borderRadius: "50%",
            backgroundColor: "white",
            padding: "5px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.2)"; // Phóng to khi hover
            e.currentTarget.style.boxShadow = "0px 8px 16px rgba(0, 0, 0, 0.5)"; // Tăng bóng mờ khi hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"; // Quay lại kích thước ban đầu
            e.currentTarget.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.3)"; // Quay lại bóng mờ ban đầu
          }}
        />
      </Link>

      <div
        className="p-5 rounded"
        style={{
          backgroundColor: "rgba(255, 255, 255, 1.0)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        {loading && <MainLoader />}
        <form method="post" onSubmit={handleSubmit}>
          <h1 className="mb-4">Login</h1>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/user.png"
                  alt="Username Icon"
                  style={{ width: "20px" }}
                />
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={userInput.username}
              name="username"
              onChange={handleUserInput}
              required
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon2">
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/password.png"
                  alt="Password Icon"
                  style={{ width: "20px" }}
                />
              </span>
            </div>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={userInput.password}
              name="password"
              onChange={handleUserInput}
              required
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-warning w-100">
            Login
          </button>
          <p className="mt-3">
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
