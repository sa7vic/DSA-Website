/**
 * Tree traversal algorithms
 * This module contains implementations of common tree traversal algorithms
 * with step-by-step animations for educational purposes.
 */

/**
 * Utility function to find a node by path
 * @param {Object} root The root node of the tree
 * @param {Array} path Array of directions ('left' or 'right') to follow
 * @returns {Object|null} The node found at the path or null
 */
const getNodeByPath = (node, path) => {
  if (!node || path.length === 0) return node;
  
  let current = node;
  for (const direction of path) {
    if (!current.children) return null;
    current = current.children[direction === 'left' ? 0 : 1];
    if (!current) return null;
  }
  return current;
};

/**
 * In-order traversal (left, root, right)
 * @param {Object} root The root node of the tree
 * @returns {Object} Animation steps and traversal result
 */
export const inOrderTraversal = (root) => {
  const results = [];
  const traversalResult = [];
  let currentStep = "";
  
  // Create a deep copy of the tree for animation
  const treeCopy = JSON.parse(JSON.stringify(root));
  
  currentStep = "Starting in-order traversal (left, root, right)";
  results.push({
    tree: JSON.parse(JSON.stringify(treeCopy)),
    step: currentStep,
    line: 1,
    traversalResult: []
  });
  
  const inOrder = (node, path = []) => {
    if (!node) return;
    
    // Visit left subtree
    if (node.children && node.children[0]) {
      currentStep = `Moving to left child of ${node.name}`;
      results.push({
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: currentStep,
        line: 5,
        traversalResult: [...traversalResult]
      });
      
      // Navigate to the left child
      inOrder(node.children[0], [...path, 'left']);
    }
    
    // Visit node
    currentStep = `Visiting node: ${node.name}`;
    traversalResult.push(node.name);
    
    // Highlight current node
    const nodeCopy = getNodeByPath(treeCopy, path);
    if (nodeCopy) nodeCopy.highlight = true;
    
    results.push({
      tree: JSON.parse(JSON.stringify(treeCopy)),
      step: currentStep,
      line: 8,
      traversalResult: [...traversalResult]
    });
    
    // Remove highlight after processing
    if (nodeCopy) nodeCopy.highlight = false;
    
    // Visit right subtree
    if (node.children && node.children[1]) {
      currentStep = `Moving to right child of ${node.name}`;
      results.push({
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: currentStep,
        line: 11,
        traversalResult: [...traversalResult]
      });
      
      // Navigate to the right child
      inOrder(node.children[1], [...path, 'right']);
    }
  };
  
  inOrder(treeCopy);
  
  currentStep = `In-order traversal complete: [${traversalResult.join(', ')}]`;
  results.push({
    tree: JSON.parse(JSON.stringify(treeCopy)),
    step: currentStep,
    line: 14,
    traversalResult: traversalResult
  });
  
  return { results, traversalResult };
};

/**
 * Pre-order traversal (root, left, right)
 * @param {Object} root The root node of the tree
 * @returns {Object} Animation steps and traversal result
 */
export const preOrderTraversal = (root) => {
  const results = [];
  const traversalResult = [];
  let currentStep = "";
  
  // Create a deep copy of the tree for animation
  const treeCopy = JSON.parse(JSON.stringify(root));
  
  currentStep = "Starting pre-order traversal (root, left, right)";
  results.push({
    tree: JSON.parse(JSON.stringify(treeCopy)),
    step: currentStep,
    line: 1,
    traversalResult: []
  });
  
  // Helper function to find a node by path
  const getNodeByPath = (node, path) => {
    if (!node || path.length === 0) return node;
    
    let current = node;
    for (const direction of path) {
      if (!current.children) return null;
      current = current.children[direction === 'left' ? 0 : 1];
      if (!current) return null;
    }
    return current;
  };
  
  const preOrder = (node, path = []) => {
    if (!node) return;
    
    // Visit node
    currentStep = `Visiting node: ${node.name}`;
    traversalResult.push(node.name);
    
    // Highlight current node
    const nodeCopy = getNodeByPath(treeCopy, path);
    if (nodeCopy) nodeCopy.highlight = true;
    
    results.push({
      tree: JSON.parse(JSON.stringify(treeCopy)),
      step: currentStep,
      line: 5,
      traversalResult: [...traversalResult]
    });
    
    // Remove highlight after processing
    if (nodeCopy) nodeCopy.highlight = false;
    
    // Visit left subtree
    if (node.children && node.children[0]) {
      currentStep = `Moving to left child of ${node.name}`;
      results.push({
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: currentStep,
        line: 8,
        traversalResult: [...traversalResult]
      });
      
      // Navigate to the left child
      preOrder(node.children[0], [...path, 'left']);
    }
    
    // Visit right subtree
    if (node.children && node.children[1]) {
      currentStep = `Moving to right child of ${node.name}`;
      results.push({
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: currentStep,
        line: 11,
        traversalResult: [...traversalResult]
      });
      
      // Navigate to the right child
      preOrder(node.children[1], [...path, 'right']);
    }
  };
  
  preOrder(treeCopy);
  
  currentStep = `Pre-order traversal complete: [${traversalResult.join(', ')}]`;
  results.push({
    tree: JSON.parse(JSON.stringify(treeCopy)),
    step: currentStep,
    line: 14,
    traversalResult: traversalResult
  });
  
  return { results, traversalResult };
};

