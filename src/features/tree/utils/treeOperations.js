/**
 * Tree Operations - Comprehensive Binary Search Tree Implementation
 * Provides complete BST functionality with step-by-step visualization support
 */

/**
 * Tree Node class for BST operations
 */
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.highlight = false;
    this.id = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clone a tree node with all its children
   */
  clone() {
    const cloned = new TreeNode(this.value);
    cloned.highlight = this.highlight;
    cloned.id = this.id;
    
    if (this.left) {
      cloned.left = this.left.clone();
    }
    if (this.right) {
      cloned.right = this.right.clone();
    }
    
    return cloned;
  }
}

/**
 * Binary Search Tree class with comprehensive operations
 */
class BinarySearchTree {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  /**
   * Clone the entire tree
   */
  clone() {
    const cloned = new BinarySearchTree();
    cloned.size = this.size;
    if (this.root) {
      cloned.root = this.root.clone();
    }
    return cloned;
  }

  /**
   * Insert a value into the BST with step-by-step visualization
   */
  insert(value, steps = []) {
    const step = (tree, description, line = 0, highlight = null) => {
      steps.push({
        tree: tree ? this.toHierarchyData(tree) : null,
        description,
        line,
        highlight
      });
    };

    if (this.root === null) {
      this.root = new TreeNode(value);
      this.size++;
      step(this.root, `Inserted ${value} as root node`, 1);
      return { tree: this, steps };
    }

    const insertRecursive = (node, value, path = 'root') => {
      if (value < node.value) {
        step(this.root, `${value} < ${node.value}, going left`, 2, node.value);
        
        if (node.left === null) {
          node.left = new TreeNode(value);
          this.size++;
          step(this.root, `Inserted ${value} as left child of ${node.value}`, 3);
        } else {
          insertRecursive(node.left, value, path + '.left');
        }
      } else if (value > node.value) {
        step(this.root, `${value} > ${node.value}, going right`, 4, node.value);
        
        if (node.right === null) {
          node.right = new TreeNode(value);
          this.size++;
          step(this.root, `Inserted ${value} as right child of ${node.value}`, 5);
        } else {
          insertRecursive(node.right, value, path + '.right');
        }
      } else {
        step(this.root, `${value} already exists in tree`, 6, node.value);
      }
    };

    insertRecursive(this.root, value);
    step(this.root, `Insert operation completed`, 7);
    return { tree: this, steps };
  }

  /**
   * Search for a value in the BST with step-by-step visualization
   */
  search(value, steps = []) {
    const step = (tree, description, line = 0, highlight = null) => {
      steps.push({
        tree: tree ? this.toHierarchyData(tree) : null,
        description,
        line,
        highlight,
        found: false
      });
    };

    if (this.root === null) {
      step(null, `Tree is empty, ${value} not found`, 1);
      return { found: false, steps };
    }

    const searchRecursive = (node, value) => {
      if (node === null) {
        step(this.root, `Reached null node, ${value} not found`, 2);
        return false;
      }

      if (value === node.value) {
        node.highlight = true;
        step(this.root, `Found ${value}!`, 3, node.value);
        steps[steps.length - 1].found = true;
        return true;
      } else if (value < node.value) {
        step(this.root, `${value} < ${node.value}, searching left subtree`, 4, node.value);
        return searchRecursive(node.left, value);
      } else {
        step(this.root, `${value} > ${node.value}, searching right subtree`, 5, node.value);
        return searchRecursive(node.right, value);
      }
    };

    const found = searchRecursive(this.root, value);
    step(this.root, found ? `Search completed: ${value} found` : `Search completed: ${value} not found`, 6);
    
    return { found, steps };
  }

  /**
   * Delete a value from the BST with step-by-step visualization
   */
  delete(value, steps = []) {
    const step = (tree, description, line = 0, highlight = null) => {
      steps.push({
        tree: tree ? this.toHierarchyData(tree) : null,
        description,
        line,
        highlight
      });
    };

    if (this.root === null) {
      step(null, `Tree is empty, cannot delete ${value}`, 1);
      return { tree: this, steps };
    }

    const findMin = (node) => {
      while (node.left !== null) {
        node = node.left;
      }
      return node;
    };

    const deleteRecursive = (node, value) => {
      if (node === null) {
        step(this.root, `${value} not found for deletion`, 2);
        return null;
      }

      if (value < node.value) {
        step(this.root, `${value} < ${node.value}, deleting from left subtree`, 3, node.value);
        node.left = deleteRecursive(node.left, value);
      } else if (value > node.value) {
        step(this.root, `${value} > ${node.value}, deleting from right subtree`, 4, node.value);
        node.right = deleteRecursive(node.right, value);
      } else {
        // Node to delete found
        step(this.root, `Found node ${value} to delete`, 5, node.value);
        
        // Case 1: Node with no children (leaf node)
        if (node.left === null && node.right === null) {
          step(this.root, `${value} is a leaf node, removing it`, 6);
          this.size--;
          return null;
        }
        
        // Case 2: Node with one child
        if (node.left === null) {
          step(this.root, `${value} has only right child, replacing with right subtree`, 7);
          this.size--;
          return node.right;
        }
        
        if (node.right === null) {
          step(this.root, `${value} has only left child, replacing with left subtree`, 8);
          this.size--;
          return node.left;
        }
        
        // Case 3: Node with two children
        step(this.root, `${value} has two children, finding inorder successor`, 9);
        const successor = findMin(node.right);
        step(this.root, `Found successor ${successor.value} for ${value}`, 10, successor.value);
        
        node.value = successor.value;
        step(this.root, `Replaced ${value} with ${successor.value}`, 11);
        
        node.right = deleteRecursive(node.right, successor.value);
      }
      
      return node;
    };

    this.root = deleteRecursive(this.root, value);
    step(this.root, `Delete operation completed`, 12);
    
    return { tree: this, steps };
  }

