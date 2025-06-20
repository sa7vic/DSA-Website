import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome, FaExpandArrowsAlt, FaCompressArrowsAlt, FaInfoCircle, FaCode, FaTree } from 'react-icons/fa';
import { BinaryTree } from '../lib/animated-binary-tree.js';
import { SvgTree } from './AnimatedBinaryTree';
import { VisualizerControls } from './VisualizerControls';
import { inOrderTraversal, preOrderTraversal, postOrderTraversal, traversalCodeSnippets } from '../lib/traversal-algorithms';
import CodeViewer from './CodeViewer';
import CodeHighlighter from '../../../features/common/components/CodeHighlighter.jsx';
import '../styles/ModernTreeVisualizer.css';

// Tree visualization styles
const nodeSize = { x: 140, y: 140 };
const foreignObjectSize = { width: 80, height: 80 };

// Tree node rendering with enhanced style and depth classes
const renderCustomNodeElement = ({ nodeDatum, toggleNode, hierarchyPointNode }) => {
  // Get the node depth for styling
  const depth = hierarchyPointNode.depth || 0;
  
  return (
    <g className={`depth-${depth}`}>
      <circle 
        r={nodeDatum.highlight ? 28 : 25} 
        fill={nodeDatum.highlight ? "#ff7f50" : "#2A623D"} 
        stroke={nodeDatum.highlight ? "#ff5722" : "#4CAF50"}
        strokeWidth={nodeDatum.highlight ? 3 : 1}
        strokeDasharray={nodeDatum.highlight ? "4,2" : ""}
        filter={nodeDatum.highlight ? "url(#glow)" : ""}
        className="node-circle"
      />
      <defs>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3 3" result="glow"/>
          <feMerge>
            <feMergeNode in="glow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <foreignObject 
        width={foreignObjectSize.width} 
        height={foreignObjectSize.height} 
        x={-foreignObjectSize.width / 2} 
        y={-foreignObjectSize.height / 2}
        className="tree-node-foreign-object"
      >
        <div className={`tree-node ${nodeDatum.highlight ? 'highlighted' : ''}`}>
          <h3>{nodeDatum.name}</h3>
          {nodeDatum.children && nodeDatum.children.length > 0 && (
            <button onClick={toggleNode}>
              {nodeDatum._children ? '⊕' : '⊖'}
            </button>
          )}
        </div>
      </foreignObject>
    </g>
  );
};

// Spring animation configuration for smooth transitions
const springAnim = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

// Convert Splay Tree node to hierarchy data format for visualization
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

// Tree data structure operations
// Binary Search Tree Insert
const bstInsert = (root, value) => {
  const results = [];
  let currentStep = "";
  
  const insertNode = (node, value, path = []) => {
    if (!node) {
      currentStep = `Inserting ${value} at current position`;
      results.push({ 
        tree: { name: value.toString(), children: [] },
        step: currentStep,
        line: 4
      });
      return { name: value.toString(), children: [] };
    }
    
    const nodeCopy = { ...node };
    const nodeValue = parseInt(node.name);
    
    if (value < nodeValue) {
      currentStep = `${value} < ${nodeValue}, going left`;
      path.push('left');
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 7 
      });
      
      nodeCopy.children = nodeCopy.children || [];
      nodeCopy.children[0] = insertNode(nodeCopy.children[0], value, path);
      
    } else if (value > nodeValue) {
      currentStep = `${value} > ${nodeValue}, going right`;
      path.push('right');
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 13
      });
      
      nodeCopy.children = nodeCopy.children || [];
      nodeCopy.children[1] = insertNode(nodeCopy.children[1], value, path);
      
    } else {
      currentStep = `${value} already exists in the tree`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 19
      });
    }
    
    return nodeCopy;
  };
  
  const newRoot = insertNode(root, value);
  
  currentStep = "Insert operation complete";
  results.push({ 
    tree: JSON.parse(JSON.stringify(newRoot)), 
    step: currentStep,
    line: 24
  });
  
  return { tree: newRoot, results };
};

