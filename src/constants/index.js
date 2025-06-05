// Application-wide constants
export const MEMORY_POOL_SIZE = 10;

// Animation settings
export const ANIMATION_SPEEDS = {
  SLOW: 1000,
  MEDIUM: 500,
  FAST: 200,
  INSTANT: 50
};

// Create a consolidated APP_CONSTANTS object for backward compatibility
export const APP_CONSTANTS = {
  ANIMATION: {
    DEFAULT_SPEED: 500,
    MIN_SPEED: 100,
    MAX_SPEED: 1000,
    SPEED_STEP: 10
  },
  UI: {
    ERROR_DISPLAY_DURATION: 3000,
    SUCCESS_DISPLAY_DURATION: 2000
  },
  INPUT: {
    DEBOUNCE_DELAY: 300
  }
};

// Color schemes
export const COLORS = {
  PRIMARY: '#58a6ff',
  SECONDARY: '#238636',
  DANGER: '#f85149',
  WARNING: '#d29922',
  SUCCESS: '#238636',
  NODE_ACTIVE: '#5bc9b1',
  NODE_INACTIVE: '#30363d',
  BACKGROUND: '#0d1117',
  SURFACE: '#161b22',
  BORDER: '#30363d'
};

// Grid sizes for pathfinding
export const PATHFINDING_GRID = {
  MIN_ROWS: 8,
  MIN_COLS: 20,
  MAX_ROWS: 15,
  MAX_COLS: 35,
  CELL_SIZE: 45
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: '768px',
  TABLET: '1024px',
  DESKTOP: '1200px'
};

// Route paths
export const ROUTES = {
  HOME: '/',
  LINKED_LIST: '/linked-list',
  SORTING: '/sorting',
  STACKS_QUEUES: '/stacks-queues',
  TREES: '/trees',
  GRAPHS: '/graphs',
  ABOUT: '/about'
};

// Algorithm complexity notations
export const COMPLEXITY = {
  CONSTANT: 'O(1)',
  LOGARITHMIC: 'O(log n)',
  LINEAR: 'O(n)',
  LINEAR_LOGARITHMIC: 'O(n log n)',
  QUADRATIC: 'O(n²)',
  CUBIC: 'O(n³)',
  EXPONENTIAL: 'O(2^n)',
  FACTORIAL: 'O(n!)'
};
