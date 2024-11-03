
import React, { useState } from "react";
import config from "./config";
import "./Signin.css";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function AdminReg() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  function validate() {
    if (password.length < 8 || password.length > 18) {
      Swal.fire("Error", "Password length must be between 8 and 18 characters", "error");
      return false;
    }
    if (password !== confirmPassword) {
      Swal.fire("Error", "Password and confirm password do not match", "error");
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validate();
    if (valid) {
      const data = {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
      };
      try {
        const res = await axios.post(`${config.base_url}/Admin_reg/`, data, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.data.status) {
          Cookies.set("user_id", res.data.data.user); 
          Swal.fire("Success", "Admin registration successful!", "success");
          navigate("/"); 
        }
      } catch (err) {
        if (err.response && !err.response.data.status) {
          Swal.fire("Error", err.response.data.message, "error");
        } else {
          Swal.fire("Error", "Server error occurred", "error");
        }
      }
    }
  };

  return (
    <div className="container_div">
      <div className="forms-container">
        <div className="signin-signup">
          <form action="#" className="sign-up-form" onSubmit={handleSubmit}>
            <h2 className="titleh2">Admin Registration</h2>

            <div className="input-field">
              <i className="fa fa-user"></i>
              <input
                type="text"
                placeholder="First Name"
                name="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <i className="fa fa-user"></i>
              <input
                type="text"
                placeholder="Last Name"
                name="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <i className="fa fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                name="email"
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <i className="fa fa-user"></i>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <i className="fa fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 characters"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <i className="fa fa-lock"></i>
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <input type="submit" className="bttn" value="Register Admin" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminReg;
