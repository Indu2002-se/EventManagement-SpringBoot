import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, User, Mail, Phone, Shield } from 'lucide-react';
import { userAPI } from '../services/api';
import { getUserRoleColor, getUserRoleText } from '../utils/helpers';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', firstName: '', lastName: '',
    phoneNumber: '', role: 'USER', isActive: true
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userAPI.getAllUsers();
      console.log('Users response:', response);
      const usersData = response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      // Validate required fields
      if (!formData.username || !formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        setError('Please fill in all required fields.');
        return;
      }

      // Prepare user data
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim() || null,
        role: formData.role,
        isActive: formData.isActive
      };

      console.log('Creating user with data:', userData);
      
      const response = await userAPI.registerUser(userData);
      console.log('User created successfully:', response);
      
      setShowCreateModal(false);
      resetForm();
      fetchUsers(); // Refresh the users list
      
      // Show success message
      alert('User created successfully!');
      
    } catch (error) {
      console.error('Error creating user:', error);
      setError(`Failed to create user: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setError('');
        await userAPI.deleteUser(userId);
        fetchUsers();
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        setError(`Failed to delete user: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '', email: '', password: '', firstName: '', lastName: '',
      phoneNumber: '', role: 'USER', isActive: true
    });
    setError('');
  };

  if (loading && users.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Users Management</h1>
        <p className="page-description">Manage all users in the system</p>
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label>Role</label>
            <select className="form-select">
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="ORGANIZER">Organizer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select className="form-select">
              <option value="">All Statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
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
          Users ({users.length})
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px'
                    }}>
                      <User size={20} style={{ color: '#2563eb' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        @{user.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '14px', color: '#111827', marginBottom: '4px' }}>
                    <Mail size={14} style={{ marginRight: '8px', color: '#9ca3af' }} />
                    {user.email}
                  </div>
                  {user.phoneNumber && (
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      <Phone size={14} style={{ marginRight: '8px', color: '#9ca3af' }} />
                      {user.phoneNumber}
                    </div>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${user.role?.toLowerCase()}`} style={{
                    backgroundColor: user.role === 'ADMIN' ? '#dc2626' : 
                                   user.role === 'ORGANIZER' ? '#2563eb' : '#059669'
                  }}>
                    {getUserRoleText(user.role)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'published' : 'draft'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ fontSize: '14px', color: '#6b7280' }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px' }}>
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
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
        
        {users.length === 0 && !loading && (
          <div className="empty-state">
            <User size={48} />
            <h3>No users found</h3>
            <p>Get started by adding a new user.</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateUser}>
              <div className="modal-header">
                <h3 className="modal-title">Add New User</h3>
              </div>
              
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="form-input"
                      placeholder="Enter first name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="form-input"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="form-input"
                    placeholder="Enter username"
                  />
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="form-input"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="form-input"
                    placeholder="Enter password"
                  />
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="form-input"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="form-select"
                    >
                      <option value="USER">User</option>
                      <option value="ORGANIZER">Organizer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      style={{ margin: 0 }}
                    />
                    Active User
                  </label>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add User
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

export default UsersManagement;
