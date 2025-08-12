import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaHome, FaPlus, FaSignOutAlt, FaRandom, FaTimes, FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import '../styles/TreeVisualizer.css';
import HeapExplanation from './HeapExplanation';
import TreeDiySection from './TreeDiySection';

// Min/Max Heap class with animations
class Heap {
  constructor(type = 'min') {
    this.heap = [];
    this.type = type; // 'min' or 'max'
    this.animationSteps = [];
  }

  getParentIndex(i) { return Math.floor((i - 1) / 2); }
  getLeftChildIndex(i) { return 2 * i + 1; }
  getRightChildIndex(i) { return 2 * i + 2; }

  hasParent(i) { return this.getParentIndex(i) >= 0; }
  hasLeftChild(i) { return this.getLeftChildIndex(i) < this.heap.length; }
  hasRightChild(i) { return this.getRightChildIndex(i) < this.heap.length; }

  parent(i) { return this.heap[this.getParentIndex(i)]; }
  leftChild(i) { return this.heap[this.getLeftChildIndex(i)]; }
  rightChild(i) { return this.heap[this.getRightChildIndex(i)]; }

  compare(a, b) {
    return this.type === 'min' ? a < b : a > b;
  }

  swap(i1, i2) {
    this.animationSteps.push({ 
      type: 'swap', 
      indices: [i1, i2], 
      line: this.type === 'min' ? 35 : 85,
      description: `Swapping elements at indices ${i1} and ${i2}: ${this.heap[i1]} ↔ ${this.heap[i2]}` 
    });
    [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  insert(value) {
    this.animationSteps = [];
    this.animationSteps.push({ 
      type: 'insert', 
      value, 
      index: this.heap.length,
      line: 15,
      description: `Adding ${value} to the end of the heap at index ${this.heap.length}` 
    });
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
    return this.animationSteps;
  }

  extract() {
    this.animationSteps = [];
    if (this.heap.length === 0) {
      this.animationSteps.push({ 
        type: 'extract_empty', 
        line: 45,
        description: "Heap is empty, cannot extract.",
        error: true
      });
      return this.animationSteps;
    }

    const item = this.heap[0];
    this.animationSteps.push({ 
      type: 'extract_root', 
      value: item, 
      line: 47,
      description: `Extracting root element: ${item}` 
    });

    // Move last element to root
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();

    if (this.heap.length > 0) {
      this.animationSteps.push({ 
        type: 'move_last_to_root', 
        value: this.heap[0], 
        line: 49,
        description: `Moving last element ${this.heap[0]} to root position` 
      });
      this.heapifyDown(0);
    }

    this.animationSteps.push({ 
      type: 'extract_complete', 
      value: item, 
      line: 52,
      description: `Extraction complete. Removed: ${item}` 
    });

    return this.animationSteps;
  }

  heapifyUp(index) {
    this.animationSteps.push({ 
      type: 'heapify_up_start', 
      index, 
      value: this.heap[index],
      line: 18,
      description: `Starting heapify up from index ${index} (value: ${this.heap[index]})` 
    });

    while (this.hasParent(index)) {
      const parentIndex = this.getParentIndex(index);
      
      this.animationSteps.push({ 
        type: 'compare_with_parent', 
        index, 
        parentIndex,
        childValue: this.heap[index],
        parentValue: this.heap[parentIndex],
        line: 20,
        description: `Comparing ${this.heap[index]} with parent ${this.heap[parentIndex]}` 
      });

      if (this.compare(this.heap[index], this.heap[parentIndex])) {
        this.swap(index, parentIndex);
        index = parentIndex;
        this.animationSteps.push({ 
          type: 'heapify_up_continue', 
          index, 
          line: 22,
          description: `Heap property violated, swapped. Continuing from index ${index}` 
        });
      } else {
        this.animationSteps.push({ 
          type: 'heapify_up_complete', 
          index, 
          line: 24,
          description: `Heap property satisfied. Heapify up complete.` 
        });
        break;
      }
    }

    if (!this.hasParent(index)) {
      this.animationSteps.push({ 
        type: 'heapify_up_complete', 
        index, 
        line: 26,
        description: `Reached root. Heapify up complete.` 
      });
    }
  }

  heapifyDown(index) {
    this.animationSteps.push({ 
      type: 'heapify_down_start', 
      index, 
      value: this.heap[index],
      line: 55,
      description: `Starting heapify down from index ${index} (value: ${this.heap[index]})` 
    });

    while (this.hasLeftChild(index)) {
      let targetChildIndex = this.getLeftChildIndex(index);
      
      // Find the appropriate child to compare with
      if (this.hasRightChild(index)) {
        const leftIndex = this.getLeftChildIndex(index);
        const rightIndex = this.getRightChildIndex(index);
        
        this.animationSteps.push({ 
          type: 'compare_children', 
          leftIndex, 
          rightIndex,
          leftValue: this.heap[leftIndex],
          rightValue: this.heap[rightIndex],
          line: 57,
          description: `Comparing children: left=${this.heap[leftIndex]}, right=${this.heap[rightIndex]}` 
        });

        if (this.compare(this.heap[rightIndex], this.heap[leftIndex])) {
          targetChildIndex = rightIndex;
        }
      }

      this.animationSteps.push({ 
        type: 'compare_with_child', 
        index, 
        childIndex: targetChildIndex,
        parentValue: this.heap[index],
        childValue: this.heap[targetChildIndex],
        line: 62,
        description: `Comparing ${this.heap[index]} with target child ${this.heap[targetChildIndex]}` 
      });

      if (this.compare(this.heap[targetChildIndex], this.heap[index])) {
        this.swap(index, targetChildIndex);
        index = targetChildIndex;
        this.animationSteps.push({ 
          type: 'heapify_down_continue', 
          index, 
          line: 64,
          description: `Heap property violated, swapped. Continuing from index ${index}` 
        });
      } else {
        this.animationSteps.push({ 
          type: 'heapify_down_complete', 
          index, 
          line: 66,
          description: `Heap property satisfied. Heapify down complete.` 
        });
        break;
      }
    }

    if (!this.hasLeftChild(index)) {
      this.animationSteps.push({ 
        type: 'heapify_down_complete', 
        index, 
        line: 68,
        description: `No children left. Heapify down complete.` 
      });
    }
  }

  clear() {
    this.heap = [];
    this.animationSteps = [];
  }

  // Convert heap array to tree structure for visualization with proper coordinates
  getTreeNodes() {
    const nodes = [];
    for (let i = 0; i < this.heap.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const positionInLevel = i - (Math.pow(2, level) - 1);
      const totalPositionsInLevel = Math.pow(2, level);
      
      // Calculate x position based on level and position for 760px width
      const spacing = 600 / (totalPositionsInLevel + 1);
      const x = 80 + spacing * (positionInLevel + 1);
      const y = 60 + level * 80;
      
      nodes.push({
        value: this.heap[i],
        index: i,
        x: x,
        y: y,
        level: level
      });
    }
    
    return nodes;
  }

  // Get edges for tree visualization with proper coordinates
  getTreeEdges() {
    const edges = [];
    const nodes = this.getTreeNodes();
    
    for (let i = 0; i < this.heap.length; i++) {
      const leftChildIndex = this.getLeftChildIndex(i);
      const rightChildIndex = this.getRightChildIndex(i);
      
      if (leftChildIndex < this.heap.length) {
        const parent = nodes[i];
        const child = nodes[leftChildIndex];
        edges.push({
          x1: parent.x, y1: parent.y + 22,
          x2: child.x, y2: child.y - 22
        });
      }
      
      if (rightChildIndex < this.heap.length) {
        const parent = nodes[i];
        const child = nodes[rightChildIndex];
        edges.push({
          x1: parent.x, y1: parent.y + 22,
          x2: child.x, y2: child.y - 22
        });
      }
    }
    
    return edges;
  }
}

const HeapVisualizer = () => {
  const [heap, setHeap] = useState(new Heap('min'));
  const [heapType, setHeapType] = useState('min');
  const [inputValue, setInputValue] = useState('');
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [currentOperation, setCurrentOperation] = useState('');
  const [lastExtractResult, setLastExtractResult] = useState(null);
  const [currentLine, setCurrentLine] = useState(0);
  
  const animationTimeoutRef = useRef(null);
  const codeViewerRef = useRef(null);

  // Update tree visualization when heap changes
  useEffect(() => {
    setNodes(heap.getTreeNodes());
    setEdges(heap.getTreeEdges());
  }, [heap]);

  // Update heap type when changed
  useEffect(() => {
    const newHeap = new Heap(heapType);
    // Copy existing values
    heap.heap.forEach(value => {
      newHeap.insert(value);
    });
    setHeap(newHeap);
    setAnimationSteps([]);
    setCurrentStep(-1);
  }, [heapType]);

  // Clear any running animations
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll code to current line - use same approach as BST
  useEffect(() => {
    if (currentLine && codeViewerRef.current) {
      const lineElement = codeViewerRef.current.querySelector(`[data-line-number="${currentLine}"]`);
      if (lineElement) {
        lineElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  }, [currentLine]);

  // Force highlight refresh while animating
  useEffect(() => {
    if (isAnimating && currentLine) {
      requestAnimationFrame(() => {});
    }
  }, [isAnimating, currentLine]);

  const handleInsert = () => {
    if (!inputValue || isAnimating) return;
    
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const steps = heap.insert(value);
    setAnimationSteps(steps);
    setCurrentStep(-1);
    setCurrentOperation(`Insert ${value}`);
    
    // Update visualization
    setNodes(heap.getTreeNodes());
    setEdges(heap.getTreeEdges());
    setInputValue('');
  };

  const handleExtract = () => {
    if (isAnimating || heap.heap.length === 0) return;

    const steps = heap.extract();
    setAnimationSteps(steps);
    setCurrentStep(-1);
  setCurrentOperation(`Extract ${heapType === 'min' ? 'Min' : 'Max'}`);
    
    // Update visualization
    setNodes(heap.getTreeNodes());
    setEdges(heap.getTreeEdges());
    
    // Store result for display
    if (steps.length > 0 && !steps[0].error) {
      setLastExtractResult(steps.find(step => step.type === 'extract_root')?.value);
    }
  };

  const generateRandomHeap = () => {
    if (isAnimating) return;
    
    const newHeap = new Heap(heapType);
    const values = Array.from({length: 7}, () => Math.floor(Math.random() * 99) + 1);
    
    // Insert each value to build the heap
    values.forEach(value => {
      newHeap.insert(value);
    });
    
    setHeap(newHeap);
    setAnimationSteps([]);
    setCurrentStep(-1);
    setCurrentOperation(`Random ${heapType.charAt(0).toUpperCase() + heapType.slice(1)} Heap Generated`);
    setLastExtractResult(null);
  };

  const clearHeap = () => {
    if (isAnimating) return;
    
    setHeap(new Heap(heapType));
    setAnimationSteps([]);
    setCurrentStep(-1);
    setCurrentOperation('Heap Cleared');
    setLastExtractResult(null);
  };

  // Animation controls
  const startAnimation = () => {
    if (animationSteps.length === 0) return;
    setIsAnimating(true);
    playNextStep();
  };

  const playNextStep = () => {
    setCurrentStep(prev => {
      const nextStep = prev + 1;
      if (nextStep >= animationSteps.length) {
        setIsAnimating(false);
        return prev;
      }
      
      // Update current line if available
      if (animationSteps[nextStep]?.line) {
        setCurrentLine(animationSteps[nextStep].line);
      }
      
      animationTimeoutRef.current = setTimeout(() => {
        playNextStep();
      }, animationSpeed);
      
      return nextStep;
    });
  };

  const pauseAnimation = () => {
    setIsAnimating(false);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  };

  const stepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (animationSteps[nextStep]?.line) {
        setCurrentLine(animationSteps[nextStep].line);
      }
    }
  };

  const stepBackward = () => {
    if (currentStep > -1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (prevStep >= 0 && animationSteps[prevStep]?.line) {
        setCurrentLine(animationSteps[prevStep].line);
      }
    }
  };

  const resetAnimation = () => {
    setCurrentStep(-1);
    setCurrentLine(0);
    setIsAnimating(false);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  };

  const currentStepInfo = currentStep >= 0 && currentStep < animationSteps.length ? animationSteps[currentStep] : null;

  const heapCode = `#include <stdio.h>
#include <stdlib.h>

#define MAX_SIZE 100

typedef struct {
    int heap[MAX_SIZE];
    int size;
} ${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap;

void init${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap(${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap* h);
void insert(${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap* h, int value);
int extract${heapType.charAt(0).toUpperCase() + heapType.slice(1)}(${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap* h);
void heapifyUp(${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap* h, int index);
void heapifyDown(${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap* h, int index);

void init${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap(${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap* h) {
    h->size = 0;
}

void insert(${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap* h, int value) {
    if (h->size >= MAX_SIZE) {
        printf("Heap is full!\\n");
        return;
    }
    h->heap[h->size] = value;
    h->size++;
    heapifyUp(h, h->size - 1);
}

void heapifyUp(${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap* h, int index) {
    if (index == 0) return;
    int parentIndex = (index - 1) / 2;
    if (${heapType === 'min' ? 'h->heap[index] < h->heap[parentIndex]' : 'h->heap[index] > h->heap[parentIndex]'}) {
        int temp = h->heap[index];
        h->heap[index] = h->heap[parentIndex];
        h->heap[parentIndex] = temp;
        heapifyUp(h, parentIndex);
    }
}

int extract${heapType.charAt(0).toUpperCase() + heapType.slice(1)}(${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap* h) {
    if (h->size == 0) {
        printf("Heap is empty!\\n");
        return -1;
    }
    int ${heapType}Value = h->heap[0];
    h->heap[0] = h->heap[h->size - 1];
    h->size--;
    if (h->size > 0) {
        heapifyDown(h, 0);
    }
    return ${heapType}Value;
}

void heapifyDown(${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap* h, int index) {
    int leftChild = 2 * index + 1;
    int rightChild = 2 * index + 2;
    int ${heapType === 'min' ? 'smallest' : 'largest'} = index;
    if (leftChild < h->size && ${heapType === 'min' ? 'h->heap[leftChild] < h->heap[smallest]' : 'h->heap[leftChild] > h->heap[largest]'}) {
        ${heapType === 'min' ? 'smallest' : 'largest'} = leftChild;
    }
    if (rightChild < h->size && ${heapType === 'min' ? 'h->heap[rightChild] < h->heap[smallest]' : 'h->heap[rightChild] > h->heap[largest]'}) {
        ${heapType === 'min' ? 'smallest' : 'largest'} = rightChild;
    }
    if (${heapType === 'min' ? 'smallest' : 'largest'} != index) {
        int temp = h->heap[index];
        h->heap[index] = h->heap[${heapType === 'min' ? 'smallest' : 'largest'}];
        h->heap[${heapType === 'min' ? 'smallest' : 'largest'}] = temp;
        heapifyDown(h, ${heapType === 'min' ? 'smallest' : 'largest'});
    }
}

int peek(${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap* h) {
    if (h->size == 0) {
        printf("Heap is empty!\\n");
        return -1;
    }
    return h->heap[0];
}

void printHeap(${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap* h) {
    printf("Heap: ");
    for (int i = 0; i < h->size; i++) {
        printf("%d ", h->heap[i]);
    }
    printf("\\n");
}

int main() {
    ${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap heap;
    init${heapType.charAt(0).toUpperCase() + heapType.slice(1)}Heap(&heap);
    insert(&heap, 10);
    insert(&heap, 20);
    insert(&heap, 5);
    printHeap(&heap);
    printf("Extracted: %d\\n", extract${heapType.charAt(0).toUpperCase() + heapType.slice(1)}(&heap));
    printHeap(&heap);
    return 0;
}`;

  return (
    <div className="tree-app">
      <header className="header">
        <Link to="/trees" className="home-btn">
          <FaHome />
          <span>Trees</span>
        </Link>
        <h1>{heapType.charAt(0).toUpperCase() + heapType.slice(1)} Heap Visualizer</h1>
      </header>

      <main className="split-view">
        <section className="panel code-panel">
          <h2>C Implementation</h2>
          <div className="code-viewer" ref={codeViewerRef}>
            <SyntaxHighlighter
              language="c"
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
                'data-line-number': lineNumber,
                style: { 
                  backgroundColor: lineNumber === currentLine ? 'rgba(88, 166, 255, 0.3)' : 'transparent',
                  display: 'block',
                  color: lineNumber === currentLine ? '#fff' : undefined,
                  fontWeight: lineNumber === currentLine ? 'bold' : 'normal'
                }
              })}
            >
              {heapCode}
            </SyntaxHighlighter>
    </div>
    </section>

