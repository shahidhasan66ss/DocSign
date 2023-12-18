import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar/TopBar';
import SideNav from '../../components/SideNav/SideNav';
import './Home.css';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [approvers, setApprovers] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [senderName, setSenderName] = useState('');

  useEffect(() => {
    // Fetch only approvers from the database
    const fetchApprovers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Filter users with role === 'approver'
        const approverUsers = response.data.filter(user => user.role === 'approver');
        setApprovers(approverUsers);
      } catch (error) {
        console.error('Error fetching approvers:', error);
      }
    };

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          const response = await axios.get('http://localhost:3001/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Set sender name based on the profile holder's name
          setSenderName(response.data.additionalData?.name || '');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchApprovers();
    fetchUserProfile();
  }, []);

  const handleFileChange = (e) => {
    // Use e.target.files.length > 0 to ensure a file is selected
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      // If no file is selected, you may want to handle this case accordingly
      console.error('No file selected');
    }
  };
  

  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  const handleApproverChange = (e) => {
    setSelectedApprover(e.target.value);
  };

  const handleStartButtonClick = () => {
    setIsFormVisible(true);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderName', senderName);
    formData.append('documentType', documentType);
    formData.append('approver', selectedApprover);
  
    // Log formData to the console for debugging
    console.log(formData);
  
    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);
      // Reset form fields and hide the form after submission
      setFile(null);
      setDocumentType('');
      setSelectedApprover('');
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    
  };
  

  return (
    <>
    <div className="app">
      <TopBar />
      <SideNav />
      <div className="main-container">
        <div className="main-content">
          <div>
            <h2>Document Submission</h2>
            {!isFormVisible ? (
              <button onClick={handleStartButtonClick}>Start Submission</button>
            ) : (
              <>
                <input type="file" onChange={handleFileChange} />
                <input type="text" placeholder="Sender's Name" value={senderName} disabled />
                <input type="text" placeholder="Document Type" value={documentType} onChange={handleDocumentTypeChange} />
                <label>Select Approver:</label>
                <select value={selectedApprover} onChange={handleApproverChange}>
                  <option value="" disabled>Select an Approver</option>
                  {approvers.map((approver) => (
                    <option key={approver.id} value={approver.id}>{`${approver.name} (${approver.id})`}</option>
                  ))}
                </select>
                <button onClick={handleSubmit}>Submit</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
  );
}