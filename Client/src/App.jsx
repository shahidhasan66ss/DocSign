// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminPortal from './admin/adminPortal';
import ApproverPortal from './approvers/approversPortal';
import UserPortal from './users/userPortal';
import Login from './commonComponents/Forms/Login/Login';
import Register from './commonComponents/Forms/Registration/Registration';


const App = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user role or set it based on your authentication logic
    // For demonstration purposes, assuming userRole is fetched from a context or local storage
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {userRole === 'admin' && <Route path="/admin/*" element={<AdminPortal />} />}
        {userRole === 'user' && <Route path="/user/*" element={<UserPortal />} />}
        {userRole === 'approver' && <Route path="/approver/*" element={<ApproverPortal />} />}
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;


        {/* <Route path="/admin/*" element={<AdminPortal />} />
        <Route path="/approver/*" element={<ApproverPortal />} />
        <Route path="/user/*" element={<UserPortal />} /> */}