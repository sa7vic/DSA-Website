import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Link } from 'react-router-dom';
import { FaHome, FaPlus, FaTrash, FaEye } from 'react-icons/fa';
import CurrentOperationDisplay from './CurrentOperationDisplay';
import '../styles/StackQueueVisualizer.css';
import '../styles/CurrentOperationDisplay.css';
import { ANIMATION_SPEEDS, COLORS } from '../../../constants';
import { debounce, isValidInput, showErrorMessage as showErrorHelper } from '../../../utils/helpers';

const StackQueueVisualizer = () => {
  // Optimized state management
  const [dataStructure, setDataStructure] = useState('stack');
  const [elements, setElements] = useState([]);
  const [value, setValue] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(ANIMATION_SPEEDS.MEDIUM);
  const [loading, setLoading] = useState(false);
  const maxSize = 10;
  
  // Ref for auto-scrolling to highlighted lines
  const codeViewerRef = useRef(null);

  // Error handling with auto-clear
  const showErrorMessage = useCallback((message) => {
    setShowError(true);
    setErrorMessage(message);
    const timeoutId = setTimeout(() => {
      setShowError(false);
      setErrorMessage('');
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Memoized validation
  const isValidElementValue = useMemo(() => {
    return isValidInput(value) && value.trim().length > 0 && value.trim().length <= 3;
  }, [value]);

  // Reset state when data structure changes
  useEffect(() => {
    setElements([]);
    setValue('');
    setCurrentStep('');
    setCurrentLine(0);
    setShowError(false);
    setErrorMessage('');
  }, [dataStructure]);

  // Convert animation speed slider value to actual delay
  const getAnimationDelay = useCallback(() => {
    // Ensure reasonable delay times - minimum 1000ms to see the steps clearly
    return Math.max(1000, 2100 - animationSpeed); // Increased min delay to 1000ms for debugging
  }, [animationSpeed]);

  // Auto-scroll to highlighted line in code viewer
  useEffect(() => {
    if (codeViewerRef.current && currentLine > 0 && isAnimating) {
      const codeElement = codeViewerRef.current.querySelector('code');
      if (codeElement) {
        const lines = codeElement.querySelectorAll('span[style*="display: block"]');
        if (lines[currentLine - 1]) {
          lines[currentLine - 1].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }
  }, [currentLine, isAnimating]);

  const stackItemVariants = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  };

  const queueItemVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  };

  // Enhanced push operation with validation
  const pushToStack = useCallback(async () => { // Make the function async
    if (!isValidElementValue) {
      showErrorMessage('Please enter a valid value (1-3 characters)');
      return;
    }
    
    if (elements.length >= maxSize) {
      showErrorMessage(`Maximum size reached (${maxSize})`);
      return;
    }
    
    setIsAnimating(true);
    setLoading(true);
    const delay = getAnimationDelay();

    // Helper function for animated steps, defined within useCallback to capture necessary scope
    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message);
        setCurrentLine(line);
        if (action) {
          action(); // Execute actions like setElements
        }
        // Allow time for React to render the state updates and for the user to see the step
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting push operation...");
    setCurrentLine(0); 
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing stack object", 11);
    await performAnimatedStep(`Calling push(${value})`, 32);
    await performAnimatedStep("Checking current state with peek()", 34);
    await performAnimatedStep("Inside peek() method", 24);
    await performAnimatedStep("Checking if stack is empty", 25);

    if (elements.length === 0) {
      await performAnimatedStep("Stack is empty (result of peek)", 26);
    } else {
      await performAnimatedStep(`Stack not empty, top is ${elements[elements.length - 1]} (result of peek)`, 28);
    }

    await performAnimatedStep(`Adding ${value} to stack`, 37, () => {
      setElements(prev => [...prev, value]);
    });
    
    await performAnimatedStep(`Successfully pushed ${value}`, 38);

    setIsAnimating(false);
    setLoading(false);
    setValue('');
    setTimeout(() => {
      setCurrentStep('');
      setCurrentLine(0);
    }, 2000);

  }, [
    value, 
    elements, 
    isValidElementValue, 
    getAnimationDelay, 
    showErrorMessage, 
    maxSize, 
    setCurrentStep, 
    setCurrentLine, 
    setElements, 
    setValue, 
    setIsAnimating, 
    setLoading
  ]);

  // Enhanced pop operation with validation
  const popFromStack = useCallback(async () => {
    if (elements.length === 0) {
      showErrorMessage('Stack is empty! Cannot pop.');
      return;
    }

    setIsAnimating(true);
    setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message);
        setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting pop operation...");
    setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing stack object", 11);
    await performAnimatedStep("Calling pop()", 42);
    await performAnimatedStep("Checking if stack is empty", 43);
    await performAnimatedStep("Inside isEmpty() method", 14);
    await performAnimatedStep("Checking if items vector is empty", 15);

    await performAnimatedStep("Stack has elements, proceeding with pop", 46);
    
    const poppedValue = elements[elements.length - 1];
    await performAnimatedStep(`Getting top element: ${poppedValue}`, 46);

    await performAnimatedStep("Removing top element", 47, () => {
      setElements(prev => prev.slice(0, -1));
    });
    
    await performAnimatedStep("Pop operation complete", 48);

    setIsAnimating(false);
    setLoading(false);
    setTimeout(() => {
      setCurrentStep('');
      setCurrentLine(0);
    }, 2000);
  }, [
    elements, 
    getAnimationDelay, 
    showErrorMessage, 
    setCurrentStep, 
    setCurrentLine, 
    setElements, 
    setIsAnimating, 
    setLoading
  ]);

  // Enhanced enqueue operation with validation
  const enqueue = useCallback(async () => {
    if (!isValidElementValue) {
      showErrorMessage('Please enter a valid value (1-3 characters)');
      return;
    }

    if (elements.length >= maxSize) {
      showErrorMessage('Queue is full! Cannot enqueue more elements.');
      return;
    }

    setIsAnimating(true);
    setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message);
        setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting enqueue operation...");
    setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing queue object", 11);
    await performAnimatedStep(`Calling enqueue(${value})`, 32);
    await performAnimatedStep("Checking current state with peek()", 34);
    await performAnimatedStep("Inside peek() method", 24);
    await performAnimatedStep("Checking if queue is empty", 25);

    if (elements.length === 0) {
      await performAnimatedStep("Queue is empty (result of peek)", 26);
    } else {
      await performAnimatedStep(`Current front element: ${elements[0]} (result of peek)`, 28);
    }
    
    await performAnimatedStep(`Adding ${value} to queue`, 37, () => {
      setElements(prev => [...prev, value]);
    });
    
    await performAnimatedStep(`Successfully enqueued ${value}`, 38);

    setIsAnimating(false);
    setLoading(false);
    setValue('');
    setTimeout(() => {
      setCurrentStep('');
      setCurrentLine(0);
    }, 2000);
  }, [
    value, 
    elements, 
    isValidElementValue, 
    getAnimationDelay, 
    showErrorMessage, 
    maxSize, 
    setCurrentStep, 
    setCurrentLine, 
    setElements, 
    setValue, 
    setIsAnimating, 
    setLoading
  ]);

  // Enhanced dequeue operation with validation
  const dequeue = useCallback(async () => {
    if (elements.length === 0) {
      showErrorMessage('Queue is empty! Cannot dequeue.');
      return;
    }

    setIsAnimating(true);
    setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message);
        setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting dequeue operation...");
    setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing queue object", 11);
    await performAnimatedStep("Calling dequeue()", 42);
    await performAnimatedStep("Checking if queue is empty", 43);
    await performAnimatedStep("Inside isEmpty() method", 14);
    await performAnimatedStep("Checking if items vector is empty", 15);

    await performAnimatedStep("Queue has elements, proceeding with dequeue", 46);
    
    const dequeuedValue = elements[0];
    await performAnimatedStep(`Getting front element: ${dequeuedValue}`, 46);

    await performAnimatedStep("Removing front element", 47, () => {
      setElements(prev => prev.slice(1));
    });
    
    await performAnimatedStep("Dequeue operation complete", 48);

    setIsAnimating(false);
    setLoading(false);
    setTimeout(() => {
      setCurrentStep('');
      setCurrentLine(0);
    }, 2000);
  }, [
    elements, 
    getAnimationDelay, 
    showErrorMessage, 
    setCurrentStep, 
    setCurrentLine, 
    setElements, 
    setIsAnimating, 
    setLoading
  ]);

  // Enhanced peek operations
  const peekStack = useCallback(async () => {
    setIsAnimating(true);
    setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message);
        setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting peek operation...");
    setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));

    await performAnimatedStep("Initializing stack object", 11);
    await performAnimatedStep("Inside peek() method", 24);
    await performAnimatedStep("Checking if stack is empty", 25);
    await performAnimatedStep("Inside isEmpty() method", 14);
    await performAnimatedStep("Checking if items vector is empty", 15);

    if (elements.length === 0) {
      await performAnimatedStep("Stack is empty - nothing to peek", 26);
    } else {
      await performAnimatedStep(`Current top element: ${elements[elements.length - 1]}`, 28);
    }

    setIsAnimating(false);
    setLoading(false);
    setTimeout(() => {
      setCurrentStep('');
      setCurrentLine(0);
    }, 2000);
  }, [
    elements, 
    getAnimationDelay, 
    setCurrentStep, 
    setCurrentLine, 
    setIsAnimating, 
    setLoading
  ]);

  const peekQueue = useCallback(async () => {
    setIsAnimating(true);
    setLoading(true);
    const delay = getAnimationDelay();

    const performAnimatedStep = (message, line, action = null) => {
      return new Promise(resolve => {
        setCurrentStep(message);
        setCurrentLine(line);
        if (action) action();
        setTimeout(resolve, delay);
      });
    };

    setCurrentStep("Starting peek operation...");
    setCurrentLine(0);
    await new Promise(r => setTimeout(r, delay));
    
    await performAnimatedStep("Initializing queue object", 11);
    await performAnimatedStep("Inside peek() method", 24);
    await performAnimatedStep("Checking if queue is empty", 25);
    await performAnimatedStep("Inside isEmpty() method", 14);
    await performAnimatedStep("Checking if items vector is empty", 15);

    if (elements.length === 0) {
      await performAnimatedStep("Queue is empty - nothing to peek", 26);
    } else {
      await performAnimatedStep(`Current front element: ${elements[0]}`, 28);
    }

    setIsAnimating(false);
    setLoading(false);
    setTimeout(() => {
      setCurrentStep('');
      setCurrentLine(0);
    }, 2000);
  }, [
    elements, 
    getAnimationDelay, 
    setCurrentStep, 
    setCurrentLine, 
    setIsAnimating, 
    setLoading
  ]);

  // Get C++ code with optimized formatting and good commenting
  const getCode = () => {
    if (dataStructure === 'stack') {
      return `#include <iostream>
#include <vector>
#include <stdexcept>

class Stack {
private:
    std::vector<int> items;  // Dynamic array to store stack elements
    
public:
    // Constructor: Initialize empty stack
    Stack() {}
    
    // Check if stack is empty
    bool isEmpty() const {
        return items.empty();
    }
    
    // Get size of stack
    size_t size() const {
        return items.size();
    }
    
    // View top element without removing it
    int peek() const {
        if (isEmpty()) {
            throw std::runtime_error("Stack is empty");
        }
        return items.back();  // Get last element
    }
    
    // Add element to top of stack
    void push(int element) {
        // Check current state for visualization
        if (!isEmpty()) {
            std::cout << "Current top: " << peek() << std::endl;
        }
        items.push_back(element);  // Add to end of vector
        std::cout << "Pushed " << element << " to stack" << std::endl;
    }
    
    // Remove and return top element
    int pop() {
        if (isEmpty()) {
            throw std::runtime_error("Stack Underflow: Cannot pop from empty stack");
        }
        int topElement = items.back();  // Get top element
        items.pop_back();               // Remove top element
        std::cout << "Popped " << topElement << " from stack" << std::endl;
        return topElement;
    }
    
    // Display all stack elements (top to bottom)
    void display() const {
        if (isEmpty()) {
            std::cout << "Stack is empty" << std::endl;
            return;
        }
        std::cout << "Stack (top to bottom): ";
        for (int i = items.size() - 1; i >= 0; i--) {
            std::cout << items[i] << " ";
        }
        std::cout << std::endl;
    }
};

// Example usage
int main() {
    Stack myStack;
    myStack.push(10);
    myStack.push(20);
    myStack.display();
    return 0;
}`;
    } else {
      return `#include <iostream>
#include <vector>
#include <stdexcept>

class Queue {
private:
    std::vector<int> items;  // Dynamic array to store queue elements
    
public:
    // Constructor: Initialize empty queue
    Queue() {}
    
    // Check if queue is empty
    bool isEmpty() const {
        return items.empty();
    }
    
    // Get size of queue
    size_t size() const {
        return items.size();
    }
    
    // View front element without removing it
    int peek() const {
        if (isEmpty()) {
            throw std::runtime_error("Queue is empty");
        }
        return items.front();  // Get first element
    }
    
    // Add element to rear of queue
    void enqueue(int element) {
        // Check current state for visualization
        if (!isEmpty()) {
            std::cout << "Current front: " << peek() << std::endl;
        }
        items.push_back(element);  // Add to end of vector
        std::cout << "Enqueued " << element << " to queue" << std::endl;
    }
    
    // Remove and return front element
    int dequeue() {
        if (isEmpty()) {
            throw std::runtime_error("Queue is empty: Cannot dequeue from empty queue");
        }
        int frontElement = items.front();  // Get front element
        items.erase(items.begin());        // Remove first element
        std::cout << "Dequeued " << frontElement << " from queue" << std::endl;
        return frontElement;
    }
    
    // Display all queue elements (front to rear)
    void display() const {
        if (isEmpty()) {
            std::cout << "Queue is empty" << std::endl;
            return;
        }
        std::cout << "Queue (front to rear): ";
        for (const int& element : items) {
            std::cout << element << " ";
        }
        std::cout << std::endl;
    }
};

// Example usage
int main() {
    Queue myQueue;
    myQueue.enqueue(10);
    myQueue.enqueue(20);
    myQueue.display();
    return 0;
}`;
    }
  };

  return (
    <div className="app-container">
      
      <motion.header 
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="home-button">
          <FaHome size={18} />
          <span>Home</span>
        </Link>
        <h1 style={{ flex: 1, textAlign: 'center' }}>
          {dataStructure === 'stack' ? 'Stack' : 'Queue'} Visualizer
        </h1>
      </motion.header>

      <motion.div 
        className="split-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div 
          className="panel panel-left"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>{dataStructure === 'stack' ? 'C++ Stack' : 'C++ Queue'} Implementation</h2>
          <div className="code-viewer" ref={codeViewerRef}>
            <SyntaxHighlighter
              language="cpp"
              style={vs2015}
              wrapLines={true}
              showLineNumbers={true}
              lineNumberStyle={{ color: '#6a737d' }}
              wrapLongLines={true}
              codeTagProps={{
                style: {
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: '0.9rem'
                }
              }}
              customStyle={{
                margin: 0,
                padding: '1rem',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                height: '100%',
                overflow: 'auto',
                background: '#1e1e1e'
              }}
              lineProps={lineNumber => ({
                style: { 
                  backgroundColor: lineNumber === currentLine ? 'rgba(88, 166, 255, 0.3)' : 'transparent',
                  display: 'block',
                  color: lineNumber === currentLine ? '#fff' : undefined,
                  fontWeight: lineNumber === currentLine ? 'bold' : 'normal'
                }
              })}
            >
              {getCode()}
            </SyntaxHighlighter>
          </div>
        </motion.div>

        <motion.div 
          className="panel panel-right"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Interactive Visualization</h2>
          
          {/* Controls */}
          <div className="controls">
            <div className="control-group">
              <select 
                value={dataStructure} 
                onChange={(e) => setDataStructure(e.target.value)}
                disabled={isAnimating}
                className="control-select"
              >
                <option value="stack">Stack</option>
                <option value="queue">Queue</option>
              </select>
              
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value.slice(0, 3))}
                placeholder="Enter node data"
                disabled={isAnimating || loading}
                maxLength={3}
                className="control-input"
              />
            </div>

            <div className="control-group">
              {dataStructure === 'stack' ? (
                <>
                  <button 
                    onClick={pushToStack}
                    disabled={isAnimating || loading || !isValidElementValue}
                    className="control-button"
                    title="Add element to top of stack"
                  >
                    <FaPlus /> Push
                  </button>
                  <button 
                    onClick={popFromStack}
                    disabled={isAnimating || loading || elements.length === 0}
                    className="control-button"
                    title="Remove element from top of stack"
                  >
                    <FaTrash /> Pop
                  </button>
                  <button 
                    onClick={peekStack}
                    disabled={isAnimating || loading}
                    className="control-button"
                    title="View top element"
                  >
                    <FaEye /> Peek
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={enqueue}
                    disabled={isAnimating || loading || !isValidElementValue}
                    className="control-button"
                    title="Add element to rear of queue"
                  >
                    <FaPlus /> Enqueue
                  </button>
                  <button 
                    onClick={dequeue}
                    disabled={isAnimating || loading || elements.length === 0}
                    className="control-button"
                    title="Remove element from front of queue"
                  >
                    <FaTrash /> Dequeue
                  </button>
                  <button 
                    onClick={peekQueue}
                    disabled={isAnimating || loading}
                    className="control-button"
                    title="View front element"
                  >
                    <FaEye /> Peek
                  </button>
                </>
              )}
            </div>

            <div className="slider-group">
              <label>Animation Speed</label>
              <input
                type="range"
                min="100"
                max="1000"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                disabled={isAnimating}
                className="speed-slider"
              />
              <span>{animationSpeed}ms</span>
            </div>
            
            {/* Animation status - moved outside slider group to prevent overflow */}
            {isAnimating && (
              <div className="animation-status">
                <div className="spinner"></div>
                <span>Animating...</span>
              </div>
            )}
          </div>

          {/* Error display */}
          {showError && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          {/* Unified Current Operation Display */}
          {(isAnimating || currentStep) && (
            <CurrentOperationDisplay 
              currentStep={currentStep || (isAnimating ? 'Processing step...' : '')}
              isAnimating={isAnimating}
              loading={loading}
            />
          )}
          
          {/* Visualization Area */}
          <div className={`structure-visualization ${dataStructure}`}>
            <div className="structure-info">
              <span>Size: {elements.length} / {maxSize}</span>
              {dataStructure === 'stack' ? (
                <span> | Top: {elements[elements.length - 1] || 'None'}</span>
              ) : (
                <span> | Front: {elements[0] || 'None'} | Rear: {elements[elements.length - 1] || 'None'}</span>
              )}
            </div>
            
            <div className={`structure-container ${dataStructure} ${elements.length > 0 ? 'has-elements' : ''}`}>
              <AnimatePresence mode="popLayout">
                {elements.map((element, index) => (
                  <motion.div
                    key={`${element}-${index}-${dataStructure}`}
                    className="element"
                    variants={dataStructure === 'stack' ? stackItemVariants : queueItemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    {element}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {elements.length === 0 && (
                <div className="placeholder">
                  <p>{dataStructure === 'stack' ? 'Stack is empty' : 'Queue is empty'}</p>
                  <small>
                    {dataStructure === 'stack' 
                      ? 'Use Push to add elements to the top' 
                      : 'Use Enqueue to add elements to the rear'
                    }
                  </small>
                </div>
              )}
            </div>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default StackQueueVisualizer;
