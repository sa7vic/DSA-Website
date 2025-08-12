/**
 * Main Application Component - DSA Website
 * 
 * This is the root component that handles routing between different visualizers.
 * Each route corresponds to a different data structure or algorithm visualization.
 * 
 * Structure:
 * - Home: Landing page with feature cards
 * - Linked List: Doubly linked list with code generation
 * - Stack/Queue: Stack and queue operations
 * - Tree: Binary search tree with traversals
 * - Sorting: Various sorting algorithm animations
 * - Pathfinding: Grid-based pathfinding algorithms
 * - About: Team information
 */

import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome } from 'react-icons/fa'

// Global styles - imported in order of specificity
import './App.css'

import './features/linkedList/styles/LinkedListHome.css'
import './features/linkedList/styles/LinkedList.css'
import './features/sorting/styles/Sorting.css'
import './features/tree/styles/TreeVisualizer.css'
import './features/tree/styles/TreeHome.css'
import './features/pathfinding/styles/Pathfinding.css'
import './features/quiz/styles/Quiz.css'
import './features/quiz/styles/landingpage.css'
import './features/archive/styles/landingpage.css'
import './features/archive/styles/Archive.css'
import './features/searchAlgos/styles/SearchAlgos.css'
import './features/graphs/styles/GraphAlgorithmsList.css'
import './features/graphs/styles/GraphVisualizerTemplate.css'
import './features/recursion/styles/RecursionVisualizer.css'
import './features/hashTable/styles/HashTableVisualizer.css'
import './features/greedyAlgorithms/styles/GreedyAlgorithmsList.css'
import './features/greedyAlgorithms/styles/GreedyVisualizerTemplate.css'
import './features/flowcharts/styles/BlockBuilder.css'


// Shared components
import ErrorBoundary from './features/common/components/ErrorBoundary'
import CodeViewer from './features/common/components/CodeViewer'

// Feature components - each handles its own visualization
import LinkedListHome from './features/linkedList/components/LinkedListHome'
import DoublyLinkedListVisualizer from './features/linkedList/components/DoublyLinkedListVisualizer'
import SinglyLinkedListVisualizer from './features/linkedList/components/SinglyLinkedListVisualizer'
import SinglyLinkedListExplanation from './features/linkedList/components/SinglyLinkedListExplanation'
import SinglyLinkedListCodeViewer from './features/linkedList/components/SinglyLinkedListCodeViewer'
import CircularLinkedListVisualizer from './features/linkedList/components/CircularLinkedListVisualizer'
import CircularLinkedListExplanation from './features/linkedList/components/CircularLinkedListExplanation'
import CircularLinkedListCodeViewer from './features/linkedList/components/CircularLinkedListCodeViewer'
import DiySection from './features/linkedList/components/DiySection'
import DoublyLinkedListExplanation from './features/linkedList/components/DoublyLinkedListExplanation'
import DoublyLinkedListCodeViewer from './features/linkedList/components/DoublyLinkedListCodeViewer'
import HomePage from './features/home/components/HomePage'
import AboutUs from './features/about/components/AboutUs'
import SortingVisualizer from './features/sorting/components/SortingVisualizer'
import StackQueueVisualizer from './features/stackQueue/components/StackQueueVisualizer'
import TreeHome from './features/tree/components/TreeHome'
import TreeVisualizer from './features/tree/components/TreeVisualizer'
import BSTVisualizer from './features/tree/components/BSTVisualizer'
import HeapVisualizer from './features/tree/components/HeapVisualizer'
import AVLTreeVisualizer from './features/tree/components/AVLTreeVisualizer'
import RecursionVisualizer from './features/recursion/components/RecursionVisualizer'
import HashTableVisualizer from './features/hashTable/components/HashTableVisualizer'
import PathfindingVisualizer from './features/pathfinding/components/PathfindingVisualizer'
import LandingPage from './features/quiz/components/landingpage';
import Quiz from './features/quiz/components/Quiz';
import ArchiveLanding from './features/archive/components/landingpage'
import Archive from './features/archive/components/Archive'
import SearchAlgos from './features/searchAlgos/components/SearchAlgos';
import PointersPage from './features/pointers/PointersPage';

// Graph algorithm components
import {
  GraphAlgorithmsList,
  BFSPage,
  DFSPage,
  DijkstraPage,
  PrimPage,
  KruskalPage
} from './features/graphs';

