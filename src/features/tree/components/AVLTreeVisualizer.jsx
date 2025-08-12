import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaHome, FaPlus, FaSearch, FaTrash, FaRandom, FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import AVLExplanation from './AVLExplanation';
import TreeDiySection from './TreeDiySection';
import '../styles/TreeVisualizer.css';

// AVL Node class
class AVLNode {
	constructor(value) {
		this.value = value;
		this.left = null;
		this.right = null;
		this.height = 1;
	}
}

// Enhanced AVL Tree class with animations
class AVLTree {
	constructor() {
		this.root = null;
		this.animationSteps = [];
		this.nodeCount = 0;
	}

	// Get height of a node
	getHeight(node) {
		return node ? node.height : 0;
	}

	// Update height of a node
	updateHeight(node) {
		if (node) {
			node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
		}
	}

	// Get balance factor of a node
	getBalance(node) {
		return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
	}

	// Right rotation
	rotateRight(y) {
		this.animationSteps.push({ 
			type: 'rotate', 
			node: y.value, 
			direction: 'right', 
			line: 45,
			description: `Right rotating node ${y.value}` 
		});
    
		const x = y.left;
		const T2 = x.right;

		x.right = y;
		y.left = T2;

		this.updateHeight(y);
		this.updateHeight(x);

		this.animationSteps.push({ 
			type: 'rotation_complete', 
			node: x.value, 
			line: 52,
			description: `Right rotation complete. New root: ${x.value}` 
		});

		return x;
	}

	// Left rotation
	rotateLeft(x) {
		this.animationSteps.push({ 
			type: 'rotate', 
			node: x.value, 
			direction: 'left', 
			line: 55,
			description: `Left rotating node ${x.value}` 
		});
    
		const y = x.right;
		const T2 = y.left;

		y.left = x;
		x.right = T2;

		this.updateHeight(x);
		this.updateHeight(y);

		this.animationSteps.push({ 
			type: 'rotation_complete', 
			node: y.value, 
			line: 62,
			description: `Left rotation complete. New root: ${y.value}` 
		});

		return y;
	}

	// Insert with animation
	insert(value) {
		this.animationSteps = [];
		this.animationSteps.push({ 
			type: 'start_insert', 
			value, 
			line: 15,
			description: `Starting insertion of ${value}` 
		});
		this.root = this.insertNode(this.root, value);
		this.nodeCount++;
		return this.animationSteps;
	}

	insertNode(node, value) {
		// Standard BST insertion
		if (node === null) {
			this.animationSteps.push({ 
				type: 'insert', 
				value, 
				line: 20,
				description: `Creating new node with value ${value}` 
			});
			return new AVLNode(value);
		}

		this.animationSteps.push({ 
			type: 'compare', 
			currentNode: node.value, 
			value, 
			line: 22,
			description: `Comparing ${value} with ${node.value}` 
		});

		if (value < node.value) {
			this.animationSteps.push({
				type: 'go_left',
				currentNode: node.value,
				value,
				line: 24,
				description: `${value} < ${node.value}, going left`
			});
			node.left = this.insertNode(node.left, value);
		} else if (value > node.value) {
			this.animationSteps.push({
				type: 'go_right',
				currentNode: node.value,
				value,
				line: 26,
				description: `${value} > ${node.value}, going right`
			});
			node.right = this.insertNode(node.right, value);
		} else {
			this.animationSteps.push({ 
				type: 'duplicate', 
				value, 
				line: 28,
				description: `Value ${value} already exists`,
				error: true
			});
			return node;
		}

		// Update height
		this.updateHeight(node);
		this.animationSteps.push({ 
			type: 'update_height', 
			node: node.value, 
			height: node.height, 
			line: 30,
			description: `Updating height of ${node.value} to ${node.height}` 
		});
    
		// Get balance factor
		const balance = this.getBalance(node);
		this.animationSteps.push({ 
			type: 'balance_check', 
			node: node.value, 
			balance, 
			line: 32,
			description: `Balance factor of ${node.value}: ${balance}` 
		});

		// Perform rotations if needed
		if (balance > 1 && value < node.left.value) {
			this.animationSteps.push({ 
				type: 'rotation_needed', 
				rotation: 'Right', 
				line: 35,
				description: `Left-Left case detected. Performing right rotation.` 
			});
			return this.rotateRight(node);
		}

		if (balance < -1 && value > node.right.value) {
			this.animationSteps.push({ 
				type: 'rotation_needed', 
				rotation: 'Left', 
				line: 37,
				description: `Right-Right case detected. Performing left rotation.` 
			});
			return this.rotateLeft(node);
		}

		if (balance > 1 && value > node.left.value) {
			this.animationSteps.push({ 
				type: 'rotation_needed', 
				rotation: 'Left-Right', 
				line: 39,
				description: `Left-Right case detected. Performing left-right rotation.` 
			});
			node.left = this.rotateLeft(node.left);
			return this.rotateRight(node);
		}

		if (balance < -1 && value < node.right.value) {
			this.animationSteps.push({ 
				type: 'rotation_needed', 
				rotation: 'Right-Left', 
				line: 42,
				description: `Right-Left case detected. Performing right-left rotation.` 
			});
			node.right = this.rotateRight(node.right);
			return this.rotateLeft(node);
		}

		return node;
	}

