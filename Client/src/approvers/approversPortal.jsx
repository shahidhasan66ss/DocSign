// AdminPortal.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Approved from './pages/Approved/Approved';
import Pending from './pages/Pending/Pending';
import Profile from './pages/Profile/Profile';




function AdminPortal() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Pending />} />
        <Route path="/approved" element={<Approved />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Additional content for the main AdminPortal component */}
    </div>
  );
}

export default AdminPortal;
