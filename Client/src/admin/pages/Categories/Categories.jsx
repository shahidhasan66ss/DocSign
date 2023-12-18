import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar/TopBar';
import SideNav from '../../components/SideNav/SideNav';
import axios from 'axios';
import './Categories.css'

export default function Categories() {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post('http://localhost:3001/categories', {
        name: categoryName,
      });

      console.log(response.data);
      setCategoryName(''); 
      fetchCategories(); 
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <div className="app">
        <TopBar />
        <div className="main-container">
          <SideNav />
          <div className="main-content">
            <div className="categories-list">
              <h2>Categories List</h2> 
              <div class="category-card-container">
              {categories.map((category) => ( 
                <div key={category._id} className="category-card">
                  {category.name}
              </div>
              ))}
              </div>
            </div>
            <div className="add-category">
              <h2>Add New Category</h2>
              <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={handleCategoryNameChange}
              />
              <button className='add-cate-btn' onClick={handleAddCategory}>Add Category</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
