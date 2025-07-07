import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaForward, FaBackward, FaCode } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { binarySearchIterative, binarySearchRecursive } from '../algorithms/binarySearch';

const BinarySearchVisualizer = () => {
  const [array, setArray] = useState([2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78]);
  const [target, setTarget] = useState(23);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [searchType, setSearchType] = useState('iterative');
  const [speed, setSpeed] = useState(1000);
  const [showCode, setShowCode] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);

  const codeViewerRef = useRef(null);

  const cCode = `// Iterative Binary Search
int binarySearchIterative(int arr[], int n, int target) {
    int left = 0, right = n - 1;  
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target)
            return mid;
        if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    return -1; // Target not found
}
// Recursive Binary Search  
int binarySearchRecursive(int arr[], int left, int right, int target) {
    if (left > right)
        return -1;
        
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target)
        return mid;
        
    if (arr[mid] < target)
        return binarySearchRecursive(arr, mid + 1, right, target);
    else
        return binarySearchRecursive(arr, left, mid - 1, target);
}`;

  const generateRandomArray = () => {
    const size = 10 + Math.floor(Math.random() * 5);
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100))
      .sort((a, b) => a - b);
    setArray(newArray);
    setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    setSteps([]);
    setCurrentStep(0);
  };

  const runSearch = () => {
    const result = searchType === 'iterative' 
      ? binarySearchIterative(array, target)
      : binarySearchRecursive(array, target);
    
    setSteps(result.steps);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        
        // Update current line based on search type and step
        const step = steps[currentStep];
        if (step) {
          if (searchType === 'iterative') {
            if (step.found) {
              setCurrentLine(10);
            } else if (step.action.includes('searching right')) {
              setCurrentLine(13);
            } else if (step.action.includes('searching left')) {
              setCurrentLine(15);
            } else {
              setCurrentLine(8);
            }
          } else if (step.found) {
            setCurrentLine(28);
          } else if (step.action.includes('searching right')) {
            setCurrentLine(31);
          } else if (step.action.includes('searching left')) {
            setCurrentLine(33);
          } else {
            setCurrentLine(26);
          }
        }
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed, searchType]);

  const currentStepData = steps[currentStep - 1];

  const getArrayItemStyle = (index) => {
    if (!currentStepData) {
      return 'array-item';
    }
    
    const { left, right, mid, found, notFound } = currentStepData;
    
    if (found && index === mid) {
      return 'array-item found';
    }
    if (notFound) {
      return 'array-item';
    }
    if (index === mid) {
      return 'array-item current';
    }
    if (index >= left && index <= right) {
      return 'array-item active';
    }
    return 'array-item inactive';
  };

  return (
    <div className="binary-search-container">
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

            <div className="search-type">
              <label>
                <input 
                  type="radio" 
                  value="iterative" 
                  checked={searchType === 'iterative'}
                  onChange={(e) => setSearchType(e.target.value)}
                />
                Iterative
              </label>
              <label>
                <input 
                  type="radio" 
                  value="recursive" 
                  checked={searchType === 'recursive'}
                  onChange={(e) => setSearchType(e.target.value)}
                />
                Recursive
              </label>
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
              <h3>C Implementation - {searchType}</h3>
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
              <h3>Binary Search - {searchType}</h3>
              <div className="complexity-info">
                <div>Time Complexity: <span className="complexity">O(log n)</span></div>
                <div>Space Complexity: <span className="complexity">
                  {searchType === 'iterative' ? 'O(1)' : 'O(log n)'}
                </span></div>
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
                  
                  {currentStepData.left !== undefined && (
                    <div className="step-details">
                      <span>Left: {currentStepData.left}</span>
                      <span>Right: {currentStepData.right}</span>
                      <span>Mid: {currentStepData.mid}</span>
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

export default BinarySearchVisualizer;
