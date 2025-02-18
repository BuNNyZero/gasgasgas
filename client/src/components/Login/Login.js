// Login.js
import React, { useState } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import TokenRefresher from "../Utils/token"; 
import "./Login.scss";

function Login(props) {
  let [uname, setUname] = useState("");
  let [password, setPass] = useState("");
  let [error, setError] = useState("");

  // Adding click handler
  function handleClick() {
    if (validateInputs()) {
      const user = {
        email: uname,
        password: password,
      };
      let url = `${getBaseURL()}api/users/login`;
      axios
        .post(url, { ...user })
        .then((res) => {
          console.log(res);
          if (res.data.length > 0) {
            console.log("Logged in successfully");
            sessionStorage.setItem("isUserAuthenticated", true);

            const userData = res.data[0]; // ชุดข้อมูลที่ได้จาก API
            sessionStorage.setItem("customerId", userData.userId);
            sessionStorage.setItem("isAdmin", userData.isAdmin);
            sessionStorage.setItem("jwt_token", userData.token);
            sessionStorage.setItem("jwt_refresh_token", userData.refreshToken);
            TokenRefresher(userData.refreshToken);

            // Set User Authentication Status
            props.setUserAuthenticatedStatus(userData.isAdmin, userData.userId);

            // นำไปสู่หน้าที่เหมาะสมตาม isAdmin
            if (userData.isAdmin === 3) {
              // ถ้า isAdmin = 3 ไปที่ AdminOrderList เลย
              props.navigate("/admin/order-list");
            } else if (userData.isAdmin) {
              // ถ้า isAdmin เป็น 1 ไปที่ AdminContainer
              props.navigate("/admin-dashboard");
            } else {
              // ถ้าไม่ใช่ Admin ไปที่ CustomerDashboard
              props.navigate("/customer-dashboard");
            }
          } else {
            console.log("User not available");
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("error");
        });
    }
  }

  // Function to validate email format
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Function to validate password length
  function validatePassword(password) {
    return password.length >= 6;
  }

  // Function to validate inputs
  function validateInputs() {
    if (!validateEmail(uname)) {
      setError("Please provide a valid email address.");
      return false;
    } else if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  }

  // Function to handle changes in email input
  function changeName(event) {
    setUname(event.target.value);
  }

  // Function to handle changes in password input
  function changePass(event) {
    setPass(event.target.value);
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <div>
        <label>E-Mail</label>
        <input type="text" value={uname} onChange={changeName}></input>
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={changePass}></input>
      </div>
      {error && <div className="error-message">{error}</div>}
      <button onClick={handleClick}>Login</button>
      <div className="register-link" onClick={() => props.navigateToRegisterPage()}>
        Is New User
      </div>
    </div>
  );
}

export default Login;