// Binary Search Tree Search
const bstSearch = (root, value) => {
  const results = [];
  let currentStep = "";
  
  const searchNode = (node, value) => {
    if (!node) {
      currentStep = `Value ${value} not found in the tree`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 4
      });
      return false;
    }
    
    const nodeValue = parseInt(node.name);
    
    if (value === nodeValue) {
      currentStep = `Found ${value} at current node`;
      node.highlight = true;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 9
      });
      return true;
      
    } else if (value < nodeValue) {
      currentStep = `${value} < ${nodeValue}, searching left subtree`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 14
      });
      return node.children && node.children[0] ? 
        searchNode(node.children[0], value) : 
        (() => {
          currentStep = `Left subtree is empty, ${value} not found`;
          results.push({ 
            tree: JSON.parse(JSON.stringify(root)), 
            step: currentStep,
            line: 17
          });
          return false;
        })();
      
    } else {
      currentStep = `${value} > ${nodeValue}, searching right subtree`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 23
      });
      return node.children && node.children[1] ? 
        searchNode(node.children[1], value) : 
        (() => {
          currentStep = `Right subtree is empty, ${value} not found`;
          results.push({ 
            tree: JSON.parse(JSON.stringify(root)), 
            step: currentStep,
            line: 26
          });
          return false;
        })();
    }
  };
  
  const found = searchNode(JSON.parse(JSON.stringify(root)), value);
  
  if (found) {
    currentStep = `Successfully found ${value} in the tree`;
  } else {
    currentStep = `Value ${value} is not present in the tree`;
  }
  
  results.push({ 
    tree: results[results.length-1].tree, 
    step: currentStep,
    line: found ? 9 : 29
  });
  
  return { results };
};

// Binary Search Tree Delete
const bstDelete = (root, value) => {
  const results = [];
  let currentStep = "";
  
  const findMinValue = (node) => {
    let current = node;
    while (current.children && current.children[0]) {
      current = current.children[0];
    }
    return current.name;
  };
  
  const deleteNode = (node, value) => {
    if (!node) {
      currentStep = `Value ${value} not found for deletion`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 4
      });
      return null;
    }
    
    const nodeValue = parseInt(node.name);
    
    if (value < nodeValue) {
      currentStep = `${value} < ${nodeValue}, going left to delete`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 9
      });
      
      if (node.children && node.children[0]) {
        node.children[0] = deleteNode(node.children[0], value);
      }
      return node;
      
    } else if (value > nodeValue) {
      currentStep = `${value} > ${nodeValue}, going right to delete`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 14
      });
      
      if (node.children && node.children[1]) {
        node.children[1] = deleteNode(node.children[1], value);
      }
      return node;
      
    } else {
      // Node to delete found
      currentStep = `Found node with value ${value} to delete`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 20
      });
      
      // Case 1: No children
      if (!node.children || (node.children.length === 0)) {
        currentStep = `Node ${value} has no children, removing it`;
        results.push({ 
          tree: JSON.parse(JSON.stringify(root)),
          step: currentStep,
          line: 23
        });
        return null;
      }
      
      // Case 2: One child
      if (!node.children[0]) {
        currentStep = `Node ${value} has only right child, replacing with right child`;
        results.push({ 
          tree: JSON.parse(JSON.stringify(root)), 
          step: currentStep,
          line: 28
        });
        return node.children[1];
      }
      
      if (!node.children[1]) {
        currentStep = `Node ${value} has only left child, replacing with left child`;
        results.push({ 
          tree: JSON.parse(JSON.stringify(root)), 
          step: currentStep,
          line: 33
        });
        return node.children[0];
      }
      
      // Case 3: Two children
      currentStep = `Node ${value} has two children, finding successor`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 39
      });
      
      const successor = findMinValue(node.children[1]);
      currentStep = `Found successor ${successor} for node ${value}`;
      results.push({ 
        tree: JSON.parse(JSON.stringify(root)), 
        step: currentStep,
        line: 41
      });
      
      node.name = successor;
      node.children[1] = deleteNode(node.children[1], parseInt(successor));
      return node;
    }
  };
  
  const newRoot = deleteNode(JSON.parse(JSON.stringify(root)), value);
  
  if (!newRoot) {
    currentStep = "Tree is now empty";
  } else {
    currentStep = "Delete operation complete";
  }
  
  results.push({ 
    tree: newRoot || { name: "", children: [] }, 
    step: currentStep,
    line: 50
  });
  
  return { tree: newRoot || null, results };
};