        <section className="panel viz-panel">
          <h2>Interactive Visualization</h2>

          <div className="controls">
            <div className="input-group">
              <label>Heap Type:</label>
              <select
                value={heapType}
                onChange={(e) => setHeapType(e.target.value)}
                className="number-input"
                disabled={isAnimating}
              >
                <option value="min">Min Heap</option>
                <option value="max">Max Heap</option>
              </select>
            </div>
          </div>

          <div className="controls">
            <div className="input-group">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter number"
                className="number-input"
                onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                disabled={isAnimating}
              />
              <button onClick={handleInsert} className="btn btn-primary" disabled={!inputValue || isAnimating}>
                <FaPlus /> Insert
              </button>
            </div>

            <div className="action-group">
              <button onClick={handleExtract} className="btn btn-secondary" disabled={isAnimating || heap.heap.length === 0}>
                <FaSignOutAlt /> Extract {heapType === 'min' ? 'Min' : 'Max'}
              </button>
              <button onClick={generateRandomHeap} className="btn btn-info" disabled={isAnimating}>
                <FaRandom /> Random Heap
              </button>
              <button onClick={clearHeap} className="btn btn-warning" disabled={isAnimating}>
                <FaTimes /> Clear Heap
              </button>
            </div>
          </div>

          {animationSteps.length > 0 && (
            <div className="animation-controls">
              <div className="playback-controls">
                <button onClick={stepBackward} className="btn btn-control" disabled={currentStep <= -1}>
                  <FaStepBackward />
                </button>
                {!isAnimating ? (
                  <button onClick={startAnimation} className="btn btn-control" disabled={currentStep >= animationSteps.length - 1}>
                    <FaPlay />
                  </button>
                ) : (
                  <button onClick={pauseAnimation} className="btn btn-control">
                    <FaPause />
                  </button>
                )}
                <button onClick={stepForward} className="btn btn-control" disabled={currentStep >= animationSteps.length - 1}>
                  <FaStepForward />
                </button>
                <button onClick={resetAnimation} className="btn btn-control">
                  Reset
                </button>
                <div className="speed-control">
                  <label>Speed:</label>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                    className="speed-slider"
                  />
                  <span>{animationSpeed}ms</span>
                </div>
              </div>
            </div>
          )}

