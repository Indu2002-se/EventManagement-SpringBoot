import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { eventAPI, categoryAPI } from '../services/api';
import { formatDateTime, formatCurrency, getEventStatusColor, getEventStatusText } from '../utils/helpers';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', startDate: '', endDate: '', location: '',
    maxCapacity: '', ticketPrice: '', categoryId: '', imageUrl: '', tags: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await eventAPI.getAllEvents(0, 50);
      console.log('Events response:', response);
      // Handle both paginated and non-paginated responses
      const eventsData = response.data?.content || response.data || [];
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setError('');
      const response = await categoryAPI.getAllCategories();
      console.log('Categories response:', response);
      const categoriesData = response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please check your backend connection.');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      // Validate required fields
      if (!formData.title || !formData.startDate || !formData.endDate || !formData.location) {
        setError('Please fill in all required fields.');
        return;
      }

      // Prepare event data
      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        maxCapacity: parseInt(formData.maxCapacity) || 100,
        ticketPrice: parseFloat(formData.ticketPrice) || 0.0,
        categoryId: formData.categoryId || null,
        imageUrl: formData.imageUrl || '',
        tags: formData.tags || ''
      };

      console.log('Creating event with data:', eventData);
      
      // Create event (using admin user ID 1 for now)
      const response = await eventAPI.createEvent(eventData, 1);
      console.log('Event created successfully:', response);
      
      setShowCreateModal(false);
      resetForm();
      fetchEvents(); // Refresh the events list
      
      // Show success message
      alert('Event created successfully!');
      
    } catch (error) {
      console.error('Error creating event:', error);
      setError(`Failed to create event: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setError('');
        await eventAPI.deleteEvent(eventId, 1);
        fetchEvents();
        alert('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        setError(`Failed to delete event: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', startDate: '', endDate: '', location: '',
      maxCapacity: '', ticketPrice: '', categoryId: '', imageUrl: '', tags: ''
    });
    setError('');
  };

  if (loading && events.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Events Management</h1>
        <p className="page-description">Manage all your events</p>
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
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label>Category</label>
            <select className="form-select">
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select className="form-select">
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
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
          Events ({events.length})
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Create Event
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th>Event</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: '#dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px'
                    }}>
                      <Calendar size={20} style={{ color: '#2563eb' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                        {event.title}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {event.categoryName || 'No Category'}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '14px', color: '#111827' }}>
                    {formatDateTime(event.startDate)}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#111827' }}>
                    <MapPin size={16} style={{ marginRight: '8px', color: '#9ca3af' }} />
                    {event.location}
                  </div>
                </td>
                <td style={{ fontSize: '14px', color: '#111827' }}>
                  {event.currentRegistrations || 0}/{event.maxCapacity}
                </td>
                <td style={{ fontSize: '14px', color: '#111827' }}>
                  {formatCurrency(event.ticketPrice)}
                </td>
                <td>
                  <span className={`status-badge ${event.status?.toLowerCase() || 'draft'}`}>
                    {getEventStatusText(event.status)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px' }}>
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
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
        
        {events.length === 0 && !loading && (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No events found</h3>
            <p>Get started by creating a new event.</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateEvent}>
              <div className="modal-header">
                <h3 className="modal-title">Create New Event</h3>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="form-input"
                    placeholder="Enter event title"
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="form-input"
                    placeholder="Describe your event"
                  />
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>End Date *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="form-input"
                    placeholder="Enter event location"
                  />
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Max Capacity</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({...formData, maxCapacity: e.target.value})}
                      className="form-input"
                      placeholder="100"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Ticket Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.ticketPrice}
                      onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select a category (optional)</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="form-group">
                  <label>Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="form-input"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Event
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

export default EventsManagement;