	// Search method
	search(value) {
		this.animationSteps = [];
		this.animationSteps.push({ 
			type: 'start_search', 
			value, 
			line: 65,
			description: `Starting search for ${value}` 
		});
		const result = this.searchNode(this.root, value);
		return { found: result, steps: this.animationSteps };
	}

	searchNode(node, value) {
		if (node === null) {
			this.animationSteps.push({ 
				type: 'not_found', 
				value, 
				line: 70,
				description: `Value ${value} not found` 
			});
			return false;
		}

		this.animationSteps.push({ 
			type: 'compare', 
			currentNode: node.value, 
			value, 
			line: 72,
			description: `Comparing ${value} with ${node.value}` 
		});

		if (value === node.value) {
			this.animationSteps.push({ 
				type: 'found', 
				value, 
				line: 74,
				description: `Found ${value}!` 
			});
			return true;
		}

		if (value < node.value) {
			this.animationSteps.push({
				type: 'go_left',
				currentNode: node.value,
				value,
				line: 76,
				description: `${value} < ${node.value}, searching left`
			});
			return this.searchNode(node.left, value);
		} else {
			this.animationSteps.push({
				type: 'go_right',
				currentNode: node.value,
				value,
				line: 78,
				description: `${value} > ${node.value}, searching right`
			});
			return this.searchNode(node.right, value);
		}
	}

	// Get all nodes for visualization with proper coordinates for 760x460 SVG
		getAllNodes() {
			const nodes = [];
			// Center horizontally and start from top with proper spacing
			this.collectNodes(this.root, nodes, 380, 50, 180);
			return nodes;
		}

		collectNodes(node, nodes, x, y, offset) {
		if (node === null) return;
    
		nodes.push({
			value: node.value,
			x: x,
			y: y,
			height: node.height,
			balance: this.getBalance(node)
		});

		if (node.left) {
			this.collectNodes(node.left, nodes, x - offset, y + 80, Math.max(40, offset / 2));
		}
		if (node.right) {
			this.collectNodes(node.right, nodes, x + offset, y + 80, Math.max(40, offset / 2));
		}
	}

	// Get all edges for visualization with proper coordinates for 760x460 SVG
		getAllEdges() {
			const edges = [];
			this.collectEdges(this.root, edges, 380, 50, 180);
			return edges;
		}

		collectEdges(node, edges, x, y, offset) {
		if (node === null) return;

		if (node.left) {
			const leftX = x - offset;
			const leftY = y + 80;
			edges.push({
				x1: x, y1: y + 22,
				x2: leftX, y2: leftY - 22
			});
			this.collectEdges(node.left, edges, leftX, leftY, Math.max(40, offset / 2));
		}
    
		if (node.right) {
			const rightX = x + offset;
			const rightY = y + 80;
			edges.push({
				x1: x, y1: y + 22,
				x2: rightX, y2: rightY - 22
			});
			this.collectEdges(node.right, edges, rightX, rightY, Math.max(40, offset / 2));
		}
	}
}

