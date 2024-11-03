import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "./config";
import Navbar from "./Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Employee_List() {
  const ID = Cookies.get("user_id");
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [customFieldName, setCustomFieldName] = useState(""); 
  const [customFieldType, setCustomFieldType] = useState("text");
  const [customFieldValue, setCustomFieldValue] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null); 
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    const token = Cookies.get("access"); 
  
    
    if (!token) {
      console.error("No access token found");
      Swal.fire("Error", "No access token found. Please log in again.", "error");
      navigate("/"); 
      return;
    }
  
    try {
      const res = await axios.get(`${config.base_url}/fetch_employees/${ID}/`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      if (res.data.status) {
        setEmployees(res.data.employees);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {

        Swal.fire("Error", "Session expired. Please log in again.", "error");
        navigate("/"); 
      } else {
        Swal.fire("Error", "Failed to fetch employees", "error");
      }
    }
  };
  

  const handleModalClose = () => {
    setCustomFieldName("");
    setCustomFieldType("text");
    setCustomFieldValue("");
  };

  const handleAddCustomField = async () => {
    if (!selectedEmployee || !customFieldName || !customFieldValue) return;

    const existingField = selectedEmployee.custom_fields && 
      Object.keys(selectedEmployee.custom_fields).includes(customFieldName);

    if (existingField) {
      Swal.fire("Error", "Field name already exists!", "error");
      return;
    }

    const data = {
      employeeId: selectedEmployee.id,
      fieldName: customFieldName,
      fieldType: customFieldType,
      fieldValue: customFieldValue,
    };

    try {
      const res = await axios.post(`${config.base_url}/add_custom_field/`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access")}`, 
        },
      });
      if (res.data.status) {
        Swal.fire("Success", "Custom field added successfully!", "success");
        fetchEmployees();
        handleModalClose();
        setShowModal(false);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        Swal.fire("Error", "Session expired. Please log in again.", "error");
        navigate("/"); 
      } else {
        Swal.fire("Error", "Failed to fetch employees", "error");
      }
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        const res = await axios.delete(`${config.base_url}/delete_employee/${employeeId}/`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("access")}`,
          },
        });
        if (res.status === 204) {
          setEmployees(prevEmployees => 
            prevEmployees.filter(employee => employee.id !== employeeId)
          );
          Swal.fire("Deleted!", "Employee deleted successfully!", "success");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          Swal.fire("Error", "Session expired. Please log in again.", "error");
          navigate("/"); 
        } else {
          Swal.fire("Error", "Failed to fetch employees", "error");
        }
      }
      }
    };

  const handleUpdateEmployee = (employee) => {
    navigate(`/update_employee/${employee.id}`);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div style={{ width: "100vw" , overflowX: "hidden" }}>
      <Navbar />
      <h2 className="text-center mt-3">Employee List</h2>
      
      <div className="row p-2">
        {employees.map((employee, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4 mb-3">
            <div className="border p-3 bg-light">
              <h4>{employee.name}</h4>
              <p>Email: {employee.email}</p>
              <p>Position: {employee.position}</p>
             
              {employee.custom_fields && Object.entries(employee.custom_fields).map(([name, { value }], idx) => (
                <p key={idx}><strong>{name}</strong>: {value}</p>
              ))}

              <button
                className="btn btn-success ms-2"
                onClick={() => {
                  setSelectedEmployee(employee);
                  setShowModal(true);
                }}
              >
                Add Custom Field
              </button>

              <button
                className="btn btn-primary ml-2 ms-2"
                onClick={() => handleUpdateEmployee(employee)}
              >
                Update
              </button>

              <button
                className="btn btn-danger ml-2 ms-2"
                onClick={() => handleDeleteEmployee(employee.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Custom Field</h5>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="customFieldName">Field Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="customFieldName"
                    placeholder="Enter custom field name"
                    value={customFieldName}
                    onChange={(e) => setCustomFieldName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="customFieldType">Select Field Type</label>
                  <select
                    className="form-control"
                    id="customFieldType"
                    value={customFieldType}
                    onChange={(e) => setCustomFieldType(e.target.value)}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="date">Date</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="customFieldValue">Custom Field Value</label>
                  <input
                    type={customFieldType} 
                    className="form-control"
                    id="customFieldValue"
                    placeholder="Enter custom field value"
                    value={customFieldValue}
                    onChange={(e) => setCustomFieldValue(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleAddCustomField}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employee_List;
