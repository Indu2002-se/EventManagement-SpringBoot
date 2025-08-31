import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Tag, 
  FileText, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  LogOut,
  User,
  Search,
  Bell
} from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Events', href: '/dashboard/events', icon: Calendar },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Categories', href: '/dashboard/categories', icon: Tag },
    { name: 'Registrations', href: '/dashboard/registrations', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="dashboard-container">
      {/* Mobile sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">EventPro</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">EventPro</h1>
        </div>
        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Top header */}
        <div className="header">
          <button
            type="button"
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="header-left">
            <div className="welcome-message">Welcome back, Admin 👋</div>
            <h1 className="page-title">Dashboard</h1>
          </div>

          <div className="header-right">
            {/* Search icon */}
            <div className="header-icon">
              <Search size={20} />
            </div>
            
            {/* Notification bell */}
            <div className="header-icon">
              <Bell size={20} />
            </div>
            
            {/* Profile dropdown */}
            <button className="user-menu">
              <div className="user-avatar">
                <User size={16} />
              </div>
              <span>Admin User</span>
            </button>
            
            {/* Logout button */}
            <button className="header-icon">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