// Greedy algorithm components
import GreedyAlgorithmsList from './features/greedyAlgorithms/components/GreedyAlgorithmsList';
import BoyerMooreMajority from './features/greedyAlgorithms/components/BoyerMooreMajority';
import StableMatching from './features/greedyAlgorithms/components/StableMatching';
import JobScheduling from './features/greedyAlgorithms/components/JobScheduling';

// Flowchart algorithm builder component
import { BlockBasedAlgorithmBuilder } from './features/flowcharts';


// Utility functions
import { generateCppCode } from './utils/codeGenerator'
import { generateSinglyLinkedListCode } from './utils/singlyLinkedListCodeGenerator'
import { generateCircularLinkedListCode } from './utils/circularLinkedListCodeGenerator'
import { generateDoublyLinkedListCode } from './utils/doublyLinkedListCodeGenerator'
import { setStorageItem, getStorageItem } from './utils/helpers'
import { MEMORY_POOL_SIZE } from './constants'

/**
 * LinkedListPage wrapper component
 * Handles state coordination between code viewer and visualizer
 * Manages animation synchronization and memory pool
 */
function LinkedListPage({ nodes, setNodes, code, setCode, memoryPoolAddresses, handleMemoryPoolInit, handleCodeChange, updateNodesAndCode }) {
  // State for animation coordination between CodeViewer and DoublyLinkedListVisualizer
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  // Function to handle animation state updates from DoublyLinkedListVisualizer
  const handleAnimationUpdate = useCallback((lineNumber, step, animating) => {
    setCurrentLine(lineNumber);
    setCurrentStep(step);
    setIsAnimating(animating);
  }, []);

  return (
    <div className="app-container">
      <div className="linkedlist-bg-overlay"></div>
     
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
        <h1 style={{ flex: 1, textAlign: 'center' }}>Linked List Visualizer</h1>
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
          <h2>C Implementation</h2>
          <DoublyLinkedListCodeViewer 
            code={code} 
            onChange={handleCodeChange}
            currentLine={currentLine}
            isAnimating={isAnimating}
            nodes={nodes}
          />
        </motion.div>

        <motion.div 
          className="panel panel-right"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Interactive Visualization</h2>
          <DoublyLinkedListVisualizer 
            nodes={nodes} 
            onNodesChange={updateNodesAndCode}
            onMemoryPoolInit={handleMemoryPoolInit}
            onAnimationUpdate={handleAnimationUpdate}
          />
          <DoublyLinkedListExplanation />
          <DiySection code={code} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * SinglyLinkedListPage wrapper component
 * Handles state coordination between code viewer and visualizer for singly linked lists
 * Manages animation synchronization and memory pool
 */
function SinglyLinkedListPage({ nodes, setNodes, code, setCode, memoryPoolAddresses, handleMemoryPoolInit, handleCodeChange, updateNodesAndCode }) {
  // State for animation coordination between CodeViewer and SinglyLinkedListVisualizer
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  // Function to handle animation state updates from SinglyLinkedListVisualizer
  const handleAnimationUpdate = useCallback((lineNumber, step, animating) => {
    setCurrentLine(lineNumber);
    setCurrentStep(step);
    setIsAnimating(animating);
  }, []);

  return (
    <div className="app-container">
      <div className="linkedlist-bg-overlay"></div>
     
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
        <h1 style={{ flex: 1, textAlign: 'center' }}>Singly Linked List Visualizer</h1>
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
          <h2>C Implementation</h2>
          <SinglyLinkedListCodeViewer 
            code={code} 
            onChange={handleCodeChange}
            currentLine={currentLine}
            isAnimating={isAnimating}
            nodes={nodes}
          />
        </motion.div>

        <motion.div 
          className="panel panel-right"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Interactive Visualization</h2>
          <SinglyLinkedListVisualizer 
            nodes={nodes} 
            onNodesChange={updateNodesAndCode}
            onMemoryPoolInit={handleMemoryPoolInit}
            onAnimationUpdate={handleAnimationUpdate}
          />
          <SinglyLinkedListExplanation />
          <DiySection code={code} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * CircularLinkedListPage wrapper component
 * Handles state coordination between code viewer and visualizer for circular linked lists
 * Manages animation synchronization and memory pool
 */
function CircularLinkedListPage({ nodes, setNodes, code, setCode, memoryPoolAddresses, handleMemoryPoolInit, handleCodeChange, updateNodesAndCode }) {
  // State for animation coordination between CodeViewer and CircularLinkedListVisualizer
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  // Function to handle animation state updates from CircularLinkedListVisualizer
  const handleAnimationUpdate = useCallback((lineNumber, step, animating) => {
    setCurrentLine(lineNumber);
    setCurrentStep(step);
    setIsAnimating(animating);
  }, []);

  return (
    <div className="app-container">
      <div className="linkedlist-bg-overlay"></div>
     
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
        <h1 style={{ flex: 1, textAlign: 'center' }}>Circular Linked List Visualizer</h1>
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
          <h2>C Implementation</h2>
          <CircularLinkedListCodeViewer 
            code={code} 
            onChange={handleCodeChange}
            currentLine={currentLine}
            isAnimating={isAnimating}
            nodes={nodes}
          />
        </motion.div>

        <motion.div 
          className="panel panel-right"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Interactive Visualization</h2>
          <CircularLinkedListVisualizer 
            nodes={nodes} 
            onNodesChange={updateNodesAndCode}
            onMemoryPoolInit={handleMemoryPoolInit}
            onAnimationUpdate={handleAnimationUpdate}
          />
          <CircularLinkedListExplanation />
          <DiySection code={code} />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Redirection component for the pathfinding visualizer
function PathfindingRedirect() {
  useEffect(() => {
    // Redirect to the standalone pathfinding visualizer HTML file
    window.location.href = '/pathfinding.html';
  }, []);
  
  return <div>Redirecting to Pathfinding Visualizer...</div>;
}

function App() {
  // Persist state at App level using helper functions for doubly linked list
  const [nodes, setNodes] = useState(() => {
    const saved = getStorageItem('linkedListNodes', 'session');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [code, setCode] = useState(() => {
    const saved = getStorageItem('linkedListCode', 'session');
    return saved || generateDoublyLinkedListCode([]);
  });

  // State for singly linked list
  const [singlyNodes, setSinglyNodes] = useState(() => {
    const saved = getStorageItem('singlyLinkedListNodes', 'session');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [singlyCode, setSinglyCode] = useState(() => {
    const saved = getStorageItem('singlyLinkedListCode', 'session');
    return saved || generateSinglyLinkedListCode([]);
  });

  // State for circular linked list
  const [circularNodes, setCircularNodes] = useState(() => {
    const saved = getStorageItem('circularLinkedListNodes', 'session');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [circularCode, setCircularCode] = useState(() => {
    const saved = getStorageItem('circularLinkedListCode', 'session');
    return saved || generateCircularLinkedListCode([]);
  });

  // Save state to sessionStorage when it changes
  useEffect(() => {
    setStorageItem('linkedListNodes', JSON.stringify(nodes), 'session');
    setStorageItem('linkedListCode', code, 'session');
  }, [nodes, code]);

  useEffect(() => {
    setStorageItem('singlyLinkedListNodes', JSON.stringify(singlyNodes), 'session');
    setStorageItem('singlyLinkedListCode', singlyCode, 'session');
  }, [singlyNodes, singlyCode]);

  useEffect(() => {
    setStorageItem('circularLinkedListNodes', JSON.stringify(circularNodes), 'session');
    setStorageItem('circularLinkedListCode', circularCode, 'session');
  }, [circularNodes, circularCode]);

  // Store memory pool addresses
  const [memoryPoolAddresses, setMemoryPoolAddresses] = useState([]);

  // Function to handle memory pool initialization
  const handleMemoryPoolInit = (addresses) => {
    setMemoryPoolAddresses(addresses);
  };

  // Function to update visualization based on code changes
  const handleCodeChange = (nodesData) => {
    if (Array.isArray(nodesData) && memoryPoolAddresses.length > 0) {
      // Track used indices to avoid duplicates
      const usedIndices = new Set();
      
      const newNodes = nodesData.map((node, index) => {
        // Find first available index
        let memoryIndex = index % MEMORY_POOL_SIZE; // Make sure we don't go beyond pool size
        
        // Only increment if this index is already used
        if (usedIndices.has(memoryIndex)) {
          let attemptsCount = 0;
          while (usedIndices.has(memoryIndex) && attemptsCount < MEMORY_POOL_SIZE) {
            memoryIndex = (memoryIndex + 1) % MEMORY_POOL_SIZE;
            attemptsCount++;
          }
          
          // If we couldn't find an available slot, just use the original index
          if (attemptsCount >= MEMORY_POOL_SIZE) {
            memoryIndex = index % MEMORY_POOL_SIZE;
          }
        }
        
        usedIndices.add(memoryIndex);
        
        return {
          data: node.data,
          address: memoryPoolAddresses[memoryIndex],
          memoryIndex: memoryIndex,
          prev: index > 0 ? index - 1 : null,  // Use array indices for links
          next: index < nodesData.length - 1 ? index + 1 : null
        };
      });
      setNodes(newNodes);
    }
  };

  // Function to update both nodes and code when using buttons
  const updateNodesAndCode = (newNodes) => {
    setNodes(newNodes);
    // Update the code state which will trigger DoublyLinkedListCodeViewer update
    setCode(generateDoublyLinkedListCode(newNodes));
  };

  // Helper functions for singly linked list
  const handleSinglyCodeChange = (nodesData) => {
    if (Array.isArray(nodesData) && memoryPoolAddresses.length > 0) {
      // Track used indices to avoid duplicates
      const usedIndices = new Set();
      
      const newNodes = nodesData.map((node, index) => {
        // Find first available index
        let memoryIndex = index % MEMORY_POOL_SIZE;
        
        // Only increment if this index is already used
        if (usedIndices.has(memoryIndex)) {
          let attemptsCount = 0;
          while (usedIndices.has(memoryIndex) && attemptsCount < MEMORY_POOL_SIZE) {
            memoryIndex = (memoryIndex + 1) % MEMORY_POOL_SIZE;
            attemptsCount++;
          }
          
          // If we couldn't find an available slot, just use the original index
          if (attemptsCount >= MEMORY_POOL_SIZE) {
            memoryIndex = index % MEMORY_POOL_SIZE;
          }
        }
        
        usedIndices.add(memoryIndex);
        
        return {
          data: node.data,
          address: memoryPoolAddresses[memoryIndex],
          memoryIndex: memoryIndex,
          next: index < nodesData.length - 1 ? index + 1 : null  // Only next pointer for singly linked list
        };
      });
      setSinglyNodes(newNodes);
    }
  };

  const updateSinglyNodesAndCode = (newNodes) => {
    setSinglyNodes(newNodes);
    setSinglyCode(generateSinglyLinkedListCode(newNodes));
  };

  // Helper functions for circular linked list
  const handleCircularCodeChange = (nodesData) => {
    if (Array.isArray(nodesData) && memoryPoolAddresses.length > 0) {
      // Track used indices to avoid duplicates
      const usedIndices = new Set();
      
      const newNodes = nodesData.map((node, index) => {
        // Find first available index
        let memoryIndex = index % MEMORY_POOL_SIZE;
        
        // Only increment if this index is already used
        if (usedIndices.has(memoryIndex)) {
          let attemptsCount = 0;
          while (usedIndices.has(memoryIndex) && attemptsCount < MEMORY_POOL_SIZE) {
            memoryIndex = (memoryIndex + 1) % MEMORY_POOL_SIZE;
            attemptsCount++;
          }
          
          // If we couldn't find an available slot, just use the original index
          if (attemptsCount >= MEMORY_POOL_SIZE) {
            memoryIndex = index % MEMORY_POOL_SIZE;
          }
        }
        
        usedIndices.add(memoryIndex);
        
        // For circular linked list, last node points to first
        let nextIndex = null;
        if (nodesData.length > 1) {
          nextIndex = index < nodesData.length - 1 ? index + 1 : 0; // Last points to first
        } else if (nodesData.length === 1) {
          nextIndex = 0; // Single node points to itself
        }
        
        return {
          data: node.data,
          address: memoryPoolAddresses[memoryIndex],
          memoryIndex: memoryIndex,
          next: nextIndex
        };
      });
      setCircularNodes(newNodes);
    }
  };

  const updateCircularNodesAndCode = (newNodes) => {
    setCircularNodes(newNodes);
    setCircularCode(generateCircularLinkedListCode(newNodes));
  };

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/linked-list" element={<ErrorBoundary><LinkedListHome /></ErrorBoundary>} />
          <Route 
            path="/doubly-linkedlist" 
            element={
              <ErrorBoundary>
                <LinkedListPage
                  nodes={nodes}
                  setNodes={setNodes}
                  code={code}
                  setCode={setCode}
                  memoryPoolAddresses={memoryPoolAddresses}
                  handleMemoryPoolInit={handleMemoryPoolInit}
                  handleCodeChange={handleCodeChange}
                  updateNodesAndCode={updateNodesAndCode}
                />
              </ErrorBoundary>
            }
          />
          <Route 
            path="/singly-linkedlist" 
            element={
              <ErrorBoundary>
                <SinglyLinkedListPage
                  nodes={singlyNodes}
                  setNodes={setSinglyNodes}
                  code={singlyCode}
                  setCode={setSinglyCode}
                  memoryPoolAddresses={memoryPoolAddresses}
                  handleMemoryPoolInit={handleMemoryPoolInit}
                  handleCodeChange={handleSinglyCodeChange}
                  updateNodesAndCode={updateSinglyNodesAndCode}
                />
              </ErrorBoundary>
            }
          />
          <Route 
            path="/circular-linkedlist" 
            element={
              <ErrorBoundary>
                <CircularLinkedListPage
                  nodes={circularNodes}
                  setNodes={setCircularNodes}
                  code={circularCode}
                  setCode={setCircularCode}
                  memoryPoolAddresses={memoryPoolAddresses}
                  handleMemoryPoolInit={handleMemoryPoolInit}
                  handleCodeChange={handleCircularCodeChange}
                  updateNodesAndCode={updateCircularNodesAndCode}
                />
              </ErrorBoundary>
            }
          />
          <Route path="/sorting" element={<ErrorBoundary><SortingVisualizer /></ErrorBoundary>} />
          <Route path="/stacks-queues" element={<ErrorBoundary><StackQueueVisualizer /></ErrorBoundary>} />
          
          {/* Tree Routes */}
          <Route path="/trees" element={<ErrorBoundary><TreeHome /></ErrorBoundary>} />
          <Route path="/trees/bst" element={<ErrorBoundary><BSTVisualizer /></ErrorBoundary>} />
          <Route path="/trees/heap" element={<ErrorBoundary><HeapVisualizer /></ErrorBoundary>} />
          <Route path="/trees/avl" element={<ErrorBoundary><AVLTreeVisualizer /></ErrorBoundary>} />
          <Route path="/tree" element={<Navigate replace to="/trees" />} />
          
          <Route path="/recursion" element={<ErrorBoundary><RecursionVisualizer /></ErrorBoundary>} />
          <Route path="/hashtable" element={<ErrorBoundary><HashTableVisualizer /></ErrorBoundary>} />
          <Route path="/pathfinding" element={<ErrorBoundary><PathfindingRedirect /></ErrorBoundary>} />
          <Route path="/about" element={<AboutUs />} />
          {/* Graph Algorithm Routes */}
          <Route path="/graphs" element={<ErrorBoundary><GraphAlgorithmsList /></ErrorBoundary>} />
          <Route path="/graphs/bfs" element={<ErrorBoundary><BFSPage /></ErrorBoundary>} />
          <Route path="/graphs/dfs" element={<ErrorBoundary><DFSPage /></ErrorBoundary>} />
          <Route path="/graphs/dijkstra" element={<ErrorBoundary><DijkstraPage /></ErrorBoundary>} />
          <Route path="/graphs/prim" element={<ErrorBoundary><PrimPage /></ErrorBoundary>} />
          <Route path="/graphs/kruskal" element={<ErrorBoundary><KruskalPage /></ErrorBoundary>} />
          {/* Greedy Algorithm Routes */}
          <Route path="/greedy" element={<ErrorBoundary><GreedyAlgorithmsList /></ErrorBoundary>} />
          <Route path="/greedy/boyer-moore" element={<ErrorBoundary><BoyerMooreMajority /></ErrorBoundary>} />
          <Route path="/greedy/stable-matching" element={<ErrorBoundary><StableMatching /></ErrorBoundary>} />
          <Route path="/greedy/job-scheduling" element={<ErrorBoundary><JobScheduling /></ErrorBoundary>} />
          {/* Flowchart Algorithm Builder Route */}
          <Route path="/flowcharts" element={<ErrorBoundary><BlockBasedAlgorithmBuilder /></ErrorBoundary>} />
          {/* Redirect old routes */}
          <Route path="/pathfinding-visualizer" element={<Navigate replace to="/pathfinding" />} />
          <Route path="/archive" element={<ErrorBoundary><ArchiveLanding /></ErrorBoundary>} />
          <Route path="/archive/:topic" element={<ErrorBoundary><Archive /></ErrorBoundary>} />
          <Route path="/archive/pyq/:topic" element={<ErrorBoundary><Archive /></ErrorBoundary>} />
          
          <Route path="/quiz" element={<LandingPage />} />
          <Route path="/quiz/:topic" element={<ErrorBoundary><Quiz /></ErrorBoundary>} />
          <Route path="/search" element={<ErrorBoundary><SearchAlgos /></ErrorBoundary>} />
          <Route path="/pointers" element={<PointersPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
