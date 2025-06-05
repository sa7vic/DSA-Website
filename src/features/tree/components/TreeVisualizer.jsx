import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome, FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaTrash, FaKeyboard } from 'react-icons/fa';
import { SvgTree } from './AnimatedBinaryTree';
import '../styles/TreeVisualizerEnhanced.css';
import CodeHighlighter from '../../common/components/CodeHighlighter';

// Enhanced imports for new functionality
import { BinarySearchTree, TreeTraversal, treeUtils } from '../utils/treeOperations';
import { treeAlgorithmInfo, traversalCodeSnippets } from '../utils/algorithmInfo';
import { ANIMATION_SPEEDS, COLORS, MEMORY_POOL_SIZE, APP_CONSTANTS } from '../../../constants';
import { debounce, generateMemoryAddresses } from '../../../utils/helpers';

const TreeVisualizer = () => {
  // Enhanced state management with better organization
  const [tree, setTree] = useState(new BinarySearchTree());
  const [value, setValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [isValidInput, setIsValidInput] = useState(true);

  // Animation and operation state
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(APP_CONSTANTS.ANIMATION.DEFAULT_SPEED);
  const [currentTraversal, setCurrentTraversal] = useState(null);
  const [currentOperation, setCurrentOperation] = useState(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Refs for cleanup and control
  const timeoutRef = useRef(null);
  const errorTimeoutRef = useRef(null);
  const successTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Memory management
  const memoryPool = useRef(new Set());

  // Cleanup function for timeouts
  const clearTimeouts = useCallback(() => {
    [timeoutRef, errorTimeoutRef, successTimeoutRef].forEach(ref => {
      if (ref.current) {
        clearTimeout(ref.current);
        ref.current = null;
      }
    });
  }, []);

  // Enhanced error handling with auto-clear
  const showError = useCallback((message, duration = APP_CONSTANTS.UI.ERROR_DISPLAY_DURATION) => {
    setErrorMessage(message);
    setSuccessMessage("");
    
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    
    errorTimeoutRef.current = setTimeout(() => {
      setErrorMessage("");
      errorTimeoutRef.current = null;
    }, duration);
  }, []);

  // Enhanced success message handling
  const showSuccess = useCallback((message, duration = APP_CONSTANTS.UI.SUCCESS_DISPLAY_DURATION) => {
    setSuccessMessage(message);
    setErrorMessage("");
    
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    
    successTimeoutRef.current = setTimeout(() => {
      setSuccessMessage("");
      successTimeoutRef.current = null;
    }, duration);
  }, []);

  // Debounced input validation
  const validateTreeInput = useCallback(
    debounce((inputValue) => {
      if (!inputValue.trim()) {
        setInputError("");
        setIsValidInput(true);
        return;
      }

      const validation = treeUtils.validateInput(inputValue);
      setInputError(validation.valid ? "" : validation.error);
      setIsValidInput(validation.valid);
    }, APP_CONSTANTS.INPUT.DEBOUNCE_DELAY),
    []
  );

  // Handle input change with validation
  const handleInputChange = useCallback((newValue) => {
    setValue(newValue);
    validateTreeInput(newValue);
  }, [validateTreeInput]);

  // Enhanced keyboard shortcuts
  const handleKeyPress = useCallback((event) => {
    // Don't handle keyboard shortcuts when input is focused
    if (document.activeElement === inputRef.current) {
      if (event.key === 'Enter' && value.trim() && isValidInput) {
        event.preventDefault();
        handleInsert();
      }
      return;
    }

    const { key, ctrlKey, metaKey } = event;
    const isModified = ctrlKey || metaKey;

    switch (key) {
      case ' ':
      case 'Enter':
        event.preventDefault();
        if (animationSteps.length > 0) {
          handlePlayPause();
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        handleStepBack();
        break;
      case 'ArrowRight':
        event.preventDefault();
        handleStepForward();
        break;
      case 'Escape':
        event.preventDefault();
        handleClear();
        break;
      case 'r':
      case 'R':
        if (isModified) {
          event.preventDefault();
          handleGenerateRandom();
        }
        break;
      case 'i':
      case 'I':
        if (isModified && tree.root) {
          event.preventDefault();
          handleInOrderTraversal();
        }
        break;
      case 'p':
      case 'P':
        if (isModified && tree.root) {
          event.preventDefault();
          handlePreOrderTraversal();
        }
        break;
      case 'o':
      case 'O':
        if (isModified && tree.root) {
          event.preventDefault();
          handlePostOrderTraversal();
        }
        break;
      case 'Delete':
      case 'Backspace':
        if (isModified && value.trim() && isValidInput) {
          event.preventDefault();
          handleDelete();
        }
        break;
      case 'f':
      case 'F':
        if (isModified && value.trim() && isValidInput) {
          event.preventDefault();
          handleFind();
        }
        break;
      default:
        break;
    }
  }, [value, isValidInput, animationSteps.length, tree.root]);

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.addEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Enhanced animation control functions
  const handlePlayPause = useCallback(() => {
    if (animationSteps.length === 0) {
      showError("No animation steps available");
      return;
    }
    setIsPlaying(prev => !prev);
  }, [animationSteps.length, showError]);

  const handleStepBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  }, [currentStepIndex]);

  const handleStepForward = useCallback(() => {
    if (currentStepIndex < animationSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
      if (currentOperation) {
        showSuccess(`${currentOperation} operation completed successfully`);
        setCurrentOperation(null);
      }
    }
  }, [currentStepIndex, animationSteps.length, currentOperation, showSuccess]);

  // Enhanced operation handlers with comprehensive error handling
  const handleInsert = useCallback(async () => {
    if (!value.trim()) {
      showError("Please enter a value to insert");
      inputRef.current?.focus();
      return;
    }

    const validation = treeUtils.validateInput(value);
    if (!validation.valid) {
      showError(validation.error);
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setCurrentOperation("Insert");

    try {
      const { tree: newTree, steps } = tree.insert(validation.value);
      
      // Memory management
      const memoryAddresses = generateMemoryAddresses(1);
      memoryPool.current.add(memoryAddresses[0]);
      
      setTree(newTree);
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      setValue("");
      setCurrentTraversal(null);
      
      showSuccess(`Successfully inserted ${validation.value}`);
    } catch (error) {
      console.error("Error during insert operation:", error);
      showError("Failed to insert value. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [value, tree, showError, showSuccess]);

  const handleFind = useCallback(async () => {
    if (!value.trim()) {
      showError("Please enter a value to search");
      inputRef.current?.focus();
      return;
    }

    const validation = treeUtils.validateInput(value);
    if (!validation.valid) {
      showError(validation.error);
      inputRef.current?.focus();
      return;
    }

    if (!tree.root) {
      showError("Tree is empty. Please insert some values first.");
      return;
    }

    setIsLoading(true);
    setCurrentOperation("Search");

    try {
      const { found, steps } = tree.search(validation.value);
      
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      setValue("");
      setCurrentTraversal(null);
      
      if (found) {
        showSuccess(`Value ${validation.value} found in the tree`);
      } else {
        showError(`Value ${validation.value} not found in the tree`);
      }
    } catch (error) {
      console.error("Error during search operation:", error);
      showError("Failed to search for value. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [value, tree, showError, showSuccess]);

  const handleDelete = useCallback(async () => {
    if (!value.trim()) {
      showError("Please enter a value to delete");
      inputRef.current?.focus();
      return;
    }

    const validation = treeUtils.validateInput(value);
    if (!validation.valid) {
      showError(validation.error);
      inputRef.current?.focus();
      return;
    }

    if (!tree.root) {
      showError("Tree is empty. Nothing to delete.");
      return;
    }

    setIsLoading(true);
    setCurrentOperation("Delete");

    try {
      const { tree: newTree, steps } = tree.delete(validation.value);
      
      setTree(newTree);
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      setValue("");
      setCurrentTraversal(null);
      
      showSuccess(`Successfully deleted ${validation.value}`);
    } catch (error) {
      console.error("Error during delete operation:", error);
      showError("Failed to delete value. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [value, tree, showError, showSuccess]);

  const handleGenerateRandom = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const size = Math.floor(Math.random() * 7) + 3; // Between 3 and 10 nodes
      const randomTree = BinarySearchTree.generateRandom(size);
      
      setTree(randomTree);
      setAnimationSteps([
        {
          tree: randomTree.toHierarchyData(),
          description: `Generated random tree with ${size} nodes`,
          line: 0
        }
      ]);
      setCurrentStepIndex(0);
      setCurrentTraversal(null);
      
      showSuccess(`Generated random tree with ${size} nodes`);
    } catch (error) {
      console.error("Error generating random tree:", error);
      showError("Failed to generate random tree. Please try again.");
      
      // Fallback: create a simple tree
      const fallbackTree = new BinarySearchTree();
      const values = [10, 5, 15, 3, 7, 12, 18];
      const randomValues = values.slice(0, Math.floor(Math.random() * 5) + 3);
      
      for (const val of randomValues) {
        fallbackTree.insert(val);
      }
      
      setTree(fallbackTree);
      setAnimationSteps([
        {
          tree: fallbackTree.toHierarchyData(),
          description: `Generated fallback tree with ${randomValues.length} nodes`,
          line: 0
        }
      ]);
      setCurrentStepIndex(0);
      setCurrentTraversal(null);
    } finally {
      setIsLoading(false);
    }
  }, [showError, showSuccess]);

  const handleClear = useCallback(() => {
    // Clear all states
    setTree(new BinarySearchTree());
    setAnimationSteps([
      {
        tree: null,
        description: "Tree cleared",
        line: 0
      }
    ]);
    setCurrentStepIndex(0);
    setCurrentTraversal(null);
    setCurrentOperation(null);
    setIsPlaying(false);
    setValue("");
    setInputError("");
    setIsValidInput(true);
    
    // Clear memory pool
    memoryPool.current.clear();
    
    // Clear timeouts
    clearTimeouts();
    
    showSuccess("Tree cleared successfully");
  }, [clearTimeouts, showSuccess]);

  // Enhanced traversal handlers with new tree operations
  const handleInOrderTraversal = useCallback(async () => {
    if (!tree || !tree.root) {
      showError("Tree is empty. Please insert some values first.");
      return;
    }

    setIsLoading(true);
    setCurrentOperation("In-Order Traversal");

    try {
      const { result, steps } = TreeTraversal.inOrder(tree);
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      setCurrentTraversal("In-Order");
      
      showSuccess(`In-order traversal: [${result.join(', ')}]`);
    } catch (error) {
      console.error("Error during in-order traversal:", error);
      showError("Failed to perform in-order traversal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [tree, showError, showSuccess]);

  const handlePreOrderTraversal = useCallback(async () => {
    if (!tree || !tree.root) {
      showError("Tree is empty. Please insert some values first.");
      return;
    }

    setIsLoading(true);
    setCurrentOperation("Pre-Order Traversal");

    try {
      const { result, steps } = TreeTraversal.preOrder(tree);
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      setCurrentTraversal("Pre-Order");
      
      showSuccess(`Pre-order traversal: [${result.join(', ')}]`);
    } catch (error) {
      console.error("Error during pre-order traversal:", error);
      showError("Failed to perform pre-order traversal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [tree, showError, showSuccess]);

  const handlePostOrderTraversal = useCallback(async () => {
    if (!tree || !tree.root) {
      showError("Tree is empty. Please insert some values first.");
      return;
    }

    setIsLoading(true);
    setCurrentOperation("Post-Order Traversal");

    try {
      const { result, steps } = TreeTraversal.postOrder(tree);
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      setCurrentTraversal("Post-Order");
      
      showSuccess(`Post-order traversal: [${result.join(', ')}]`);
    } catch (error) {
      console.error("Error during post-order traversal:", error);
      showError("Failed to perform post-order traversal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [tree, showError, showSuccess]);

  const handleLevelOrderTraversal = useCallback(async () => {
    if (!tree || !tree.root) {
      showError("Tree is empty. Please insert some values first.");
      return;
    }

    setIsLoading(true);
    setCurrentOperation("Level-Order Traversal");

    try {
      const { result, steps } = TreeTraversal.levelOrder(tree);
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
      setCurrentTraversal("Level-Order");
      
      showSuccess(`Level-order traversal: [${result.join(', ')}]`);
    } catch (error) {
      console.error("Error during level-order traversal:", error);
      showError("Failed to perform level-order traversal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [tree, showError, showSuccess]);

  // Enhanced animation timer effect with better performance
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (isPlaying && currentStepIndex < animationSteps.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, animationSpeed);
    } else if (currentStepIndex >= animationSteps.length - 1) {
      setIsPlaying(false);
      if (currentOperation) {
        showSuccess(`${currentOperation} completed successfully`);
        setCurrentOperation(null);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isPlaying, currentStepIndex, animationSteps.length, animationSpeed, currentOperation, showSuccess]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts();
      memoryPool.current.clear();
    };
  }, [clearTimeouts]);

  // Memoized computed values for performance
  const currentTreeData = useMemo(() => {
    if (animationSteps.length > 0 && animationSteps[currentStepIndex]) {
      return animationSteps[currentStepIndex].tree;
    }
    return tree.root ? tree.toHierarchyData() : null;
  }, [animationSteps, currentStepIndex, tree]);

  const currentDescription = useMemo(() => {
    if (animationSteps.length > 0 && animationSteps[currentStepIndex]) {
      return animationSteps[currentStepIndex].description;
    }
    return "No operations performed yet";
  }, [animationSteps, currentStepIndex]);

  const treeStats = useMemo(() => {
    return tree.getStats();
  }, [tree]);

  const canPerformOperations = useMemo(() => {
    return !isLoading && animationSteps.length === 0;
  }, [isLoading, animationSteps.length]);

  return (
    <div className="tree-visualizer-container" role="main">
      <div className="sorting-bg-overlay"></div>
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      
      {/* Enhanced Header with better accessibility */}
      <motion.header 
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        role="banner"
      >
        <Link 
          to="/" 
          className="home-button"
          aria-label="Go to home page"
        >
          <FaHome size={16} aria-hidden="true" />
          <span>Home</span>
        </Link>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '1.5rem' }}>
          Binary Search Tree Visualization
        </h1>
        
        {/* Keyboard Shortcuts Help */}
        <div className="keyboard-shortcuts-help" title="Keyboard Shortcuts">
          <FaKeyboard 
            size={16} 
            aria-hidden="true"
            tabIndex="0"
            role="button"
            aria-label="Show keyboard shortcuts"
          />
          <div className="shortcuts-tooltip">
            <div className="shortcuts-title">Keyboard Shortcuts</div>
            <div className="shortcuts-list">
              <div><kbd>Enter/Space</kbd> Play/Pause</div>
              <div><kbd>←/→</kbd> Step Back/Forward</div>
              <div><kbd>Esc</kbd> Clear Tree</div>
              <div><kbd>Ctrl+R</kbd> Random Tree</div>
              <div><kbd>Ctrl+I</kbd> In-Order</div>
              <div><kbd>Ctrl+P</kbd> Pre-Order</div>
              <div><kbd>Ctrl+O</kbd> Post-Order</div>
              <div><kbd>Ctrl+F</kbd> Find Value</div>
              <div><kbd>Ctrl+Del</kbd> Delete Value</div>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Enhanced Introduction Section */}
      <motion.div 
        className="intro-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        role="region"
        aria-labelledby="intro-heading"
      >
        <h2 id="intro-heading" className="sr-only">Introduction</h2>
        <p>
          A binary search tree is a hierarchical data structure where each node has at most two children,
          with the left child containing values less than the node and the right child containing values greater than the node.
        </p>
        
        {/* Tree Statistics */}
        {tree.root && (
          <div className="tree-stats" role="status" aria-live="polite">
            <div className="stat-item">
              <span className="stat-label">Nodes:</span>
              <span className="stat-value">{treeStats.size}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Height:</span>
              <span className="stat-value">{treeStats.height}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Leaves:</span>
              <span className="stat-value">{treeStats.leafCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Balanced:</span>
              <span className={`stat-value ${treeUtils.isBalanced(tree) ? 'balanced' : 'unbalanced'}`}>
                {treeUtils.isBalanced(tree) ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Enhanced Error and Success Messages */}
      {(errorMessage || successMessage) && (
        <motion.div 
          className={`message-container ${errorMessage ? 'error' : 'success'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          role="alert"
          aria-live="polite"
        >
          <div className="message-content">
            {errorMessage || successMessage}
          </div>
        </motion.div>
      )}

      {/* Enhanced Controls Section */}
      <motion.div 
        className="controls-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        role="region"
        aria-labelledby="controls-heading"
      >
        <h2 id="controls-heading" className="sr-only">Tree Controls</h2>
        
        {/* Input Section */}
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="tree-input" className="input-label">
              Enter Value (1-999):
            </label>
            <input
              id="tree-input"
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter a number..."
              className={`tree-input ${!isValidInput ? 'invalid' : ''} ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !canPerformOperations}
              aria-describedby={inputError ? "input-error" : undefined}
              aria-invalid={!isValidInput}
            />
            {inputError && (
              <div id="input-error" className="input-error" role="alert">
                {inputError}
              </div>
            )}
          </div>

          {/* Operation Buttons */}
          <div className="operation-buttons">
            <button
              onClick={handleInsert}
              disabled={!value.trim() || !isValidInput || isLoading || !canPerformOperations}
              className="operation-button insert-button"
              aria-label={`Insert ${value} into tree`}
            >
              {isLoading && currentOperation === "Insert" ? (
                <div className="loading-spinner" aria-hidden="true"></div>
              ) : null}
              Insert
            </button>
            
            <button
              onClick={handleFind}
              disabled={!value.trim() || !isValidInput || isLoading || !tree.root || !canPerformOperations}
              className="operation-button find-button"
              aria-label={`Search for ${value} in tree`}
            >
              {isLoading && currentOperation === "Search" ? (
                <div className="loading-spinner" aria-hidden="true"></div>
              ) : null}
              Find
            </button>
            
            <button
              onClick={handleDelete}
              disabled={!value.trim() || !isValidInput || isLoading || !tree.root || !canPerformOperations}
              className="operation-button delete-button"
              aria-label={`Delete ${value} from tree`}
            >
              {isLoading && currentOperation === "Delete" ? (
                <div className="loading-spinner" aria-hidden="true"></div>
              ) : null}
              Delete
            </button>
          </div>
        </div>

        {/* Utility Buttons */}
        <div className="utility-buttons">
          <button
            onClick={handleGenerateRandom}
            disabled={isLoading}
            className="utility-button generate-button"
            aria-label="Generate random tree"
          >
            {isLoading && !currentOperation ? (
              <div className="loading-spinner" aria-hidden="true"></div>
            ) : (
              <FaRandom aria-hidden="true" />
            )}
            Random Tree
          </button>
          
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="utility-button clear-button"
            aria-label="Clear entire tree"
          >
            <FaTrash aria-hidden="true" />
            Clear
          </button>
        </div>

        {/* Traversal Buttons */}
        <div className="traversal-buttons">
          <h3>Tree Traversals:</h3>
          <div className="traversal-group">
            <button
              onClick={handleInOrderTraversal}
              disabled={!tree.root || isLoading || !canPerformOperations}
              className="traversal-button in-order-button"
              aria-label="Perform in-order traversal"
            >
              {isLoading && currentOperation === "In-Order Traversal" ? (
                <div className="loading-spinner" aria-hidden="true"></div>
              ) : null}
              In-Order
            </button>
            
            <button
              onClick={handlePreOrderTraversal}
              disabled={!tree.root || isLoading || !canPerformOperations}
              className="traversal-button pre-order-button"
              aria-label="Perform pre-order traversal"
            >
              {isLoading && currentOperation === "Pre-Order Traversal" ? (
                <div className="loading-spinner" aria-hidden="true"></div>
              ) : null}
              Pre-Order
            </button>
            
            <button
              onClick={handlePostOrderTraversal}
              disabled={!tree.root || isLoading || !canPerformOperations}
              className="traversal-button post-order-button"
              aria-label="Perform post-order traversal"
            >
              {isLoading && currentOperation === "Post-Order Traversal" ? (
                <div className="loading-spinner" aria-hidden="true"></div>
              ) : null}
              Post-Order
            </button>
            
            <button
              onClick={handleLevelOrderTraversal}
              disabled={!tree.root || isLoading || !canPerformOperations}
              className="traversal-button level-order-button"
              aria-label="Perform level-order traversal"
            >
              {isLoading && currentOperation === "Level-Order Traversal" ? (
                <div className="loading-spinner" aria-hidden="true"></div>
              ) : null}
              Level-Order
            </button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Animation Controls */}
      {animationSteps.length > 0 && (
        <motion.div 
          className="animation-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          role="region"
          aria-labelledby="animation-controls-heading"
        >
          <h3 id="animation-controls-heading" className="sr-only">Animation Controls</h3>
          
          <div className="playback-controls">
            <button
              onClick={handleStepBack}
              disabled={currentStepIndex === 0}
              className="control-button step-back"
              aria-label="Step backward"
            >
              <FaStepBackward aria-hidden="true" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="control-button play-pause"
              aria-label={isPlaying ? "Pause animation" : "Play animation"}
            >
              {isPlaying ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
            </button>
            
            <button
              onClick={handleStepForward}
              disabled={currentStepIndex >= animationSteps.length - 1}
              className="control-button step-forward"
              aria-label="Step forward"
            >
              <FaStepForward aria-hidden="true" />
            </button>
          </div>

          <div className="speed-control">
            <label htmlFor="speed-slider">Animation Speed:</label>
            <input
              id="speed-slider"
              type="range"
              min={APP_CONSTANTS.ANIMATION.MIN_SPEED}
              max={APP_CONSTANTS.ANIMATION.MAX_SPEED}
              step={APP_CONSTANTS.ANIMATION.SPEED_STEP}
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
              className="speed-slider"
              aria-label="Adjust animation speed"
            />
            <span className="speed-display">{animationSpeed}ms</span>
          </div>
        </motion.div>
      )}

      {/* Tree Visualization Section */}
      <motion.div 
        className="visualization-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        role="region"
        aria-labelledby="visualization-heading"
      >
        <h2 id="visualization-heading" className="sr-only">Tree Visualization</h2>
        
        {/* Status Display */}
        <div className="visualization-status" role="status" aria-live="polite">
          <div className="status-header">
            <div className="status-icon">
              {isPlaying ? (
                <div className="status-running" title="Animation running">
                  <div className="dot dot1"></div>
                  <div className="dot dot2"></div>
                  <div className="dot dot3"></div>
                </div>
              ) : isLoading ? (
                <div className="loading-spinner" title="Loading"></div>
              ) : (
                <div className="status-ready" title="Ready">✓</div>
              )}
            </div>
            <div className="status-title">
              {isLoading ? 'Loading...' : isPlaying ? 'Visualizing' : 'Ready'} 
              {currentTraversal ? ` - ${currentTraversal} Traversal` : ''}
            </div>
          </div>
          <div className="current-step">{currentDescription}</div>
        </div>
        
        <div className="visualization-panels">
          <div className="tree-display-panel">
            {currentTreeData ? (
              <SvgTree 
                tree={currentTreeData} 
                cursor={animationSteps[currentStepIndex]?.highlight || 0}
                aria-label="Binary search tree visualization"
              />
            ) : (
              <div className="empty-tree-message">
                <div className="empty-tree-icon" aria-hidden="true">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8ZM6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3>Tree is empty</h3>
                <p>Use Insert to add nodes or generate a random tree</p>
                <button 
                  onClick={handleGenerateRandom} 
                  className="action-button generate-button"
                  style={{ marginTop: "1rem" }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner" aria-hidden="true"></div>
                  ) : (
                    "Generate Random Tree"
                  )}
                </button>
              </div>
            )}
          </div>
          
          {/* Enhanced Code Panel */}
          {currentTraversal && animationSteps[currentStepIndex] && (
            <motion.div 
              className="code-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              role="region"
              aria-labelledby="code-panel-heading"
            >
              <h3 id="code-panel-heading">{currentTraversal} Traversal Algorithm</h3>
              
              <CodeHighlighter 
                code={traversalCodeSnippets[
                  currentTraversal === "In-Order" ? "inOrder" : 
                  currentTraversal === "Pre-Order" ? "preOrder" : 
                  currentTraversal === "Post-Order" ? "postOrder" : "levelOrder"
                ]} 
                currentLine={animationSteps[currentStepIndex]?.line}
                title={`${currentTraversal} Traversal Algorithm`}
              />
              
              {/* Traversal Result Display */}
              {animationSteps[currentStepIndex]?.traversalResult && (
                <div className="traversal-result" role="region" aria-labelledby="result-heading">
                  <h4 id="result-heading">Traversal Result</h4>
                  <div className="result-values" aria-live="polite">
                    {animationSteps[currentStepIndex].traversalResult.map((value, index) => (
                      <span key={index} className="result-value">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Algorithm Information */}
              <div className="algorithm-info">
                {currentTraversal && treeAlgorithmInfo[currentTraversal.toLowerCase().replace('-', '')] && (
                  <div className="complexity-info">
                    <h4>Complexity Analysis</h4>
                    <div className="complexity-details">
                      <div className="complexity-item">
                        <span className="complexity-label">Time:</span>
                        <span className="complexity-value">
                          {treeAlgorithmInfo[currentTraversal.toLowerCase().replace('-', '')].timeComplexity}
                        </span>
                      </div>
                      <div className="complexity-item">
                        <span className="complexity-label">Space:</span>
                        <span className="complexity-value">
                          {treeAlgorithmInfo[currentTraversal.toLowerCase().replace('-', '')].spaceComplexity}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Enhanced Animation Progress */}
      {animationSteps.length > 0 && (
        <motion.div 
          className="animation-progress"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          role="progressbar"
          aria-valuenow={currentStepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={animationSteps.length}
          aria-label={`Animation progress: step ${currentStepIndex + 1} of ${animationSteps.length}`}
        >
          <div className="progress-label">
            <span>Animation Progress</span>
            <span>
              {currentStepIndex + 1} of {animationSteps.length}
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${((currentStepIndex + 1) / animationSteps.length) * 100}%`,
              }}
            ></div>
          </div>
        </motion.div>
      )}
      
      {/* Enhanced Information Section */}
      <motion.div 
        className="tree-info-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        role="region"
        aria-labelledby="info-heading"
      >
        <h2 id="info-heading">About Binary Search Trees</h2>
        <p>
          A binary search tree (BST) is a node-based binary tree data structure that 
          maintains the BST property: the key in each node is greater than all keys in its 
          left subtree and less than all keys in its right subtree. This enables efficient 
          operations like search, insertion, and deletion.
        </p>
        
        <div className="info-grid">
          <div className="info-card">
            <h3>Time Complexity</h3>
            <ul>
              <li><strong>Insert:</strong> O(log n) average, O(n) worst case</li>
              <li><strong>Delete:</strong> O(log n) average, O(n) worst case</li>
              <li><strong>Search:</strong> O(log n) average, O(n) worst case</li>
              <li><strong>Traversal:</strong> O(n) for all methods</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>Key Properties</h3>
            <ul>
              <li>Ordered storage of elements</li>
              <li>Efficient searching and sorting</li>
              <li>Dynamic size adaptation</li>
              <li>In-order traversal gives sorted data</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>Real-World Applications</h3>
            <ul>
              <li>Database indexing systems</li>
              <li>File system organization</li>
              <li>Expression parsing in compilers</li>
              <li>Auto-complete suggestions</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TreeVisualizer;
