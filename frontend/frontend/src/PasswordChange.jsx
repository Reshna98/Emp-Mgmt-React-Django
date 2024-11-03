import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "./config";
import Navbar from "./Navbar";
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const accessToken = Cookies.get("access");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Passwords do not match',
        text: 'Please ensure that the new password and confirm password are the same.',
      });
      return;
    }

    try {
      const res = await axios.put(
        `${config.base_url}/change_password/`,
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Password changed successfully!',
        });

       
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);  
      if (err.response) {
        if (err.response.status === 401) {
          Swal.fire("Session expired", "Please log in again", "warning");
          navigate("/");  
        } else {
          Swal.fire("Error", err.response.data.detail || "Failed to change password", "error");
        }
      } else {
        Swal.fire("Error", "Network error. Please try again later.", "error");
      }
    }
  };

  return (
    <div style={{ width: "100vw" , overflowX: "hidden" }}>
      <Navbar />
      <h2 className="text-center mt-3">Change Password</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="border p-3 bg-light">
            <div className="mb-3">
              <label htmlFor="currentPassword">Current Password</label>
              <div className="input-group">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="form-control"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <span className="input-group-text" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-group">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span className="input-group-text" onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span className="input-group-text" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordChange;
