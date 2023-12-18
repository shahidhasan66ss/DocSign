import { FcDepartment } from 'react-icons/fc';
import { AiTwotoneHome } from 'react-icons/ai';
import { BsFillPeopleFill } from 'react-icons/bs';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { LuWorkflow } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import './SideNav.css';

function SideNav() {
  const navigate = useNavigate();

  return (
    <div className="side-nav">
      <a onClick={() => navigate("/admin/home")
    }  className={`menu-item ${location.pathname === '/admin/home' ? 'active' : ''}`}>
        <i><AiTwotoneHome/></i>
        Home
      </a>

      <a onClick={() => navigate("/admin/department")}
       className={`menu-item ${location.pathname === '/admin/department' ? 'active' : ''}`}>
        <i><FcDepartment/></i>
        Department
      </a>

      <a onClick={() => navigate("/admin/categories")}
      className={`menu-item ${location.pathname == '/admin/categories' ? 'active': ''}`}>
        <i><BiSolidCategoryAlt/></i> 
        Categories
      </a>

      <a onClick={() => navigate("/admin/approvers")}
      className={`menu-item ${location.pathname == '/admin/approvers' ? 'active': ''}`}>
        <i><BsFillPeopleFill/></i> 
        Approvers
      </a>

      <a onClick={() => navigate("/admin/workflow")}
      className={`menu-item ${location.pathname == '/admin/workflow' ? 'active': ''}`}>
        <i><LuWorkflow/></i> 
        Workflow
      </a>
    </div>
  );
}

export default SideNav;
