import React, { useState } from 'react';
import { BsArrowRightCircleFill } from 'react-icons/bs';
import TopBar from '../../components/TopBar/TopBar';
import SideNav from '../../components/SideNav/SideNav';

export default function Workflow() {
  // State for selected department, category, and approvers
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedApprovers, setSelectedApprovers] = useState([]);
  const [workflows, setWorkflows] = useState([]);

  // Mock data for departments, categories, and approvers (replace with actual data)
  const departments = ['Department A', 'Department B', 'Department C'];
  const categories = ['Category X', 'Category Y', 'Category Z'];
  const approvers = ['Approver 1', 'Approver 2', 'Approver 3'];

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct the workflow based on selected data
    const workflow = {
      department: selectedDepartment,
      category: selectedCategory,
      approvers: selectedApprovers,
    };

    // Add the workflow to the list of workflows
    setWorkflows([...workflows, workflow]);

    // Reset form fields for the next workflow
    setSelectedDepartment('');
    setSelectedCategory('');
    setSelectedApprovers([]);
  };

  return (
    <>
      <div className="app">
        <TopBar />
        <div className="main-container">
          <SideNav />
          <div className="main-content">
            <h1>Workflow</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="department">Select Department:</label>
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="category">Select Category:</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="approvers">Select Approvers:</label>
                <select
                  id="approvers"
                  multiple
                  value={selectedApprovers}
                  onChange={(e) =>
                    setSelectedApprovers(Array.from(e.target.selectedOptions, (option) => option.value))
                  }
                >
                  {approvers.map((approver) => (
                    <option key={approver} value={approver}>
                      {approver}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">Submit</button>
            </form>
            {workflows.length > 0 && (
              <div>
                <p>Selected Workflows:</p>
                <ul>
                  {workflows.map((workflow, index) => (
                    <li key={index}>
                      Workflow {index + 1}: {workflow.department} → {workflow.category} → {workflow.approvers.join(' → ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