/**
 * Post-order traversal (left, right, root)
 * @param {Object} root The root node of the tree
 * @returns {Object} Animation steps and traversal result
 */
export const postOrderTraversal = (root) => {
  const results = [];
  const traversalResult = [];
  let currentStep = "";
  
  // Create a deep copy of the tree for animation
  const treeCopy = JSON.parse(JSON.stringify(root));
  
  currentStep = "Starting post-order traversal (left, right, root)";
  results.push({
    tree: JSON.parse(JSON.stringify(treeCopy)),
    step: currentStep,
    line: 1,
    traversalResult: []
  });
  
  // Helper function to find a node by path
  const getNodeByPath = (node, path) => {
    if (!node || path.length === 0) return node;
    
    let current = node;
    for (const direction of path) {
      if (!current.children) return null;
      current = current.children[direction === 'left' ? 0 : 1];
      if (!current) return null;
    }
    return current;
  };
  
  const postOrder = (node, path = []) => {
    if (!node) return;
    
    // Visit left subtree
    if (node.children && node.children[0]) {
      currentStep = `Moving to left child of ${node.name}`;
      results.push({
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: currentStep,
        line: 5,
        traversalResult: [...traversalResult]
      });
      
      // Navigate to the left child
      postOrder(node.children[0], [...path, 'left']);
    }
    
    // Visit right subtree
    if (node.children && node.children[1]) {
      currentStep = `Moving to right child of ${node.name}`;
      results.push({
        tree: JSON.parse(JSON.stringify(treeCopy)),
        step: currentStep,
        line: 8,
        traversalResult: [...traversalResult]
      });
      
      // Navigate to the right child
      postOrder(node.children[1], [...path, 'right']);
    }
    
    // Visit node
    currentStep = `Visiting node: ${node.name}`;
    traversalResult.push(node.name);
    
    // Highlight current node
    const nodeCopy = getNodeByPath(treeCopy, path);
    if (nodeCopy) nodeCopy.highlight = true;
    
    results.push({
      tree: JSON.parse(JSON.stringify(treeCopy)),
      step: currentStep,
      line: 11,
      traversalResult: [...traversalResult]
    });
    
    // Remove highlight after processing
    if (nodeCopy) nodeCopy.highlight = false;
  };
  
  postOrder(treeCopy);
  
  currentStep = `Post-order traversal complete: [${traversalResult.join(', ')}]`;
  results.push({
    tree: JSON.parse(JSON.stringify(treeCopy)),
    step: currentStep,
    line: 14,
    traversalResult: traversalResult
  });
  
  return { results, traversalResult };
};

/**
 * Tree traversal code snippets for the code panel
 */
export const traversalCodeSnippets = {
  inOrder: `function inOrderTraversal(node) {
  // Base case
  if (node === null) return;
  
  // Traverse left subtree
  inOrderTraversal(node.left);
  
  // Visit node
  console.log(node.value);
  
  // Traverse right subtree
  inOrderTraversal(node.right);
}`,

  preOrder: `function preOrderTraversal(node) {
  // Base case
  if (node === null) return;
  
  // Visit node
  console.log(node.value);
  
  // Traverse left subtree
  preOrderTraversal(node.left);
  
  // Traverse right subtree
  preOrderTraversal(node.right);
}`,

  postOrder: `function postOrderTraversal(node) {
  // Base case
  if (node === null) return;
  
  // Traverse left subtree
  postOrderTraversal(node.left);
  
  // Traverse right subtree
  postOrderTraversal(node.right);
  
  // Visit node
  console.log(node.value);
}`
};
