import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; 
import config from "./config";
import Navbar from "./Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';

function Add_employee() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");

  const ID = Cookies.get("user_id"); 
  const navigate = useNavigate(); 

  const validateEmail = (email) => {
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!validateEmail(email)) {
      Swal.fire("Error", "Please enter a valid email address", "error");
      return; 
    }

    const data = {
      user: ID,
      name,
      email,
      position,
    };

    try {
      const token = Cookies.get("access"); 
      const res = await axios.post(`${config.base_url}/add_employee/`, data, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (res.data.status) {
        Swal.fire("Success", res.data.message, "success").then(() => {
        
          navigate("/emp_list");
        });

       
        setName("");
        setEmail("");
        setPosition("");
      }
    } catch (err) {
   
      if (err.response) {
       
        if (err.response.status === 401) {
       
          navigate("/");
        } else {
          Swal.fire("Error", err.response.data.message || "An error occurred", "error");
        }
      } else {
        Swal.fire("Error", "Server error occurred", "error");
      }
    }
  };

  return (
    <div style={{ width: "100vw" , overflowX: "hidden" }}>
      <Navbar />
      <h2 className="text-center mt-3 ">Add Employee</h2>
      <div className="row justify-content-center">
        <div className="col-md-8 ">
          <div className="border p-3 bg-light">
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
              <div className="mb-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Enter employee's name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter employee's email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  className="form-control"
                  id="position"
                  name="position"
                  placeholder="Enter employee's position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success">Add Employee</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Add_employee;
