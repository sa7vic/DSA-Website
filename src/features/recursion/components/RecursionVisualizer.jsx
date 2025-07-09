import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import '../styles/RecursionVisualizer.css';

const RecursionVisualizerNew = () => {
  const [algorithm, setAlgorithm] = useState('fibonacci');
  const [n, setN] = useState(4);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1000);

  // Simple recursion tracer
  class SimpleTracer {
    constructor() {
      this.steps = [];
      this.callStack = [];
      this.nodeCounter = 0;
      this.nodes = new Map();
    }

    addNode(label, parentId = null, x = 0, y = 0) {
      const nodeId = this.nodeCounter++;
      const node = {
        id: nodeId,
        label,
        parentId,
        x,
        y,
        state: 'calling',
        result: null
      };
      this.nodes.set(nodeId, node);
      return nodeId;
    }

    addStep(type, description, nodeId = null, highlightLine = 1) {
      this.steps.push({
        type,
        description,
        callStack: [...this.callStack],
        nodes: new Map(this.nodes),
        currentNodeId: nodeId,
        highlightLine
      });
    }

    call(func, params) {
      this.callStack.push({ func, params, result: null });
    }

    return(value, nodeId = null) {
      if (this.callStack.length > 0) {
        this.callStack[this.callStack.length - 1].result = value;
        if (nodeId && this.nodes.has(nodeId)) {
          const node = this.nodes.get(nodeId);
          node.result = value;
          node.state = 'complete';
          this.nodes.set(nodeId, node);
        }
      }
      this.callStack.pop();
    }

    baseCase(value, nodeId = null) {
      if (nodeId && this.nodes.has(nodeId)) {
        const node = this.nodes.get(nodeId);
        node.result = value;
        node.state = 'base_case';
        this.nodes.set(nodeId, node);
      }
    }
  }

  // Fibonacci tracing
  const traceFibonacci = useCallback((n, tracer = new SimpleTracer()) => {
    const fibonacci = (num, depth = 0, parentId = null, isLeft = true) => {
      const x = parentId === null ? 350 : (isLeft ? Math.max(50, 350 - depth * 100) : Math.min(650, 350 + depth * 100));
      const y = 80 + depth * 100;
      
      const nodeId = tracer.addNode(`fib(${num})`, parentId, x, y);
      tracer.call(`fib(${num})`, { n: num });
      tracer.addStep('call', `Calling fib(${num})`, nodeId, 1);

      if (num <= 1) {
        tracer.baseCase(num, nodeId);
        tracer.addStep('base_case', `Base case: fib(${num}) = ${num}`, nodeId, 2);
        tracer.return(num, nodeId);
        return num;
      }

      tracer.addStep('recursive_case', `Computing fib(${num-1}) + fib(${num-2})`, nodeId, 3);
      
      const left = fibonacci(num - 1, depth + 1, nodeId, true);
      const right = fibonacci(num - 2, depth + 1, nodeId, false);
      
      const result = left + right;
      tracer.return(result, nodeId);
      tracer.addStep('return', `fib(${num}) returns ${result}`, nodeId, 3);
      
      return result;
    };

    fibonacci(n);
    return tracer;
  }, []);

  // GCD tracing
  const traceGCD = useCallback((a, b, tracer = new SimpleTracer()) => {
    const gcd = (numA, numB, depth = 0, parentId = null) => {
      const x = 350 - depth * 80;
      const y = 80 + depth * 100;
      
      const nodeId = tracer.addNode(`gcd(${numA},${numB})`, parentId, x, y);
      tracer.call(`gcd(${numA},${numB})`, { a: numA, b: numB });
      tracer.addStep('call', `Calling gcd(${numA}, ${numB})`, nodeId, 1);

      if (numB === 0) {
        tracer.baseCase(numA, nodeId);
        tracer.addStep('base_case', `Base case: gcd(${numA}, 0) = ${numA}`, nodeId, 2);
        tracer.return(numA, nodeId);
        return numA;
      }

      tracer.addStep('recursive_case', `Computing gcd(${numB}, ${numA % numB})`, nodeId, 3);
      const result = gcd(numB, numA % numB, depth + 1, nodeId);
      
      tracer.return(result, nodeId);
      tracer.addStep('return', `gcd(${numA}, ${numB}) returns ${result}`, nodeId, 3);
      
      return result;
    };

    gcd(a, b);
    return tracer;
  }, []);

  // Fast Power tracing
  const traceFastPower = useCallback((base, exp, tracer = new SimpleTracer()) => {
    const fastPower = (b, e, depth = 0, parentId = null) => {
      const x = 350 - depth * 60;
      const y = 80 + depth * 100;
      
      const nodeId = tracer.addNode(`pow(${b},${e})`, parentId, x, y);
      tracer.call(`pow(${b},${e})`, { base: b, exp: e });
      tracer.addStep('call', `Calling pow(${b}, ${e})`, nodeId, 1);

      if (e === 0) {
        tracer.baseCase(1, nodeId);
        tracer.addStep('base_case', `Base case: pow(${b}, 0) = 1`, nodeId, 2);
        tracer.return(1, nodeId);
        return 1;
      }

      tracer.addStep('recursive_case', `Computing pow(${b}, ${Math.floor(e/2)})`, nodeId, 3);
      const half = fastPower(b, Math.floor(e / 2), depth + 1, nodeId);
      
      const result = e % 2 === 0 ? half * half : b * half * half;
      tracer.return(result, nodeId);
      tracer.addStep('return', `pow(${b}, ${e}) returns ${result}`, nodeId, 4);
      
      return result;
    };

    fastPower(base, exp);
    return tracer;
  }, []);

  const generateSteps = useCallback(() => {
    try {
      let tracer;
      
      switch (algorithm) {
        case 'fibonacci':
          tracer = traceFibonacci(n);
          break;
        case 'gcd':
          tracer = traceGCD(n, Math.max(1, Math.floor(n * 0.6)));
          break;
        case 'fastPower':
          tracer = traceFastPower(2, n);
          break;
        default:
          tracer = traceFibonacci(n);
      }
      
      setSteps(tracer.steps);
      setCurrentStep(0);
      setIsAnimating(false);
    } catch (error) {
      console.error('Error generating steps:', error);
      setSteps([]);
    }
  }, [algorithm, n, traceFibonacci, traceGCD, traceFastPower]);

  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

  useEffect(() => {
    let timer;
    if (isAnimating && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsAnimating(false);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, steps.length, speed]);

  const handlePlay = () => setIsAnimating(!isAnimating);
  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = steps[currentStep] || { callStack: [], nodes: new Map(), highlightLine: 1 };

  const renderTree = () => {
    if (currentStepData.nodes.size === 0) {
      return (
        <text x="50%" y="50%" textAnchor="middle" fill="#8b949e" fontSize="16">
          Click play to start visualization
        </text>
      );
    }

    const nodes = Array.from(currentStepData.nodes.values());
    
    // Create edges
    const edges = nodes
      .filter(node => node.parentId !== null)
      .map(node => {
        const parent = nodes.find(n => n.id === node.parentId);
        if (!parent) return null;
        
        return (
          <line
            key={`edge-${node.id}`}
            x1={parent.x}
            y1={parent.y}
            x2={node.x}
            y2={node.y}
            stroke="#30363d"
            strokeWidth="2"
          />
        );
      })
      .filter(Boolean);

    // Create nodes
    const nodeElements = nodes.map(node => {
      let fillColor = '#21262d';
      let strokeColor = '#58a6ff';
      
      if (node.state === 'calling') {
        fillColor = '#f7931e';
        strokeColor = '#f7931e';
      } else if (node.state === 'base_case') {
        fillColor = '#238636';
        strokeColor = '#238636';
      } else if (node.state === 'complete') {
        fillColor = '#58a6ff';
        strokeColor = '#58a6ff';
      }

      return (
        <g key={`node-${node.id}`}>
          <circle
            cx={node.x}
            cy={node.y}
            r="30"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2"
          />
          <text
            x={node.x}
            y={node.y - 5}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="11"
            fontWeight="600"
          >
            {node.label}
          </text>
          {node.result !== null && node.result !== undefined && (
            <text
              x={node.x}
              y={node.y + 12}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="10"
              fontWeight="700"
            >
              = {node.result}
            </text>
          )}
        </g>
      );
    });

    return (
      <>
        {edges}
        {nodeElements}
      </>
    );
  };

  const renderCode = () => {
    const codeMap = {
      fibonacci: [
        'function fibonacci(n) {',
        '  if (n <= 1) return n;',
        '  return fibonacci(n-1) +',
        '         fibonacci(n-2);',
        '}'
      ],
      gcd: [
        'function gcd(a, b) {',
        '  if (b === 0) return a;',
        '  return gcd(b, a % b);',
        '}'
      ],
      fastPower: [
        'function fastPower(base, exp) {',
        '  if (exp === 0) return 1;',
        '  let half = fastPower(base, exp/2);',
        '  return exp%2 ? base*half*half : half*half;',
        '}'
      ]
    };

    const lines = codeMap[algorithm] || [];
    const highlightedLine = currentStepData.highlightLine || 0;
    
    return (
      <div className="code-display">
        {lines.map((line, index) => (
          <div 
            key={index}
            className={`code-line ${highlightedLine === index + 1 ? 'highlighted' : ''}`}
          >
            <span className="line-number">{index + 1}</span>
            <span className="line-content">{line}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="recursion-visualizer">
      {/* Header */}
      <header className="recursion-header">
        <Link to="/" className="home-button">
          <FaHome />
          <span>Home</span>
        </Link>
        <h1>Recursion Visualizer</h1>
      </header>

      <main className="recursion-main">
        {/* Controls */}
        <div className="recursion-controls">
          <div className="algorithm-selector">
            <label>Algorithm:</label>
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
              <option value="fibonacci">Fibonacci</option>
              <option value="gcd">GCD (Greatest Common Divisor)</option>
              <option value="fastPower">Fast Power</option>
            </select>
          </div>

          <div className="input-controls">
            <div className="input-group">
              <label>n:</label>
              <input
                type="number"
                value={n}
                onChange={(e) => setN(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
                min="1"
                max="8"
              />
            </div>
            <button className="btn btn-secondary" onClick={generateSteps}>
              Reset
            </button>
          </div>

          <div className="playback-controls">
            <button onClick={handleStepBackward} disabled={currentStep === 0} className="control-btn">
              <FaStepBackward />
            </button>
            <button onClick={handlePlay} className="control-btn">
              {isAnimating ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={handleStepForward} disabled={currentStep >= steps.length - 1} className="control-btn">
              <FaStepForward />
            </button>
          </div>

          <div className="step-info">
            <span>Step {currentStep + 1} of {steps.length}</span>
            {currentStepData.description && (
              <span className="step-description">{currentStepData.description}</span>
            )}
          </div>

          <div className="speed-control">
            <label>Speed:</label>
            <input
              type="range"
              min="200"
              max="2000"
              step="200"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
            />
            <span>{speed}ms</span>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="visualization-container">
          {/* Tree Column */}
          <div className="visualization-column">
            <div className="column-header">
              <h3>Recursion Tree</h3>
            </div>
            <div className="tree-container">
              <svg width="100%" height="500" viewBox="0 0 700 500">
                {renderTree()}
              </svg>
            </div>
          </div>

          {/* Call Stack Column */}
          <div className="visualization-column">
            <div className="column-header">
              <h3>Call Stack</h3>
            </div>
            <div className="call-stack">
              {currentStepData.callStack && currentStepData.callStack.length > 0 ? (
                currentStepData.callStack.map((call, index) => (
                  <div key={index} className={`stack-frame ${index === currentStepData.callStack.length - 1 ? 'active' : ''}`}>
                    <div className="frame-function">{call.func}</div>
                    <div className="frame-params">
                      {Object.entries(call.params).map(([key, value]) => (
                        <span key={key}>{key}: {value}</span>
                      )).join(', ')}
                    </div>
                    {call.result !== null && call.result !== undefined && (
                      <div className="frame-return">→ {call.result}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="stack-empty">No active function calls</div>
              )}
            </div>
          </div>

          {/* Code Column */}
          <div className="visualization-column">
            <div className="column-header">
              <h3>Code</h3>
            </div>
            {renderCode()}
          </div>
        </div>

        {/* Legend */}
        <div className="recursion-legend">
          <div className="legend-header">
            <h3>Legend</h3>
          </div>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-node calling"></div>
              <span>Currently Executing</span>
            </div>
            <div className="legend-item">
              <div className="legend-node base-case"></div>
              <span>Base Case Reached</span>
            </div>
            <div className="legend-item">
              <div className="legend-node complete"></div>
              <span>Call Completed</span>
            </div>
            <div className="legend-item">
              <div className="legend-node default"></div>
              <span>Not Yet Called</span>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="recursion-education">
          <div className="education-header">
            <h3>Understanding Recursion</h3>
          </div>
          
          <div className="education-content">
            <div className="concept-section">
              <h4>What is Recursion?</h4>
              <p>
                Recursion is a programming technique where a function calls itself to solve smaller 
                instances of the same problem. It consists of two essential parts:
              </p>
              <ul>
                <li><strong>Base Case:</strong> A condition that stops the recursion</li>
                <li><strong>Recursive Case:</strong> The function calling itself with modified parameters</li>
              </ul>
            </div>

            <div className="algorithm-explanation">
              <h4>Current Algorithm: {algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}</h4>
              {algorithm === 'fibonacci' && (
                <div>
                  <p>
                    <strong>Fibonacci Sequence:</strong> Each number is the sum of the two preceding ones.
                    F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)
                  </p>
                  <p><strong>Time Complexity:</strong> O(2^n) - Exponential due to repeated subproblems</p>
                  <p><strong>Space Complexity:</strong> O(n) - Maximum depth of recursion stack</p>
                </div>
              )}
              {algorithm === 'gcd' && (
                <div>
                  <p>
                    <strong>Greatest Common Divisor:</strong> Uses Euclidean algorithm to find the largest 
                    number that divides both inputs. GCD(a, b) = GCD(b, a mod b)
                  </p>
                  <p><strong>Time Complexity:</strong> O(log min(a, b))</p>
                  <p><strong>Space Complexity:</strong> O(log min(a, b))</p>
                </div>
              )}
              {algorithm === 'fastPower' && (
                <div>
                  <p>
                    <strong>Fast Exponentiation:</strong> Efficiently computes base^exp by reducing 
                    the problem size by half at each step using the property: x^n = (x^(n/2))^2
                  </p>
                  <p><strong>Time Complexity:</strong> O(log n)</p>
                  <p><strong>Space Complexity:</strong> O(log n)</p>
                </div>
              )}
            </div>

            <div className="visualization-guide">
              <h4>How to Use This Visualizer</h4>
              <ol>
                <li>Choose an algorithm from the dropdown</li>
                <li>Set the input value (n) using the number input</li>
                <li>Click "Reset" to generate the recursion tree</li>
                <li>Use the playback controls to step through the execution</li>
                <li>Watch how the call stack grows and shrinks</li>
                <li>Observe code highlighting showing current execution point</li>
              </ol>
            </div>

            <div className="key-insights">
              <h4>Key Insights</h4>
              <ul>
                <li>The recursion tree shows all function calls and their relationships</li>
                <li>The call stack demonstrates LIFO (Last In, First Out) execution order</li>
                <li>Base cases prevent infinite recursion</li>
                <li>Each recursive call creates a new stack frame with its own variables</li>
                <li>Return values propagate back up the call chain</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecursionVisualizerNew;
