import React, { useState, useEffect } from 'react';
import { CgProfile } from 'react-icons/cg';
import TopBar from '../../components/TopBar/TopBar';
import SideNav from '../../components/SideNav/SideNav';
import axios from 'axios';
import './Approvers.css';

export default function Approvers() {
  const defaultAvatarIcon = <CgProfile size={64} />;
  const [approversData, setApproversData] = useState([]);
  const [newApprover, setNewApprover] = useState({
    name: '',
    department: '',
    designation: '',
    username: '',
    password: '',
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/approvers');
      setApproversData(response.data);
    } catch (error) {
      console.error('Error fetching approvers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === "file" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const profilePic = e.target.result;
        setNewApprover({
          ...newApprover,
          profilePic,
        });
      };
  
      reader.readAsDataURL(file);
    } else {
      setNewApprover({
        ...newApprover,
        [name]: value,
      });
    }
  };
  

  const handleCreateApprover = async () => {
    try {
      const response = await axios.post('http://localhost:3001/approvers', newApprover);
      console.log(response.data);
      setNewApprover({
        name: '',
        department: '',
        designation: '',
        username: '',
        password: '',
      });
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      console.error('Error adding approver:', error);
    }
  };

  return (
    <div className="app">
      <TopBar />
      <SideNav />
      <div className="main-container">
        <div className="main-content">
          <div className="approvers-container">
            {approversData.map((approver) => (
              <div key={approver.id} className="approver-card">
                <div className="profile-pic-area">
                {approver.profilePic ? (
                  <img
                    src={approver.profilePic}
                    alt={`${approver.name}'s profile`}
                    className="profile-pic"
                  />
                ) : (
                  <div className="profile-pic">{defaultAvatarIcon}</div>
                )}
                </div>
                <div className="details">
                  <h2>{approver.name}</h2>
                  <p>{approver.department}</p>
                  <p>{approver.designation}</p>
                  <p>{approver.username}</p>
                  <p>{approver.password}</p>
                </div>
              </div>
            ))}
          </div>


          <button
            className="create-approver-button"
            onClick={() => setShowCreateForm(true)}
          >
            Create New Approver
          </button>
          {showCreateForm && (
            <div className="create-approver-form-overlay">
              <div className="create-approver-form">
                <h2>Create New Approver</h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newApprover.name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={newApprover.department}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="designation"
                  placeholder="Designation"
                  value={newApprover.designation}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={newApprover.username}
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={newApprover.password}
                  onChange={handleInputChange}
                />
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                <button onClick={handleCreateApprover}>Create Approver</button>
                <button onClick={() => setShowCreateForm(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