const avlCode = `#include <stdio.h>
#include <stdlib.h>

// AVL Tree Node structure
struct AVLNode {
		int data;
		struct AVLNode* left;
		struct AVLNode* right;
		int height;
};

// Function to create a new node
struct AVLNode* newNode(int data) {
		struct AVLNode* node = (struct AVLNode*)malloc(sizeof(struct AVLNode));
		node->data = data;
		node->left = NULL;
		node->right = NULL;
		node->height = 1;
		return node;
}

// Get height of node
int getHeight(struct AVLNode* node) {
		if (node == NULL) return 0;
		return node->height;
}

// Get balance factor of node
int getBalance(struct AVLNode* node) {
		if (node == NULL) return 0;
		return getHeight(node->left) - getHeight(node->right);
}

// Update height of node
void updateHeight(struct AVLNode* node) {
		if (node != NULL) {
				int leftHeight = getHeight(node->left);
				int rightHeight = getHeight(node->right);
				node->height = 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
		}
}

// Right rotate
struct AVLNode* rotateRight(struct AVLNode* y) {
		struct AVLNode* x = y->left;
		struct AVLNode* T2 = x->right;
    
		// Perform rotation
		x->right = y;
		y->left = T2;
    
		// Update heights
		updateHeight(y);
		updateHeight(x);
    
		return x;
}

// Left rotate
struct AVLNode* rotateLeft(struct AVLNode* x) {
		struct AVLNode* y = x->right;
		struct AVLNode* T2 = y->left;
    
		// Perform rotation
		y->left = x;
		x->right = T2;
    
		// Update heights
		updateHeight(x);
		updateHeight(y);
    
		return y;
}

// Insert node
struct AVLNode* insert(struct AVLNode* node, int data) {
		// Standard BST insertion
		if (node == NULL)
				return newNode(data);
    
		if (data < node->data)
				node->left = insert(node->left, data);
		else if (data > node->data)
				node->right = insert(node->right, data);
		else
				return node; // Duplicates not allowed
    
		// Update height
		updateHeight(node);
    
		// Get balance factor
		int balance = getBalance(node);
    
		// Left Left Case
		if (balance > 1 && data < node->left->data)
				return rotateRight(node);
    
		// Right Right Case
		if (balance < -1 && data > node->right->data)
				return rotateLeft(node);
    
		// Left Right Case
		if (balance > 1 && data > node->left->data) {
				node->left = rotateLeft(node->left);
				return rotateRight(node);
		}
    
		// Right Left Case
		if (balance < -1 && data < node->right->data) {
				node->right = rotateRight(node->right);
				return rotateLeft(node);
		}
    
		return node;
}

// Search function
struct AVLNode* search(struct AVLNode* root, int data) {
		if (root == NULL || root->data == data)
				return root;
    
		if (data < root->data)
				return search(root->left, data);
    
		return search(root->right, data);
}`;

