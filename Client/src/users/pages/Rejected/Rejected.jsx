import React, { useState } from 'react';
import TopBar from '../../components/TopBar/TopBar';
import SideNav from '../../components/SideNav/SideNav';
import './Rejected.css';

export default function Rejected() {
  
  return (
    <>
      <div className="app"> 
        <TopBar />
        <div className="main-container">
          <SideNav />
          <div className="main-content">

            <h1>Rejected</h1>

          </div>
        </div>
      </div>
    </>
  );
}
