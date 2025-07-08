/**
 * Graph Visualizer Template Component
 * 
 * Reusable template for graph algorithm visualizations with:
 * - Split layout: Code viewer (right) and Visualization + Controls (left)
 * - Real-time code highlighting
 * - Interactive controls
 * - Graph visualization area
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import CodeViewer from '../../common/components/CodeViewer';
import GraphControls from './GraphControls';
import GraphVisualization from './GraphVisualization';
import '../styles/GraphVisualizerTemplate.css';

const GraphVisualizerTemplate = ({ 
  algorithmName,
  algorithmCode,
  initialGraph,
  onAlgorithmStep,
  controlsConfig,
  algorithmDescription,
  timeComplexity,
  spaceComplexity
}) => {
  // State management
  const [graph, setGraph] = useState(initialGraph || []);
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [algorithmState, setAlgorithmState] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [visitedEdges, setVisitedEdges] = useState(new Set());

  // Animation callback
  const handleAnimationUpdate = useCallback((lineNumber, step, animating, state = {}) => {
    setCurrentLine(lineNumber);
    setCurrentStep(step);
    setIsAnimating(animating);
    setAlgorithmState(prev => ({ ...prev, ...state }));
    
    // Update visited nodes and edges from algorithm state
    if (state.visitedNodes) {
      setVisitedNodes(new Set(state.visitedNodes));
    }
    if (state.visitedEdges) {
      setVisitedEdges(new Set(state.visitedEdges));
    }
  }, []);

  // Algorithm execution callback
  const handleAlgorithmExecution = useCallback(async (startNode, endNode, config = {}) => {
    if (onAlgorithmStep) {
      setIsPlaying(true);
      setVisitedNodes(new Set());
      setVisitedEdges(new Set());
      await onAlgorithmStep(graph, startNode, endNode, handleAnimationUpdate, config, speed);
      setIsPlaying(false);
    }
  }, [graph, onAlgorithmStep, handleAnimationUpdate, speed]);

  // Graph update callback
  const handleGraphUpdate = useCallback((newGraph) => {
    setGraph(newGraph);
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
    setCurrentLine(0);
    setCurrentStep('');
    setAlgorithmState({});
  }, []);

  // Reset algorithm state
  const handleReset = useCallback(() => {
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
    setCurrentLine(0);
    setCurrentStep('');
    setAlgorithmState({});
    setIsPlaying(false);
    setIsAnimating(false);
  }, []);

  return (
    <div className="graph-visualizer-container">
      <div className="graph-visualizer-bg-overlay"></div>
      
      <motion.header 
        className="graph-visualizer-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="header-navigation">
          <Link to="/" className="nav-button home-button">
            <FaHome size={16} />
            <span>Home</span>
          </Link>
          <Link to="/graphs" className="nav-button back-button">
            <FaArrowLeft size={16} />
            <span>Graphs</span>
          </Link>
        </div>
        
        <div className="header-content">
          <h1>{algorithmName}</h1>
          <p>{algorithmDescription}</p>
          <div className="complexity-info">
            <span className="complexity-item">
              <strong>Time:</strong> {timeComplexity}
            </span>
            <span className="complexity-item">
              <strong>Space:</strong> {spaceComplexity}
            </span>
          </div>
        </div>
      </motion.header>

      <motion.div 
        className="visualizer-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Left Panel - Visualization and Controls */}
        <motion.div 
          className="left-panel"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Controls Section */}
          <div className="controls-section">
            <h3>Controls</h3>
            <GraphControls
              graph={graph}
              onGraphUpdate={handleGraphUpdate}
              onAlgorithmExecute={handleAlgorithmExecution}
              onReset={handleReset}
              isPlaying={isPlaying}
              speed={speed}
              onSpeedChange={setSpeed}
              config={controlsConfig}
              algorithmState={algorithmState}
            />
          </div>

          {/* Visualization Section */}
          <div className="visualization-section">
            <h3>Visualization</h3>
            <GraphVisualization
              graph={graph}
              visitedNodes={visitedNodes}
              visitedEdges={visitedEdges}
              currentStep={currentStep}
              algorithmState={algorithmState}
              isAnimating={isAnimating}
            />
          </div>

          {/* Status Section */}
          {currentStep && (
            <div className="status-section">
              <h4>Current Step</h4>
              <p>{currentStep}</p>
              {Object.keys(algorithmState).length > 0 && (
                <div className="algorithm-state">
                  {Object.entries(algorithmState).map(([key, value]) => (
                    <div key={key} className="state-item">
                      <strong>{key}:</strong> {JSON.stringify(value)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Right Panel - Code Viewer */}
        <motion.div 
          className="right-panel"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3>C Implementation</h3>
          <CodeViewer 
            code={algorithmCode}
            language="c"
            currentLine={currentLine}
            isAnimating={isAnimating}
            theme="dark"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GraphVisualizerTemplate;