  /**
   * Convert tree to hierarchy data format for visualization
   */
  toHierarchyData(node = this.root) {
    if (!node) return null;
    
    const hierarchyNode = {
      name: node.value.toString(),
      value: node.value,
      id: node.id,
      highlight: node.highlight || false,
      children: []
    };
    
    if (node.left) {
      hierarchyNode.children.push(this.toHierarchyData(node.left));
    }
    
    if (node.right) {
      // Ensure right child is in correct position
      if (!node.left) {
        hierarchyNode.children.push(null);
      }
      hierarchyNode.children.push(this.toHierarchyData(node.right));
    }
    
    // Clean up trailing nulls
    while (hierarchyNode.children.length > 0 && 
           hierarchyNode.children[hierarchyNode.children.length - 1] === null) {
      hierarchyNode.children.pop();
    }
    
    return hierarchyNode;
  }

  /**
   * Generate a random BST
   */
  static generateRandom(size = 7) {
    const tree = new BinarySearchTree();
    const values = new Set();
    
    // Generate unique random values
    while (values.size < size) {
      const value = Math.floor(Math.random() * 100) + 1;
      values.add(value);
    }
    
    // Insert values into tree
    Array.from(values).forEach(value => {
      tree.insert(value);
    });
    
    return tree;
  }

  /**
   * Clear all highlights from nodes
   */
  clearHighlights(node = this.root) {
    if (!node) return;
    
    node.highlight = false;
    this.clearHighlights(node.left);
    this.clearHighlights(node.right);
  }

  /**
   * Get tree statistics
   */
  getStats() {
    const getHeight = (node) => {
      if (!node) return 0;
      return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    };

    const getLeafCount = (node) => {
      if (!node) return 0;
      if (!node.left && !node.right) return 1;
      return getLeafCount(node.left) + getLeafCount(node.right);
    };

    return {
      size: this.size,
      height: getHeight(this.root),
      leafCount: getLeafCount(this.root),
      isEmpty: this.size === 0
    };
  }
}

/**
 * Tree Traversal Operations
 */
class TreeTraversal {
  /**
   * In-order traversal with step-by-step visualization
   */
  static inOrder(tree, steps = []) {
    const result = [];
    
    const step = (tree, description, line = 0, highlight = null, result = []) => {
      steps.push({
        tree: tree ? tree.toHierarchyData() : null,
        description,
        line,
        highlight,
        traversalResult: [...result]
      });
    };

    const inOrderRecursive = (node) => {
      if (!node) return;
      
      // Clear previous highlights
      tree.clearHighlights();
      
      // Visit left subtree
      if (node.left) {
        step(tree, `Visiting left subtree of ${node.value}`, 1, node.value, result);
        inOrderRecursive(node.left);
      }
      
      // Visit current node
      node.highlight = true;
      result.push(node.value);
      step(tree, `Visiting node ${node.value}`, 2, node.value, result);
      
      // Visit right subtree
      if (node.right) {
        step(tree, `Visiting right subtree of ${node.value}`, 3, node.value, result);
        inOrderRecursive(node.right);
      }
    };

    if (tree.root) {
      step(tree, "Starting in-order traversal", 0, null, result);
      inOrderRecursive(tree.root);
      step(tree, "In-order traversal completed", 4, null, result);
    }
    
    return { result, steps };
  }

