import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  Trash2,
  RefreshCw
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  
  // Profile Settings
  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@eventpro.com',
    phone: '+1 (555) 123-4567',
    position: 'System Administrator',
    department: 'IT',
    location: 'New York, NY',
    bio: 'Experienced event management professional.'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    eventReminders: true,
    registrationUpdates: true,
    systemAlerts: true,
    marketingEmails: false,
    weeklyReports: true
  });

  // Application Settings
  const [appSettings, setAppSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    autoSave: true,
    showTutorials: false,
    compactMode: false,
    enableAnalytics: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    console.log('Loading settings...');
  };

  const handleSave = async (section) => {
    setLoading(true);
    setSaveStatus({ type: '', message: '' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem(`settings_${section}`, JSON.stringify({
        profile: profileData,
        notifications: notificationSettings,
        app: appSettings
      }[section]));

      setSaveStatus({ type: 'success', message: `${section} settings saved successfully!` });
      
      setTimeout(() => {
        setSaveStatus({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to save settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setSaveStatus({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaveStatus({ type: 'success', message: 'Password changed successfully!' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to change password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const exportSettings = () => {
    const settings = {
      profile: profileData,
      notifications: notificationSettings,
      app: appSettings
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eventpro-settings.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target.result);
          if (settings.profile) setProfileData(settings.profile);
          if (settings.notifications) setNotificationSettings(settings.notifications);
          if (settings.app) setAppSettings(settings.app);
          setSaveStatus({ type: 'success', message: 'Settings imported successfully!' });
        } catch (error) {
          setSaveStatus({ type: 'error', message: 'Invalid settings file format.' });
        }
      };
      reader.readAsText(file);
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      setProfileData({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@eventpro.com',
        phone: '+1 (555) 123-4567',
        position: 'System Administrator',
        department: 'IT',
        location: 'New York, NY',
        bio: 'Experienced event management professional.'
      });
      
      setNotificationSettings({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        eventReminders: true,
        registrationUpdates: true,
        systemAlerts: true,
        marketingEmails: false,
        weeklyReports: true
      });
      
      setAppSettings({
        theme: 'light',
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        autoSave: true,
        showTutorials: false,
        compactMode: false,
        enableAnalytics: true
      });
      
      setSaveStatus({ type: 'success', message: 'Settings reset to default values.' });
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'app', name: 'Application', icon: Palette }
  ];

  const renderProfileTab = () => (
    <div>
      <div className="settings-section">
        <h3>Personal Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              value={profileData.position}
              onChange={(e) => setProfileData({...profileData, position: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={profileData.department}
              onChange={(e) => setProfileData({...profileData, department: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              rows={4}
              className="form-textarea"
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="form-input pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              className="form-input"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? <RefreshCw className="spinner" /> : <Save size={16} />}
            Change Password
          </button>
        </form>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-section">
      <h3>Notification Preferences</h3>
      <div className="settings-toggle-container">
        {Object.entries(notificationSettings).map(([key, value]) => (
          <div key={key} className="settings-toggle-container">
            <div className="settings-toggle-label">
              <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
              <p>
                {key.includes('email') ? 'Receive notifications via email' :
                 key.includes('sms') ? 'Receive notifications via SMS' :
                 key.includes('push') ? 'Receive push notifications' :
                 'Get notified about important updates'}
              </p>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, [key]: !value})}
              className={`settings-toggle ${value ? 'active' : ''}`}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppTab = () => (
    <div>
      <div className="settings-section">
        <h3>Display & Language</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Theme</label>
            <select
              value={appSettings.theme}
              onChange={(e) => setAppSettings({...appSettings, theme: e.target.value})}
              className="form-select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div className="form-group">
            <label>Language</label>
            <select
              value={appSettings.language}
              onChange={(e) => setAppSettings({...appSettings, language: e.target.value})}
              className="form-select"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <select
              value={appSettings.timezone}
              onChange={(e) => setAppSettings({...appSettings, timezone: e.target.value})}
              className="form-select"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
          <div className="form-group">
            <label>Time Format</label>
            <select
              value={appSettings.timeFormat}
              onChange={(e) => setAppSettings({...appSettings, timeFormat: e.target.value})}
              className="form-select"
            >
              <option value="12h">12-hour</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Application Behavior</h3>
        <div className="settings-toggle-container">
          {Object.entries(appSettings).filter(([key]) => !['theme', 'language', 'timezone', 'dateFormat', 'timeFormat'].includes(key)).map(([key, value]) => (
            <div key={key} className="settings-toggle-container">
              <div className="settings-toggle-label">
                <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                <p>
                  {key === 'autoSave' ? 'Automatically save changes' :
                   key === 'showTutorials' ? 'Show helpful tutorials' :
                   key === 'compactMode' ? 'Use compact layout' :
                   'Enable analytics tracking'}
                </p>
              </div>
              <button
                onClick={() => setAppSettings({...appSettings, [key]: !value})}
                className={`settings-toggle ${value ? 'active' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>
        <div className="settings-actions">
          <button
            onClick={exportSettings}
            className="settings-button secondary"
          >
            <Download size={16} />
            Export Settings
          </button>
          <label className="settings-button secondary">
            <Upload size={16} />
            Import Settings
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
            />
          </label>
          <button
            onClick={resetSettings}
            className="settings-button danger"
          >
            <Trash2 size={16} />
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'app':
        return renderAppTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title-large">Settings</h1>
        <p className="page-description">Manage your account preferences and system configuration</p>
      </div>

      {/* Status Message */}
      {saveStatus.message && (
        <div className={`status-message ${saveStatus.type}`}>
          {saveStatus.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {saveStatus.message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Sidebar */}
        <div className="settings-sidebar">
          <nav>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="settings-content" style={{ flex: 1 }}>
          {renderTabContent()}
          
          {/* Save Button */}
          <div className="settings-actions">
            <button
              onClick={() => handleSave(activeTab)}
              disabled={loading}
              className="settings-button primary"
            >
              {loading ? <RefreshCw className="spinner" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
