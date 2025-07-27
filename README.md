#  DSA Visualizer

**Interactive Data Structures & Algorithms Learning Platform** - Making computer science concepts accessible through beautiful, step-by-step visualizations.

🌐 **Live Demo:** https://visualalgo-ov.web.app/

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://visualalgo-ov.web.app/)
[![React](https://img.shields.io/badge/React-19+-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6+-purple)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Overview

DSA Visualizer is an interactive educational platform designed to help students and developers understand data structures and algorithms through visual learning. Each visualizer provides step-by-step animations synchronized with actual code execution, making complex concepts easy to grasp. It is brought to you by Openverse, the open source club of IIIT Kottayam, if you wish to contribute, check out contributing.md 
We use C for code since, the visualizer is specifically tailored for the Datastructure 121 Course at IIIT Kottayam 

## Features

### 📊 **Available Visualizations**
- **🔗 Linked Lists** - Doubly linked lists with memory address visualization and dynamic code generation
- **📚 Stack & Queue** - LIFO/FIFO operations with real-time step tracking and C implementation
- **🌳 Binary Search Trees** - Interactive tree operations with traversal algorithms and balancing
- **🗺️ Pathfinding** - Grid-based pathfinding with Dijkstra's and A* algorithms
- **🔄 Sorting Algorithms** - Multiple sorting algorithms with complexity analysis and performance comparison

### � **Interactive Learning Experience**
- **🎮 Interactive Controls** - Play, pause, step-through, and speed control for all animations
- **💻 Code Visualization** - Real-time syntax highlighting showing exact execution steps
- **🧠 Memory Management** - Visual representation of memory allocation and pointer manipulation
- **📱 Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **📚 Educational Content** - Comprehensive explanations, complexity analysis, and best practices

### **Technical Features**
- **🎨 Modern UI** - Dark theme with consistent design system and accessibility features
- **🧪 Educational Focus** - Code examples in C with detailed comments and explanations
- **🔄 Real-time Updates** - Dynamic visualization updates based on user interactions

---

Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/DSA-Website.git
cd DSA-Website

# Install dependencies
npm install

# Start development server
npm run dev

# Open the application
# Visit http://localhost:5173 in your browser

# Build for production
npm run build

# Preview production build
npm run preview
```

You can also build a docker image and run the build isolately, without any setup overhead.
```bash
# After cloning and changing directory
docker build -t algorithima:latest .

# To run the image
docker run -d --name dsa_website \
           -p 1234:80 \
           algorithima:latest
# Build will be running on port localhost:1234, if the port is busy, put another port in docker run command.
``` 

---

## 🏗️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 19 | Modern UI with hooks and functional components |
| **Build Tool** | Vite 6 | Fast development and optimized builds |
| **Animations** | Framer Motion | Smooth, performant animations |
| **Code Display** | React Syntax Highlighter | Syntax highlighting with line tracking |
| **Code Editor** | Monaco Editor | Interactive code editing experience |
| **Styling** | CSS3 + Custom Design System | Consistent dark theme across all components |
| **Icons** | React Icons | Comprehensive icon library |
| **Routing** | React Router v7 | Client-side navigation |
| **Deployment** | Firebase Hosting | Fast, reliable hosting |

---

## 📁 Project Structure

```
DSA-Website/
├── 📂 src/
│   ├── 🎯 features/              # Feature-based organization
│   │   ├── 🔗 linkedList/        # Doubly linked list with memory visualization
│   │   ├── 🔄 sorting/           # Multiple sorting algorithms
│   │   ├── 🌳 tree/              # Binary search tree operations
│   │   ├── 🗺️ pathfinding/       # Grid-based pathfinding algorithms
│   │   ├── 📚 stackQueue/        # Stack and queue data structures
│   │   ├── 🏠 home/              # Landing page with feature showcase
│   │   ├── ℹ️ about/             # Team and project information
│   │   └── 🔧 common/            # Shared components and utilities
│   │       ├── components/       # Reusable React components
│   │       └── styles/          # Global CSS and design system
│   ├── 🎨 constants/            # Theme, colors, animation speeds
│   ├── 🛠️ utils/                # Helper functions and utilities
│   ├── 🖼️ assets/               # Images, icons, static files
│   ├── 📄 App.jsx              # Main router and application shell
│   └── 🚀 main.jsx             # Application entry point
├── 📂 public/                  # Static assets and legacy files
├── 📖 CONTRIBUTING.md         # Comprehensive contribution guide
└── 📦 package.json           # Dependencies and build scripts
```

---

## 🎨 Design System

Our consistent **dark theme** provides an optimal learning environment:

### 🎨 Color Palette
```css
/* Primary Colors */
--primary: #58a6ff;      /* Blue - actions, highlights */
--secondary: #238636;    /* Green - success states */
--danger: #f85149;       /* Red - errors, warnings */
--warning: #d29922;      /* Yellow - cautions */

/* Interface Colors */
--background: #0d1117;   /* Main dark background */
--surface: #161b22;      /* Panels, cards */
--border: #30363d;       /* Borders, dividers */
--text-primary: #c9d1d9; /* Main text */
--text-secondary: #8b949e; /* Secondary text */

/* Node Visualization */
--node-active: #5bc9b1;  /* Active/highlighted nodes */
--node-inactive: #30363d; /* Default/inactive nodes */
--node-visiting: #f39c12; /* Nodes being processed */
```

### 📱 Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

---

## 🚀 Getting Started for Developers

### 🛠️ Development Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Create production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality

# Dependencies
npm install          # Install all dependencies
npm update          # Update dependencies to latest versions
npm audit           # Check for security vulnerabilities
```

### 🎯 Key Development Features

- **⚡ Hot Module Replacement** - Instant updates during development
- **🔍 ESLint Integration** - Code quality and consistency checking
- **📦 Optimized Builds** - Tree-shaking and code splitting for performance
- **🧪 Modern JavaScript** - ES6+ features with Vite compilation
- **🔒 Security Focused** - Regular dependency audits and updates

---

## 🤝 Contributing

We actively welcome contributions! Whether you're a student, educator, or developer, there are many ways to help:

### 🎯 Ways to Contribute
- **🐛 Bug Reports** - Help us identify and fix issues
- **✨ Feature Requests** - Suggest new visualizers or improvements
- **� Documentation** - Improve guides and code comments
- **🎨 Design** - Enhance UI/UX and accessibility
- **� Testing** - Help ensure quality across browsers and devices
- **🔧 Code** - Add new features or optimize existing ones

### 🚀 Quick Start for Contributors

1. **📖 Read the Guide** - Check [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines
2. **🍴 Fork & Clone** - Get your own copy of the repository
3. **🌿 Create Branch** - Work on a dedicated feature branch
4. **🧪 Test Changes** - Ensure all visualizers work correctly
5. **📝 Submit PR** - Describe your changes and improvements

### 📋 Development Guidelines

- **🎨 Follow Design System** - Use established colors and patterns
- **📝 Add Documentation** - Comment complex algorithms and functions
- **🧪 Test Thoroughly** - Verify animations and edge cases
- **♿ Consider Accessibility** - Ensure inclusive design practices
- **📱 Mobile-First** - Design for all screen sizes

---

### 🏠 Homepage
![Homepage featuring all available visualizers](https://github.com/user-attachments/assets/73a73d85-ccc3-445b-94c7-44701059311f)

### 🔗 Interactive Visualizations
- **Real-time Animations** - Watch algorithms execute step-by-step
- **Code Synchronization** - See exactly which code is running
- **Memory Visualization** - Understand pointer operations and memory allocation
- **Performance Analysis** - Compare time and space complexity

---


**⭐ Star this repository if it helps you learn!** Your support motivates continued development and improvement.
- **Modern Web Technologies:** Leveraging the latest in React and web development

---

**Made with 💚 by the Openverse Team**



