import React from 'react'
import TopBar from '../../components/TopBar/TopBar'
import SideNav from '../../components/SideNav/SideNav'
import './Home.css'

export default function Home() {
  return (
    <>
     <div className="app">
      <TopBar />
      <SideNav />
      
      <div className="main-container">
        
        <div className="main-content">
          <h1>Hello</h1>
        </div>
      </div>
    </div>
    </>
    
  )
}
