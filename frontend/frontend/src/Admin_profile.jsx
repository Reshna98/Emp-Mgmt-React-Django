import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "./config"; 
import Navbar from "./Navbar"; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useNavigate } from "react-router-dom"; 

function Admin_profile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = Cookies.get("user_id");
  const navigate = useNavigate(); 

  const fetchProfileData = async () => {
    try {
      const token = Cookies.get("access"); 
      const res = await axios.get(`${config.base_url}/get_profile_data/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      if (res.status === 200) {
        setAdminData(res.data);
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);

      if (err.response?.status === 401) {
       
        navigate("/"); 
      }
      setError(err.response?.data?.detail || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div style={{ width: "100vw" , overflowX: "hidden" }}>
      <Navbar />
      <div className="row justify-content-center">
        <div className="col-md-6 ">
          <h2 className="text-center mt-3">Admin Profile</h2>
          {adminData && (
            <div className="border p-3 bg-light text-center">
              <p>First Name: {adminData.first_name}</p>
              <p>Last Name: {adminData.last_name}</p>
              <h4>{adminData.username}</h4>
              <p>Email: {adminData.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin_profile;
