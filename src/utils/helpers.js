/**
 * Utility functions for the DSA website
 */

// Memory address generation
export const generateMemoryAddresses = (size) => {
  return Array(size).fill().map((_, i) => 
    `0x${(i * 100).toString(16).toUpperCase().padStart(3, '0')}`
  );
};

// Singular version for backwards compatibility
export const generateMemoryAddress = (index = 0) => {
  return `0x${(index * 100).toString(16).toUpperCase().padStart(3, '0')}`;
};

// Debounce function for performance optimization
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

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Deep clone utility
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(deepClone);
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// Array shuffle utility for randomization
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate random array for sorting
export const generateRandomArray = (size = 50, min = 1, max = 100) => {
  return Array.from({ length: size }, (_, index) => ({
    id: index,
    value: Math.floor(Math.random() * (max - min + 1)) + min,
    style: ''
  }));
};

// Format complexity notation
export const formatComplexity = (complexity) => {
  const complexityMap = {
    '1': 'O(1)',
    'log n': 'O(log n)',
    'n': 'O(n)',
    'n log n': 'O(n log n)',
    'n²': 'O(n²)',
    'n^2': 'O(n²)',
    '2^n': 'O(2^n)',
    'n!': 'O(n!)'
  };
  return complexityMap[complexity] || complexity;
};

// Input validation helper
export const isValidInput = (input) => {
  return input && input.trim().length > 0;
};

// Error message display helper
export const showErrorMessage = (message, duration = 3000) => {
  return new Promise((resolve) => {
    // This function returns a promise that resolves after the duration
    // In a real app, this would show a toast or notification
    console.error(message);
    setTimeout(resolve, duration);
  });
};

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }
};

// Session storage utilities (for temporary data)
export const sessionStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from sessionStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to sessionStorage:`, error);
    }
  },
  
  remove: (key) => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from sessionStorage:`, error);
    }
  }
};

// Validation utilities
export const validators = {
  isPositiveInteger: (value) => {
    const num = parseInt(value);
    return Number.isInteger(num) && num > 0;
  },
  
  isInRange: (value, min, max) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  },
  
  isValidNodeData: (data) => {
    return data !== null && data !== undefined && data.toString().trim() !== '';
  }
};

// Performance monitoring utilities
export const performance = {
  measure: (name, fn) => {
    const start = window.performance.now();
    const result = fn();
    const end = window.performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  },
  
  measureAsync: async (name, fn) => {
    const start = window.performance.now();
    const result = await fn();
    const end = window.performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }
};

// Storage helpers for direct import
export const getStorageItem = (key, type = 'local') => {
  try {
    const storage = type === 'session' ? sessionStorage : localStorage;
    const value = storage.getItem(key);
    return value === null ? null : value;
  } catch (error) {
    console.error(`Error getting ${key} from ${type} storage:`, error);
    return null;
  }
};

export const setStorageItem = (key, value, type = 'local') => {
  try {
    const storage = type === 'session' ? sessionStorage : localStorage;
    storage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in ${type} storage:`, error);
    return false;
  }
};

export const removeStorageItem = (key, type = 'local') => {
  try {
    const storage = type === 'session' ? sessionStorage : localStorage;
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from ${type} storage:`, error);
    return false;
  }
};
