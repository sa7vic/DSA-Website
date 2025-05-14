import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { FaHome, FaRandom, FaSortAmountDown, FaSlidersH } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/Sorting.css';
import '../styles/control-section.css';

// CodeHighlighter component using react-syntax-highlighter with auto-scroll to highlighted line
const CodeHighlighter = ({ code, currentLine }) => {
  const codeContainerRef = useRef(null);
  
  if (!code) return null;
  
  // Custom renderer to add line highlighting
  const lineProps = (lineNumber) => {
    const style = {
      display: 'block',
      padding: '0 0.5rem',
      width: '100%',
    };
    
    // Check if this is the line that needs highlighting
    if (currentLine === lineNumber) {
      return {
        style: {
          ...style,
          backgroundColor: 'rgba(88, 166, 255, 0.1)', 
          borderLeft: '2px solid #58a6ff',
          paddingLeft: '1rem',
        },
        className: 'highlight-line',
      };
    }
    
    return { style };
  };
  
  // Effect to scroll to the highlighted line when it changes
  useEffect(() => {
    if (!currentLine || !codeContainerRef.current) return;
    
    // Find the highlighted line element
    const highlightedLine = codeContainerRef.current.querySelector('.highlight-line');
    
    if (highlightedLine) {
      // Scroll the highlighted line into view with smooth behavior
      highlightedLine.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentLine, code]);
  
  return (
    <div 
      className="algorithm-code"
      ref={codeContainerRef}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
    >
      <SyntaxHighlighter
        language="javascript"
        style={atomDark}
        wrapLines={true}
        showLineNumbers={true}
        lineProps={lineNumber => lineProps(lineNumber)}
        customStyle={{
          margin: 0,
          padding: '0.75rem',
          borderRadius: '6px',
          backgroundColor: '#0d1117',
          fontSize: '0.85rem',
          lineHeight: '1.5',
          height: 'auto', 
          overflow: 'visible',
          flex: 1,
          minHeight: '300px'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// Spring animation configuration for smooth transitions
const springAnim = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

// Import the sorting algorithms
const selectionSort = (arr, length) => {
  var results = [];
  var currentStep = ""; // Track the current operation for the verbose explanation
  
  for (let i = 0; i < length; i++) {
    let min = i;
    arr[i].style = "bar-swap";
    currentStep = `Finding minimum element starting from position ${i+1}`;
    results.push({
      array: JSON.parse(JSON.stringify(arr)),
      step: currentStep
    });
    
    for (let j = i + 1; j < length; j++) {
      if (arr[j].value < arr[min].value) {
        arr[min].style = "bar";
        min = j;
        currentStep = `Found new minimum at position ${j+1}`;
      }
      arr[j].style = "bar-swap";
      arr[min].style = "bar-min";
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: currentStep
      });
      arr[j].style = "bar";
    }
    
    arr[i].style = "bar";
    currentStep = `Swapping minimum (${arr[min].value}) with position ${i+1} (${arr[i].value})`;
    [arr[i], arr[min]] = [arr[min], arr[i]];
    arr[i].style = "bar-sorted";
    results.push({
      array: JSON.parse(JSON.stringify(arr)),
      step: currentStep
    });
  }
  
  currentStep = "Array sorted successfully!";
  results.push({
    array: JSON.parse(JSON.stringify(arr)),
    step: currentStep
  });
  return results;
};

const mergeSort = (arr, length) => {
  var results = [];
  var currentStep = "";
  
  const sort = (arr, l, r) => {
    if (l < r) {
      let m = Math.floor(l + (r - l) / 2);
      
      currentStep = `Dividing array from index ${l} to ${r}`;
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: currentStep
      });
      
      sort(arr, l, m);
      sort(arr, m + 1, r);
      
      currentStep = `Merging subarrays from index ${l} to ${m} and ${m+1} to ${r}`;
      merge(arr, l, m, r);
      
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: currentStep
      });
    }
  };
  
  const merge = (arr, l, m, r) => {
    let temp_left = [];
    let temp_right = [];

    for (let i = l; i <= m; i++) {
      temp_left.push(JSON.parse(JSON.stringify(arr[i])));
    }
    for (let i = m + 1; i <= r; i++) {
      temp_right.push(JSON.parse(JSON.stringify(arr[i])));
    }

    var i = 0, j = 0, k = l;
    var n1 = m - l + 1;
    var n2 = r - m;
    
    currentStep = `Comparing and merging elements from both subarrays`;
    
    while (i < n1 && j < n2) {
      if (temp_left[i].value <= temp_right[j].value) {
        arr[k] = temp_left[i];
        arr[k].style = "bar-swap";
        i++;
      } else {
        arr[k] = temp_right[j];
        arr[k].style = "bar-swap";
        j++;
      }
      k++;
      
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: currentStep
      });
    }
    
    while (i < n1) {
      arr[k] = temp_left[i];
      arr[k].style = "bar-swap";
      k++;
      i++;
      
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: `Adding remaining elements from left subarray`
      });
    }
    
    while (j < n2) {
      arr[k] = temp_right[j];
      arr[k].style = "bar-swap";
      k++;
      j++;
      
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: `Adding remaining elements from right subarray`
      });
    }
  };

  sort(arr, 0, length - 1);
  
  arr.forEach(element => {
    element.style = "bar-sorted";
  });
  
  currentStep = "Array sorted successfully!";
  results.push({
    array: JSON.parse(JSON.stringify(arr)),
    step: currentStep
  });
  
  return results;
};

