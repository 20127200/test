import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLoader } from "../Components/Page/Common";
import "bootstrap/dist/css/bootstrap.min.css";
import { inputHelper } from "../Helpers";
import { apiResponse } from "../Interfaces";
import { useRegisterMutation } from "../Apis/authApi";
import { toast } from "react-toastify";

function Register() {
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    fullName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    email: "",
  });

  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [fullAddress, setFullAddress] = useState<string>("");

  const cities: string[] = ["TP.HCM", "Ngoại Thành"];
  const districts: Record<string, string[]> = {
    "TP.HCM": [
      "Quận 1",
      "Quận 2",
      "Quận 3",
      "Quận 4",
      "Quận 5",
      "Quận 6",
      "Quận 7",
      "Quận 8",
      "Quận 9",
      "Quận 10",
      "Quận 11",
      "Quận 12",
      "Tân Bình",
      "Tân Phú",
      "Bình Tân",
      "Bình Thạnh",
      "Gò Vấp",
      "Phú Nhuận",
      "Thủ Đức",
      "Nhà Bè",
      "Cần Giờ",
      "Củ Chi",
      "Hóc Môn",
      "Bình Chánh",
    ],
    "Ngoại Thành": [],
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    setDistrict(""); // Reset district when city changes
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value);
  };

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreet(e.target.value);
  };

  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "address" && value.length > 0) {
      const firstChar = value.charAt(0);
      if (!/^[0-9]$/.test(firstChar)) {
        e.target.setCustomValidity("Ký tự đầu tiên của địa chỉ phải là số.");
        e.target.reportValidity();
        return;
      } else if (/[^a-zA-Z0-9\s,\./]/.test(value)) {
        e.target.setCustomValidity("Địa chỉ không được chứa ký tự đặc biệt.");
        e.target.reportValidity();
        return;
      } else {
        e.target.setCustomValidity("");
      }
    }

    if (name === "phone") {
      const phoneRegex = /^[0-9]*$/;
      const validPrefixes =
        /^(032|033|034|035|036|037|038|039|088|091|094|081|082|083|084|085|090|093|089|070|079|077|076|078|096|097|098|086|092)/;
      if (!phoneRegex.test(value)) {
        e.target.setCustomValidity("Số điện thoại chỉ được chứa các ký tự số.");
        e.target.reportValidity();
        return;
      } else if (
        value.length > 3 &&
        !validPrefixes.test(value.substring(0, 3))
      ) {
        e.target.setCustomValidity(
          "Ba số đầu tiên của số điện thoại không hợp lệ."
        );
        e.target.reportValidity();
        return;
      } else {
        e.target.setCustomValidity("");
      }
    }

    // if (name === "fullName") {
    //   const nameRegex = /^[a-zA-Z\s]*$/;
    //   if (!nameRegex.test(value)) {
    //     e.target.setCustomValidity(
    //       "Tên không được chứa các ký tự số hoặc ký tự đặc biệt."
    //     );
    //     e.target.reportValidity();
    //     return;
    //   } else {
    //     e.target.setCustomValidity("");
    //   }
    // }

    // if (name === "fullName") {
    //   // Biểu thức chính quy cho phép các chữ cái, bao gồm cả dấu tiếng Việt
    //   const nameRegex = /^[a-zA-Z\s\u00C0-\u1EF9]*$/;
    //   if (!nameRegex.test(value)) {
    //     e.target.setCustomValidity(
    //       "Tên không được chứa các ký tự số hoặc ký tự đặc biệt."
    //     );
    //     e.target.reportValidity();
    //     return;
    //   } else {
    //     e.target.setCustomValidity("");
    //   }
    // }

    if (name === "userName") {
      const usernameRegex = /^[a-zA-Z0-9@$#*!%&]*$/;
      // const hasDiacritics =
      //   /[áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/;  || hasDiacritics.test(value)
      if (!usernameRegex.test(value)) {
        e.target.setCustomValidity(
          "Username không được chứa dấu hoặc ký tự đặc biệt trừ @, $, #, *, !, %, &."
        );
        e.target.reportValidity();
        return;
      } else {
        e.target.setCustomValidity("");
      }
    }

    if (name === "password") {
      const passRegex = /^[a-zA-Z0-9@$#*!%&]*$/;
      const hasDiacritics =
        /[áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/;
      if (!passRegex.test(value) || hasDiacritics.test(value)) {
        e.target.setCustomValidity(
          "Mật khẩu chỉ cho phép các ký tự không dấu và @, $, #, *, !, %, &."
        );
        e.target.reportValidity();
        return;
      } else {
        e.target.setCustomValidity("");
      }
    }

    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSaveAddress = () => {
    // Tạo fullAddress và lưu lại vào state tĩnh
    const address = `${street}, ${district}, ${city}`;
    setFullAddress(address);
    console.log("Full Address saved:", address);
  };

  const handleConfirmPasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      userInput.confirmPassword &&
      userInput.confirmPassword !== userInput.password
    ) {
      e.target.setCustomValidity("Mật khẩu xác nhận không khớp.");
      e.target.reportValidity();
    } else {
      e.target.setCustomValidity("");
    }
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (userInput.phone.length !== 10) {
      e.target.setCustomValidity("Số điện thoại phải đủ 10 số.");
      e.target.reportValidity();
    } else {
      e.target.setCustomValidity("");
    }
  };

  const handleConfirmPasswordInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    if (value === userInput.password) {
      e.target.setCustomValidity("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    //const fullAddress = `${street}, ${district}, ${city}`;
    const fullAddress =
      city === "Ngoại Thành"
        ? `${street}, ${city}`
        : `${street}, ${district}, ${city}`;
    setFullAddress(fullAddress);

    try {
      const response: apiResponse = await registerUser({
        name: userInput.fullName,
        username: userInput.userName,
        password: userInput.password,
        sdt: userInput.phone,
        shippingAddress: fullAddress,
        email: userInput.email,
      }).unwrap();

      // Xử lý dữ liệu trả về khi thành công
      console.log(response);
      //alert(response.message);
      // Điều hướng tới trang khác nếu cần
      toast.success("Bạn đã đăng ký tài khoản thành công!");

      // Điều hướng đến trang đăng nhập sau 3 giây
      setTimeout(() => {
        navigate("/login");
      }, 500);
      navigate("");
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Đã có lỗi xảy ra: ", error);
      //alert("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
    setLoading(false);
    const phoneRegex =
      /^(032|033|034|035|036|037|038|039|088|091|094|081|082|083|084|085|090|093|089|070|079|077|076|078|096|097|098|086|092)[0-9]{7}$/;
    if (!phoneRegex.test(userInput.phone)) {
      alert(
        "Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng các mã hợp lệ."
      );
      setLoading(false);
      return;
    }
    if (userInput.password !== userInput.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp.");
      setLoading(false);
      return;
    }
  };

  // if (typeof fullAddress === "string") {
  //   console.log("fullAddress là chuỗi:", fullAddress);
  // } else {
  //   console.log("fullAddress không phải là chuỗi:", fullAddress);
  // }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1523294587484-bae6cc870010?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJha2VyeXxlbnwwfHwwfHx8MA%3D%3D")',
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
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          margin: "0 auto",
        }}
      >
        {loading && <MainLoader />}
        <form method="post" onSubmit={handleSubmit}>
          <h1 className="mb-4">Sign up</h1>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/user-male-circle.png"
                  alt="Full Name Icon"
                  style={{ width: "20px" }}
                />
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Full name"
              value={userInput.fullName}
              name="fullName"
              onChange={handleUserInput}
              required
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon2">
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
              value={userInput.userName}
              name="userName"
              onChange={handleUserInput}
              required
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon3">
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
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon7">
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/password.png"
                  alt="Confirm Password Icon"
                  style={{ width: "20px" }}
                />
              </span>
            </div>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={userInput.confirmPassword}
              name="confirmPassword"
              onChange={(e) => {
                handleUserInput(e);
                handleConfirmPasswordInput(e);
              }}
              onBlur={handleConfirmPasswordBlur}
              disabled={!userInput.password}
              required
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon4">
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/phone.png"
                  alt="Phone Icon"
                  style={{ width: "20px" }}
                />
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Phone"
              value={userInput.phone}
              name="phone"
              onChange={handleUserInput}
              onBlur={handlePhoneBlur}
              maxLength={10}
              required
              // onKeyPress={handleKeyPress}
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon6">
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/email.png"
                  alt="Email Icon"
                  style={{ width: "20px" }}
                />
              </span>
            </div>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={userInput.email}
              name="email"
              onChange={handleUserInput}
              required
            />
          </div>
          {/* <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon5">
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/address.png"
                  alt="Address Icon"
                  style={{ width: "20px" }}
                />
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              value={userInput.address}
              name="address"
              onChange={handleUserInput}
              required
            />
          </div>  */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={city}
                onChange={handleCityChange}
                required
              >
                <option value="">Thành phố</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={district}
                onChange={handleDistrictChange}
                required
                disabled={!city}
              >
                <option value="">Quận/huyện</option>
                {city &&
                  districts[city].map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon8">
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/address.png"
                  alt="Street Icon"
                  style={{ width: "20px" }}
                />
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Số nhà"
              value={street}
              onChange={handleStreetChange}
              required
            />
          </div>
          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={handleSaveAddress}
          >
            Xác nhận địa chỉ
          </button>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon9">
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/address.png"
                  alt="Full Address Icon"
                  style={{ width: "20px" }}
                />
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Địa chỉ đầy đủ"
              value={fullAddress}
              readOnly
              required
            />
          </div>
          <button type="submit" className="btn btn-warning w-100">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
