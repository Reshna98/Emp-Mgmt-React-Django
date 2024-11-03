import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import config from "./config";
import { useNavigate } from "react-router-dom";
import './Signin.css';
import { Link } from 'react-router-dom';

function Adminlogin() {
  const [logUsername, setLogUsername] = useState("");
  const [logPassword, setLogPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = {
      username: logUsername,
      password: logPassword,
    };

    axios
      .post(`${config.base_url}/login/`, loginData)
      .then((res) => {
        if (res.data.status) {
          Cookies.set("user_id", res.data.user);
          Cookies.set("access", res.data.access);
          Cookies.set("refresh", res.data.refresh);
          console.log("Access Token:", Cookies.get("access"));
          console.log("Refresh Token:", Cookies.get("refresh"));


          navigate("/home");
        } else {

          Swal.fire({
            icon: "error",
            title: res.data.message,
          });
        }
      })
      .catch((err) => {

        Swal.fire({
          icon: "error",
          title: err.response?.data?.message || "Server error occurred",
        });
      });
  };

  return (
    <div className="container_div">
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleLogin} className="sign-in-form">
            <h2 className="titleh2" style={{ fontWeight: "bolder" }}>
              Sign in
            </h2>
            <div className="input-field">
              <i className="fa fa-user"></i>
              <input
                type="text"
                placeholder="Username"
                value={logUsername}
                onChange={(e) => setLogUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <i className="fa fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={logPassword}
                onChange={(e) => setLogPassword(e.target.value)}
                required
              />
            </div>
            <input type="submit" value="Login" className="bttn solid" />
            <Link to={"register/"}>
            <h6
              className="text-dark p-1"
             
            >Register</h6>
          </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Adminlogin;