const AVLTreeVisualizer = () => {
	const [avlTree, setAvlTree] = useState(new AVLTree());
	const [inputValue, setInputValue] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [animationSteps, setAnimationSteps] = useState([]);
	const [currentStep, setCurrentStep] = useState(-1);
	const [isAnimating, setIsAnimating] = useState(false);
	const [animationSpeed, setAnimationSpeed] = useState(1000);
	const [currentOperation, setCurrentOperation] = useState('');
	const [lastSearchResult, setLastSearchResult] = useState(null);
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);
  
	const animationTimeoutRef = useRef(null);
	const codeViewerRef = useRef(null);

	// Current step info (declare BEFORE any effects that depend on it)
	const currentStepInfo = (currentStep >= 0 && currentStep < animationSteps.length)
		? animationSteps[currentStep]
		: null;

	// Auto-scroll code to current step line - use same approach as BST
	useEffect(() => {
		const line = currentStepInfo?.line;
		if (line && codeViewerRef.current) {
			const lineElement = codeViewerRef.current.querySelector(`[data-line-number="${line}"]`);
			if (lineElement) {
				lineElement.scrollIntoView({ 
					behavior: 'smooth', 
					block: 'center',
					inline: 'nearest'
				});
			}
		}
	}, [currentStepInfo?.line]);

	// Ensure code highlight updates while animating
	useEffect(() => {
		if (isAnimating && currentStepInfo?.line) {
			// trigger reflow for highlight CSS effects if needed
			requestAnimationFrame(() => {
				// no-op: presence ensures rerender before next timeout tick
			});
		}
	}, [isAnimating, currentStepInfo?.line]);

	// Update visualization when tree changes
	useEffect(() => {
		setNodes(avlTree.getAllNodes());
		setEdges(avlTree.getAllEdges());
	}, [avlTree]);

	// Handle insert
	const handleInsert = () => {
		if (!inputValue || isAnimating) return;
    
		const value = parseInt(inputValue);
		if (isNaN(value)) return;

		const steps = avlTree.insert(value);
		setAnimationSteps(steps);
		setCurrentStep(-1);
		setCurrentOperation(`Inserting ${value}`);
		setInputValue('');
    
		// Create a new tree instance with the updated root to trigger re-render
		const newTree = new AVLTree();
		newTree.root = avlTree.root;
		setAvlTree(newTree);
	};

	// Handle search
	const handleSearch = () => {
		if (!searchValue || isAnimating) return;
    
		const value = parseInt(searchValue);
		if (isNaN(value)) return;

		const result = avlTree.search(value);
		setAnimationSteps(result.steps);
		setCurrentStep(-1);
		setCurrentOperation(`Searching for ${value}`);
		setLastSearchResult(result.found);
		setSearchValue('');
	};

	// Generate random tree
	const generateRandomTree = () => {
		if (isAnimating) return;
    
		const newTree = new AVLTree();
		const values = [];
    
		// Generate 7-10 random values
		const count = Math.floor(Math.random() * 4) + 7;
		while (values.length < count) {
			const value = Math.floor(Math.random() * 99) + 1;
			if (!values.includes(value)) {
				values.push(value);
				newTree.insert(value);
			}
		}
    
		setAvlTree(newTree);
		setAnimationSteps([]);
		setCurrentStep(-1);
		setCurrentOperation(`Generated random AVL tree with values: ${values.join(', ')}`);
		setLastSearchResult(null);
	};

	// Clear tree
	const clearTree = () => {
		if (isAnimating) return;
    
		setAvlTree(new AVLTree());
		setAnimationSteps([]);
		setCurrentStep(-1);
		setCurrentOperation('Tree Cleared');
		setLastSearchResult(null);
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
			setCurrentStep(prev => prev + 1);
		}
	};

	const stepBackward = () => {
		if (currentStep > -1) {
			setCurrentStep(prev => prev - 1);
		}
	};

	const resetAnimation = () => {
		setCurrentStep(-1);
		setIsAnimating(false);
		if (animationTimeoutRef.current) {
			clearTimeout(animationTimeoutRef.current);
		}
	};

	// currentStepInfo already computed above

	// Stop animation when component unmounts
	useEffect(() => {
		return () => {
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
		};
	}, []);

	return (
		<div className="tree-app">
			<header className="header">
				<Link to="/trees" className="home-btn">
					<FaHome />
					<span>Trees</span>
				</Link>
				<h1>AVL Tree Visualizer</h1>
			</header>
      
			<main className="split-view">
				{/* Left Panel - Code */}
				<section className="panel code-panel">
					<h2>C Implementation</h2>
					<div className="code-viewer" ref={codeViewerRef}>
						<SyntaxHighlighter 
							language="c" 
							style={vs2015} 
							showLineNumbers
							wrapLines
							lineProps={(lineNumber) => {
								const isCurrentLine = currentStepInfo?.line === lineNumber;
								const isErrorLine = currentStepInfo?.error && currentStepInfo?.line === lineNumber;
								return {
									'data-line-number': lineNumber,
									style: { 
										backgroundColor: isCurrentLine 
											? isErrorLine 
												? 'rgba(255, 0, 0, 0.1)' 
												: 'rgba(88, 166, 255, 0.1)' 
											: 'transparent',
										display: 'block',
										color: isCurrentLine ? '#fff' : undefined,
										fontWeight: isCurrentLine ? 'bold' : 'normal',
										borderLeft: isErrorLine ? '4px solid #f85149' : isCurrentLine ? '4px solid #58a6ff' : 'none',
										paddingLeft: isCurrentLine ? '8px' : '12px'
									}
								};
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
						>
							{avlCode}
						</SyntaxHighlighter>
					</div>
				</section>

				{/* Right Panel - Visualization */}
				<section className="panel viz-panel">
					<h2>Interactive Visualization</h2>
          
					{/* Controls */}
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

						<div className="input-group">
							<input
								type="number"
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								placeholder="Search number"
								className="number-input"
								onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
								disabled={isAnimating}
							/>
							<button onClick={handleSearch} className="btn btn-secondary" disabled={!searchValue || isAnimating}>
								<FaSearch /> Search
							</button>
						</div>

						<div className="action-group">
							<button onClick={generateRandomTree} className="btn btn-info" disabled={isAnimating}>
								<FaRandom /> Random Tree
							</button>
							<button onClick={clearTree} className="btn btn-warning" disabled={isAnimating}>
								<FaTrash /> Clear
							</button>
						</div>
					</div>

					{/* Animation Controls */}
					{animationSteps.length > 0 && (
						<div className="animation-controls">
							<button onClick={stepBackward} className="btn btn-step" disabled={currentStep <= -1}>
								<FaStepBackward />
							</button>
              
							{!isAnimating ? (
								<button onClick={startAnimation} className="btn btn-play" disabled={currentStep >= animationSteps.length - 1}>
									<FaPlay /> Play
								</button>
							) : (
								<button onClick={pauseAnimation} className="btn btn-pause">
									<FaPause /> Pause
								</button>
							)}
              
							<button onClick={stepForward} className="btn btn-step" disabled={currentStep >= animationSteps.length - 1}>
								<FaStepForward />
							</button>
              
							<button onClick={resetAnimation} className="btn btn-reset">
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
								<span>{(2200 - animationSpeed) / 200}x</span>
							</div>
						</div>
					)}

					{/* Current Step Info */}
					{currentStepInfo && (
						<div className="step-info">
							<h3>Step {currentStep + 1} of {animationSteps.length} - {currentOperation}</h3>
							<p>{currentStepInfo.description}</p>
							{currentStepInfo.line && (
								<span className="code-line">Line {currentStepInfo.line}</span>
							)}
						</div>
					)}

					{/* AVL Tree Visualization */}
					<div className="tree-display">
						{nodes.length > 0 ? (() => {
							// Calculate proper SVG dimensions like BST
							const getTreeHeight = (node) => {
								if (!node) return 0;
								return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
							};
							const treeHeight = getTreeHeight(avlTree.root);
							const svgWidth = 760;
							const svgHeight = Math.min(460, Math.max(treeHeight * 70 + 100, 300));
							
							return (
								<svg 
									width={svgWidth} 
									height={svgHeight} 
									className="tree-svg"
									viewBox={`0 0 ${svgWidth} ${svgHeight}`}
									preserveAspectRatio="xMidYMid meet"
								>
									{/* Draw edges */}
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
	                
									{/* Draw nodes */}
									{nodes.map((node, index) => {
										let nodeClass = 'tree-node';
	                  
										// Highlight nodes based on current animation step
										if (currentStepInfo) {
											if (currentStepInfo.currentNode === node.value) {
												nodeClass += ' highlighted';
											}
											if (currentStepInfo.type === 'found' && currentStepInfo.value === node.value) {
												nodeClass += ' found';
											}
											if (currentStepInfo.type === 'insert' && currentStepInfo.value === node.value) {
												nodeClass += ' inserted';
											}
											if (currentStepInfo.type === 'rotate' && currentStepInfo.node === node.value) {
												nodeClass += ' rotating';
											}
										}
	                  
										const nodeRadius = 22;
										
										return (
											<g key={index}>
												<circle
													cx={node.x}
													cy={node.y}
													r={nodeRadius}
													className={nodeClass}
												/>
												<text
													x={node.x}
													y={node.y}
													textAnchor="middle"
													dominantBaseline="central"
													className="node-text"
													fontSize="16"
													fill="white"
													fontWeight="700"
												>
													{node.value}
												</text>
												{/* Show height and balance factor */}
												<text
													x={node.x + 25}
													y={node.y - 15}
													textAnchor="start"
													className="height-text"
													fontSize="12"
													fill="#87ceeb"
												>
													h:{node.height}
												</text>
												<text
													x={node.x + 25}
													y={node.y + 15}
													textAnchor="start"
													className="balance-factor"
													fontSize="12"
													fill="#ffd700"
												>
													b:{node.balance}
												</text>
											</g>
										);
									})}
								</svg>
							);
						})() : (
							<div className="empty-tree">
								<p>AVL Tree is empty</p>
								<p>Insert some numbers to start</p>
							</div>
						)}
					</div>

					{/* Search Result */}
					{lastSearchResult !== null && (
						<div className={`search-result ${lastSearchResult ? 'found' : 'not-found'}`}>
							<h3>Search Result:</h3>
							<p>{lastSearchResult ? '✓ Found' : '✗ Not Found'}</p>
						</div>
					)}

					{/* Tree Information */}
					{nodes.length > 0 && (
						<div className="tree-info">
							<h3>Tree Information:</h3>
							<div className="info-grid">
								<div className="info-item">
									<span>Total Nodes:</span>
									<span>{nodes.length}</span>
								</div>
								<div className="info-item">
									<span>Tree Height:</span>
									<span>{Math.max(...nodes.map(n => n.y)) / 15}</span>
								</div>
								<div className="info-item">
									<span>Is Balanced:</span>
									<span>✓ Yes (AVL Property)</span>
								</div>
							</div>
						</div>
					)}

					{/* AVL-specific explanation and shared DIY section */}
					<AVLExplanation />
					<TreeDiySection />
				</section>
			</main>
		</div>
	);
};

export default AVLTreeVisualizer;
