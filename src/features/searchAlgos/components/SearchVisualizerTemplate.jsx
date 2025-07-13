import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import '../styles/SearchVisualizerTemplate.css';

const SearchVisualizerTemplate = ({
  title,
  description,
  complexity,
  children,
  codeComponent,
  controls,
  visualization,
  consoleOutput
}) => {
  return (
    <div className="search-visualizer-container">
      <div className="search-visualizer-bg-overlay"></div>
      
      {/* Header */}
      <header className="search-visualizer-header">
        <div className="header-navigation">
          <Link to="/" className="nav-button">
            <FaHome size={16} />
            <span>Home</span>
          </Link>
          <Link to="/search-algorithms" className="nav-button">
            <FaArrowLeft size={16} />
            <span>Back to Search Algorithms</span>
          </Link>
        </div>
        
        <div className="header-content">
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="complexity-info">
            <div className="complexity-item">
              <strong>Time Complexity:</strong> {complexity.time}
            </div>
            <div className="complexity-item">
              <strong>Space Complexity:</strong> {complexity.space}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="visualizer-content">
        {/* Left Panel - Visualization and Console */}
        <div className="left-panel">
          {/* Controls Section */}
          <div className="controls-section">
            <h3>Controls</h3>
            {controls}
          </div>

          {/* Visualization Section */}
          <div className="visualization-section">
            <h3>Visualization</h3>
            <div className="visualization-content">
              {visualization}
            </div>
          </div>

          {/* Console Section */}
          <div className="console-section">
            <h3>Algorithm Steps</h3>
            <div className="console-content">
              {consoleOutput}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Viewer */}
        <div className="right-panel">
          <h3>Implementation</h3>
          <div className="code-viewer">
            {codeComponent}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
};

export default SearchVisualizerTemplate;
