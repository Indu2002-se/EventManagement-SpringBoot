import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './components/DashboardOverview';
import EventsManagement from './components/EventsManagement';
import UsersManagement from './components/UsersManagement';
import CategoriesManagement from './components/CategoriesManagement';
import RegistrationsManagement from './components/RegistrationsManagement';
import Settings from './components/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="events" element={<EventsManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="categories" element={<CategoriesManagement />} />
            <Route path="registrations" element={<RegistrationsManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
