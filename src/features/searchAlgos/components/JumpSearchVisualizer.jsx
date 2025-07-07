import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaForward, FaBackward, FaCode } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { jumpSearch } from '../algorithms/jumpSearch';

const JumpSearchVisualizer = () => {
  const [array, setArray] = useState([2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78, 89, 95]);
  const [target, setTarget] = useState(23);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(1000);
  const [showCode, setShowCode] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);

  const codeViewerRef = useRef(null);

  const cCode = `#include <stdio.h>
#include <math.h>

int jumpSearch(int arr[], int n, int target) {
    int jumpSize = sqrt(n);
    int left = 0;
    int right = 0;
    
    // Jump phase - find the block
    while (right < n && arr[right] < target) {
        left = right;
        right += jumpSize;
    }
    
    // Linear search within the block
    for (int i = left; i < min(right, n); i++) {
        if (arr[i] == target) {
            return i;  // Found target
        }
        if (arr[i] > target) {
            return -1; // Target not found
        }
    }
    
    return -1; // Target not found
}`;

  const generateRandomArray = () => {
    const size = 12 + Math.floor(Math.random() * 6);
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100))
      .sort((a, b) => a - b);
    setArray(newArray);
    setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    setSteps([]);
    setCurrentStep(0);
    setCurrentLine(0);
  };

  const runSearch = () => {
    const result = jumpSearch(array, target);
    setSteps(result.steps);
    setCurrentStep(0);
    setCurrentLine(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        
        // Update current line based on step phase
        const step = steps[currentStep];
        if (step) {
          if (step.phase === 'jumping') {
            setCurrentLine(10);
          } else if (step.phase === 'linear_start') {
            setCurrentLine(15);
          } else if (step.phase === 'linear') {
            setCurrentLine(16);
          }
        }
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const currentStepData = steps[currentStep - 1];

  const getArrayItemStyle = (index) => {
    if (!currentStepData) {
      return 'array-item';
    }
    
    const { phase, left, right, current, found, notFound } = currentStepData;
    
    if (found && index === current) {
      return 'array-item found';
    }
    if (notFound) {
      return 'array-item';
    }
    if (index === current) {
      return 'array-item current';
    }
    if (phase === 'jumping' && index === right) {
      return 'array-item jump-target';
    }
    if (phase === 'linear' && index >= left && index < right) {
      return 'array-item active';
    }
    if (phase === 'jumping' && index === left) {
      return 'array-item jump-start';
    }
    return 'array-item';
  };

  const jumpSize = Math.floor(Math.sqrt(array.length));

  return (
    <div className="jump-search-container">
      <div className="main-layout">
        {/* Controls Section */}
        <div className="controls-section">
          <div className="array-controls">
            <button onClick={generateRandomArray} className="control-btn">
              <FaRedo /> Generate Array
            </button>
            
            <div className="target-input">
              <label>Target: </label>
              <input 
                type="number" 
                value={target} 
                onChange={(e) => setTarget(parseInt(e.target.value))}
                className="target-input-field"
              />
            </div>

            <button 
              onClick={() => setShowCode(!showCode)} 
              className="control-btn"
            >
              <FaCode /> {showCode ? 'Hide' : 'Show'} Code
            </button>
          </div>

          <div className="playback-controls">
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="control-btn"
            >
              <FaBackward />
            </button>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={steps.length === 0}
              className="control-btn primary"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            
            <button 
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              disabled={currentStep >= steps.length}
              className="control-btn"
            >
              <FaForward />
            </button>
            
            <button onClick={runSearch} className="control-btn">
              Start Search
            </button>
          </div>

          <div className="speed-control">
            <label>Speed: </label>
            <input 
              type="range" 
              min="200" 
              max="2000" 
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="speed-slider"
            />
            <span>{speed}ms</span>
          </div>
        </div>

        <div className="content-layout">
          {/* Code Section */}
          {showCode && (
            <div className="code-section">
              <h3>C Implementation</h3>
              <div className="code-viewer" ref={codeViewerRef}>
                <SyntaxHighlighter
                  language="c"
                  style={vscDarkPlus}
                  wrapLines={true}
                  showLineNumbers={true}
                  lineNumberStyle={{ color: '#6a737d' }}
                  wrapLongLines={true}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    height: '100%',
                    overflow: 'auto',
                    background: 'rgba(13, 17, 23, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '8px'
                  }}
                  lineProps={lineNumber => ({
                    style: { 
                      backgroundColor: lineNumber === currentLine ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                      display: 'block',
                      color: lineNumber === currentLine ? '#fff' : undefined,
                    }
                  })}
                >
                  {cCode}
                </SyntaxHighlighter>
              </div>
            </div>
          )}

          {/* Visualization Section */}
          <div className="visualization-section">
            <div className="algorithm-info">
              <h3>Jump Search</h3>
              <div className="complexity-info">
                <div>Time Complexity: <span className="complexity">O(√n)</span></div>
                <div>Space Complexity: <span className="complexity">O(1)</span></div>
                <div>Jump Size: <span className="complexity">√{array.length} = {jumpSize}</span></div>
              </div>
            </div>

            <div className="array-container">
              {array.map((value, index) => (
                <motion.div
                  key={index}
                  className={getArrayItemStyle(index)}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="array-value">{value}</div>
                  <div className="array-index">{index}</div>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {currentStepData && (
                <motion.div 
                  className="step-info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="step-description">
                    <strong>Step {currentStep}:</strong> {currentStepData.action}
                  </div>
                  
                  {currentStepData.phase === 'jumping' && (
                    <div className="step-details">
                      <span>Phase: Jumping</span>
                      <span>Jump Size: {jumpSize}</span>
                      <span>Current Block: [{currentStepData.left}, {currentStepData.right}]</span>
                    </div>
                  )}
                  
                  {currentStepData.phase === 'linear' && (
                    <div className="step-details">
                      <span>Phase: Linear Search</span>
                      <span>Block: [{currentStepData.left}, {currentStepData.right})</span>
                      <span>Current: {currentStepData.current}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JumpSearchVisualizer;