// Algorithm explanations
const algorithmInfo = {
  "Insert": {
    timeComplexity: "O(log n) average, O(n) worst case",
    spaceComplexity: "O(log n)",
    description: "Binary Search Tree insertion places a new node in the correct position based on the BST property: left child < parent < right child.",
    pseudocode: `function insert(root, value):
  if root is null:
    return new Node(value)
    
  if value < root.value:
    root.left = insert(root.left, value)
  else if value > root.value:
    root.right = insert(root.right, value)
  
  // Value already exists
  return root`
  },
  "Search": {
    timeComplexity: "O(log n) average, O(n) worst case",
    spaceComplexity: "O(log n) for recursive, O(1) for iterative",
    description: "Binary Search Tree search traverses the tree comparing the target value with each node to locate a value.",
    pseudocode: `function search(root, value):
  if root is null:
    return false
    
  if value equals root.value:
    return true
  else if value < root.value:
    return search(root.left, value)
  else:
    return search(root.right, value)
`
  },
  "Delete": {
    timeComplexity: "O(log n) average, O(n) worst case",
    spaceComplexity: "O(log n)",
    description: "Binary Search Tree deletion handles three cases: deleting a leaf node, a node with one child, or a node with two children.",
    pseudocode: `function delete(root, value):
  if root is null:
    return null
    
  if value < root.value:
    root.left = delete(root.left, value)
  else if value > root.value:
    root.right = delete(root.right, value)
  else:
    // Case 1: No children
    if root has no children:
      return null
      
    // Case 2: One child
    if root has only one child:
      return that child
      
    // Case 3: Two children
    successor = findMin(root.right)
    root.value = successor
    root.right = delete(root.right, successor)
  
  return root`
  },
  "In-Order": {
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) where h is height of the tree",
    description: "In-order traversal visits the left subtree, then the current node, then the right subtree. For a BST, this produces elements in sorted order.",
    pseudocode: `function inOrder(node):
  if node is null:
    return
    
  inOrder(node.left)
  visit(node)
  inOrder(node.right)`
  },
  "Pre-Order": {
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) where h is height of the tree",
    description: "Pre-order traversal visits the current node, then the left subtree, then the right subtree. Useful for creating a copy of the tree.",
    pseudocode: `function preOrder(node):
  if node is null:
    return
    
  visit(node)
  preOrder(node.left)
  preOrder(node.right)`
  },
  "Post-Order": {
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) where h is height of the tree",
    description: "Post-order traversal visits the left subtree, then the right subtree, then the current node. Useful for deleting the tree.",
    pseudocode: `function postOrder(node):
  if node is null:
    return
    
  postOrder(node.left)
  postOrder(node.right)
  visit(node)`
  },
  "Level-Order": {
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    description: "Level-order traversal visits all nodes level by level from top to bottom. Uses a queue to track nodes to visit.",
    pseudocode: `function levelOrder(root):
  if root is null:
    return
    
  queue = new Queue()
  queue.enqueue(root)
  
  while queue is not empty:
    node = queue.dequeue()
    visit(node)
    
    if node.left is not null:
      queue.enqueue(node.left)
    if node.right is not null:
      queue.enqueue(node.right)`
  }
};