  /**
   * Pre-order traversal with step-by-step visualization
   */
  static preOrder(tree, steps = []) {
    const result = [];
    
    const step = (tree, description, line = 0, highlight = null, result = []) => {
      steps.push({
        tree: tree ? tree.toHierarchyData() : null,
        description,
        line,
        highlight,
        traversalResult: [...result]
      });
    };

    const preOrderRecursive = (node) => {
      if (!node) return;
      
      // Clear previous highlights
      tree.clearHighlights();
      
      // Visit current node
      node.highlight = true;
      result.push(node.value);
      step(tree, `Visiting node ${node.value}`, 1, node.value, result);
      
      // Visit left subtree
      if (node.left) {
        step(tree, `Visiting left subtree of ${node.value}`, 2, node.value, result);
        preOrderRecursive(node.left);
      }
      
      // Visit right subtree
      if (node.right) {
        step(tree, `Visiting right subtree of ${node.value}`, 3, node.value, result);
        preOrderRecursive(node.right);
      }
    };

    if (tree.root) {
      step(tree, "Starting pre-order traversal", 0, null, result);
      preOrderRecursive(tree.root);
      step(tree, "Pre-order traversal completed", 4, null, result);
    }
    
    return { result, steps };
  }

  /**
   * Post-order traversal with step-by-step visualization
   */
  static postOrder(tree, steps = []) {
    const result = [];
    
    const step = (tree, description, line = 0, highlight = null, result = []) => {
      steps.push({
        tree: tree ? tree.toHierarchyData() : null,
        description,
        line,
        highlight,
        traversalResult: [...result]
      });
    };

    const postOrderRecursive = (node) => {
      if (!node) return;
      
      // Clear previous highlights
      tree.clearHighlights();
      
      // Visit left subtree
      if (node.left) {
        step(tree, `Visiting left subtree of ${node.value}`, 1, node.value, result);
        postOrderRecursive(node.left);
      }
      
      // Visit right subtree
      if (node.right) {
        step(tree, `Visiting right subtree of ${node.value}`, 2, node.value, result);
        postOrderRecursive(node.right);
      }
      
      // Visit current node
      node.highlight = true;
      result.push(node.value);
      step(tree, `Visiting node ${node.value}`, 3, node.value, result);
    };

    if (tree.root) {
      step(tree, "Starting post-order traversal", 0, null, result);
      postOrderRecursive(tree.root);
      step(tree, "Post-order traversal completed", 4, null, result);
    }
    
    return { result, steps };
  }

  /**
   * Level-order traversal with step-by-step visualization
   */
  static levelOrder(tree, steps = []) {
    const result = [];
    
    const step = (tree, description, line = 0, highlight = null, result = []) => {
      steps.push({
        tree: tree ? tree.toHierarchyData() : null,
        description,
        line,
        highlight,
        traversalResult: [...result]
      });
    };

    if (!tree.root) {
      step(tree, "Tree is empty", 0, null, result);
      return { result, steps };
    }

    const queue = [tree.root];
    step(tree, "Starting level-order traversal", 0, null, result);

    while (queue.length > 0) {
      // Clear previous highlights
      tree.clearHighlights();
      
      const node = queue.shift();
      node.highlight = true;
      result.push(node.value);
      
      step(tree, `Visiting node ${node.value}`, 1, node.value, result);
      
      if (node.left) {
        queue.push(node.left);
        step(tree, `Added left child ${node.left.value} to queue`, 2, node.value, result);
      }
      
      if (node.right) {
        queue.push(node.right);
        step(tree, `Added right child ${node.right.value} to queue`, 3, node.value, result);
      }
    }

    step(tree, "Level-order traversal completed", 4, null, result);
    return { result, steps };
  }
}

/**
 * Tree Utility Functions
 */
export const treeUtils = {
  /**
   * Validate tree input value
   */
  validateInput: (value) => {
    const num = parseInt(value);
    if (isNaN(num)) {
      return { valid: false, error: 'Please enter a valid number' };
    }
    if (num < 1 || num > 999) {
      return { valid: false, error: 'Please enter a number between 1 and 999' };
    }
    return { valid: true, value: num };
  },

  /**
   * Check if tree is balanced
   */
  isBalanced: (tree) => {
    const checkBalance = (node) => {
      if (!node) return { balanced: true, height: 0 };
      
      const left = checkBalance(node.left);
      const right = checkBalance(node.right);
      
      const balanced = left.balanced && right.balanced && 
                      Math.abs(left.height - right.height) <= 1;
      
      return {
        balanced,
        height: 1 + Math.max(left.height, right.height)
      };
    };
    
    return checkBalance(tree.root).balanced;
  },

  /**
   * Convert array to BST
   */
  arrayToBST: (arr) => {
    const tree = new BinarySearchTree();
    arr.forEach(value => tree.insert(value));
    return tree;
  },

  /**
   * Tree to array (in-order)
   */
  treeToArray: (tree) => {
    const result = [];
    const inOrder = (node) => {
      if (!node) return;
      inOrder(node.left);
      result.push(node.value);
      inOrder(node.right);
    };
    inOrder(tree.root);
    return result;
  }
};

export { BinarySearchTree, TreeTraversal, TreeNode };
