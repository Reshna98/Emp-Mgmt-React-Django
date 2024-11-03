import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import config from "./config";
import Navbar from "./Navbar";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from 'sweetalert2';

function Update_employee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [customFields, setCustomFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");
  const [newFieldValue, setNewFieldValue] = useState("");
  const navigate = useNavigate();
  const accessToken = Cookies.get("access");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`${config.base_url}/fetch_employee/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.data.status) {
          setEmployee(res.data.employee);

          const fieldsArray = Object.entries(res.data.employee.custom_fields || {}).map(([key, value]) => ({
            name: key,
            type: value.type || 'text',
            value: value.value || '',
          }));
          setCustomFields(fieldsArray);
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
    
    fetchEmployee();
  }, [id, accessToken]);

  const handleUpdateEmployee = async () => {
    try {
      const res = await axios.put(
        `${config.base_url}/update_employee/${id}/`,
        {
          ...employee,
          custom_fields: Object.fromEntries(customFields.map(field => [field.name, { type: field.type, value: field.value }])),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Employee updated successfully!',
        });
        navigate("/emp_list");
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
    

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleCustomFieldChange = (index, e) => {
    const newFields = [...customFields];
    newFields[index].value = e.target.value;
    setCustomFields(newFields);
  };

  const handleRemoveCustomField = (index) => {
    const newFields = customFields.filter((_, idx) => idx !== index);
    setCustomFields(newFields);
  };

  const handleAddCustomField = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewFieldName("");
    setNewFieldType("text");
    setNewFieldValue("");
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (customFields.some(field => field.name === newFieldName)) {
      Swal.fire({
        icon: 'warning',
        title: 'Field Exists',
        text: 'Field name already exists. Please choose a different name.',
      });
      return;
    }

    const newField = { name: newFieldName, type: newFieldType, value: newFieldValue };
    setCustomFields([...customFields, newField]);
    handleModalClose();
  };

  if (!employee) return <p>Loading...</p>;

  return (
    <div style={{ width: "100vw" , overflowX: "hidden" }}>
      <Navbar />
      <h2 className="text-center mt-3">Update Employee</h2>
      <div className="row justify-content-center">
        <div className="col-md-8 ">
          <div className="border p-3 bg-light">
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={employee.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={employee.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                className="form-control"
                id="position"
                name="position"
                value={employee.position}
                onChange={handleChange}
              />
            </div>

            {customFields.map((field, index) => (
              <div key={index} className="mb-3 d-flex align-items-center">
                <div className="flex-grow-1">
                  <label htmlFor={`customField${index}`}>{field.name || "Custom Field"}</label>
                  <input
                    type={field.type}  
                    className="form-control"
                    id={`customField${index}`}
                    value={field.value}
                    onChange={(e) => handleCustomFieldChange(index, e)}
                  />
                </div>
                <button type="button" className="btn btn-danger ms-2 mt-4" onClick={() => handleRemoveCustomField(index)}>
                  <FaTrash /> 
                </button>
              </div>
            ))}
            <div className="p-4">
              <button type="button" className="btn btn-success" onClick={handleAddCustomField}>
                <FaPlus /> Add Custom Field
              </button>
              <button className="btn btn-primary ms-3" onClick={handleUpdateEmployee}>
                Update Employee
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Custom Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleModalSubmit}>
            <Form.Group className="mb-3" controlId="customFieldName">
              <Form.Label>Field Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter custom field name"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="customFieldType">
              <Form.Label>Field Type</Form.Label>
              <Form.Select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                required
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="date">Date</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="customFieldValue">
              <Form.Label>Field Value</Form.Label>
              <Form.Control
                type={newFieldType}
                placeholder="Enter custom field value"
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Field
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Update_employee;
