import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaHome, FaExpandArrowsAlt, FaCompressArrowsAlt, FaInfoCircle, 
  FaCode, FaTree, FaPlay, FaPause, FaStepForward, FaStepBackward,
  FaPlus, FaSearch, FaTrash, FaRandom, FaEraser, FaBars, FaTimes,
  FaListOl, FaSitemap, FaCode as FaCodeBranch
} from 'react-icons/fa';
import { BinaryTree } from '../lib/animated-binary-tree.js';
import { SvgTree } from './AnimatedBinaryTree';
import { VisualizerControls } from './VisualizerControls';
import { inOrderTraversal, preOrderTraversal, postOrderTraversal } from '../lib/traversal-algorithms';
import CodeViewer from './CodeViewer';
import CodeHighlighter from '../../common/components/CodeHighlighter';
import '../styles/EnhancedTreeVisualizer.css';

const EnhancedTreeVisualizer = () => {
  // Core tree state
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [tree, setTree] = useState(new BinaryTree());
  const [value, setValue] = useState("");
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [currentOperation, setCurrentOperation] = useState('none');
  const [currentTraversal, setCurrentTraversal] = useState('');
  
  // UI state
  const [activePanel, setActivePanel] = useState('tree');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCodeViewer, setShowCodeViewer] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const timeoutRef = useRef(null);

  // Animation control
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (isPlaying && currentStepIndex < animationSteps.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
      }, animationSpeed);
    } else if (currentStepIndex >= animationSteps.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, animationSteps, animationSpeed]);

  // Control handlers
  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleStepForward = () => {
    if (currentStepIndex < animationSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Operation handlers
  const handleInsert = () => {
    const key = parseInt(value);
    if (isNaN(key) || key <= 0) {
      alert("Please enter a positive integer");
      return;
    }

    setCurrentOperation('insert');
    const clonedTree = tree.clone();
    const steps = clonedTree.insert(key);
    setTree(clonedTree);
    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setValue("");
  };

  const handleFind = () => {
    const key = parseInt(value);
    if (isNaN(key) || key <= 0) {
      alert("Please enter a positive integer");
      return;
    }

    setCurrentOperation('search');
    const clonedTree = tree.clone();
    const steps = clonedTree.find(key);
    setTree(clonedTree);
    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setValue("");
  };

  const handleDelete = () => {
    const key = parseInt(value);
    if (isNaN(key) || key <= 0) {
      alert("Please enter a positive integer");
      return;
    }

    setCurrentOperation('delete');
    const clonedTree = tree.clone();
    const steps = clonedTree.delete(key);
    setTree(clonedTree);
    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setValue("");
  };

  const handleGenerateRandom = () => {
    const size = Math.floor(Math.random() * 7) + 3;
    const randomTree = BinaryTree.random(size);
    setTree(randomTree);
    setAnimationSteps([
      {
        tree: randomTree.cloneNode(randomTree.root),
        description: `Generated random tree with ${size} nodes`,
        cursor: null,
      },
    ]);
    setCurrentStepIndex(0);
    setCurrentOperation('generate');
  };

  const handleClear = () => {
    setTree(new BinaryTree());
    setAnimationSteps([
      {
        tree: null,
        cursor: null,
        description: "Tree cleared",
      },
    ]);
    setCurrentStepIndex(0);
    setCurrentOperation('clear');
  };

  // Traversal handlers
  const handleInOrderTraversal = () => {
    if (!tree || !tree.root) {
      alert("Tree is empty. Please insert some values first.");
      return;
    }
    
    const treeData = toHierarchyData(tree.cloneNode(tree.root));
    const { results } = inOrderTraversal(treeData);
    setAnimationSteps(results);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setCurrentTraversal("In-Order");
    setCurrentOperation('traversal');
  };
  
  const handlePreOrderTraversal = () => {
    if (!tree || !tree.root) {
      alert("Tree is empty. Please insert some values first.");
      return;
    }
    
    const treeData = toHierarchyData(tree.cloneNode(tree.root));
    const { results } = preOrderTraversal(treeData);
    setAnimationSteps(results);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setCurrentTraversal("Pre-Order");
    setCurrentOperation('traversal');
  };
  
  const handlePostOrderTraversal = () => {
    if (!tree || !tree.root) {
      alert("Tree is empty. Please insert some values first.");
      return;
    }
    
    const treeData = toHierarchyData(tree.cloneNode(tree.root));
    const { results } = postOrderTraversal(treeData);
    setAnimationSteps(results);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setCurrentTraversal("Post-Order");
    setCurrentOperation('traversal');
  };

  // Helper function to convert tree to hierarchy data
  const toHierarchyData = (node) => {
    if (!node) return null;
    
    const hierarchyNode = {
      name: node.key.toString(),
      children: []
    };
    
    if (node.left) {
      hierarchyNode.children[0] = toHierarchyData(node.left);
    }
    
    if (node.right) {
      hierarchyNode.children[1] = toHierarchyData(node.right);
    }
    
    return hierarchyNode;
  };

  // Current tree data based on animation step
  const currentTreeData = animationSteps.length > 0
    ? animationSteps[currentStepIndex].tree
    : tree.root;

  const currentCursor = animationSteps.length > 0
    ? (animationSteps[currentStepIndex].cursor?.key || 0)
    : 0;

  const currentDescription = animationSteps.length > 0
    ? animationSteps[currentStepIndex].description
    : "Ready for operations";

  // Get current code for the operation (C language)
  const getCurrentCode = () => {
    switch (currentOperation) {
      case 'insert':
        return `// Binary Search Tree Insert in C
#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};

struct TreeNode* createNode(int value) {
    struct TreeNode* newNode = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    newNode->data = value;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

struct TreeNode* insert(struct TreeNode* root, int value) {
    // Base case: if tree is empty
    if (root == NULL) {
        return createNode(value);
    }
    
    // Recursively insert in left or right subtree
    if (value < root->data) {
        root->left = insert(root->left, value);
    } else if (value > root->data) {
        root->right = insert(root->right, value);
    }
    
    return root;
}`;
      case 'search':
        return `// Binary Search Tree Search in C
#include <stdio.h>
#include <stdbool.h>

struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};

bool search(struct TreeNode* root, int value) {
    // Base case: empty tree or value not found
    if (root == NULL) {
        return false;
    }
    
    // Value found
    if (root->data == value) {
        return true;
    }
    
    // Search in left or right subtree
    if (value < root->data) {
        return search(root->left, value);
    } else {
        return search(root->right, value);
    }
}`;
      case 'delete':
        return `// Binary Search Tree Delete in C
#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};

struct TreeNode* findMin(struct TreeNode* root) {
    while (root && root->left) {
        root = root->left;
    }
    return root;
}

struct TreeNode* deleteNode(struct TreeNode* root, int value) {
    if (root == NULL) {
        return root;
    }
    
    if (value < root->data) {
        root->left = deleteNode(root->left, value);
    } else if (value > root->data) {
        root->right = deleteNode(root->right, value);
    } else {
        // Node to be deleted found
        if (root->left == NULL) {
            struct TreeNode* temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            struct TreeNode* temp = root->left;
            free(root);
            return temp;
        }
        
        // Node with two children
        struct TreeNode* temp = findMin(root->right);
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }
    return root;
}`;
      case 'inorder':
        return `// In-Order Traversal in C
#include <stdio.h>

struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};

void inOrderTraversal(struct TreeNode* root) {
    if (root != NULL) {
        // Traverse left subtree
        inOrderTraversal(root->left);
        
        // Visit root node
        printf("%d ", root->data);
        
        // Traverse right subtree
        inOrderTraversal(root->right);
    }
}

// Result: Left -> Root -> Right
// For BST: produces sorted sequence`;
      case 'preorder':
        return `// Pre-Order Traversal in C
#include <stdio.h>

struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};

void preOrderTraversal(struct TreeNode* root) {
    if (root != NULL) {
        // Visit root node
        printf("%d ", root->data);
        
        // Traverse left subtree
        preOrderTraversal(root->left);
        
        // Traverse right subtree
        preOrderTraversal(root->right);
    }
}

// Result: Root -> Left -> Right
// Used for: copying/serializing tree`;
      case 'postorder':
        return `// Post-Order Traversal in C
#include <stdio.h>

struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};

void postOrderTraversal(struct TreeNode* root) {
    if (root != NULL) {
        // Traverse left subtree
        postOrderTraversal(root->left);
        
        // Traverse right subtree
        postOrderTraversal(root->right);
        
        // Visit root node
        printf("%d ", root->data);
    }
}

// Result: Left -> Right -> Root
// Used for: deleting tree nodes`;
      default:
        return `// Binary Search Tree in C
#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};

// Create a new tree node
struct TreeNode* createNode(int value) {
    struct TreeNode* newNode = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    newNode->data = value;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

// Main operations:
// - insert(root, value)
// - search(root, value)
// - deleteNode(root, value)
// - inOrderTraversal(root)
// - preOrderTraversal(root)
// - postOrderTraversal(root)`;
    }
  };

  return (
    <div className="enhanced-tree-visualizer">
      {/* Top Navigation Bar */}
      <motion.header 
        className="nav-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-content">
          <Link to="/" className="home-link">
            <FaHome />
            <span>Home</span>
          </Link>

          <div className="title-section">
            
            <h1>Binary Search Tree Visualizer</h1>
          </div>

          <div className="nav-controls">
            <button 
              className="mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`nav-buttons ${showMobileMenu ? 'mobile-open' : ''}`}>
              <button 
                className={`nav-btn ${activePanel === 'tree' ? 'active' : ''}`}
                onClick={() => setActivePanel('tree')}
              >
                <FaTree />
                <span>Tree</span>
              </button>
              <button 
                className={`nav-btn ${showCodeViewer ? 'active' : ''}`}
                onClick={() => setShowCodeViewer(!showCodeViewer)}
              >
                <FaCode />
                <span>Code</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Layout Container */}
      <div className={`main-layout ${showCodeViewer ? 'with-code-viewer' : ''}`}>
        
        {/* Sidebar with Controls - Collapsible */}
        <motion.aside 
          className={`controls-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="sidebar-header">
            <h2>Operations</h2>
            <button 
              className="sidebar-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {isSidebarOpen && (
            <div className="controls-content">
              {/* Input Section */}
              <div className="input-section">
                <h3>Insert/Search/Delete</h3>
                <div className="input-group">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter a number"
                    className="value-input"
                  />
                  <div className="operation-buttons">
                    <button onClick={handleInsert} className="op-btn insert-btn">
                      <FaPlus />
                      Insert
                    </button>
                    <button onClick={handleFind} className="op-btn search-btn">
                      <FaSearch />
                      Search
                    </button>
                    <button onClick={handleDelete} className="op-btn delete-btn">
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Tree Generation */}
              <div className="generation-section">
                <h3>Tree Generation</h3>
                <div className="gen-buttons">
                  <button onClick={handleGenerateRandom} className="gen-btn random-btn">
                   
                    Random Tree
                  </button>
                  <button onClick={handleClear} className="gen-btn clear-btn">
                   
                    Clear Tree
                  </button>
                </div>
              </div>

              {/* Traversal Section */}
              <div className="traversal-section">
                <h3>Tree Traversals</h3>
                <div className="traversal-buttons">
                  <button onClick={handleInOrderTraversal} className="trav-btn inorder-btn">
                   
                    In-Order
                    <small>Left → Root → Right</small>
                  </button>
                  <button onClick={handlePreOrderTraversal} className="trav-btn preorder-btn">
                   
                    Pre-Order
                    <small>Root → Left → Right</small>
                  </button>
                  <button onClick={handlePostOrderTraversal} className="trav-btn postorder-btn">
                   
                    Post-Order
                    <small>Left → Right → Root</small>
                  </button>
                </div>
              </div>

              {/* Animation Controls */}
              <div className="animation-section">
                <h3>Animation Control</h3>
                <div className="animation-controls">
                  <div className="playback-controls">
                    <button onClick={handleStepBack} className="control-btn">
                      <FaStepBackward />
                    </button>
                    <button onClick={handlePlayPause} className="control-btn play-btn">
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={handleStepForward} className="control-btn">
                      <FaStepForward />
                    </button>
                  </div>
                  
                  <div className="speed-control">
                    <label>Speed:</label>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="100"
                      value={animationSpeed}
                      onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                      className="speed-slider"
                    />
                    <span>{animationSpeed}ms</span>
                  </div>

                  {animationSteps.length > 0 && (
                    <div className="progress-info">
                      <div className="step-info">
                        Step {currentStepIndex + 1} of {animationSteps.length}
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${((currentStepIndex + 1) / animationSteps.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Operation Status */}
              <div className="status-section">
                <h3>Current Status</h3>
                <div className="status-display">
                  <div className="operation-status">
                    Operation: <span className="status-value">{currentOperation}</span>
                  </div>
                  {currentTraversal && (
                    <div className="traversal-status">
                      Traversal: <span className="status-value">{currentTraversal}</span>
                    </div>
                  )}
                  <div className="description-status">
                    {currentDescription}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.aside>

        {/* Main Content Area */}
        <main className={`main-content ${showCodeViewer ? 'with-code-grid' : ''}`}>
          
          {/* Tree Visualization Panel */}
          <motion.section 
            className="tree-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="panel-header">
              <h2>Tree Visualization</h2>
              <div className="tree-info">
                {tree.root && (
                  <div className="tree-stats">
                    <span>Nodes: {countNodes(tree.root)}</span>
                    <span>Height: {getTreeHeight(tree.root)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="tree-container">
              {currentTreeData ? (
                <div className="tree-visualization">
                  <SvgTree tree={currentTreeData} cursor={currentCursor} />
                  
                  {/* Status Overlay */}
                  <div className="tree-status-overlay">
                    <div className="status-indicator">
                      {isPlaying ? (
                        <div className="loading-dots">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                        </div>
                      ) : (
                        <div className="ready-indicator">●</div>
                      )}
                    </div>
                    <div className="current-step">
                      {currentDescription}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-tree-message">
                  <FaTree className="empty-icon" />
                  <h3>No Tree to Display</h3>
                  <p>Start by inserting values or generating a random tree</p>
                  <button onClick={handleGenerateRandom} className="cta-btn">
                    <FaRandom />
                    Generate Random Tree
                  </button>
                </div>
              )}
            </div>
          </motion.section>

          {/* Code Panel - Shows beside tree when enabled */}
          <AnimatePresence>
            {showCodeViewer && (
              <motion.section 
                className="code-panel"
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="panel-header">
                  <h2>Algorithm Code</h2>
                  <div className="code-language">C Language</div>
                </div>

                <div className="code-content">
                  <CodeHighlighter
                    code={getCurrentCode()}
                    currentLine={animationSteps[currentStepIndex]?.line || 0}
                    title={`${currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)} Operation`}
                  />
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Information Panel - Shows as overlay when info is selected */}
          <AnimatePresence>
            {activePanel === 'info' && (
              <motion.div
                className="info-overlay"
                key="info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActivePanel('tree')}
              >
                <motion.section 
                  className="info-panel"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="panel-header">
                    <h2>Algorithm Information</h2>
                    <button 
                      className="close-btn"
                      onClick={() => setActivePanel('tree')}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="info-content">
                    {/* ...existing info content... */}
                  </div>
                </motion.section>
              </motion.div>
            )}
          </AnimatePresence>
  </main>

        {/* Code Panel */}
        {activePanel === 'code' && (
          <motion.section 
                className="code-panel"
                key="code"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="panel-header">
                  <h2>Algorithm Code</h2>
                  <div className="code-language">JavaScript</div>
                </div>
                {/* Additional panels removed from here as they were duplicated */}
                <CodeViewer
                  code={getCurrentCode()}
                  onChange={() => {}} // Read-only for visualization
                  currentLine={animationSteps[currentStepIndex]?.line || 0}
                  isAnimating={isPlaying}
                  nodes={[]} // Not needed for tree visualization
                />
              </motion.section>
            )}
      </div>
    </div>
  );
};

// Helper functions
const countNodes = (node) => {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
};

const getTreeHeight = (node) => {
  if (!node) return 0;
  return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
};

export default EnhancedTreeVisualizer;
