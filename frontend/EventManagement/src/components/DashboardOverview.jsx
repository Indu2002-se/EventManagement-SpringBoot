import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Tag, 
  TrendingUp, 
  DollarSign,
  Target,
  ArrowRight,
  Trophy,
  Activity,
  Star
} from 'lucide-react';
import { eventAPI, userAPI, categoryAPI } from '../services/api';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalCategories: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch events
      const eventsResponse = await eventAPI.getAllEvents(0, 1000);
      const events = eventsResponse.data || [];
      
      // Fetch users
      const usersResponse = await userAPI.getAllUsers();
      const users = usersResponse.data || [];
      
      // Fetch categories
      const categoriesResponse = await categoryAPI.getAllCategories();
      const categories = categoriesResponse.data || [];
      
      // Calculate upcoming events (events in the future)
      const now = new Date();
      const upcomingEvents = events.filter(event => new Date(event.startDate) > now).length;

      setStats({
        totalEvents: events.length,
        totalUsers: users.length,
        totalCategories: categories.length,
        upcomingEvents
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      {/* Dashboard Grid Layout */}
      <div className="dashboard-grid">
        <div className="dashboard-left">
          {/* Next Event Card */}
          <div className="card next-game-card">
            <div className="card-header">
              <h3 className="card-title">Next Event</h3>
              <a href="/dashboard/events" className="card-link">View calendar</a>
            </div>
            <div className="game-details">
              <div className="game-league">Event Management</div>
              <div className="game-time">No upcoming events scheduled</div>
            </div>
            <div className="teams-container">
              <div className="team">
                <div className="team-logo">E</div>
                <div className="team-name">Events</div>
              </div>
              <div className="vs-separator"></div>
              <div className="team">
                <div className="team-logo">M</div>
                <div className="team-name">Management</div>
              </div>
            </div>
      </div>

          {/* Events Statistics Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Events Statistics</h3>
              <a href="/dashboard/events" className="card-link">View all statistics</a>
            </div>
      <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{stats.totalEvents}</div>
                <div className="stat-label">Total Events</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.upcomingEvents}</div>
                <div className="stat-label">Upcoming</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.totalCategories}</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Users</div>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-segment wins" 
                  style={{ width: `${stats.totalEvents > 0 ? (stats.upcomingEvents / stats.totalEvents) * 100 : 0}%` }}
                ></div>
                <div 
                  className="progress-segment draws" 
                  style={{ width: `${stats.totalEvents > 0 ? (stats.totalCategories / stats.totalEvents) * 100 : 0}%` }}
                ></div>
                <div 
                  className="progress-segment losses" 
                  style={{ width: `${stats.totalEvents > 0 ? (stats.totalUsers / stats.totalEvents) * 100 : 0}%` }}
                ></div>
              </div>
      </div>
      </div>

          {/* Standings Card */}
      <div className="card">
        <div className="card-header">
              <h3 className="card-title">Top Categories</h3>
              <a href="/dashboard/categories" className="card-link">View all</a>
        </div>
            <table className="standings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>CATEGORY</th>
                  <th>EVENTS</th>
                  <th>STATUS</th>
                  <th>PRIORITY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="team-position">1</td>
                  <td className="team-name-cell">Technology</td>
                  <td className="team-stats">12</td>
                  <td className="team-stats">Active</td>
                  <td className="team-points">High</td>
                </tr>
                <tr>
                  <td className="team-position">2</td>
                  <td className="team-name-cell">Business</td>
                  <td className="team-stats">8</td>
                  <td className="team-stats">Active</td>
                  <td className="team-points">Medium</td>
                </tr>
                <tr>
                  <td className="team-position">3</td>
                  <td className="team-name-cell">Health</td>
                  <td className="team-stats">6</td>
                  <td className="team-stats">Active</td>
                  <td className="team-points">Medium</td>
                </tr>
                <tr>
                  <td className="team-position">4</td>
                  <td className="team-name-cell">Education</td>
                  <td className="team-stats">5</td>
                  <td className="team-stats">Active</td>
                  <td className="team-points">Low</td>
                </tr>
                <tr>
                  <td className="team-position">5</td>
                  <td className="team-name-cell">Entertainment</td>
                  <td className="team-stats">4</td>
                  <td className="team-stats">Active</td>
                  <td className="team-points">Low</td>
                </tr>
              </tbody>
            </table>
                  </div>
                </div>

        <div className="dashboard-right">
          {/* Small Statistics Cards */}
          <div className="small-stats-grid">
            <div className="small-stat-card">
              <div className="small-stat-icon purple">
                <TrendingUp size={24} />
              </div>
              <div className="small-stat-value">65%</div>
              <div className="small-stat-label">Event Success Rate</div>
            </div>
            
            <div className="small-stat-card">
              <div className="small-stat-icon pink">
                <DollarSign size={24} />
              </div>
              <div className="small-stat-value">$12.5k</div>
              <div className="small-stat-label">Total Revenue</div>
            </div>
            
            <div className="small-stat-card">
              <div className="small-stat-icon orange">
                <Target size={24} />
              </div>
              <div className="small-stat-value">89%</div>
              <div className="small-stat-label">User Satisfaction</div>
                </div>
            
            <div className="small-stat-card">
              <div className="small-stat-icon teal">
                <Activity size={24} />
              </div>
              <div className="small-stat-value">7.8</div>
              <div className="small-stat-label">Average Rating</div>
        </div>
      </div>

          {/* Reminder Card */}
          <div className="card reminder-card">
            <div className="decorative-shapes">
              <div className="shape cube"></div>
              <div className="shape sphere"></div>
              <div className="shape cylinder"></div>
            </div>
            <div className="reminder-header">DON'T FORGET</div>
            <div className="reminder-message">Setup training for next week</div>
            <button className="reminder-button">
              Go to training center
              <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </button>
          </div>

          {/* Quick Actions Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Calendar size={16} />
                Create New Event
            </button>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <Users size={16} />
                Add New User
            </button>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <Tag size={16} />
                Create Category
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
