import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Tag, Palette } from 'lucide-react';
import { categoryAPI } from '../services/api';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', icon: '', color: '#3b82f6'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await categoryAPI.getAllCategories();
      console.log('Categories response:', response);
      const categoriesData = response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      // Validate required fields
      if (!formData.name) {
        setError('Category name is required.');
        return;
      }

      // Prepare category data
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        icon: formData.icon.trim() || null,
        color: formData.color || '#3b82f6'
      };

      console.log('Creating category with data:', categoryData);
      
      const response = await categoryAPI.createCategory(categoryData);
      console.log('Category created successfully:', response);
      
      setShowCreateModal(false);
      resetForm();
      fetchCategories(); // Refresh the categories list
      
      // Show success message
      alert('Category created successfully!');
      
    } catch (error) {
      console.error('Error creating category:', error);
      setError(`Failed to create category: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        setError('');
        await categoryAPI.deleteCategory(categoryId);
        fetchCategories();
        alert('Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        setError(`Failed to delete category: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', icon: '', color: '#3b82f6'
    });
    setError('');
  };

  if (loading && categories.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Categories Management</h1>
        <p className="page-description">Manage event categories and their properties</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <div className="filters">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Search</label>
            <div style={{ position: 'relative' }}>
              <Search style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#9ca3af',
                width: '16px',
                height: '16px'
              }} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label>&nbsp;</label>
            <button
              onClick={() => setSearchTerm('')}
              className="filter-button"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>
          Categories ({categories.length})
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Icon</th>
              <th>Color</th>
              <th>Events Count</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: category.color || '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px'
                    }}>
                      <Tag size={20} style={{ color: 'white' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                        {category.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: '14px', color: '#6b7280' }}>
                  {category.description || 'No description'}
                </td>
                <td>
                  <div style={{ fontSize: '24px' }}>
                    {category.icon || '🏷️'}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      backgroundColor: category.color || '#3b82f6'
                    }}></div>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {category.color || '#3b82f6'}
                    </span>
                  </div>
                </td>
                <td style={{ fontSize: '14px', color: '#111827' }}>
                  {category.events?.length || 0} events
                </td>
                <td style={{ fontSize: '14px', color: '#6b7280' }}>
                  {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px' }}>
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="btn btn-danger"
                      style={{ padding: '4px 8px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {categories.length === 0 && !loading && (
          <div className="empty-state">
            <Tag size={48} />
            <h3>No categories found</h3>
            <p>Get started by adding a new category.</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateCategory}>
              <div className="modal-header">
                <h3 className="modal-title">Add New Category</h3>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="form-input"
                    placeholder="e.g., Technology, Business, Education"
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="form-input"
                    placeholder="Describe what this category represents"
                  />
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Icon</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      className="form-input"
                      placeholder="e.g., 💻, 🏢, 📚"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        style={{ width: '50px', height: '40px', border: 'none', borderRadius: '6px' }}
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="form-input"
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Category
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
