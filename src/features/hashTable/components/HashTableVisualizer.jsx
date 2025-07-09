import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaPlus, 
  FaSearch, 
  FaTrash, 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward,
  FaRandom,
  FaCalculator,
  FaArrowRight,
  FaHashtag
} from 'react-icons/fa';
import HashTable from '../utils/HashTableAlgorithms';
import '../styles/HashTableVisualizer.css';

const HashTableVisualizer = () => {
  // Core state
  const [hashTable] = useState(() => new HashTable(11));
  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [tableSize, setTableSize] = useState(11);
  const [hashFunction, setHashFunction] = useState('division');
  const [collisionMethod, setCollisionMethod] = useState('linear');
  
  // Animation state
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [message, setMessage] = useState('Ready to start hashing!');
  
  // Visualization state
  const [highlightedSlots, setHighlightedSlots] = useState(new Set());
  const [currentStep, setCurrentStep] = useState(null);
  const [tableVersion, setTableVersion] = useState(0);
  
  // Educational state
  const [showEducation, setShowEducation] = useState(false);
  const [activeEducationTab, setActiveEducationTab] = useState('hashFunctions');
  
  const timeoutRef = useRef(null);

  // Update hash table settings when changed
  useEffect(() => {
    hashTable.setHashFunction(hashFunction);
    hashTable.setCollisionMethod(collisionMethod);
    if (hashTable.size !== tableSize) {
      hashTable.resize(tableSize);
      setTableVersion(prev => prev + 1);
      setMessage(`Table resized to ${tableSize}. Previous data cleared.`);
    }
  }, [hashFunction, collisionMethod, tableSize, hashTable]);

  // Animation effect
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isAnimating && currentStepIndex < animationSteps.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, animationSpeed);
    } else if (currentStepIndex >= animationSteps.length - 1) {
      setIsAnimating(false);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAnimating, currentStepIndex, animationSteps.length, animationSpeed]);

  // Step visualization effect
  useEffect(() => {
    if (animationSteps.length > 0 && currentStepIndex < animationSteps.length) {
      const step = animationSteps[currentStepIndex];
      setCurrentStep(step);
      setMessage(step.description);
      
      // Highlight relevant slots
      const highlights = new Set();
      if (step.position !== undefined) {
        highlights.add(step.position);
      }
      if (step.hash !== undefined && step.position !== step.hash) {
        highlights.add(step.hash);
      }
      setHighlightedSlots(highlights);
    } else {
      setCurrentStep(null);
      setHighlightedSlots(new Set());
    }
  }, [animationSteps, currentStepIndex]);

  // Event handlers
  const handleInsert = () => {
    const key = parseInt(inputKey);
    const value = inputValue.trim() || key.toString();
    
    if (isNaN(key) || key < 0) {
      setMessage('Please enter a valid positive number for the key');
      return;
    }
    
    resetAnimation();
    setTimeout(() => {
      const steps = hashTable.insert(key, value);
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      setInputKey('');
      setInputValue('');
      forceUpdate();
      if (steps.length > 0) {
        setIsAnimating(true);
      }
    }, 100);
  };

  const handleSearch = () => {
    const key = parseInt(inputKey);
    
    if (isNaN(key) || key < 0) {
      setMessage('Please enter a valid positive number for the key');
      return;
    }
    
    resetAnimation();
    setTimeout(() => {
      const { steps } = hashTable.search(key);
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      setInputKey('');
      if (steps.length > 0) {
        setIsAnimating(true);
      }
    }, 100);
  };

  const handleDelete = () => {
    const key = parseInt(inputKey);
    
    if (isNaN(key) || key < 0) {
      setMessage('Please enter a valid positive number for the key');
      return;
    }
    
    resetAnimation();
    setTimeout(() => {
      const steps = hashTable.delete(key);
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      setInputKey('');
      forceUpdate();
      if (steps.length > 0) {
        setIsAnimating(true);
      }
    }, 100);
  };

  const handleClear = () => {
    resetAnimation();
    hashTable.clear();
    setMessage('Hash table cleared');
    forceUpdate();
  };

  const handleRandom = () => {
    resetAnimation();
    hashTable.clear();
    
    // Insert 5-8 random values
    const count = Math.floor(Math.random() * 4) + 5;
    const values = [];
    for (let i = 0; i < count; i++) {
      const key = Math.floor(Math.random() * 100) + 1;
      if (!values.includes(key)) {
        values.push(key);
        hashTable.insert(key);
      }
    }
    
    setMessage(`Random values inserted: ${values.join(', ')}`);
    forceUpdate();
  };

  const resetAnimation = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsAnimating(false);
    setAnimationSteps([]);
    setCurrentStepIndex(0);
    setHighlightedSlots(new Set());
    setCurrentStep(null);
  };

  const forceUpdate = () => {
    setTableVersion(prev => prev + 1);
  };

  const handlePlay = () => {
    if (animationSteps.length > 0) {
      setIsAnimating(!isAnimating);
    }
  };

  const handleStepForward = () => {
    if (currentStepIndex < animationSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Helper functions
  const getSlotClass = (index, value) => {
    let classes = ['hash-slot'];
    
    if (value === null) {
      classes.push('empty');
    } else {
      classes.push('occupied');
    }
    
    if (highlightedSlots.has(index)) {
      if (currentStep?.type === 'hash_calculation' && index === currentStep.hash) {
        classes.push('initial-hash');
      } else if (currentStep?.type === 'check_position' && index === currentStep.position) {
        if (currentStep.isEmpty) {
          classes.push('checking-empty');
        } else if (currentStep.isMatch) {
          classes.push('found');
        } else {
          classes.push('checking-occupied');
        }
      } else if (currentStep?.type === 'collision_resolution' && index === currentStep.position) {
        classes.push('probing');
      } else if (currentStep?.type === 'insert_success' && index === currentStep.position) {
        classes.push('inserted');
      }
    }
    
    return classes.join(' ');
  };

  const getStepTypeColor = (stepType) => {
    switch (stepType) {
      case 'hash_calculation': return '#58a6ff';
      case 'collision_resolution': return '#d29922';
      case 'check_position': return '#8b949e';
      case 'insert_success': return '#238636';
      case 'search_found': return '#238636';
      case 'search_not_found': return '#f85149';
      case 'duplicate_key': return '#d29922';
      case 'table_full': return '#f85149';
      default: return '#8b949e';
    }
  };

  return (
    <div className="hash-table-visualizer">
      <header className="hash-header">
        <Link to="/" className="home-button">
          <FaHome />
          <span>Home</span>
        </Link>
        <h1>Hash Table Visualizer</h1>
      </header>

      <main className="hash-main">
        {/* Controls */}
        <div className="hash-controls">
          {/* Configuration */}
          <div className="config-group">
            <div className="config-item">
              <label>Hash Function:</label>
              <select 
                value={hashFunction} 
                onChange={(e) => setHashFunction(e.target.value)}
                disabled={isAnimating}
              >
                <option value="division">Division Method</option>
                <option value="midSquare">Mid Square Method</option>
                <option value="folding">Folding Method</option>
              </select>
            </div>
            
            <div className="config-item">
              <label>Collision Resolution:</label>
              <select 
                value={collisionMethod} 
                onChange={(e) => setCollisionMethod(e.target.value)}
                disabled={isAnimating}
              >
                <option value="linear">Linear Probing</option>
                <option value="quadratic">Quadratic Probing</option>
                <option value="double">Double Hashing</option>
              </select>
            </div>
            
            <div className="config-item">
              <label>Table Size:</label>
              <select 
                value={tableSize} 
                onChange={(e) => setTableSize(parseInt(e.target.value))}
                disabled={isAnimating}
              >
                <option value="7">7</option>
                <option value="11">11</option>
                <option value="13">13</option>
                <option value="17">17</option>
              </select>
            </div>
          </div>

          {/* Operations */}
          <div className="operations-group">
            <div className="input-group">
              <input
                type="number"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Key"
                className="key-input"
                disabled={isAnimating}
                min="0"
              />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Value (optional)"
                className="value-input"
                disabled={isAnimating}
              />
            </div>
            
            <div className="action-buttons">
              <button onClick={handleInsert} disabled={isAnimating || !inputKey} className="btn btn-primary">
                <FaPlus /> Insert
              </button>
              <button onClick={handleSearch} disabled={isAnimating || !inputKey} className="btn btn-secondary">
                <FaSearch /> Search
              </button>
              <button onClick={handleDelete} disabled={isAnimating || !inputKey} className="btn btn-danger">
                <FaTrash /> Delete
              </button>
            </div>
            
            <div className="utility-buttons">
              <button onClick={handleRandom} disabled={isAnimating} className="btn btn-info">
                <FaRandom /> Random
              </button>
              <button onClick={handleClear} disabled={isAnimating} className="btn btn-warning">
                <FaTrash /> Clear
              </button>
            </div>
          </div>

          {/* Animation Controls */}
          {animationSteps.length > 0 && (
            <div className="animation-controls">
              <div className="playback-controls">
                <button onClick={handleStepBackward} disabled={currentStepIndex === 0} className="control-btn">
                  <FaStepBackward />
                </button>
                <button onClick={handlePlay} className="control-btn">
                  {isAnimating ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={handleStepForward} disabled={currentStepIndex >= animationSteps.length - 1} className="control-btn">
                  <FaStepForward />
                </button>
              </div>
              
              <div className="step-info">
                <span>Step {currentStepIndex + 1} of {animationSteps.length}</span>
                {currentStep && (
                  <span className="step-type" style={{ color: getStepTypeColor(currentStep.type) }}>
                    {currentStep.type.replace('_', ' ')}
                  </span>
                )}
              </div>
              
              <div className="speed-control">
                <label>Speed:</label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="200"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                />
                <span>{animationSpeed}ms</span>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="hash-status">
          <div className="status-item">
            <FaHashtag />
            <span>Load Factor: {hashTable.getLoadFactor()}%</span>
          </div>
          <div className="status-item">
            <FaCalculator />
            <span>Hash Function: {hashTable.getHashMethodName()}</span>
          </div>
          <div className="status-item">
            <FaArrowRight />
            <span>Collision Method: {hashTable.getCollisionMethodName()}</span>
          </div>
        </div>

        {/* Message */}
        <div className="hash-message">
          {message}
        </div>

        {/* Hash Table Visualization */}
        <div className="hash-table-container">
          <h3>Hash Table (Size: {tableSize})</h3>
          <div className="hash-table-grid">
            {hashTable.getTableState().map((slot) => (
              <div key={`${slot.index}-${tableVersion}`} className={getSlotClass(slot.index, slot.value)}>
                <div className="slot-index">{slot.index}</div>
                <div className="slot-value">
                  {slot.value !== null ? slot.value : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Content */}
        <div className="hash-education">
          <div className="education-header">
            <button 
              className="education-toggle"
              onClick={() => setShowEducation(!showEducation)}
            >
              {showEducation ? '▼' : '▶'} Understanding Hash Tables
            </button>
          </div>
          
          {showEducation && (
            <div className="education-content">
              <div className="education-tabs">
                <button 
                  className={activeEducationTab === 'hashFunctions' ? 'tab active' : 'tab'}
                  onClick={() => setActiveEducationTab('hashFunctions')}
                >
                  Hash Functions
                </button>
                <button 
                  className={activeEducationTab === 'collisionResolution' ? 'tab active' : 'tab'}
                  onClick={() => setActiveEducationTab('collisionResolution')}
                >
                  Collision Resolution
                </button>
                <button 
                  className={activeEducationTab === 'complexity' ? 'tab active' : 'tab'}
                  onClick={() => setActiveEducationTab('complexity')}
                >
                  Complexity & Usage
                </button>
              </div>
              
              <div className="education-panel">
                {activeEducationTab === 'hashFunctions' && (
                  <div className="education-section">
                    <h4>Hash Functions</h4>
                    
                    <div className="method-explanation">
                      <h5>Division Method</h5>
                      <p><strong>Formula:</strong> h(k) = k mod m</p>
                      <p>The simplest method. Divides the key by table size and takes the remainder.</p>
                      <p><strong>Example:</strong> For key 25 and table size 11: 25 % 11 = 3</p>
                      <p><strong>Pros:</strong> Simple, fast computation</p>
                      <p><strong>Cons:</strong> Poor distribution if table size isn't prime</p>
                    </div>
                    
                    <div className="method-explanation">
                      <h5>Mid Square Method</h5>
                      <p><strong>Process:</strong> Square the key, extract middle digits</p>
                      <p>Square the key and take the middle digits as the hash value.</p>
                      <p><strong>Example:</strong> For key 12: 12² = 144, middle digits give hash value</p>
                      <p><strong>Pros:</strong> Good distribution, less clustering</p>
                      <p><strong>Cons:</strong> More computation, overflow concerns</p>
                    </div>
                    
                    <div className="method-explanation">
                      <h5>Folding Method</h5>
                      <p><strong>Process:</strong> Split key into parts, sum them, mod by table size</p>
                      <p>Divide the key into groups and sum them together.</p>
                      <p><strong>Example:</strong> For key 1234: (12 + 34) % table_size</p>
                      <p><strong>Pros:</strong> Good for large keys, better distribution</p>
                      <p><strong>Cons:</strong> More complex computation</p>
                    </div>
                  </div>
                )}
                
                {activeEducationTab === 'collisionResolution' && (
                  <div className="education-section">
                    <h4>Collision Resolution Methods</h4>
                    
                    <div className="method-explanation">
                      <h5>Linear Probing</h5>
                      <p><strong>Formula:</strong> h'(k) = (h(k) + i) mod m</p>
                      <p>When collision occurs, check the next slot sequentially.</p>
                      <p><strong>Pros:</strong> Simple implementation, good cache performance</p>
                      <p><strong>Cons:</strong> Primary clustering - consecutive occupied slots</p>
                    </div>
                    
                    <div className="method-explanation">
                      <h5>Quadratic Probing</h5>
                      <p><strong>Formula:</strong> h'(k) = (h(k) + i²) mod m</p>
                      <p>Uses quadratic increments to find next available slot.</p>
                      <p><strong>Pros:</strong> Reduces primary clustering</p>
                      <p><strong>Cons:</strong> Secondary clustering, may not probe all slots</p>
                    </div>
                    
                    <div className="method-explanation">
                      <h5>Double Hashing</h5>
                      <p><strong>Formula:</strong> h'(k) = (h₁(k) + i × h₂(k)) mod m</p>
                      <p>Uses a second hash function to determine step size.</p>
                      <p><strong>Pros:</strong> Eliminates clustering, uniform distribution</p>
                      <p><strong>Cons:</strong> More computation, requires good second hash function</p>
                    </div>
                  </div>
                )}
                
                {activeEducationTab === 'complexity' && (
                  <div className="education-section">
                    <h4>Time Complexity & Applications</h4>
                    
                    <div className="complexity-table">
                      <h5>Time Complexity</h5>
                      <table>
                        <thead>
                          <tr>
                            <th>Operation</th>
                            <th>Average Case</th>
                            <th>Worst Case</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Insert</td>
                            <td>O(1)</td>
                            <td>O(n)</td>
                          </tr>
                          <tr>
                            <td>Search</td>
                            <td>O(1)</td>
                            <td>O(n)</td>
                          </tr>
                          <tr>
                            <td>Delete</td>
                            <td>O(1)</td>
                            <td>O(n)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="applications">
                      <h5>Real-world Applications</h5>
                      <ul>
                        <li><strong>Database Indexing:</strong> Fast record retrieval</li>
                        <li><strong>Caching:</strong> Web browsers, CDNs</li>
                        <li><strong>Compilers:</strong> Symbol tables for variables</li>
                        <li><strong>Cryptography:</strong> Digital signatures, checksums</li>
                        <li><strong>Programming Languages:</strong> Sets, maps, dictionaries</li>
                      </ul>
                    </div>
                    
                    <div className="best-practices">
                      <h5>Best Practices</h5>
                      <ul>
                        <li>Keep load factor below 0.7 for open addressing</li>
                        <li>Use prime numbers for table size</li>
                        <li>Choose hash functions that distribute keys uniformly</li>
                        <li>Consider resizing when load factor gets too high</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HashTableVisualizer;
