// Generate random SKU
const generateSKU = (name, category) => {
  const prefix = category.substring(0, 3).toUpperCase();
  const namePrefix = name.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  return `${prefix}-${namePrefix}-${timestamp}${random}`;
};

// Format currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Calculate tax
const calculateTax = (amount, taxRate = 0.08) => {
  return Math.round(amount * taxRate * 100) / 100;
};

// Calculate shipping cost
const calculateShipping = (items, shippingMethod = 'standard') => {
  const totalWeight = items.reduce((total, item) => {
    return total + (item.weight || 0.5) * item.quantity;
  }, 0);

  let baseCost;
  switch (shippingMethod) {
    case 'express':
      baseCost = 15.99;
      break;
    case 'overnight':
      baseCost = 29.99;
      break;
    case 'standard':
    default:
      baseCost = 5.99;
      break;
  }

  // Add weight-based cost
  const weightCost = totalWeight > 2 ? (totalWeight - 2) * 2 : 0;
  
  return Math.round((baseCost + weightCost) * 100) / 100;
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp.slice(-8)}${random}`;
};

// Sanitize search query
const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return '';
  
  // Remove special regex characters
  return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
};

// Pagination helper
const getPaginationData = (page, limit, total) => {
  const currentPage = Math.max(1, parseInt(page) || 1);
  const itemsPerPage = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const totalPages = Math.ceil(total / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;
  
  return {
    page: currentPage,
    limit: itemsPerPage,
    total,
    pages: totalPages,
    skip,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

// Format date
const formatDate = (date, locale = 'en-US') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// Get time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

module.exports = {
  generateSKU,
  formatCurrency,
  calculateTax,
  calculateShipping,
  isValidEmail,
  generateOrderNumber,
  sanitizeSearchQuery,
  getPaginationData,
  formatDate,
  getTimeAgo
};