          {currentStepInfo && (
            <div className="message">
              Step {currentStep + 1} of {animationSteps.length} — {currentOperation}. {currentStepInfo.description}
              {currentStepInfo.line && (
                <span className="code-line"> (Line {currentStepInfo.line})</span>
              )}
            </div>
          )}

          <div className="tree-display">
            {nodes.length > 0 ? (() => {
              // Calculate proper SVG dimensions like BST
              const heapHeight = Math.floor(Math.log2(heap.heap.length)) + 1;
              const svgWidth = 760;
              const svgHeight = Math.min(460, Math.max(heapHeight * 80 + 100, 300));
              
              return (
                <svg 
                  width={svgWidth} 
                  height={svgHeight} 
                  className="tree-svg"
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {edges.map((edge, index) => (
                    <line
                      key={index}
                      x1={edge.x1}
                      y1={edge.y1}
                      x2={edge.x2}
                      y2={edge.y2}
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="2"
                    />
                  ))}
                  {nodes.map((node, index) => {
                    let nodeClass = 'tree-node';
                    if (currentStepInfo) {
                      if (currentStepInfo.indices && currentStepInfo.indices.includes(node.index)) nodeClass += ' highlighted';
                      if (currentStepInfo.index === node.index) nodeClass += ' highlighted';
                      if (currentStepInfo.type === 'insert' && currentStepInfo.value === node.value) nodeClass += ' inserted';
                    }
                    const nodeRadius = 22;
                    return (
                      <g key={index}>
                        <circle cx={node.x} cy={node.y} r={nodeRadius} className={nodeClass} />
                        <text x={node.x} y={node.y - 2} textAnchor="middle" dominantBaseline="central" className="node-text" fontSize="16" fill="white" fontWeight="700">
                          {node.value}
                        </text>
                        <text x={node.x} y={node.y + 8} textAnchor="middle" dominantBaseline="central" className="node-info" fontSize="10" fill="#94a3b8">
                          [{node.index}]
                        </text>
                      </g>
                    );
                  })}
                </svg>
              );
            })() : (
              <div className="empty-tree">
                <p>{heapType.charAt(0).toUpperCase() + heapType.slice(1)} Heap is empty</p>
                <p>Insert some numbers to start</p>
              </div>
            )}
          </div>

