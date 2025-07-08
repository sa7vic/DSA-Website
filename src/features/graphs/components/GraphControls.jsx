/**
 * Graph Controls Component
 * 
 * Interactive controls for graph algorithm visualizations:
 * - Graph generation (random, preset, custom)
 * - Algorithm execution controls
 * - Speed control
 * - Node selection for start/end points
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaRandom, 
  FaCog,
  FaPlus,
  FaMinus
} from 'react-icons/fa';

const GraphControls = ({
  graph,
  onGraphUpdate,
  onAlgorithmExecute,
  onReset,
  isPlaying,
  speed,
  onSpeedChange,
  config = {},
  algorithmState = {}
}) => {
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [graphSize, setGraphSize] = useState(6);
  const [graphDensity, setGraphDensity] = useState(0.3);
  const [isWeighted, setIsWeighted] = useState(config.weighted || false);
  const [isDirected, setIsDirected] = useState(config.directed || false);

  // Generate random graph
  const generateRandomGraph = useCallback(() => {
    const newGraph = [];
    for (let i = 0; i < graphSize; i++) {
      newGraph[i] = [];
      for (let j = 0; j < graphSize; j++) {
        if (i !== j && Math.random() < graphDensity) {
          const weight = isWeighted ? Math.floor(Math.random() * 10) + 1 : 1;
          newGraph[i][j] = weight;
          if (!isDirected) {
            newGraph[j] = newGraph[j] || [];
            newGraph[j][i] = weight;
          }
        } else {
          newGraph[i][j] = 0;
        }
      }
    }
    onGraphUpdate(newGraph);
    setStartNode(0);
    setEndNode(graphSize > 1 ? graphSize - 1 : null);
  }, [graphSize, graphDensity, isWeighted, isDirected, onGraphUpdate]);

  // Generate preset graphs
  const generatePresetGraph = useCallback((type) => {
    let newGraph = [];
    
    switch (type) {
      case 'tree':
        // Generate a binary tree-like structure
        newGraph = Array(7).fill().map(() => Array(7).fill(0));
        const treeWeight = isWeighted ? Math.floor(Math.random() * 5) + 1 : 1;
        
        // Create tree edges
        const treeEdges = [
          [0, 1], [0, 2],
          [1, 3], [1, 4],
          [2, 5], [2, 6]
        ];
        
        treeEdges.forEach(([from, to]) => {
          const weight = isWeighted ? Math.floor(Math.random() * 8) + 1 : 1;
          newGraph[from][to] = weight;
          if (!isDirected) {
            newGraph[to][from] = weight;
          }
        });
        break;
        
      case 'complete':
        // Generate complete graph
        const size = 5;
        newGraph = Array(size).fill().map(() => Array(size).fill(0));
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if (i !== j) {
              const weight = isWeighted ? Math.floor(Math.random() * 10) + 1 : 1;
              newGraph[i][j] = weight;
            }
          }
        }
        break;
        
      case 'path':
        // Generate path graph
        const pathSize = 6;
        newGraph = Array(pathSize).fill().map(() => Array(pathSize).fill(0));
        for (let i = 0; i < pathSize - 1; i++) {
          const weight = isWeighted ? Math.floor(Math.random() * 8) + 1 : 1;
          newGraph[i][i + 1] = weight;
          if (!isDirected) {
            newGraph[i + 1][i] = weight;
          }
        }
        break;
        
      default:
        return;
    }
    
    onGraphUpdate(newGraph);
    setStartNode(0);
    setEndNode(newGraph.length > 1 ? newGraph.length - 1 : null);
  }, [isWeighted, isDirected, onGraphUpdate]);

  // Handle algorithm execution
  const handleExecute = useCallback(() => {
    if (graph && graph.length > 0) {
      const validStartNode = Math.max(0, Math.min(startNode, graph.length - 1));
      const validEndNode = endNode !== null ? Math.max(0, Math.min(endNode, graph.length - 1)) : null;
      
      onAlgorithmExecute(validStartNode, validEndNode, {
        weighted: isWeighted,
        directed: isDirected
      });
    }
  }, [graph, startNode, endNode, isWeighted, isDirected, onAlgorithmExecute]);

  return (
    <div className="graph-controls">
      {/* Algorithm Controls */}
      <div className="control-group">
        <h4>Algorithm</h4>
        <div className="button-group">
          <motion.button
            className={`control-button primary ${isPlaying ? 'playing' : ''}`}
            onClick={isPlaying ? onReset : handleExecute}
            disabled={!graph || graph.length === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <FaStop /> : <FaPlay />}
            {isPlaying ? 'Stop' : 'Start'}
          </motion.button>
          
          <motion.button
            className="control-button secondary"
            onClick={onReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
        </div>
      </div>

      {/* Speed Control */}
      <div className="control-group">
        <h4>Speed</h4>
        <div className="speed-control">
          <button onClick={() => onSpeedChange(Math.max(0.1, speed - 0.1))}>
            <FaMinus />
          </button>
          <span>{speed.toFixed(1)}x</span>
          <button onClick={() => onSpeedChange(Math.min(3, speed + 0.1))}>
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Node Selection */}
      <div className="control-group">
        <h4>Nodes</h4>
        <div className="input-group">
          <label>
            Start:
            <select 
              value={startNode} 
              onChange={(e) => setStartNode(parseInt(e.target.value))}
              disabled={isPlaying}
            >
              {graph && graph.map((_, index) => (
                <option key={index} value={index}>Node {index}</option>
              ))}
            </select>
          </label>
          
          {config.needsEndNode && (
            <label>
              End:
              <select 
                value={endNode || ''} 
                onChange={(e) => setEndNode(e.target.value ? parseInt(e.target.value) : null)}
                disabled={isPlaying}
              >
                <option value="">None</option>
                {graph && graph.map((_, index) => (
                  <option key={index} value={index}>Node {index}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      {/* Graph Generation */}
      <div className="control-group">
        <h4>Generate</h4>
        <div className="button-group">
          <motion.button
            className="control-button"
            onClick={generateRandomGraph}
            disabled={isPlaying}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRandom />
          </motion.button>
          
          <motion.button
            className="control-button"
            onClick={() => setShowSettings(!showSettings)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCog />
          </motion.button>
        </div>
        
        <div className="preset-buttons">
          <button onClick={() => generatePresetGraph('tree')}>Tree</button>
          <button onClick={() => generatePresetGraph('complete')}>Complete</button>
          <button onClick={() => generatePresetGraph('path')}>Path</button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div 
          className="settings-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h4>Graph Settings</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <label>
              Size:
              <input
                type="range"
                min="3"
                max="10"
                value={graphSize}
                onChange={(e) => setGraphSize(parseInt(e.target.value))}
                disabled={isPlaying}
              />
              <span>{graphSize} nodes</span>
            </label>
            
            <label>
              Density:
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={graphDensity}
                onChange={(e) => setGraphDensity(parseFloat(e.target.value))}
                disabled={isPlaying}
              />
              <span>{(graphDensity * 100).toFixed(0)}%</span>
            </label>
          </div>
          
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isWeighted}
                onChange={(e) => setIsWeighted(e.target.checked)}
                disabled={isPlaying}
              />
              Weighted
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={isDirected}
                onChange={(e) => setIsDirected(e.target.checked)}
                disabled={isPlaying}
              />
              Directed
            </label>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GraphControls;