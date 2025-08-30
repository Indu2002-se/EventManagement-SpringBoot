import { format, parseISO } from 'date-fns';

// Date formatting utilities
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'HH:mm');
  } catch (error) {
    return 'Invalid Date';
  }
};

// Event status utilities
export const getEventStatusColor = (status) => {
  switch (status) {
    case 'DRAFT':
      return 'bg-gray-500 text-white';
    case 'PUBLISHED':
      return 'bg-green-500 text-white';
    case 'CANCELLED':
      return 'bg-red-500 text-white';
    case 'COMPLETED':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-300 text-gray-700';
  }
};

export const getEventStatusText = (status) => {
  switch (status) {
    case 'DRAFT':
      return 'Draft';
    case 'PUBLISHED':
      return 'Published';
    case 'CANCELLED':
      return 'Cancelled';
    case 'COMPLETED':
      return 'Completed';
    default:
      return status;
  }
};

// Registration status utilities
export const getRegistrationStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-500 text-white';
    case 'CONFIRMED':
      return 'bg-green-500 text-white';
    case 'CANCELLED':
      return 'bg-red-500 text-white';
    case 'REFUNDED':
      return 'bg-purple-500 text-white';
    default:
      return 'bg-gray-300 text-gray-700';
  }
};

export const getRegistrationStatusText = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'CONFIRMED':
      return 'Confirmed';
    case 'CANCELLED':
      return 'Cancelled';
    case 'REFUNDED':
      return 'Refunded';
    default:
      return status;
  }
};

// User role utilities
export const getUserRoleColor = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-500 text-white';
    case 'ORGANIZER':
      return 'bg-blue-500 text-white';
    case 'USER':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-300 text-gray-700';
  }
};

export const getUserRoleText = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'Admin';
    case 'ORGANIZER':
      return 'Organizer';
    case 'USER':
      return 'User';
    default:
      return role;
  }
};

// Capacity utilities
export const getCapacityPercentage = (current, max) => {
  if (!max || max === 0) return 0;
  return Math.round((current / max) * 100);
};

export const getCapacityColor = (current, max) => {
  const percentage = getCapacityPercentage(current, max);
  if (percentage >= 90) return 'text-red-600';
  if (percentage >= 75) return 'text-yellow-600';
  return 'text-green-600';
};

// Search and filter utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validation utilities
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone);
};

// Currency formatting
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Text truncation
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
