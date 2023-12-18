import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar/TopBar';
import SideNav from '../../components/SideNav/SideNav';
import './Approved.css';
import axios from 'axios';

export default function Approved() {
  const [approvedFiles, setApprovedFiles] = useState([]);

  useEffect(() => {
    const fetchApprovedFiles = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          // Fetch approved files for the user when the component mounts
          const response = await axios.get('http://localhost:3001/approved-files/user', {
            headers: { Authorization: `Bearer ${token}` },
          });

          setApprovedFiles(response.data);
        }
      } catch (error) {
        console.error('Error fetching approved files:', error);
      }
    };

    fetchApprovedFiles();
  }, []);

  const saveFile = async (file) => {
    const userConfirmed = window.confirm('Do you want to download this file?');
    if (!userConfirmed) {
      return; // Do nothing if the user cancels the confirmation
    }

    try {
      const response = await axios.get(`http://localhost:3001/files/${file._id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();

      // Remove the downloaded file from the list
      setApprovedFiles(prevFiles => prevFiles.filter(approvedFile => approvedFile._id !== file._id));

      // Make a call to your backend to delete the file (optional)
      // await axios.delete(`http://localhost:3001/files/${file._id}`);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  return (
    <>
      <div className="app">
        <TopBar />
        <SideNav />

        <div className="main-container">
          <div className="main-content">
            <h2>Approved list</h2>

            <ol className='approved-list'>
              <li className="list-header">
                <div className="index">Index</div>
                <div className="sender">Sender</div>
                <div className="file-name">File Name</div>
                <div className="actions">Actions</div>
              </li>
              {approvedFiles.map((file, index) => (
                <li key={file._id}>
                  <div className="index">{index + 1}</div>
                  <div className="sender">{file.senderName}</div>
                  <div className="file-name">{file.name}</div>
                  <div className="actions">
                    <button className="action-button" onClick={() => saveFile(file)}>
                      Save
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
