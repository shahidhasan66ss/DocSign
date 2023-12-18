import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar/TopBar';
import SideNav from '../../components/SideNav/SideNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './Pending.css';
import './../../../common.css';
import axios from 'axios';

import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the app element

export default function Pending() {
  const [showPdfOverlay, setShowPdfOverlay] = useState(false);
  const [files, setFiles] = useState([]);
  const [pdfContent, setPdfContent] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (token) {
        const response = await axios.get('http://localhost:3001/files/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setFiles(response.data);
      }
    } catch (error) {
      console.error('Error fetching pending files:', error);
    }
  };
  

  const openPdf = async (url) => {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      setPdfContent(new Uint8Array(response.data));
      setShowPdfOverlay(true);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setPdfError(error);
    }
  };

  const closePdfOverlay = () => {
    setShowPdfOverlay(false);
  };

  const handleApprove = (documentId) => {
    // Show a confirmation dialog
    setConfirmDialog({
      message: 'Are you sure you want to approve this document?',
      onConfirm: async () => {
        try {
          const response = await axios.post(`http://localhost:3001/approve/${documentId}`);
          if (response.status === 200) {
            setFiles((prevFiles) => prevFiles.filter((document) => document._id !== documentId));
            toast.success('Document approved successfully');
          }
        } catch (error) {
          console.error('Error approving document:', error);
          toast.error('Error approving document');
        }
        // Close the confirmation dialog
        setConfirmDialog(null);
      },
    });
  };

  const handleReject = (documentId) => {
    // Show a confirmation dialog
    setConfirmDialog({
      message: 'Are you sure you want to reject this document?',
      onConfirm: async () => {
        try {
          const response = await axios.post(`http://localhost:3001/reject/${documentId}`);
          if (response.status === 200) {
            setFiles((prevFiles) => prevFiles.filter((document) => document._id !== documentId));
            toast.success('Document rejected successfully');
          }
        } catch (error) {
          console.error('Error rejecting document:', error);
          toast.error('Error rejecting document');
        }
        // Close the confirmation dialog
        setConfirmDialog(null);
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="app">
        <TopBar />
        <div className="main-container">
          <SideNav />
          <div className="main-content">
            <h2>Pending List</h2>
            <ol className="pending-list">
              <li className="pending-header">
                <div className="sender">Sender</div>
                <div className="type">Type</div>
                <div className="file-name">File</div>
                <div className="actions">Action</div>
              </li>
              {files
                .filter((document) => document.status === 'Pending')
                .map((document) => (
                  <li key={document._id} className="list-item">
                    <div className="sender">{document.senderName}</div>
                    <div className="type">{document.documentType}</div>
                    <div className="file">{document.name}</div>
                    <div className="actions">
                      <button
                        className="action-button"
                        onClick={() => openPdf(`http://localhost:3001/files/${document._id}`)}
                      >
                        View
                      </button>
                      <button
                        className="action-button"
                        onClick={() => handleApprove(document._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="action-button"
                        onClick={() => handleReject(document._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
            </ol>

            {confirmDialog && (
        <Modal
          isOpen={true}
          contentLabel="Confirmation Dialog"
          onRequestClose={() => setConfirmDialog(null)}
          className="centered-dialog"
        >
          <p>{confirmDialog.message}</p>
          <button onClick={confirmDialog.onConfirm}>Confirm</button>
          <button onClick={() => setConfirmDialog(null)}>Cancel</button>
        </Modal>
      )}
          </div>
        </div>
      </div>

      <ToastContainer />

      {/* PDF Overlay */}
      {showPdfOverlay && (
        <div className="pdf-overlay" onClick={closePdfOverlay}>
          <div className="pdf-dialog" onClick={(e) => e.stopPropagation()}>
            <object
              data={URL.createObjectURL(new Blob([pdfContent], { type: 'application/pdf' }))}
              type="application/pdf"
              width="1000px"
              height="800px"
            >
              PDF Viewer not available in your browser. Download the PDF to view it.
            </object>
          </div>
        </div>
      )}

   
    </>
  );
}
