import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data, error.message);
    return Promise.reject(error);
  }
);

// Helper function to safely construct URLs with parameters
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, API_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.pathname + url.search;
};

export const eventAPI = {
  getAllEvents: (page = 0, size = 10) =>
    api.get('/events/all'),
  getEventById: (eventId) =>
    api.get(`/events/${eventId}`),
  createEvent: (eventData, organizerId) => {
    // Ensure organizerId is a clean number
    const cleanOrganizerId = parseInt(organizerId);
    if (isNaN(cleanOrganizerId)) {
      throw new Error('Invalid organizerId: must be a valid number');
    }
    return api.post(buildUrl('/events', { organizerId: cleanOrganizerId }), eventData);
  },
  updateEvent: (eventId, eventData, organizerId) => {
    const cleanOrganizerId = parseInt(organizerId);
    if (isNaN(cleanOrganizerId)) {
      throw new Error('Invalid organizerId: must be a valid number');
    }
    return api.put(buildUrl(`/events/${eventId}`, { organizerId: cleanOrganizerId }), eventData);
  },
  deleteEvent: (eventId, organizerId) => {
    const cleanOrganizerId = parseInt(organizerId);
    if (isNaN(cleanOrganizerId)) {
      throw new Error('Invalid organizerId: must be a valid number');
    }
    return api.delete(buildUrl(`/events/${eventId}`, { organizerId: cleanOrganizerId }));
  },
  publishEvent: (eventId, organizerId) => {
    const cleanOrganizerId = parseInt(organizerId);
    if (isNaN(cleanOrganizerId)) {
      throw new Error('Invalid organizerId: must be a valid number');
    }
    return api.patch(buildUrl(`/events/${eventId}/publish`, { organizerId: cleanOrganizerId }));
  },
  cancelEvent: (eventId, organizerId) => {
    const cleanOrganizerId = parseInt(organizerId);
    if (isNaN(cleanOrganizerId)) {
      throw new Error('Invalid organizerId: must be a valid number');
    }
    return api.patch(buildUrl(`/events/${eventId}/cancel`, { organizerId: cleanOrganizerId }));
  },
  searchEvents: (searchTerm, page = 0, size = 10) =>
    api.get(buildUrl('/events/search', { searchTerm, page, size })),
  getUpcomingEvents: () =>
    api.get('/events/upcoming'),
  getEventsByCategory: (categoryId, page = 0, size = 10) =>
    api.get(buildUrl(`/events/category/${categoryId}`, { page, size })),
  getEventsByOrganizer: (organizerId, page = 0, size = 10) => {
    const cleanOrganizerId = parseInt(organizerId);
    if (isNaN(cleanOrganizerId)) {
      throw new Error('Invalid organizerId: must be a valid number');
    }
    return api.get(buildUrl(`/events/organizer/${cleanOrganizerId}`, { page, size }));
  },
  getEventsWithAvailableCapacity: () =>
    api.get('/events/available'),
};

export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (userId) => api.get(`/users/${userId}`),
  registerUser: (userData) => api.post('/users/register', userData),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  getUserEvents: (userId) => api.get(`/users/${userId}/events`),
};

export const categoryAPI = {
  getAllCategories: () => api.get('/categories'),
  getCategoryById: (categoryId) => api.get(`/categories/${categoryId}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (categoryId, categoryData) => api.put(`/categories/${categoryId}`, categoryData),
  deleteCategory: (categoryId) => api.delete(`/categories/${categoryId}`),
};

export const registrationAPI = {
  registerForEvent: (eventId, userId) =>
    api.post(buildUrl('/registrations', { eventId, userId })),
  getRegistrationsByEvent: (eventId) =>
    api.get(`/registrations/event/${eventId}`),
  getRegistrationsByUser: (userId) =>
    api.get(`/registrations/user/${userId}`),
  getRegistrationById: (registrationId) =>
    api.get(`/registrations/${registrationId}`),
  updateRegistration: (registrationId, registrationData) =>
    api.put(`/registrations/${registrationId}`, registrationData),
  confirmRegistration: (registrationId) =>
    api.patch(`/registrations/${registrationId}/confirm`),
  cancelRegistration: (registrationId) =>
    api.patch(`/registrations/${registrationId}/cancel`),
  deleteRegistration: (registrationId) =>
    api.delete(`/registrations/${registrationId}`),
};

export default api;