          {heap.heap.length > 0 && (
            <div className="array-representation">
              <h3>Array Representation</h3>
              <div className="array-display">
                {heap.heap.map((value, index) => (
                  <div key={index} className={`array-element ${currentStepInfo?.indices?.includes(index) ? 'highlighted' : ''} ${currentStepInfo?.index === index ? 'highlighted' : ''}`}>
                    <div className="array-value">{value}</div>
                    <div className="array-index">[{index}]</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lastExtractResult !== null && (
            <div className="tree-properties">
              <h3>Last Extracted</h3>
              <div className="properties-grid">
                <div className="property"><span>Type</span><span>{heapType === 'min' ? 'Min' : 'Max'}</span></div>
                <div className="property"><span>Value</span><span>{lastExtractResult}</span></div>
              </div>
            </div>
          )}

          {heap.heap.length > 0 && (
            <div className="tree-properties">
              <h3>Heap Information</h3>
              <div className="properties-grid">
                <div className="property"><span>Total Elements</span><span>{heap.heap.length}</span></div>
                <div className="property"><span>Heap Height</span><span>{Math.floor(Math.log2(heap.heap.length)) + 1}</span></div>
                <div className="property"><span>Root ({heapType === 'min' ? 'Min' : 'Max'})</span><span>{heap.peek() || 'Empty'}</span></div>
              </div>
            </div>
          )}

          <HeapExplanation />
          <TreeDiySection />
        </section>
      </main>
    </div>
  );
};

export default HeapVisualizer;