const TreeVisualizer = () => {
  // Tree state
  const [tree, setTree] = useState(new BinaryTree());
  const [value, setValue] = useState("");
  
  // Animation state
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [currentTraversal, setCurrentTraversal] = useState(null);
  const [currentOperation, setCurrentOperation] = useState('insert');
  
  // Layout state
  const [isCodeViewExpanded, setIsCodeViewExpanded] = useState(false);
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(true);
  const [activePanel, setActivePanel] = useState('tree'); // 'tree', 'code', 'info'
  
  const timeoutRef = useRef(null);

  // Animation control functions
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepForward = () => {
    if (currentStepIndex < animationSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsPlaying(false);
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
    const size = Math.floor(Math.random() * 7) + 3; // Between 3 and 10 nodes
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
  };

  // Animation timer effect
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

  // Current tree data based on animation step
  const currentTreeData =
    animationSteps.length > 0
      ? animationSteps[currentStepIndex].tree
      : tree.root;

  const currentCursor =
    animationSteps.length > 0
      ? (animationSteps[currentStepIndex].cursor?.key || 0)
      : 0;

  const currentDescription =
    animationSteps.length > 0
      ? animationSteps[currentStepIndex].description
      : "No operations performed yet";

  return (
    <div className="modern-tree-visualizer">
      {/* Header Section */}
      <motion.header 
        className="visualizer-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <Link to="/" className="home-button">
            <FaHome />
            <span>Home</span>
          </Link>
          
          <div className="header-title">
            <FaTree className="title-icon" />
            <h1>Binary Search Tree Visualizer</h1>
          </div>

          <div className="layout-controls">
            <button 
              className={`layout-btn ${activePanel === 'tree' ? 'active' : ''}`}
              onClick={() => setActivePanel('tree')}
              title="Tree View"
            >
              <FaTree />
            </button>
            <button 
              className={`layout-btn ${activePanel === 'code' ? 'active' : ''}`}
              onClick={() => setActivePanel('code')}
              title="Code View"
            >
              <FaCode />
            </button>
            <button 
              className={`layout-btn ${activePanel === 'info' ? 'active' : ''}`}
              onClick={() => setActivePanel('info')}
              title="Algorithm Info"
            >
              <FaInfoCircle />
            </button>
            <button 
              className="expand-btn"
              onClick={() => setIsCodeViewExpanded(!isCodeViewExpanded)}
              title={isCodeViewExpanded ? "Collapse" : "Expand"}
            >
              {isCodeViewExpanded ? <FaCompressArrowsAlt /> : <FaExpandArrowsAlt />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content Grid */}
      <div className={`main-grid ${isCodeViewExpanded ? 'expanded' : ''}`}>
        
        {/* Controls Panel */}
        <motion.section 
          className="controls-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="controls-header">
            <h2>Operations</h2>
            <div className="operation-indicator">
              Current: <span className="current-op">{currentOperation}</span>
            </div>
          </div>
          
          <VisualizerControls
            value={value}
            setValue={setValue}
            handleGenerateRandom={handleGenerateRandom}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
            currentStepIndex={currentStepIndex}
            isPlaying={isPlaying}
            handleStepForward={handleStepForward}
            handlePlayPause={handlePlayPause}
            handleStepBack={handleStepBack}
            handleClear={handleClear}
            animationSteps={animationSteps}
            handleInsert={handleInsert}
            handleFind={handleFind}
            handleDelete={handleDelete}
            handleInOrderTraversal={handleInOrderTraversal}
            handlePreOrderTraversal={handlePreOrderTraversal}
            handlePostOrderTraversal={handlePostOrderTraversal}
          />
        </motion.section>

        {/* Tree Visualization Panel */}
        <motion.section 
          className={`tree-section ${activePanel === 'tree' ? 'active' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="tree-header">
            <h2>Binary Search Tree</h2>
            <div className="tree-stats">
              {animationSteps.length > 0 && (
                <div className="animation-progress">
                  <span>Step {currentStepIndex + 1} of {animationSteps.length}</span>
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

          <div className="tree-display-container">
            {currentTreeData ? (
              <div className="tree-visualization">
                <SvgTree tree={currentTreeData} cursor={currentCursor} />
                
                {/* Status Display */}
                <div className="tree-status">
                  <div className="status-indicator">
                    {isPlaying ? (
                      <div className="status-running">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                    ) : (
                      <div className="status-ready">Ready</div>
                    )}
                  </div>
                  <div className="status-text">{currentDescription}</div>
                </div>
              </div>
            ) : (
              <div className="empty-tree">
                <FaTree className="empty-icon" />
                <h3>Tree is Empty</h3>
                <p>Insert some values or generate a random tree to begin</p>
                <button onClick={handleGenerateRandom} className="generate-btn">
                  Generate Random Tree
                </button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Code Viewer Panel */}
        <AnimatePresence>
          {(activePanel === 'code' || isCodeViewExpanded) && (
            <motion.section 
              className="code-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="code-header">
                <h2>Algorithm Code</h2>
                <div className="code-language-info">
                  Multiple languages supported
                </div>
              </div>

              <CodeViewer
                operation={currentOperation}
                currentLine={animationSteps[currentStepIndex]?.line || 0}
                isAnimating={isPlaying}
                className="main-code-viewer"
              />

              {/* Traversal Results */}
              {currentTraversal && animationSteps[currentStepIndex]?.traversalResult && (
                <motion.div 
                  className="traversal-results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3>{currentTraversal} Traversal Result</h3>
                  <div className="result-sequence">
                    {animationSteps[currentStepIndex].traversalResult.map((value, index) => (
                      <motion.span 
                        key={index}
                        className="result-item"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {value}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Algorithm Info Panel */}
        <AnimatePresence>
          {(activePanel === 'info' || showAlgorithmInfo) && (
            <motion.section 
              className="info-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="info-header">
                <h2>Algorithm Information</h2>
                <button 
                  className="close-info"
                  onClick={() => setShowAlgorithmInfo(false)}
                >
                  ×
                </button>
              </div>

              <div className="algorithm-details">
                <div className="complexity-info">
                  <h3>Time Complexity</h3>
                  <div className="complexity-grid">
                    <div className="complexity-item">
                      <span className="operation">Insert</span>
                      <span className="value">O(log n)</span>
                    </div>
                    <div className="complexity-item">
                      <span className="operation">Search</span>
                      <span className="value">O(log n)</span>
                    </div>
                    <div className="complexity-item">
                      <span className="operation">Delete</span>
                      <span className="value">O(log n)</span>
                    </div>
                  </div>
                </div>

                <div className="properties-info">
                  <h3>BST Properties</h3>
                  <ul className="properties-list">
                    <li>Left subtree contains only nodes with values less than the parent</li>
                    <li>Right subtree contains only nodes with values greater than the parent</li>
                    <li>Both left and right subtrees are also binary search trees</li>
                    <li>In-order traversal gives values in sorted order</li>
                  </ul>
                </div>

                <div className="use-cases">
                  <h3>Common Use Cases</h3>
                  <div className="use-case-grid">
                    <div className="use-case">Database Indexing</div>
                    <div className="use-case">Search Operations</div>
                    <div className="use-case">Expression Parsing</div>
                    <div className="use-case">Priority Queues</div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <button 
          className={`nav-item ${activePanel === 'tree' ? 'active' : ''}`}
          onClick={() => setActivePanel('tree')}
        >
          <FaTree />
          <span>Tree</span>
        </button>
        <button 
          className={`nav-item ${activePanel === 'code' ? 'active' : ''}`}
          onClick={() => setActivePanel('code')}
        >
          <FaCode />
          <span>Code</span>
        </button>
        <button 
          className={`nav-item ${activePanel === 'info' ? 'active' : ''}`}
          onClick={() => setActivePanel('info')}
        >
          <FaInfoCircle />
          <span>Info</span>
        </button>
      </div>
    </div>
  );
};

export default TreeVisualizer;
