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

export const eventAPI = {
  getAllEvents: (page = 0, size = 10) =>
    api.get(`/events?page=${page}&size=${size}`),
  getEventById: (eventId) =>
    api.get(`/events/${eventId}`),
  createEvent: (eventData, organizerId) =>
    api.post(`/events?organizerId=${organizerId}`, eventData),
  updateEvent: (eventId, eventData, organizerId) =>
    api.put(`/events/${eventId}?organizerId=${organizerId}`, eventData),
  deleteEvent: (eventId, organizerId) =>
    api.delete(`/events/${eventId}?organizerId=${organizerId}`),
  publishEvent: (eventId, organizerId) =>
    api.patch(`/events/${eventId}/publish?organizerId=${organizerId}`),
  cancelEvent: (eventId, organizerId) =>
    api.patch(`/events/${eventId}/cancel?organizerId=${organizerId}`),
  searchEvents: (searchTerm, page = 0, size = 10) =>
    api.get(`/events/search?searchTerm=${searchTerm}&page=${page}&size=${size}`),
  getUpcomingEvents: () =>
    api.get('/events/upcoming'),
  getEventsByCategory: (categoryId, page = 0, size = 10) =>
    api.get(`/events/category/${categoryId}?page=${page}&size=${size}`),
  getEventsByOrganizer: (organizerId, page = 0, size = 10) =>
    api.get(`/events/organizer/${organizerId}?page=${page}&size=${size}`),
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
    api.post(`/registrations?eventId=${eventId}&userId=${userId}`),
  getRegistrationsByEvent: (eventId) =>
    api.get(`/registrations/event/${eventId}`),
  getRegistrationsByUser: (userId) =>
    api.get(`/registrations/user/${userId}`),
  getRegistrationById: (registrationId) =>
    api.get(`/registrations/${registrationId}`),
  confirmRegistration: (registrationId) =>
    api.patch(`/registrations/${registrationId}/confirm`),
  cancelRegistration: (registrationId) =>
    api.patch(`/registrations/${registrationId}/cancel`),
  deleteRegistration: (registrationId) =>
    api.delete(`/registrations/${registrationId}`),
};

export default api;
