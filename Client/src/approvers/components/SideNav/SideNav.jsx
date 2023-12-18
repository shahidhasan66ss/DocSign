import { FcDepartment } from 'react-icons/fc';
import { AiTwotoneHome } from 'react-icons/ai';
import { RiAccountPinCircleFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import './SideNav.css';

function SideNav() {
  const navigate = useNavigate();

  return (
    <div className="side-nav">
      <a onClick={() => navigate("/approver")} >
        <i><AiTwotoneHome/></i>
        Pending
      </a>
      <a onClick={() => navigate("/approver/approved")}>
        <i><FcDepartment/></i>
        Approved
      </a>

      <a onClick={() => navigate("/approver/profile")}>
        <i><RiAccountPinCircleFill/></i>
        Profile
      </a>
  
    </div>
  );
}

export default SideNav;
