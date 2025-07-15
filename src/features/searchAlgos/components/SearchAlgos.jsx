import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHome,FaCode,FaArrowRight, FaSearch, FaRocket, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import BinarySearchVisualizer from './BinarySearchVisualizer';
import LinearSearchVisualizer from './LinearSearchVisualizer';
import JumpSearchVisualizer from './JumpSearchVisualizer';
import '../styles/SearchAlgos.css';

const SearchAlgos = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('overview');

  const algorithms = [
    {
      id: 'binary',
      title: 'Binary Search',
      description: 'Efficient search for sorted arrays using divide-and-conquer',
      complexity: 'O(log n)',
      icon: <FaRocket />,
      color: '#8b5cf6',
      features: ['Divide and conquer', 'Sorted arrays', 'Fast lookup'],
      gradient: 'linear-gradient(135deg, #667eea 0%, #8b5cf6 100%)'
    },
    {
      id: 'linear',
      title: 'Linear Search',
      description: 'Simple sequential search through array elements',
      complexity: 'O(n)',
      icon: <FaSearch />,
      color: '#06b6d4',
      features: ['Sequential scan', 'Works on any array', 'Simple logic'],
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)'
    },
    {
      id: 'jump',
      title: 'Jump Search',
      description: 'Block-based search with √n optimal jump size',
      complexity: 'O(√n)',
      icon: <FaChartLine />,
      color: '#10b981',
      features: ['Block jumps', 'Optimized for sorted arrays', 'Hybrid approach'],
      gradient: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)'
    }
  ];

  const renderAlgorithmView = () => {
    switch (selectedAlgorithm) {
      case 'binary':
        return <BinarySearchVisualizer />;
      case 'linear':
        return <LinearSearchVisualizer />;
      case 'jump':
        return <JumpSearchVisualizer />;
      default:
        return (
          <motion.div 
            className="linkedlist-home-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="linkedlist-home-bg-overlay"></div>
            <motion.header 
              className="linkedlist-home-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link to="/" className="home-button">
                <FaHome size={18} />
                <span>Home</span>
              </Link>
              <div className="header-content">
                <h1>Search Algorithms Visualizer</h1>
                <p>Interactive visualizations for different search algorithms</p>
              </div>
            </motion.header>
            <motion.div 
              className="linkedlist-cards-grid"
              initial="hidden"
              animate="visible"
            >
              {algorithms.map((algo, index) => (
                <motion.div
                  key={algo.id}
                  className="linkedlist-card"
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: algo.gradient }}
                  onClick={() => setSelectedAlgorithm(algo.id)}
                >
                  <div className="linkedlist-card-link" style={{ height: '100%' }}>
                    <div className="linkedlist-card-header">
                      <div className="linkedlist-card-icon" style={{ color: '#f8fafc', textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
                        {React.cloneElement(algo.icon, { color: '#f8fafc', size: 48 })}
                      </div>
                      <div className="linkedlist-card-badges">
                        <span className="difficulty-badge">Search</span>
                        <span className="complexity-badge">{algo.complexity}</span>
                      </div>
                    </div>
                    <div className="linkedlist-card-body">
                      <h3 className="linkedlist-card-title">{algo.title}</h3>
                      <p className="linkedlist-card-description">{algo.description}</p>
                      <div className="linkedlist-card-features">
                        {algo.features.map((feature, idx) => (
                          <span key={idx} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                    </div>
                    <div className="linkedlist-card-footer">
                      <div className="learn-more-btn">
                        <FaCode size={14} />
                        Learn & Visualize
                        <FaArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div 
              className="linkedlist-home-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p>Choose a search algorithm to start your interactive learning journey</p>
            </motion.div>
          </motion.div>
        );
    }
  };

  return (
    <div>
      {selectedAlgorithm !== 'overview' && (
        <motion.div 
          className="algorithm-nav"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button 
            onClick={() => setSelectedAlgorithm('overview')}
            className="back-button"
          >
            ← Back to Overview
          </button>
          <div className="algorithm-tabs">
            {algorithms.map(algo => (
              <button
                key={algo.id}
                onClick={() => setSelectedAlgorithm(algo.id)}
                className={`tab-button ${selectedAlgorithm === algo.id ? 'active' : ''}`}
                style={{ '--accent-color': algo.color }}
              >
                {algo.icon}
                {algo.title}
              </button>
            ))}
          </div>
        </motion.div>
      )}
      <main className="main-content">
        {renderAlgorithmView()}
      </main>
    </div>
  );
};

export default SearchAlgos;