const quickSort = (arr, length) => {
  var results = [];
  var currentStep = "";
  
  const sort = (arr, low, high) => {
    if (low < high) {
      currentStep = `Selecting pivot at position ${high+1} with value ${arr[high].value}`;
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: currentStep
      });
      
      var pi = partition(arr, low, high);
      
      sort(arr, low, pi - 1);
      sort(arr, pi + 1, high);
    }
  };

  const partition = (arr, low, high) => {
    let pivot = arr[high];
    arr[high].style = "bar-min";
    
    results.push({
      array: JSON.parse(JSON.stringify(arr)),
      step: `Partitioning: pivot = ${pivot.value}`
    });
    
    var i = low - 1;
    
    for (let j = low; j < high; j++) {
      arr[j].style = "bar-swap";
      
      currentStep = `Comparing ${arr[j].value} with pivot ${pivot.value}`;
      results.push({
        array: JSON.parse(JSON.stringify(arr)),
        step: currentStep
      });
      
      if (arr[j].value < pivot.value) {
        i++;
        currentStep = `Element ${arr[j].value} is less than pivot, swapping with position ${i+1}`;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        
        results.push({
          array: JSON.parse(JSON.stringify(arr)),
          step: currentStep
        });
      }
      
      arr[j].style = "bar";
    }
    
    arr[high].style = "bar";
    currentStep = `Placing pivot ${pivot.value} at its correct position`;
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    results.push({
      array: JSON.parse(JSON.stringify(arr)),
      step: currentStep
    });
    
    return i + 1;
  };

  sort(arr, 0, length - 1);
  
  arr.forEach(element => {
    element.style = "bar-sorted";
  });
  
  currentStep = "Array sorted successfully!";
  results.push({
    array: JSON.parse(JSON.stringify(arr)),
    step: currentStep
  });
  
  return results;
};

