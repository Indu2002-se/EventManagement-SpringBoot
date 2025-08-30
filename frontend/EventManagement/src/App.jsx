import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './components/DashboardOverview';
import EventsManagement from './components/EventsManagement';
import UsersManagement from './components/UsersManagement';
import CategoriesManagement from './components/CategoriesManagement';
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
            <Route path="registrations" element={<div className="p-6"><h1 className="text-2xl font-bold">Registrations Management</h1><p>Registrations management component will be loaded here</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Settings component will be loaded here</p></div>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
