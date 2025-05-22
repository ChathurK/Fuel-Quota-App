// src/utils/index.js

// ==================== DATE UTILITIES ====================
export const DateUtils = {
  // Format timestamp to readable date
  formatTimestamp: (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Format date for API (YYYY-MM-DD)
  formatDateForAPI: (date) => {
    if (!date) return null;
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  },

  // Get current date in API format
  getCurrentDate: () => {
    return DateUtils.formatDateForAPI(new Date());
  },

  // Get date range for reports
  getDateRange: (period) => {
    const now = new Date();
    const endDate = DateUtils.formatDateForAPI(now);
    let startDate;

    switch (period) {
      case 'today':
        startDate = endDate;
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate = DateUtils.formatDateForAPI(weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        startDate = DateUtils.formatDateForAPI(monthAgo);
        break;
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        startDate = DateUtils.formatDateForAPI(yearAgo);
        break;
      default:
        startDate = endDate;
    }

    return { startDate, endDate };
  },

  // Check if date is today
  isToday: (timestamp) => {
    if (!timestamp) return false;
    const date = new Date(timestamp);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return DateUtils.formatTimestamp(timestamp);
  }
};

// ==================== VALIDATION UTILITIES ====================
export const ValidationUtils = {
  // Vehicle registration number validation (Sri Lankan format)
  validateRegistrationNumber: (regNo) => {
    if (!regNo) return { isValid: false, message: 'Registration number is required' };
    
    // Sri Lankan vehicle registration patterns
    const patterns = [
      // Province-based patterns: WP-CAB-1234, CP-QA-1111, etc.
      /^(WP|CP|SP|NP|EP|NWP|NCP|UP|SGP)-(CAB|CAR|CBB|CAA|CAD|QA|QB|TA|TB|LD|BUS)-\d{4}$/i,
      
      // Old patterns: ABC-1234
      /^[A-Z]{2,3}-\d{4}$/i,
      
      // Commercial: WP-LD-1234, WP-BUS-5678
      /^[A-Z]{2,3}-(LD|BUS)-\d{4}$/i,
      
      // Numeric only: 123-1234
      /^\d{2,3}-\d{4}$/,
      
      // Compact format: AB1234
      /^[A-Z]{2}\d{4}$/i,
      
      // Old numeric format: 12345678
      /^\d{8}$/
    ];
    
    const normalizedRegNo = regNo.toUpperCase().trim();
    const isValid = patterns.some(pattern => pattern.test(normalizedRegNo));
    
    return {
      isValid,
      message: isValid ? '' : 'Invalid registration number format (e.g., WP-CAB-1234, CP-QA-1111)'
    };
  },

  // Enhanced chassis number validation
  validateChassisNumber: (chassis) => {
    if (!chassis) return { isValid: false, message: 'Chassis number is required' };
    
    const normalizedChassis = chassis.toUpperCase().trim();
    
    // Modern VIN format (17 characters)
    const modernVIN = /^[A-HJ-NPR-Z0-9]{17}$/i;
    
    // Older chassis formats (10-17 characters, alphanumeric)
    const olderChassis = /^[A-Z0-9]{10,17}$/i;
    
    const isValid = modernVIN.test(normalizedChassis) || olderChassis.test(normalizedChassis);
    
    let message = '';
    if (!isValid) {
      if (normalizedChassis.length < 10) {
        message = 'Chassis number must be at least 10 characters';
      } else if (normalizedChassis.length > 17) {
        message = 'Chassis number cannot exceed 17 characters';
      } else if (/[IOQ]/i.test(normalizedChassis)) {
        message = 'Chassis number cannot contain letters I, O, or Q';
      } else {
        message = 'Invalid chassis number format';
      }
    }
    
    return { isValid, message };
  },

  // Vehicle type validation based on registration
  getVehicleTypeFromRegistration: (regNo) => {
    if (!regNo) return null;
    
    const normalized = regNo.toUpperCase();
    
    // Extract vehicle category from registration
    if (normalized.includes('-CAB-') || normalized.includes('-CAR-') || normalized.includes('-CBB-') || 
        normalized.includes('-CAA-') || normalized.includes('-CAD-')) {
      return 'Car';
    } else if (normalized.includes('-QA-') || normalized.includes('-QB-')) {
      return 'Motorcycle';
    } else if (normalized.includes('-TA-') || normalized.includes('-TB-')) {
      return 'Three Wheeler';
    } else if (normalized.includes('-LD-')) {
      return 'Lorry';
    } else if (normalized.includes('-BUS-')) {
      return 'Bus';
    }
    
    return null;
  },

  // Province validation
  getProvinceFromRegistration: (regNo) => {
    if (!regNo) return null;
    
    const provinceMap = {
      'WP': 'Western Province',
      'CP': 'Central Province', 
      'SP': 'Southern Province',
      'NP': 'Northern Province',
      'EP': 'Eastern Province',
      'NWP': 'North Western Province',
      'NCP': 'North Central Province',
      'UP': 'Uva Province',
      'SGP': 'Sabaragamuwa Province'
    };
    
    const prefix = regNo.split('-')[0]?.toUpperCase();
    return provinceMap[prefix] || null;
  },

  // Email validation
  validateEmail: (email) => {
    if (!email) return { isValid: false, message: 'Email is required' };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    return {
      isValid,
      message: isValid ? '' : 'Invalid email format'
    };
  },

  // Phone number validation (Sri Lankan format)
  validatePhoneNumber: (phone) => {
    if (!phone) return { isValid: false, message: 'Phone number is required' };
    
    // Sri Lankan phone patterns: +94XXXXXXXXX, 0XXXXXXXXX, 0XXXXXXXX
    const patterns = [
      /^\+94[1-9]\d{8}$/, // +94712345678
      /^0[1-9]\d{8}$/, // 0712345678
      /^0[1-9]\d{7}$/ // 01234567
    ];
    
    const isValid = patterns.some(pattern => pattern.test(phone));
    
    return {
      isValid,
      message: isValid ? '' : 'Invalid phone number format'
    };
  },

  // Password validation
  validatePassword: (password) => {
    if (!password) return { isValid: false, message: 'Password is required' };
    
    const requirements = {
      minLength: password.length >= 6,
      hasNumber: /\d/.test(password),
      hasLetter: /[a-zA-Z]/.test(password)
    };
    
    const isValid = Object.values(requirements).every(req => req);
    let message = '';
    
    if (!requirements.minLength) message = 'Password must be at least 6 characters';
    else if (!requirements.hasLetter) message = 'Password must contain at least one letter';
    else if (!requirements.hasNumber) message = 'Password must contain at least one number';
    
    return { isValid, message };
  },

  // Fuel amount validation
  validateFuelAmount: (amount) => {
    if (!amount) return { isValid: false, message: 'Fuel amount is required' };
    
    const numAmount = parseFloat(amount);
    const isValid = !isNaN(numAmount) && numAmount > 0 && numAmount <= 100;
    
    let message = '';
    if (isNaN(numAmount)) message = 'Invalid fuel amount';
    else if (numAmount <= 0) message = 'Fuel amount must be greater than 0';
    else if (numAmount > 100) message = 'Maximum 100 liters per transaction';
    
    return { isValid, message };
  }
};

// ==================== FORMATTING UTILITIES ====================
export const FormatUtils = {
  // Format currency (LKR)
  formatCurrency: (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  },

  // Format fuel amount
  formatFuelAmount: (amount, unit = 'L') => {
    if (!amount && amount !== 0) return 'N/A';
    return `${parseFloat(amount).toFixed(1)} ${unit}`;
  },

  // Format percentage
  formatPercentage: (value, decimals = 1) => {
    if (!value && value !== 0) return 'N/A';
    return `${parseFloat(value).toFixed(decimals)}%`;
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  },

  // Capitalize first letter
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Format vehicle type display
  formatVehicleType: (type) => {
    const typeMap = {
      'car': 'Car',
      'motorcycle': 'Motorcycle',
      'threewheeler': 'Three Wheeler',
      'van': 'Van',
      'bus': 'Bus',
      'truck': 'Truck'
    };
    return typeMap[type?.toLowerCase()] || FormatUtils.capitalize(type);
  },

  // Format fuel type with icon
  formatFuelType: (type) => {
    const fuelMap = {
      'petrol': { name: 'Petrol', icon: '⛽', color: 'success' },
      'diesel': { name: 'Diesel', icon: '🚛', color: 'primary' }
    };
    return fuelMap[type?.toLowerCase()] || { name: FormatUtils.capitalize(type), icon: '⛽', color: 'default' };
  }
};

// ==================== QUOTA UTILITIES ====================
export const QuotaUtils = {
  // Calculate quota percentage
  calculateQuotaPercentage: (remaining, allocated) => {
    if (!allocated || allocated === 0) return 0;
    return Math.round((remaining / allocated) * 100);
  },

  // Get quota status
  getQuotaStatus: (remaining, allocated) => {
    const percentage = QuotaUtils.calculateQuotaPercentage(remaining, allocated);
    
    if (percentage <= 0) return { status: 'empty', color: 'error', message: 'Quota Exhausted' };
    if (percentage <= 10) return { status: 'critical', color: 'error', message: 'Critical Low' };
    if (percentage <= 25) return { status: 'low', color: 'warning', message: 'Low Quota' };
    if (percentage <= 50) return { status: 'medium', color: 'info', message: 'Medium' };
    return { status: 'good', color: 'success', message: 'Good' };
  },

  // Check if quota is expiring soon
  isQuotaExpiringSoon: (endDate, daysThreshold = 3) => {
    if (!endDate) return false;
    const now = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= daysThreshold && diffDays >= 0;
  },

  // Get quota alert message
  getQuotaAlertMessage: (remaining, allocated, vehicleReg) => {
    const percentage = QuotaUtils.calculateQuotaPercentage(remaining, allocated);
    
    if (percentage <= 0) {
      return `Vehicle ${vehicleReg} has exhausted its fuel quota.`;
    } else if (percentage <= 10) {
      return `Vehicle ${vehicleReg} has only ${FormatUtils.formatFuelAmount(remaining)} remaining (${percentage}%).`;
    } else if (percentage <= 25) {
      return `Vehicle ${vehicleReg} is running low on quota: ${FormatUtils.formatFuelAmount(remaining)} remaining.`;
    }
    
    return null; // No alert needed
  }
};

// ==================== LOCAL STORAGE UTILITIES ====================
export const StorageUtils = {
  // Set item with expiration
  setWithExpiry: (key, value, ttl = 3600000) => { // 1 hour default
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  // Get item with expiration check
  getWithExpiry: (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      const now = new Date();
      
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (e) {
      localStorage.removeItem(key);
      return null;
    }
  },

  // Clear expired items
  clearExpired: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      StorageUtils.getWithExpiry(key); // This will remove expired items
    });
  }
};

