// AdminPortal.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/Home';
import Approvers from './pages/Approvers/Approvers';
import Categories from './pages/Categories/Categories';
import Workflow from './pages/Workflow/Workflow';
import Department from './pages/Department/Department';



function AdminPortal() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/department" element={<Department />} />
        <Route path="/approvers" element={<Approvers />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/workflow" element={<Workflow />} />
      </Routes>

    </div>
  );
}

export default AdminPortal;
