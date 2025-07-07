import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaSearch, FaRocket, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import BinarySearchVisualizer from './BinarySearchVisualizer';
import LinearSearchVisualizer from './LinearSearchVisualizer';
import JumpSearchVisualizer from './JumpSearchVisualizer';
import '../styles/SearchAlgos.css';

const SearchAlgos = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('overview');

  console.log('Current selected algorithm:', selectedAlgorithm);

  const algorithms = [
    {
      id: 'binary',
      name: 'Binary Search',
      description: 'Efficient search for sorted arrays using divide-and-conquer',
      complexity: 'O(log n)',
      icon: <FaRocket />,
      color: '#8b5cf6'
    },
    {
      id: 'linear',
      name: 'Linear Search',
      description: 'Simple sequential search through array elements',
      complexity: 'O(n)',
      icon: <FaSearch />,
      color: '#06b6d4'
    },
    {
      id: 'jump',
      name: 'Jump Search',
      description: 'Block-based search with √n optimal jump size',
      complexity: 'O(√n)',
      icon: <FaChartLine />,
      color: '#10b981'
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
            className="hero-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-content">
              <h2>Choose a Search Algorithm to Visualize</h2>
              <p>Explore different search algorithms and understand their performance characteristics through interactive visualizations.</p>
            </div>

            <div className="algorithm-grid">
              {algorithms.map((algo, index) => (
                <motion.div
                  key={algo.id}
                  className="algorithm-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => {
                    console.log('Clicking on algorithm:', algo.id);
                    setSelectedAlgorithm(algo.id);
                  }}
                  style={{ '--accent-color': algo.color }}
                >
                  <div className="card-icon" style={{ color: algo.color }}>
                    {algo.icon}
                  </div>
                  <h3>{algo.name}</h3>
                  <p>{algo.description}</p>
                  <div className="complexity-badge" style={{ borderColor: algo.color, color: algo.color }}>
                    {algo.complexity}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="search-algos-container">
      <div className="search-bg-overlay"></div>
      
      <motion.header 
        className="search-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="home-button">
          <FaHome size={18} />
          <span>Home</span>
        </Link>
        <h1>Search Algorithms Visualizer</h1>
      </motion.header>

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
                {algo.name}
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
