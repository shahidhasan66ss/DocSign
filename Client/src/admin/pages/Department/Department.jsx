import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import TopBar from '../../components/TopBar/TopBar';
import SideNav from '../../components/SideNav/SideNav';
import './Department.css';
import axios from 'axios';

export default function Department() {
  const [departmentName, setDepartmentName] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDepartmentNameChange = (e) => {
    setDepartmentName(e.target.value);
  };

  const handleAddDepartment = async () => {
    try {
      const response = await axios.post('http://localhost:3001/upload', {
        name: departmentName,
      });

      console.log(response.data);

      fetchDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/departments'); // Use the new route
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  

  return (
    <>
      <div className="department-page">
      <TopBar />
      <div className="main-container">
        <SideNav />

        <div className="main-content">

          <div className="department-list">
            <h2>Department List</h2>
            {departments.map((department, index) => (
            <div key={department._id} className="department-card">
              <div className="department-info">
                <span className="number-circle">{index + 1}</span>
                <span className='department-name'>{department.name}</span> 
                <button className="delete-button" onClick={() => handleDeleteDepartment(department._id)}>
                  <FaTrash /> 
                </button>
              </div>
            </div>
          ))}
          </div>

          <div className="create-department">
            <h2>Create New Department</h2>
            <input
              type="text"
              placeholder="Department Name"
              value={departmentName}
              onChange={handleDepartmentNameChange}
            />
            <button onClick={handleAddDepartment}>Add Department</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
