import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaForward, FaBackward, FaCode } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { linearSearch } from '../algorithms/linearSearch';

const LinearSearchVisualizer = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 5, 77, 30]);
  const [target, setTarget] = useState(22);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(1000);
  const [showCode, setShowCode] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);

  const codeViewerRef = useRef(null);

  const cCode = `#include <stdio.h>

int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;  // Found target at index i
        }
    }
    
    return -1; // Target not found
}`;

  const generateRandomArray = () => {
    const size = 8 + Math.floor(Math.random() * 7);
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    setSteps([]);
    setCurrentStep(0);
    setCurrentLine(0);
  };

  const runSearch = () => {
    const result = linearSearch(array, target);
    setSteps(result.steps);
    setCurrentStep(0);
    setCurrentLine(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        
        // Update current line based on step
        const step = steps[currentStep];
        if (step) {
          if (step.found) {
            setCurrentLine(5);
          } else if (step.notFound) {
            setCurrentLine(9);
          } else {
            setCurrentLine(4);
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
    
    const { currentIndex, found, notFound } = currentStepData;
    
    if (found && index === currentIndex) {
      return 'array-item found';
    }
    if (notFound) {
      return 'array-item';
    }
    if (index === currentIndex) {
      return 'array-item current';
    }
    return 'array-item';
  };

  return (
    <div className="linear-search-container">
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
              <h3>Linear Search</h3>
              <div className="complexity-info">
                <div>Time Complexity: <span className="complexity">O(n)</span></div>
                <div>Space Complexity: <span className="complexity">O(1)</span></div>
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
                  transition={{ delay: index * 0.05 }}
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
                  
                  <div className="step-details">
                    <span>Current Index: {currentStepData.currentIndex}</span>
                    <span>Comparing: {currentStepData.comparing} vs {target}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearSearchVisualizer;
