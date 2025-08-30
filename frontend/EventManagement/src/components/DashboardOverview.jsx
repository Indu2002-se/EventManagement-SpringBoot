import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Tag, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  MapPin
} from 'lucide-react';
import { eventAPI, userAPI, categoryAPI, registrationAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
    publishedEvents: 0,
    totalRevenue: 0,
    recentEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [eventsRes, usersRes, categoriesRes, registrationsRes, upcomingRes] = await Promise.all([
        eventAPI.getAllEvents(0, 1000), // Get all events for counting
        userAPI.getAllUsers(),
        categoryAPI.getAllCategories(),
        eventAPI.getAllEvents(0, 1000), // We'll use this to calculate registrations
        eventAPI.getUpcomingEvents()
      ]);

      const events = eventsRes.data.content || eventsRes.data || [];
      const users = usersRes.data || [];
      const categories = categoriesRes.data || [];
      const upcomingEvents = upcomingRes.data || [];

      // Calculate statistics
      const publishedEvents = events.filter(event => event.status === 'PUBLISHED');
      const totalRevenue = events.reduce((sum, event) => {
        const registrations = event.currentRegistrations || 0;
        return sum + (event.ticketPrice * registrations);
      }, 0);

      // Get recent events (last 5)
      const recentEvents = events
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalEvents: events.length,
        totalUsers: users.length,
        totalCategories: categories.length,
        totalRegistrations: events.reduce((sum, event) => sum + (event.currentRegistrations || 0), 0),
        upcomingEvents: upcomingEvents.length,
        publishedEvents: publishedEvents.length,
        totalRevenue,
        recentEvents
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'blue' }) => (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-icon ${color}`}>
          <Icon />
        </div>
        <div className="stat-content">
          <h3>{title}</h3>
          <div className="value">{value}</div>
        </div>
      </div>
      {change && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ 
            fontSize: '14px', 
            color: changeType === 'increase' ? '#059669' : '#dc2626',
            display: 'flex',
            alignItems: 'center'
          }}>
            {changeType === 'increase' ? (
              <TrendingUp size={16} style={{ marginRight: '4px' }} />
            ) : (
              <TrendingDown size={16} style={{ marginRight: '4px' }} />
            )}
            {change}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-description">
          Welcome to your event management dashboard. Here's what's happening with your events.
        </p>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Total Categories"
          value={stats.totalCategories}
          icon={Tag}
          color="purple"
        />
        <StatCard
          title="Total Registrations"
          value={stats.totalRegistrations}
          icon={FileText}
          color="indigo"
        />
      </div>

      {/* Additional stats */}
      <div className="stats-grid">
        <StatCard
          title="Published Events"
          value={stats.publishedEvents}
          icon={Calendar}
          color="green"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Recent Events */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Events</h3>
        </div>
        <div className="card-body">
          {stats.recentEvents.length > 0 ? (
            stats.recentEvents.map((event) => (
              <div key={event.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Calendar size={20} style={{ color: '#2563eb' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                      {event.title}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={16} />
                      {event.location}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                    {formatCurrency(event.ticketPrice)}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {event.currentRegistrations || 0}/{event.maxCapacity} registered
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '16px' }}>No events found</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <button className="btn btn-primary">
              <Calendar size={16} />
              Create Event
            </button>
            <button className="btn btn-primary" style={{ backgroundColor: '#059669' }}>
              <Users size={16} />
              Add User
            </button>
            <button className="btn btn-primary" style={{ backgroundColor: '#7c3aed' }}>
              <Tag size={16} />
              Add Category
            </button>
            <button className="btn btn-primary" style={{ backgroundColor: '#4f46e5' }}>
              <FileText size={16} />
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
