import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import '../styles/StackQueueVisualizer.css';

const StackQueueVisualizer = () => {
  const [dataStructure, setDataStructure] = useState('stack');
  const [elements, setElements] = useState([]);
  const [value, setValue] = useState('');
  const [operation, setOperation] = useState('Select Operation');
  const [currentStep, setCurrentStep] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(500); // Default speed (middle value)
  const maxSize = 10;

  useEffect(() => {
    setElements([]);
    setValue('');
    setOperation('Select Operation');
    setCurrentStep('');
    setCurrentLine(0);
  }, [dataStructure]);

  // Convert animation speed slider value to actual delay
  const getAnimationDelay = () => {
    return 1100 - animationSpeed; // Similar to Sorting Visualizer's speed calculation
  };

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

  const pushToStack = () => {
    if (elements.length >= maxSize) {
      setShowError(true);
      setCurrentStep('Stack Overflow! Cannot push more elements.');
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsAnimating(true);
    const delay = getAnimationDelay();
    let step = 0;
    
    const animate = () => {
      switch(step) {
        case 0: // Constructor
          setCurrentLine(3);
          setCurrentStep("Initializing stack");
          break;
        case 1: // Push method definition
          setCurrentLine(14);
          setCurrentStep(`Calling push(${value})`);
          break;
        case 2: // Peek call inside push
          setCurrentLine(15);
          setCurrentStep("Calling peek() to check current top");
          break;
        case 3: // Move to peek definition
          setCurrentLine(5);
          setCurrentStep("Inside peek() method");
          break;
        case 4: // isEmpty check in peek
          setCurrentLine(6);
          setCurrentStep("Checking if stack is empty");
          break;
        case 5: // Show appropriate peek result based on stack state
          if (elements.length === 0) {
            setCurrentLine(7);
            setCurrentStep("Stack is empty");
          } else {
            setCurrentLine(9);
            setCurrentStep(`Current top element: ${elements[elements.length - 1]}`);
          }
          break;
        case 6: // Return to push and perform actual push
          setCurrentLine(16);
          setCurrentStep(`Pushing ${value} to stack`);
          setElements(prev => [...prev, value]);
          break;
        case 7: // Operation complete
          setCurrentLine(16);
          setCurrentStep(`Successfully pushed ${value}`);
          setIsAnimating(false);
          setValue('');
          return;
      }
      step++;
      setTimeout(animate, delay);
    };
    
    animate();
  };

  const popFromStack = () => {
    if (elements.length === 0) {
      setShowError(true);
      setCurrentStep('Stack Underflow! Cannot pop from empty stack.');
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsAnimating(true);
    const delay = getAnimationDelay();
    let step = 0;
    
    const animate = () => {
      switch(step) {
        case 0: // Constructor
          setCurrentLine(3);
          setCurrentStep("Initializing stack");
          break;
        case 1: // Pop method definition
          setCurrentLine(18);
          setCurrentStep("Calling pop()");
          break;
        case 2: // isEmpty check
          setCurrentLine(19);
          setCurrentStep("Checking if stack is empty");
          break;
        case 3: // Show isEmpty result
          if (elements.length === 0) {
            setCurrentLine(20);
            setCurrentStep("Stack is empty");
          } else {
            setCurrentLine(22);
            setCurrentStep("Stack has elements, proceeding with pop");
          }
          break;
        case 4: // Pop operation
          setCurrentLine(22);
          setCurrentStep("Removing top element");
          const poppedValue = elements[elements.length - 1];
          setElements(prev => prev.slice(0, -1));
          setCurrentStep(`Successfully popped ${poppedValue}`);
          break;
        case 5: // Operation complete
          setCurrentLine(23);
          setCurrentStep("Pop operation complete");
          setIsAnimating(false);
          return;
      }
      step++;
      setTimeout(animate, delay);
    };
    
    animate();
  };

  const enqueue = () => {
    if (elements.length >= maxSize) {
      setShowError(true);
      setCurrentStep('Queue is full! Cannot enqueue more elements.');
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsAnimating(true);
    const delay = getAnimationDelay();
    let step = 0;
    
    const animate = () => {
      switch(step) {
        case 0: // Constructor
          setCurrentLine(3);
          setCurrentStep("Initializing queue");
          break;
        case 1: // Enqueue method definition
          setCurrentLine(14);
          setCurrentStep(`Calling enqueue(${value})`);
          break;
        case 2: // Peek call
          setCurrentLine(15);
          setCurrentStep("Calling peek() to check current state");
          break;
        case 3: // Inside peek function
          setCurrentLine(5);
          setCurrentStep("Inside peek() method");
          break;
        case 4: // Peek isEmpty check
          setCurrentLine(6);
          setCurrentStep("Checking if queue is empty");
          break;
        case 5: // Show peek result
          if (elements.length === 0) {
            setCurrentLine(7);
            setCurrentStep("Queue is empty");
          } else {
            setCurrentLine(9);
            setCurrentStep(`Current front element: ${elements[0]}`);
          }
          break;
        case 6: // Return to enqueue and perform operation
          setCurrentLine(16);
          setCurrentStep(`Adding ${value} to queue`);
          setElements(prev => [...prev, value]);
          break;
        case 7: // Operation complete
          setCurrentLine(17);
          setCurrentStep(`Successfully enqueued ${value}`);
          // Add visual feedback by briefly highlighting the element
          const lastIndex = elements.length; // This will be the index of the newly added element
          setIsAnimating(false);
          setValue('');
          return;
      }
      step++;
      setTimeout(animate, delay);
    };
    
    animate();
  };

  const dequeue = () => {
    if (elements.length === 0) {
      setShowError(true);
      setCurrentStep('Queue is empty! Cannot dequeue.');
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsAnimating(true);
    const delay = getAnimationDelay();
    let step = 0;
    
    const animate = () => {
      switch(step) {
        case 0: // Constructor
          setCurrentLine(3);
          setCurrentStep("Initializing queue");
          break;
        case 1: // Dequeue method definition
          setCurrentLine(18);
          setCurrentStep("Calling dequeue()");
          break;
        case 2: // isEmpty check call
          setCurrentLine(19);
          setCurrentStep("Checking if queue is empty");
          break;
        case 3: // Inside isEmpty function
          setCurrentLine(11);
          setCurrentStep("Inside isEmpty() method");
          break;
        case 4: // Length check in isEmpty
          setCurrentLine(12);
          setCurrentStep("Checking array length");
          break;
        case 5: // Show isEmpty result
          if (elements.length === 0) {
            setCurrentLine(20);
            setCurrentStep("Queue is empty");
          } else {
            setCurrentLine(22);
            setCurrentStep("Queue has elements, proceeding with dequeue");
          }
          break;
        case 6: // Dequeue operation
          setCurrentLine(22);
          setCurrentStep("Removing front element");
          const dequeuedValue = elements[0];
          setElements(prev => prev.slice(1));
          setCurrentStep(`Successfully dequeued ${dequeuedValue}`);
          break;
        case 7: // Operation complete
          setCurrentLine(23);
          setCurrentStep("Dequeue operation complete");
          setIsAnimating(false);
          return;
      }
      step++;
      setTimeout(animate, delay);
    };
    
    animate();
  };

  const peekStack = () => {
    setIsAnimating(true);
    const delay = getAnimationDelay();
    let step = 0;
    
    const animate = () => {
      switch(step) {
        case 0: // Constructor
          setCurrentLine(3);
          setCurrentStep("Initializing stack");
          break;
        case 1: // Function definition
          setCurrentLine(5);
          setCurrentStep("Inside peek() method");
          break;
        case 2: // isEmpty check
          setCurrentLine(6);
          setCurrentStep("Checking if stack is empty");
          break;
        case 3: // Move to isEmpty function
          setCurrentLine(11);
          setCurrentStep("Inside isEmpty() method");
          break;
        case 4: // Length check
          setCurrentLine(12);
          setCurrentStep("Checking array length");
          break;
        case 5: // Show appropriate result
          if (elements.length === 0) {
            setCurrentLine(7);
            setCurrentStep("Stack is empty");
          } else {
            setCurrentLine(9);
            setCurrentStep(`Current top element: ${elements[elements.length - 1]}`);
          }
          break;
        case 6: // Operation complete
          setIsAnimating(false);
          return;
      }
      step++;
      setTimeout(animate, delay);
    };
    
    animate();
  };

  const peekQueue = () => {
    setIsAnimating(true);
    const delay = getAnimationDelay();
    
    // Step 1: Highlight the actual function call
    setCurrentLine(14);  // "this.peek()"
    
    // Step 2: Move to function definition
    setCurrentLine(5);   // "peek() {"
    
    // Step 3: Highlight isEmpty call
    setCurrentLine(6);   // "if (this.isEmpty())"
    
    // Step 4: Move to isEmpty function
    setCurrentLine(10);   // "isEmpty() {"
    
    // Step 5: Show the length check
    setCurrentLine(11);  // "return this.items.length === 0"
    
    // Step 6a (if empty): Show empty return
    setCurrentLine(7);   // "return 'Queue is empty'"
    
    // Step 6b (if not empty): Show element access
    setCurrentLine(9);   // "return this.items[0]"

    setTimeout(() => {
      if (elements.length === 0) {
        setTimeout(() => {
          setShowError(true);
          setCurrentLine(7); // Highlight the actual return statement
          setCurrentStep('Queue is empty! Nothing to peek.');
          setTimeout(() => setShowError(false), 3000);
          setIsAnimating(false);
        }, delay);
      } else {
        setTimeout(() => {
          setCurrentLine(9); // Highlight the actual return statement with array access
          setCurrentStep('Getting front element');
          
          const frontElement = elements[0];
          setCurrentStep(`Front element is: ${frontElement}`);
          setIsAnimating(false);
        }, delay);
      }
    }, delay);
  };

  const handleOperation = () => {
    if (!value && ['Push', 'Enqueue'].includes(operation)) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    switch (operation) {
      case 'Push':
        pushToStack();
        break;
      case 'Pop':
        popFromStack();
        break;
      case 'Peek':
        dataStructure === 'stack' ? peekStack() : peekQueue();
        break;
      case 'Enqueue':
        enqueue();
        break;
      case 'Dequeue':
        dequeue();
        break;
      default:
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
    }
  };

  // Get code with optimized formatting to fit in the panel without scrolling
  const getCode = () => {
    if (dataStructure === 'stack') {
      return `class Stack {
  constructor() {
    this.items = [];
  }
  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length == 0;
  }
  push(element) {
    this.peek();  // For visualization
    this.items.push(element);
  }
  pop() {
    if (this.isEmpty()) {
      return "Stack Underflow";
    }
    return this.items.pop();
  }
}`;
    } else {
      return `class Queue {
  constructor() {
    this.items = [];
  }
  peek() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }
  isEmpty() {
    return this.items.length == 0;
  }
  enqueue(element) {
    this.peek();  // For visualization
    this.items.push(element);
  }
  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift();
    }
    return this.items.shift();
  }
}`;
    }
  };

  return (
    <div className="visualizer-container" style={{ 
      paddingBottom: '1rem',
      minHeight: '100vh',
      maxHeight: 'unset', // Allow container to expand beyond viewport height
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto' // Add scrolling for the entire container
    }}>
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
        <h1 className="dynamic-header-title" style={{ 
          flex: 1, 
          textAlign: 'center',
          margin: '0',
          fontSize: '3.2em',
          padding: '0.5rem'
        }}>{dataStructure === 'stack' ? 'Stack' : 'Queue'} Visualizer</h1>
        <motion.button 
          className={`code-panel-toggle ${showCode ? 'active' : ''}`} 
          onClick={() => setShowCode(!showCode)}
          whileHover={{ 
            backgroundColor: 'rgba(56, 139, 253, 0.2)',
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            backgroundColor: 'rgba(56, 139, 253, 0.1)',
            color: '#58a6ff',
            border: '1px solid rgba(56, 139, 253, 0.3)',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {showCode ? 'Hide Code' : 'Show Code'}
        </motion.button>
      </motion.header>

      <div className="controls" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        padding: '1rem',
        backgroundColor: '#161b22',
        borderRadius: '8px',
        border: '1px solid #30363d'
      }}>
        <motion.select 
          value={operation} 
          onChange={(e) => setOperation(e.target.value)}
          disabled={isAnimating}
          whileHover={!isAnimating ? { 
            backgroundColor: '#30363d',
            scale: 1.01,
            transition: { duration: 0.2 }
          } : {}}
          style={{ 
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            paddingLeft: '0.75rem',
            paddingRight: '2rem',
            backgroundColor: '#21262d',
            color: '#c9d1d9',
            border: '1px solid #30363d',
            borderRadius: '6px',
            height: '38px',
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            opacity: isAnimating ? 0.6 : 1,
            transition: 'all 0.2s ease',
            fontSize: '0.9rem',
            fontWeight: '500',
            lineHeight: '1.4',
            verticalAlign: 'middle',
            textAlign: 'left',
            boxShadow: 'inset 0 0 0 0 transparent',
            outline: 'none'
          }}
        >
          <option value="Select Operation">Select Operation</option>
          {dataStructure === 'stack' ? (
            <>
              <option value="Push">Push</option>
              <option value="Pop">Pop</option>
              <option value="Peek">Peek</option>
            </>
          ) : (
            <>
              <option value="Enqueue">Enqueue</option>
              <option value="Dequeue">Dequeue</option>
              <option value="Peek">Peek</option>
            </>
          )}
        </motion.select>

        {['Push', 'Enqueue'].includes(operation) && (
          <motion.input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter value to ${operation.toLowerCase()}`}
            maxLength={3}
            whileFocus={{ 
              borderColor: '#58a6ff',
              scale: 1.01,
              transition: { duration: 0.2 }
            }}
            style={{ 
              backgroundColor: '#21262d',
              color: '#c9d1d9',
              border: '1px solid #30363d',
              borderRadius: '6px',
              padding: '0.75rem',
              height: '38px',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem'
            }}
          />
        )}

        <motion.button 
          onClick={handleOperation}
          disabled={isAnimating}
          className="operation-button"
          whileHover={!isAnimating ? { 
            backgroundColor: '#238636',
            borderColor: '#238636',
            color: 'white',
            scale: 1.02,
            y: -2,
            transition: { duration: 0.2 }
          } : {}}
          whileTap={!isAnimating ? { scale: 0.98 } : {}}
          style={{ 
            backgroundColor: isAnimating ? '#21262d' : '#238636',
            color: '#ffffff',
            border: isAnimating ? '1px solid #30363d' : '1px solid #238636',
            padding: '0.75rem 1.25rem',
            borderRadius: '6px',
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            height: '38px',
            opacity: isAnimating ? 0.6 : 1,
            transition: 'all 0.2s ease',
            fontSize: '0.9rem',
            fontWeight: '700',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isAnimating ? 'Processing...' : 'Execute'}
        </motion.button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginLeft: 'auto'
        }}>
          <label style={{ color: '#8b949e', fontSize: '0.9rem' }}>
            Animation Speed
          </label>
          <motion.input
            type="range"
            min="100"
            max="1000"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
            disabled={isAnimating}
            whileHover={!isAnimating ? { scale: 1.01 } : {}}
            style={{
              width: '150px',
              height: '6px',
              WebkitAppearance: 'none',
              background: '#30363d',
              borderRadius: '3px',
              outline: 'none',
              opacity: isAnimating ? '0.5' : '1',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          />
        </div>

        <div style={{ flex: 1 }}></div>

        <motion.select 
          value={dataStructure} 
          onChange={(e) => setDataStructure(e.target.value)}
          whileHover={{ 
            backgroundColor: '#30363d',
            scale: 1.01,
            transition: { duration: 0.2 }
          }}
          style={{ 
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            paddingLeft: '0.75rem',
            paddingRight: '2rem',
            backgroundColor: '#0d1992',
            color: '#c9d1d9',
            border: '1px solid #1642bd',
            borderRadius: '6px',
            height: '38px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.9rem',
            fontWeight: '500',
            lineHeight: '1.4',
            verticalAlign: 'middle',
            textAlign: 'left',
            boxShadow: 'inset 0 0 0 0 transparent',
            outline: 'none'
          }}
        >
          <option value="stack">Stack</option>
          <option value="queue">Queue</option>
        </motion.select>
      </div>

      {showError && (
        <div className="error-message" style={{ 
          backgroundColor: 'rgba(248, 81, 73, 0.1)',
          color: '#f85149',
          border: '1px solid #f85149'
        }}>
          Please select an operation and provide a value if needed.
        </div>
      )}

      <div className="visualization-area" style={{ 
        display: 'flex', 
        gap: '1rem',
        justifyContent: 'space-between',
        height: 'auto',
        padding: '0.5rem',
        marginBottom: '1px', // Absolute minimum to just touch the success message bar
        position: 'relative' // For proper positioning of child elements
      }}>
        <div className={`structure-container ${dataStructure}`} style={{
          display: 'flex',
          flexDirection: dataStructure === 'stack' ? 'column' : 'row',
          justifyContent: dataStructure === 'stack' ? 'flex-end' : 'center',
          alignItems: 'center',
          minWidth: '600px',
          flex: '1 1 auto',
          height: '750px', // Increased height to fit 10 elements vertically
          overflowX: dataStructure === 'queue' ? 'auto' : 'hidden',
          overflowY: dataStructure === 'stack' ? 'auto' : 'hidden',
          padding: '0.5rem',
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: '#8b949e',
            fontSize: '0.9rem',
            backgroundColor: 'rgba(22, 27, 34, 0.9)',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: '1px solid #30363d',
            zIndex: 10
          }}>
            Size: {elements.length} / {maxSize}
            {dataStructure === 'stack' ? (
              <> | Top: {elements[elements.length - 1] || 'None'}</>
            ) : (
              <> | Front: {elements[0] || 'None'} | Rear: {elements[elements.length - 1] || 'None'}</>
            )}
          </div>
          <AnimatePresence mode="popLayout">
            {(dataStructure === 'stack' ? elements.slice().reverse() : elements).map((element, index) => (
              <motion.div
                key={`${element}-${index}`}
                className="element"
                variants={dataStructure === 'stack' ? stackItemVariants : queueItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                style={{ 
                  backgroundColor: '#5bc9b1',
                  width: dataStructure === 'stack' ? '60%' : '60px',
                  height: dataStructure === 'stack' ? '50px' : '60px',
                  margin: dataStructure === 'stack' ? '0.15rem 0' : '0 0.15rem',
                  zIndex: dataStructure === 'stack' ? elements.length - index : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  color: '#fff'
                }}
              >
                {element}
              </motion.div>
            ))}
          </AnimatePresence>
          {elements.length === 0 && (
            <div className="empty-message" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#8b949e'
            }}>
              {dataStructure === 'stack' ? 'Stack is empty' : 'Queue is empty'}
            </div>
          )}
        </div>

        {showCode && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '0 0 450px', // Slightly wider to fit more code
            minWidth: '450px', 
            maxWidth: '500px',
            position: 'relative',
            height: '600px', // Exact height to match structure container
            marginBottom: '0px' // No margin to ensure it touches the success bar
          }}>
            <div className="code-panel" style={{
              height: '600px', // Exact height to match structure container
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
              position: 'relative',
              overflow: 'hidden', // Hide scrollbars
              display: 'flex',
              flexDirection: 'column'
            }}>
              <SyntaxHighlighter
                language="javascript"
                style={atomDark}
                wrapLines={true}
                showLineNumbers={true}
                lineProps={lineNumber => ({
                  style: { 
                    backgroundColor: lineNumber === currentLine ? '#5bc9b1' : 'transparent',
                    display: 'block',
                    color: lineNumber === currentLine ? '#fff' : undefined
                  }
                })}
                customStyle={{
                  margin: 0,
                  padding: '0px',
                  height: '100%',
                  fontSize: '0.7rem', // Optimal font size for readability in smaller space
                  overflow: 'auto', // Allow scrolling to see all code
                  lineHeight: '1.05', // Tighter line spacing to fit more lines
                  maxHeight: 'none', // No height constraint
                  whiteSpace: 'pre', // Preserve whitespace without wrapping
                  display: 'block'
                }}
              >
                {getCode()}
              </SyntaxHighlighter>
            </div>
            
            {/* Success messages are now displayed in the status panel below instead of here */}
          </div>
        )}
      </div>

      {currentStep && (
        <div className="status-panel" style={{ 
          padding: '0.5rem',
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '8px',
          marginTop: '1px', // Absolute minimum spacing to just touch the visualizer
          position: 'relative',
          zIndex: 5, // Ensure proper stacking with other elements
          animation: currentStep.includes('Successfully') ? 'fadeIn 0.5s ease-in-out' : 'none'
        }}>
          <div className="current-step" style={{ 
            color: currentStep.includes('Successfully') ? '#58a6ff' : '#58a6ff',
            fontSize: '1.1rem',
            textAlign: 'center',
            fontWeight: currentStep.includes('Successfully') ? 'bold' : 'normal'
          }}>
            {currentStep}
          </div>
        </div>
      )}
    </div>
  );
};

export default StackQueueVisualizer; 
