// AdminPortal.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Approved from './pages/Approved/Approved';
import Rejected from './pages/Rejected/Rejected';
import TextEditor from './pages/Editor/Editor';


function userPortal() {

  return (
    <div>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/approved" element={<Approved />} />
        <Route path="/rejected" element={<Rejected />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editor" element={<TextEditor />} />
      </Routes>
    </div>


  );
}

export default userPortal;
