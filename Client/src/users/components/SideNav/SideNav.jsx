import React from 'react';
import { FcDocument, FcApprove, FcDisapprove } from 'react-icons/fc';
import { CgProfile } from 'react-icons/cg';
import { useNavigate, useLocation } from 'react-router-dom';

import './SideNav.css'; // Import your CSS file

function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="side-nav">
      <a
        onClick={() => navigate('/user/new')}
        className={`menu-item ${location.pathname === '/user/new' ? 'active' : ''}`}
      >
        <i><FcDocument /></i>
        New
      </a>
      <a
        onClick={() => navigate('/user/approved')}
        className={`menu-item ${location.pathname === '/user/approved' ? 'active' : ''}`}
      >
        <i><FcApprove /></i>
        Approved
      </a>
      <a
        onClick={() => navigate('/user/rejected')}
        className={`menu-item ${location.pathname === '/user/rejected' ? 'active' : ''}`}
      >
        <i><FcDisapprove /></i>
        Rejected
      </a>
      <a
        onClick={() => navigate('/user/profile')}
        className={`menu-item ${location.pathname === '/user/profile' ? 'active' : ''}`}
      >
        <i><CgProfile /></i>
        Profile
      </a>
    </div>
  );
}

export default SideNav;