// ==================== QR CODE UTILITIES ====================
export const QRUtils = {
  // Generate QR code data URL (you'll need to install qrcode library: npm install qrcode)
  generateQRCode: async (data, options = {}) => {
    try {
      const QRCode = await import('qrcode');
      const defaultOptions = {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        ...options
      };
      
      return await QRCode.toDataURL(data, defaultOptions);
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  },

  // Decode QR code (for scanning functionality)
  decodeQRCode: (qrData) => {
    try {
      // Your backend handles the actual decoding
      // This is just for client-side validation
      if (!qrData || typeof qrData !== 'string') {
        throw new Error('Invalid QR code data');
      }
      return qrData;
    } catch (error) {
      console.error('Error decoding QR code:', error);
      return null;
    }
  },

  // Validate QR code format
  validateQRCode: (qrData) => {
    if (!qrData) return { isValid: false, message: 'QR code data is required' };
    
    // Basic validation - your backend will do the actual validation
    const isValid = typeof qrData === 'string' && qrData.length > 0;
    
    return {
      isValid,
      message: isValid ? '' : 'Invalid QR code format'
    };
  }
};

// ==================== ROLE UTILITIES ====================
export const RoleUtils = {
  // Check if user has specific role
  hasRole: (user, role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  },

  // Check if user is admin
  isAdmin: (user) => {
    return RoleUtils.hasRole(user, 'ROLE_ADMIN');
  },

  // Check if user is vehicle owner
  isVehicleOwner: (user) => {
    return RoleUtils.hasRole(user, 'ROLE_VEHICLE_OWNER');
  },

  // Check if user is station owner
  isStationOwner: (user) => {
    return RoleUtils.hasRole(user, 'ROLE_STATION_OWNER');
  },

  // Get user's primary role for display
  getPrimaryRole: (user) => {
    if (!user || !user.roles || user.roles.length === 0) return 'User';
    
    if (RoleUtils.isAdmin(user)) return 'Admin';
    if (RoleUtils.isStationOwner(user)) return 'Station Owner';
    if (RoleUtils.isVehicleOwner(user)) return 'Vehicle Owner';
    
    return 'User';
  },

  // Get dashboard route based on user role
  getDashboardRoute: (user) => {
    if (RoleUtils.isAdmin(user)) return '/admin';
    if (RoleUtils.isStationOwner(user)) return '/station';
    if (RoleUtils.isVehicleOwner(user)) return '/vehicle';
    return '/';
  },

  // Get role-specific navigation items
  getNavigationItems: (user) => {
    const items = [{ title: 'Home', path: '/' }];
    
    if (RoleUtils.isAdmin(user)) {
      items.push(
        { title: 'Dashboard', path: '/admin' },
        { title: 'Users', path: '/admin/users' },
        { title: 'Stations', path: '/admin/stations' },
        { title: 'Vehicles', path: '/admin/vehicles' },
        { title: 'Reports', path: '/admin/reports' }
      );
    } else if (RoleUtils.isStationOwner(user)) {
      items.push(
        { title: 'Dashboard', path: '/station' },
        { title: 'My Stations', path: '/station/list' },
        { title: 'Scan QR', path: '/station/scan' },
        { title: 'Transactions', path: '/station/transactions' }
      );
    } else if (RoleUtils.isVehicleOwner(user)) {
      items.push(
        { title: 'Dashboard', path: '/vehicle' },
        { title: 'My Vehicles', path: '/vehicle/list' },
        { title: 'Add Vehicle', path: '/vehicle/add' },
        { title: 'Quota Status', path: '/vehicle/quota' }
      );
    }
    
    return items;
  }
};

// ==================== DOWNLOAD UTILITIES ====================
export const DownloadUtils = {
  // Download file from blob
  downloadBlob: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Download JSON as file
  downloadJSON: (data, filename = 'data.json') => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    DownloadUtils.downloadBlob(blob, filename);
  },

  // Download CSV from array of objects
  downloadCSV: (data, filename = 'data.csv') => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    DownloadUtils.downloadBlob(blob, filename);
  },

  // Generate report filename with timestamp
  generateReportFilename: (prefix, extension = 'csv') => {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${prefix}_${timestamp}.${extension}`;
  }
};

// ==================== SEARCH AND FILTER UTILITIES ====================
export const SearchUtils = {
  // Filter array by search term
  filterBySearch: (items, searchTerm, searchFields) => {
    if (!searchTerm) return items;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    
    return items.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        if (!value) return false;
        return value.toString().toLowerCase().includes(lowercaseSearch);
      })
    );
  },

  // Sort array by field
  sortByField: (items, field, direction = 'asc') => {
    return [...items].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue === bValue) return 0;
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  },

  // Paginate array
  paginate: (items, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      items: items.slice(startIndex, endIndex),
      totalPages: Math.ceil(items.length / pageSize),
      currentPage: page,
      totalItems: items.length,
      hasNext: endIndex < items.length,
      hasPrev: page > 1
    };
  }
};

// ==================== CONSTANTS ====================
export const Constants = {
  // Vehicle types
  VEHICLE_TYPES: [
    { value: 'car', label: 'Car' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'threewheeler', label: 'Three Wheeler' },
    { value: 'van', label: 'Van' },
    { value: 'bus', label: 'Bus' },
    { value: 'truck', label: 'Truck' }
  ],

  // Fuel types
  FUEL_TYPES: [
    { value: 'petrol', label: 'Petrol', color: 'success' },
    { value: 'diesel', label: 'Diesel', color: 'primary' }
  ],

  // User roles
  USER_ROLES: [
    { value: 'ROLE_ADMIN', label: 'Administrator' },
    { value: 'ROLE_STATION_OWNER', label: 'Station Owner' },
    { value: 'ROLE_VEHICLE_OWNER', label: 'Vehicle Owner' }
  ],

  // Transaction statuses
  TRANSACTION_STATUSES: [
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'failed', label: 'Failed', color: 'error' }
  ],

  // Quota periods
  QUOTA_PERIODS: [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ],

  // Report periods
  REPORT_PERIODS: [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ],

  // API endpoints (for reference)
  API_ENDPOINTS: {
    AUTH: '/auth',
    VEHICLE: '/vehicle',
    STATION: '/station',
    FUEL: '/fuel',
    ADMIN: '/admin'
  },

  // Quota limits
  QUOTA_LIMITS: {
    MAX_FUEL_PER_TRANSACTION: 100,
    MIN_FUEL_PER_TRANSACTION: 0.1,
    CRITICAL_QUOTA_PERCENTAGE: 10,
    LOW_QUOTA_PERCENTAGE: 25
  },

  // Validation limits
  VALIDATION_LIMITS: {
    USERNAME_MIN: 3,
    USERNAME_MAX: 20,
    PASSWORD_MIN: 6,
    REGISTRATION_NUMBER_MAX: 20,
    CHASSIS_NUMBER_LENGTH: 17
  }
};

// Default export with all utilities
export default {
  DateUtils,
  ValidationUtils,
  FormatUtils,
  QuotaUtils,
  StorageUtils,
  QRUtils,
  RoleUtils,
  DownloadUtils,
  SearchUtils,
  Constants
};