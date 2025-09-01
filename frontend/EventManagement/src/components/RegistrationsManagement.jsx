import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Plus,
  RefreshCw,
  FileText
} from 'lucide-react';
import { registrationAPI, eventAPI, userAPI } from '../services/api';

const RegistrationsManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [formData, setFormData] = useState({
    eventId: '',
    userId: '',
    registrationDate: '',
    status: 'PENDING',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsRes, usersRes] = await Promise.all([
        eventAPI.getAllEvents(),
        userAPI.getAllUsers()
      ]);
      
      setEvents(eventsRes.data);
      setUsers(usersRes.data);
      
      // Load all registrations by getting registrations for each event
      const allRegistrations = [];
      for (const event of eventsRes.data) {
        try {
          const registrationsRes = await registrationAPI.getRegistrationsByEvent(event.id);
          allRegistrations.push(...registrationsRes.data.map(reg => ({
            ...reg,
            eventName: event.title,
            userName: usersRes.data.find(u => u.id === reg.userId)?.name || 'Unknown User'
          })));
        } catch (error) {
          console.error(`Error loading registrations for event ${event.id}:`, error);
        }
      }
      setRegistrations(allRegistrations);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.id.toString().includes(searchTerm);
    const matchesEvent = !selectedEvent || registration.eventId.toString() === selectedEvent;
    const matchesStatus = !selectedStatus || registration.status === selectedStatus;
    
    return matchesSearch && matchesEvent && matchesStatus;
  });

  const handleCreateRegistration = async (e) => {
    e.preventDefault();
    try {
      await registrationAPI.registerForEvent(formData.eventId, formData.userId);
      setShowModal(false);
      setFormData({ eventId: '', userId: '', registrationDate: '', status: 'PENDING', notes: '' });
      loadData();
    } catch (error) {
      console.error('Error creating registration:', error);
    }
  };

  const handleUpdateRegistration = async (e) => {
    e.preventDefault();
    try {
      await registrationAPI.updateRegistration(editingRegistration.id, formData);
      setShowModal(false);
      setEditingRegistration(null);
      setFormData({ eventId: '', userId: '', registrationDate: '', status: 'PENDING', notes: '' });
      loadData();
    } catch (error) {
      console.error('Error updating registration:', error);
    }
  };

  const handleDeleteRegistration = async () => {
    try {
      await registrationAPI.deleteRegistration(selectedRegistration.id);
      setShowDeleteModal(false);
      setSelectedRegistration(null);
      loadData();
    } catch (error) {
      console.error('Error deleting registration:', error);
    }
  };

  const handleStatusChange = async (registrationId, newStatus) => {
    try {
      if (newStatus === 'CONFIRMED') {
        await registrationAPI.confirmRegistration(registrationId);
      } else if (newStatus === 'CANCELLED') {
        await registrationAPI.cancelRegistration(registrationId);
      }
      loadData();
    } catch (error) {
      console.error('Error updating registration status:', error);
    }
  };

  const openEditModal = (registration) => {
    setEditingRegistration(registration);
    setFormData({
      eventId: registration.eventId.toString(),
      userId: registration.userId.toString(),
      registrationDate: registration.registrationDate,
      status: registration.status,
      notes: registration.notes || ''
    });
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'pending', icon: Clock },
      CONFIRMED: { color: 'confirmed', icon: CheckCircle },
      CANCELLED: { color: 'cancelled', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;
    
    return (
      <span className={`status-badge ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  const exportRegistrations = () => {
    const csvContent = [
      ['ID', 'Event', 'User', 'Registration Date', 'Status', 'Notes'],
      ...filteredRegistrations.map(reg => [
        reg.id,
        reg.eventName,
        reg.userName,
        reg.registrationDate,
        reg.status,
        reg.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registrations.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="loading">
        <RefreshCw className="spinner" />
        <span>Loading registrations...</span>
      </div>
    );
  }

  return (
    <div className="content-area">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title-large">Registrations Management</h1>
        <p className="page-description">Manage event registrations and attendee information</p>
      </div>

      {/* Filters and Actions */}
      <div className="filters">
        <div className="filters-grid">
          {/* Search */}
          <div className="filter-group">
            <label>Search Registrations</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} />
              <input
                type="text"
                placeholder="Search by user, event, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input pl-10"
              />
            </div>
          </div>

          {/* Event Filter */}
          <div className="filter-group">
            <label>Event</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="form-select"
            >
              <option value="">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label>Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <button
              onClick={exportRegistrations}
              className="btn btn-secondary"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => {
                setEditingRegistration(null);
                setFormData({ eventId: '', userId: '', registrationDate: '', status: 'PENDING', notes: '' });
                setShowModal(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} />
              Add Registration
            </button>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th>Registration ID</th>
                <th>Event</th>
                <th>Attendee</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id}>
                  <td>#{registration.id}</td>
                  <td>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      {registration.eventName}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <User size={16} className="mr-2" />
                      {registration.userName}
                    </div>
                  </td>
                  <td>{new Date(registration.registrationDate).toLocaleDateString()}</td>
                  <td>{getStatusBadge(registration.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => setSelectedRegistration(registration)}
                        className="btn-icon edit"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(registration)}
                        className="btn-icon edit"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRegistration(registration);
                          setShowDeleteModal(true);
                        }}
                        className="btn-icon delete"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRegistrations.length === 0 && (
          <div className="empty-state">
            <FileText className="empty-state-icon" />
            <h3>No registrations found</h3>
            <p>
              {searchTerm || selectedEvent || selectedStatus 
                ? 'Try adjusting your search or filters.' 
                : 'Get started by creating a new registration.'}
            </p>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingRegistration ? 'Edit Registration' : 'Add New Registration'}
              </h3>
            </div>
            <div className="modal-body">
              <form onSubmit={editingRegistration ? handleUpdateRegistration : handleCreateRegistration}>
                <div className="form-group">
                  <label>Event</label>
                  <select
                    value={formData.eventId}
                    onChange={(e) => setFormData({...formData, eventId: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">Select Event</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>User</label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Registration Date</label>
                  <input
                    type="datetime-local"
                    value={formData.registrationDate}
                    onChange={(e) => setFormData({...formData, registrationDate: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="form-input"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="form-textarea"
                    placeholder="Optional notes about this registration..."
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingRegistration ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRegistration && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Delete Registration</h3>
            </div>
            <div className="modal-body">
              <div className="text-center">
                <Trash2 className="mx-auto h-12 w-12 text-red-600 mb-4" />
                <p>
                  Are you sure you want to delete registration #{selectedRegistration.id}? 
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRegistration}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsManagement;
