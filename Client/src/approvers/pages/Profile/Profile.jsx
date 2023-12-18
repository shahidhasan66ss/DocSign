import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import TopBar from '../../components/TopBar/TopBar';
import SideNav from '../../components/SideNav/SideNav';
import { FaCamera } from 'react-icons/fa6';
import './Profile.css';
import defaultPic from '../../../images/profile.png';

const Profile = () => {
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    username: '',
    role: '',
    additionalData: { name: '', email: '', profilePic: '' },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          const response = await axios.get('http://localhost:3001/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData({
      username: userData.username || '',
      role: userData.role || '',
      additionalData: {
        name: userData.additionalData?.name || '',
        email: userData.additionalData?.email || '',
        profilePic: userData.additionalData?.profilePic || defaultPic,
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdditionalDataChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      additionalData: {
        ...prevData.additionalData,
        [name]: value,
      },
    }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');

      if (token) {
        await axios.put('http://localhost:3001/profile', editedData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const response = await axios.get('http://localhost:3001/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleCameraIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result;
        setEditedData((prevData) => ({
          ...prevData,
          additionalData: {
            ...prevData.additionalData,
            profilePic: imageBase64,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="app">
        <TopBar />
        <SideNav />
        <div className="main-container">
          <div className="main-content profile-container">
            <div className="profile-cards">
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-pic">
                    <img
                      className="profile-pic__image"
                      src={editedData.additionalData?.profilePic || defaultPic}
                      width="150"
                      height="150"
                      alt="Profile"
                    />
                    <div
                      className="profile-pic__content"
                      onClick={handleCameraIconClick}
                    >
                      <span className="profile-pic__icon">
                        <i className="fas fa-camera"></i>
                      </span>
                      <span className="profile-pic__button">
                        <FaCamera />
                      </span>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="profile-section contact-info">
                  <div className="profile-info">
                    {userData && (
                      <div>
                        <p>Username: {userData.username}</p>
                        <p>Role: {userData.role}</p>
                        {isEditing ? (
                          <div>
                            <label>Username:</label>
                            <input
                              type="text"
                              name="username"
                              value={editedData.username}
                              onChange={handleInputChange}
                            />
                            <label>Role:</label>
                            <input
                              type="text"
                              name="role"
                              value={editedData.role}
                              onChange={handleInputChange}
                            />
                            <label>Name:</label>
                            <input
                              type="text"
                              name="name"
                              value={editedData.additionalData.name}
                              onChange={handleAdditionalDataChange}
                            />
                            <label>Email:</label>
                            <input
                              type="text"
                              name="email"
                              value={editedData.additionalData.email}
                              onChange={handleAdditionalDataChange}
                            />
                            <button onClick={handleSaveEdit}>Save</button>
                            <button onClick={handleCancelEdit}>Cancel</button>
                          </div>
                        ) : (
                          <div>
                            <p>Name: {userData.additionalData?.name}</p>
                            <p>Email: {userData.additionalData?.email}</p>
                            <button onClick={handleEditClick}>
                              Edit Profile
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-card-right">
              <div className="profile-section approval-workflow">
                <h3>Approval Workflow</h3>
                <p>Documents Pending Approval: 5</p>
                <p>Documents Approved: 20</p>
                <p>Documents Rejected: 3</p>
              </div>

            <div className="profile-section approval-history">
              <h3>Approval History</h3>
              <ul>
                <li>Document 1 - Approved on MM/DD/YYYY</li>
                <li>Document 2 - Rejected on MM/DD/YYYY</li>
                {/* Add more history entries as needed */}
              </ul>
            </div>
            </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
