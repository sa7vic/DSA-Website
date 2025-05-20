/**
 * Binary Search Tree implementation with animation steps
 * A standard binary search tree without self-balancing properties.
 */

export class BinaryTree {
  constructor() {
    this.root = null;
  }

  /**
   * Create a deep copy of the tree
   * @returns {BinaryTree} A new binary tree instance with the same structure
   */
  clone() {
    const newTree = new BinaryTree();
    if (this.root) {
      newTree.root = this.cloneNode(this.root);
    }
    return newTree;
  }

  /**
   * Create a deep copy of a node and its children
   * @param {import('./types').BinaryTreeNode} node The node to clone
   * @returns {import('./types').BinaryTreeNode|null} A new node with the same structure
   */
  cloneNode(node) {
    if (!node) return null;
    return {
      key: node.key,
      left: this.cloneNode(node.left),
      right: this.cloneNode(node.right),
    };
  }

  /**
   * Insert a key into the binary search tree
   * @param {number} key The key to insert
   * @returns {Array<import('./types').AnimationStep>} Animation steps for the insert operation
   */
  insert(key) {
    const steps = [];

    // Start with empty tree case
    if (!this.root) {
      this.root = { key, left: null, right: null };
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Inserted ${key} as the root of the empty tree`,
        cursor: this.root,
      });
      return steps;
    }

    steps.push({
      tree: this.cloneNode(this.root),
      description: `Starting insertion of ${key}`,
      cursor: this.root,
    });

    // Non-empty tree insertion
    let current = this.root;
    let parent = null;
    let direction = null;
    
    // Search for the insertion point
    while (current) {
      parent = current;
      
      if (key === current.key) {
        steps.push({
          tree: this.cloneNode(this.root),
          description: `Key ${key} already exists in the tree`,
          cursor: current,
        });
        return steps;
      }

      if (key < current.key) {
        direction = 'left';
        steps.push({
          tree: this.cloneNode(this.root),
          description: `${key} < ${current.key}, going left`,
          cursor: current,
        });
        current = current.left;
      } else {
        direction = 'right';
        steps.push({
          tree: this.cloneNode(this.root),
          description: `${key} > ${current.key}, going right`,
          cursor: current,
        });
        current = current.right;
      }
    }

    // Insert the new node
    const newNode = { key, left: null, right: null };
    if (direction === 'left') {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    steps.push({
      tree: this.cloneNode(this.root),
      description: `Inserted ${key} as ${direction} child of ${parent.key}`,
      cursor: newNode,
    });

    return steps;
  }

  /**
   * Find a key in the tree
   * @param {number} key The key to find
   * @returns {Array<import('./types').AnimationStep>} Animation steps for the find operation
   */
  find(key) {
    const steps = [];

    if (!this.root) {
      steps.push({
        tree: null,
        cursor: null,
        description: `Tree is empty, cannot find ${key}`,
      });
      return steps;
    }

    steps.push({
      tree: this.cloneNode(this.root),
      description: `Starting search for ${key}`,
      cursor: this.root,
    });

    // Search for the node
    let current = this.root;

    while (current) {
      if (key === current.key) {
        steps.push({
          tree: this.cloneNode(this.root),
          description: `Found ${key}`,
          cursor: current,
        });
        return steps;
      }

      if (key < current.key) {
        steps.push({
          tree: this.cloneNode(this.root),
          description: `${key} < ${current.key}, going left`,
          cursor: current,
        });
        if (!current.left) {
          steps.push({
            tree: this.cloneNode(this.root),
            description: `Left child is null, ${key} not found`,
            cursor: current,
          });
          return steps;
        }
        current = current.left;
      } else {
        steps.push({
          tree: this.cloneNode(this.root),
          description: `${key} > ${current.key}, going right`,
          cursor: current,
        });
        if (!current.right) {
          steps.push({
            tree: this.cloneNode(this.root),
            description: `Right child is null, ${key} not found`,
            cursor: current,
          });
          return steps;
        }
        current = current.right;
      }
    }

    steps.push({
      tree: this.cloneNode(this.root),
      description: `Key ${key} not found in the tree`,
      cursor: null,
    });

    return steps;
  }

  /**
   * Delete a key from the tree
   * @param {number} key The key to delete
   * @returns {Array<import('./types').AnimationStep>} Animation steps for the delete operation
   */
  delete(key) {
    const steps = [];

    if (!this.root) {
      steps.push({
        tree: null,
        cursor: null,
        description: `Tree is empty, cannot delete ${key}`,
      });
      return steps;
    }

    steps.push({
      tree: this.cloneNode(this.root),
      description: `Starting deletion of ${key}`,
      cursor: this.root,
    });

    // Find the node to delete and its parent
    let current = this.root;
    let parent = null;
    let direction = null;

    while (current && current.key !== key) {
      parent = current;
      
      if (key < current.key) {
        direction = 'left';
        steps.push({
          tree: this.cloneNode(this.root),
          description: `${key} < ${current.key}, going left`,
          cursor: current,
        });
        current = current.left;
      } else {
        direction = 'right';
        steps.push({
          tree: this.cloneNode(this.root),
          description: `${key} > ${current.key}, going right`,
          cursor: current,
        });
        current = current.right;
      }
    }

    // Key not found
    if (!current) {
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Key ${key} not found in the tree`,
        cursor: null,
      });
      return steps;
    }

    steps.push({
      tree: this.cloneNode(this.root),
      description: `Found node with key ${key} to delete`,
      cursor: current,
    });

    // Case 1: Node to delete has no children
    if (!current.left && !current.right) {
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Node ${key} has no children`,
        cursor: current,
      });
      
      if (!parent) {
        // Deleting the root
        this.root = null;
        steps.push({
          tree: null,
          description: `Deleted root node ${key}, tree is now empty`,
          cursor: null,
        });
      } else {
        // Deleting a leaf node
        if (direction === 'left') {
          parent.left = null;
        } else {
          parent.right = null;
        }
        steps.push({
          tree: this.cloneNode(this.root),
          description: `Removed leaf node ${key}`,
          cursor: parent,
        });
      }
      return steps;
    }
    
    // Case 2: Node has one child
    if (!current.left) {
      // Only has right child
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Node ${key} has only a right child`,
        cursor: current,
      });
      
      if (!parent) {
        // Deleting the root
        this.root = current.right;
        steps.push({
          tree: this.cloneNode(this.root),
          description: `Root ${key} replaced with its right child ${this.root.key}`,
          cursor: this.root,
        });
      } else {
        // Connect parent with node's right child
        if (direction === 'left') {
          parent.left = current.right;
        } else {
          parent.right = current.right;
        }
        steps.push({
          tree: this.cloneNode(this.root),
          description: `Replaced node ${key} with its right child`,
          cursor: parent,
        });
      }
      return steps;
    }
    
    if (!current.right) {
      // Only has left child
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Node ${key} has only a left child`,
        cursor: current,
      });
      
      if (!parent) {
        // Deleting the root
        this.root = current.left;
        steps.push({
          tree: this.cloneNode(this.root),
          description: `Root ${key} replaced with its left child ${this.root.key}`,
          cursor: this.root,
        });
      } else {
        // Connect parent with node's left child
        if (direction === 'left') {
          parent.left = current.left;
        } else {
          parent.right = current.left;
        }
        steps.push({
          tree: this.cloneNode(this.root),
          description: `Replaced node ${key} with its left child`,
          cursor: parent,
        });
      }
      return steps;
    }
    
    // Case 3: Node has two children
    steps.push({
      tree: this.cloneNode(this.root),
      description: `Node ${key} has two children, finding successor`,
      cursor: current,
    });
    
    // Find the in-order successor (smallest node in right subtree)
    let successor = current.right;
    let successorParent = current;
    
    while (successor.left) {
      successorParent = successor;
      successor = successor.left;
    }
    
    steps.push({
      tree: this.cloneNode(this.root),
      description: `Found successor ${successor.key} for node ${key}`,
      cursor: successor,
    });
    
    // Replace node's key with successor's key
    const successorKey = successor.key;
    
    // Delete the successor
    if (successorParent === current) {
      // Successor is direct right child
      current.right = successor.right;
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Successor ${successorKey} is direct right child, updated pointer`,
        cursor: current,
      });
    } else {
      // Successor is deeper in the tree
      successorParent.left = successor.right;
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Removed successor ${successorKey} from its original position`,
        cursor: successorParent,
      });
    }
    
    // Update the node's key with successor's key
    current.key = successorKey;
    steps.push({
      tree: this.cloneNode(this.root),
      description: `Replaced key ${key} with successor key ${successorKey}`,
      cursor: current,
    });
    
    return steps;
  }

  /**
   * Create a random binary search tree
   * @param {number} size The number of nodes
   * @returns {BinaryTree} A new random binary search tree
   */
  static random(size) {
    const tree = new BinaryTree();
    const values = new Set();

    // Generate unique random values
    while (values.size < size) {
      values.add(Math.floor(Math.random() * 100) + 1);
    }

    // Insert values into the tree
    for (const value of values) {
      tree.insert(value);
    }

    return tree;
  }
}