// Algorithm explanations for educational purposes
const algorithmInfo = {
  "Selection Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Selection sort works by repeatedly finding the minimum element from the unsorted part and putting it at the beginning.",
    pseudocode: `function selectionSort(arr):
  n = length(arr)
  
  for i from 0 to n-1:
    min_idx = i
    
    for j from i+1 to n-1:
      if arr[j] < arr[min_idx]:
        min_idx = j
    
    swap arr[i] with arr[min_idx]
    
  return arr`
  },
  "Merge Sort": {
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Merge sort is a divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.",
    pseudocode: `function mergeSort(arr):
  if length(arr) <= 1:
    return arr
    
  mid = length(arr) / 2
  left = mergeSort(arr[0...mid-1])
  right = mergeSort(arr[mid...n])
  
  return merge(left, right)
  
function merge(left, right):
  result = []
  i = 0, j = 0
  
  while i < length(left) and j < length(right):
    if left[i] <= right[j]:
      append left[i] to result
      i++
    else:
      append right[j] to result
      j++
      
  append remaining elements from left and right
  return result`
  },
  "Quick Sort": {
    timeComplexity: "O(n log n) average, O(n²) worst case",
    spaceComplexity: "O(log n)",
    description: "Quick sort works by selecting a 'pivot' element and partitioning the array around the pivot, placing smaller elements before it and larger ones after it.",
    pseudocode: `function quickSort(arr, low, high):
  if low < high:
    pivot_idx = partition(arr, low, high)
    
    quickSort(arr, low, pivot_idx - 1)
    quickSort(arr, pivot_idx + 1, high)
    
function partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  
  for j from low to high-1:
    if arr[j] <= pivot:
      i++
      swap arr[i] with arr[j]
      
  swap arr[i+1] with arr[high]
  return i+1`
  }
};

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [method, setMethod] = useState("Select Algorithm");
  const [length, setLength] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCodePanel, setShowCodePanel] = useState(true); // Always show by default
  const [currentStep, setCurrentStep] = useState(""); // Current algorithm step description
  const [currentLine, setCurrentLine] = useState(0); // Current highlighted line in the code

  const createArray = (size = Math.floor(window.innerWidth / 60)) => {
    let arr = [];
    for (let i = 0; i < size; i++) {
      // Generate values between 30 and 100 (limiting max to 100)
      arr.push({
        value: Math.floor(Math.random() * (70)) + 30,
        id: "id-" + i
      });
    }
    setLength(size);
    setArray(arr);
    setShowError(false);
  };

  const randomize = () => {
    if (!isAnimating) {
      createArray(length);
    }
  };

  const handleSort = () => {
    if (isAnimating) return;
    
    let results = [];
    setShowError(false);
    
    if (method === "Select Algorithm") {
      setShowError(true);
      return;
    }

    setIsAnimating(true);
    setCurrentStep("Starting sorting...");
    
    if (method === "Selection Sort")
      results = selectionSort([...array], length);
    else if (method === "Merge Sort")
      results = mergeSort([...array], length);
    else if (method === "Quick Sort")
      results = quickSort([...array], length);

    for (let i = 0; i < results.length; i++) {
      setTimeout(() => {
        setArray(results[i].array);
        setCurrentStep(results[i].step);
        
        // Update the highlighted line based on the algorithm and current step
        // These line numbers correspond to the pseudocode in algorithmInfo
        if (method === "Selection Sort") {
          if (results[i].step.includes("Finding minimum")) {
            setCurrentLine(3);
          } else if (results[i].step.includes("Found new minimum")) {
            setCurrentLine(6);
          } else if (results[i].step.includes("Swapping")) {
            setCurrentLine(8);
          } else if (results[i].step.includes("sorted successfully")) {
            setCurrentLine(10);
          }
        } else if (method === "Merge Sort") {
          if (results[i].step.includes("Dividing array")) {
            setCurrentLine(1);
          } else if (results[i].step.includes("Merging subarrays")) {
            setCurrentLine(5);
          } else if (results[i].step.includes("Comparing and merging")) {
            setCurrentLine(15);
          } else if (results[i].step.includes("Adding remaining")) {
            setCurrentLine(18);
          } else if (results[i].step.includes("sorted successfully")) {
            setCurrentLine(null);
          }
        } else if (method === "Quick Sort") {
          if (results[i].step.includes("Selecting pivot")) {
            setCurrentLine(2);
          } else if (results[i].step.includes("Partitioning")) {
            setCurrentLine(9);
          } else if (results[i].step.includes("Comparing")) {
            setCurrentLine(12);
          } else if (results[i].step.includes("less than pivot")) {
            setCurrentLine(14);
          } else if (results[i].step.includes("Placing pivot")) {
            setCurrentLine(16);
          } else if (results[i].step.includes("sorted successfully")) {
            setCurrentLine(null);
          }
        }
        
        if (i === results.length - 1) {
          setIsAnimating(false);
        }
      }, speed * i);
    }
  };

  const handleSpeedChange = (e) => {
    setSpeed(1100 - e.target.value);
  };

  const handleSizeChange = (e) => {
    if (!isAnimating) {
      createArray(parseInt(e.target.value));
    }
  };

  useEffect(() => {
    createArray();
    const handleResize = () => {
      if (!isAnimating) {
        createArray();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="sorting-container">
      {/* Background elements */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      
      {/* Header */}
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
        <h1 style={{ flex: 1, textAlign: 'center' }}>Sorting Algorithm Visualizer</h1>
        <button 
          className={`code-panel-toggle ${showCodePanel ? 'active' : ''}`} 
          onClick={() => setShowCodePanel(!showCodePanel)}
        >
          {showCodePanel ? 'Hide Code' : 'Show Code'}
        </button>
      </motion.header>

      {/* Main content */}
      <motion.div 
        className="sorting-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Steps Panel - always visible */}
        <motion.div 
          className="code-panel"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "320px" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        >
          <h3>Algorithm Steps</h3>
          
          <div className="algorithm-info">
            {method !== "Select Algorithm" && (
              <div className="algorithm-metrics">
                <div className="metric">
                  <span className="metric-label">Time Complexity:</span>
                  <span className="metric-value">{algorithmInfo[method]?.timeComplexity}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Space Complexity:</span>
                  <span className="metric-value">{algorithmInfo[method]?.spaceComplexity}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="step-display">
            <h4>Current Operation:</h4>
            <div className={`step-description ${isAnimating ? 'active-step' : ''}`}>
              {currentStep || "Select an algorithm and press 'Sort' to start visualization"}
            </div>
            
            {/* Learn More section - moved from bottom info panel */}
            {method !== "Select Algorithm" && (
              <div className="algorithm-details-container">
                <p className="algorithm-description">{algorithmInfo[method]?.description}</p>
                <button 
                  className="info-toggle-button" 
                  onClick={() => setShowInfo(!showInfo)}
                >
                  {showInfo ? "Hide Details" : "Learn More"}
                </button>
                
                {showInfo && (
                  <motion.div 
                    className="algorithm-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    {method === "Selection Sort" && (
                      <p>Selection sort is simple but inefficient for large datasets. It divides the array into a sorted and unsorted region, repeatedly finding the minimum element from the unsorted region and moving it to the beginning of the sorted region.</p>
                    )}
                    {method === "Merge Sort" && (
                      <p>Merge sort is more efficient than basic sorting algorithms like insertion or selection sort. It uses a divide-and-conquer approach that breaks down the array into equal halves until atomic values are reached, then rebuilds by merging and sorting.</p>
                    )}
                    {method === "Quick Sort" && (
                      <p>Quick sort is generally faster in practice than other O(n log n) algorithms because its inner loop can be efficiently implemented on most architectures. It works by selecting a 'pivot' element and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.</p>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>          {/* Controls Panel */}
        <div className="sorting-controls">
          <div className="control-section">
            <div className="control-group">
              <button 
                className="control-button" 
                onClick={randomize} 
                disabled={isAnimating}
              >
                <FaRandom /> Randomize
              </button>
              
              <div className="algorithm-dropdown">
                <button className="control-button dropdown-toggle">
                  <FaSortAmountDown /> {method}
                </button>
                <div className="algorithm-dropdown-content">
                  <button onClick={() => setMethod("Selection Sort")}>Selection Sort</button>
                  <button onClick={() => setMethod("Merge Sort")}>Merge Sort</button>
                  <button onClick={() => setMethod("Quick Sort")}>Quick Sort</button>
                </div>
              </div>
              
              <button 
                className="control-button sort-button" 
                onClick={handleSort}
                disabled={isAnimating}
              >
                Sort
              </button>
            </div>
          
            <div className="control-group sliders">
              <div className="slider-container">
                <label>Array Size</label>
                <input 
                  type="range" 
                  min="5" 
                  max={Math.floor(window.innerWidth / 40)} 
                  value={length} 
                  onChange={handleSizeChange}
                  disabled={isAnimating}
                />
              </div>
              
              <div className="slider-container">
                <label>Animation Speed</label>
                <input 
                  type="range" 
                  min="100" 
                  max="1000" 
                  defaultValue="500" 
                  onChange={handleSpeedChange}
                  disabled={isAnimating}
                />
              </div>
            </div>
          </div>
          
          {showError && (
            <div className="sorting-error">
              Please select an algorithm first!
            </div>
          )}
          
          {/* Algorithm Code Block - moved below controls */}
          {showCodePanel && method !== "Select Algorithm" && (
            <motion.div 
              className="algorithm-code-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                flex: 1, 
                minHeight: '400px',
                height: 'auto',
                maxHeight: 'none'
              }}
            >
              <h4>Algorithm Code:</h4>
              <div style={{ flex: 1, display: 'flex', overflow: 'visible' }}>
                <CodeHighlighter 
                  code={algorithmInfo[method]?.pseudocode || 'No code available'} 
                  currentLine={currentLine}
                />
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Visualization Area */}
        <div className="sorting-visualization-container">
          {/* Algorithm Info Panel - simplified without Learn More section */}
          {method !== "Select Algorithm" && (
            <motion.div 
              className="algorithm-info-panel"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>{method}</h3>
              <div className="algorithm-metrics">
                <div className="metric">
                  <span className="metric-label">Time Complexity:</span>
                  <span className="metric-value">{algorithmInfo[method]?.timeComplexity}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Space Complexity:</span>
                  <span className="metric-value">{algorithmInfo[method]?.spaceComplexity}</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="bars">
            {array.map((element, index) => (
              <motion.div
                key={element.id}
                layout 
                transition={springAnim}
                className={`bar ${element.style || ''}`}
                style={{height: element.value * 3, order: index}}
              >
                {element.value}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SortingVisualizer;