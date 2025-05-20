/**
 * Splay Tree implementation with animation steps
 * A self-balancing binary search tree with the additional property that recently accessed elements are quick to access again.
 */

export class SplayTree {
  constructor() {
    this.root = null;
  }

  /**
   * Create a deep copy of the tree
   * @returns {SplayTree} A new splay tree instance with the same structure
   */
  clone() {
    const newTree = new SplayTree();
    if (this.root) {
      newTree.root = this.cloneNode(this.root);
    }
    return newTree;
  }

  /**
   * Create a deep copy of a node and its children
   * @param {import('./types').SplayTreeNode} node The node to clone
   * @returns {import('./types').SplayTreeNode|null} A new node with the same structure
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
   * Find a key in the tree and splay it to the root
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
    let path = [];

    while (current && current.key !== key) {
      path.push(current);
      if (key < current.key) {
        if (!current.left) break;
        current = current.left;
      } else {
        if (!current.right) break;
        current = current.right;
      }

      // Add search step
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Comparing ${key} with ${current.key}`,
        cursor: current,
      });
    }

    // If we found the key or reached a leaf
    if (current) {
      if (current.key === key) {
        steps.push({
          tree: this.cloneNode(this.root),
          description: `Found ${key}, now splaying`,
          cursor: current,
        });

        // Add splay steps
        const splaySteps = this.splay(key);
        steps.push(...splaySteps);

        steps.push({
          tree: this.cloneNode(this.root),
          description: `Completed splaying, ${key} is now at the root`,
          cursor: this.root,
        });
      } else {
        steps.push({
          tree: this.cloneNode(this.root),
          description: `${key} not found in the tree`,
          cursor: null,
        });
      }
    } else {
      steps.push({
        tree: this.cloneNode(this.root),
        description: `${key} not found in the tree`,
        cursor: null,
      });
    }

    return steps;
  }

  /**
   * Insert a key into the tree and splay it to the root
   * @param {number} key The key to insert
   * @returns {Array<import('./types').AnimationStep>} Animation steps for the insert operation
   */
  insert(key) {
    const steps = [];

    if (!this.root) {
      this.root = { key, left: null, right: null };
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Inserted ${key} as the root`,
        cursor: this.root,
      });
      return steps;
    }

    steps.push({
      tree: this.cloneNode(this.root),
      description: `Starting insertion of ${key}`,
      cursor: this.root,
    });

    // First, find where to insert
    let current = this.root;
    let parent = null;
    let isLeft = false;

    while (current) {
      parent = current;
      if (key < current.key) {
        isLeft = true;
        current = current.left;
      } else if (key > current.key) {
        isLeft = false;
        current = current.right;
      } else {
        // Key already exists
        steps.push({
          tree: this.cloneNode(this.root),
          description: `${key} already exists in the tree`,
          cursor: current,
        });

        // Splay to bring it to the root
        const splaySteps = this.splay(key);
        steps.push(...splaySteps);
        return steps;
      }

      if (current) {
        steps.push({
          tree: this.cloneNode(this.root),
          description: `Moving to ${current.key} while looking for insertion point`,
          cursor: current,
        });
      }
    }

    // Insert the new node
    const newNode = { key, left: null, right: null };
    if (parent) {
      if (isLeft) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }

      steps.push({
        tree: this.cloneNode(this.root),
        description: `Inserted ${key} as ${isLeft ? "left" : "right"} child of ${parent.key}`,
        cursor: newNode,
      });
    }

    // Splay the newly inserted node to the root
    const splaySteps = this.splay(key);
    steps.push(...splaySteps);

    steps.push({
      tree: this.cloneNode(this.root),
      description: `Completed insertion, ${key} is now at the root`,
      cursor: this.root,
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
        description: `Tree is empty, cannot delete ${key}`,
        cursor: null,
      });
      return steps;
    }

    steps.push({
      tree: this.cloneNode(this.root),
      description: `Starting deletion of ${key}`,
      cursor: this.root,
    });

    // First, find the node
    const findSteps = this.find(key);
    // We only want steps up to when it's found, not including the final step
    if (findSteps.length > 1) {
      // Skip the last step of find, as we'll handle it differently for delete
      steps.push(...findSteps.slice(0, findSteps.length - 1));
    }

    // Check if key exists (it should be at root after splay if it exists)
    if (this.root && this.root.key !== key) {
      steps.push({
        tree: this.cloneNode(this.root),
        description: `${key} not found in the tree, nothing to delete`,
        cursor: null,
      });
      return steps;
    }

    steps.push({
      tree: this.cloneNode(this.root),
      description: `Found ${key} at the root, now deleting`,
      cursor: this.root,
    });

    // Delete the node
    if (!this.root.left) {
      // No left child, replace root with right child
      this.root = this.root.right;
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Deleted ${key}, replaced with right subtree`,
        cursor: null,
      });
    } else if (!this.root.right) {
      // No right child, replace root with left child
      this.root = this.root.left;
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Deleted ${key}, replaced with left subtree`,
        cursor: null,
      });
    } else {
      // Both children exist, join the trees
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Node ${key} has both children, finding predecessor`,
        cursor: this.root.left,
      });

      // Find the largest node in the left subtree
      let leftTree = this.root.left;
      let rightTree = this.root.right;
      
      // We'll splay the largest key in the left subtree to its root
      let current = leftTree;
      while (current.right) {
        current = current.right;
      }
      
      const maxKey = current.key;
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Found predecessor ${maxKey} for deletion`,
        cursor: current,
      });

      // Create a temporary tree for splaying the left subtree
      const tempTree = new SplayTree();
      tempTree.root = leftTree;
      const splayTemp = tempTree.splay(maxKey);
      
      // Adapt splay steps to show our whole tree
      const adaptedSplaySteps = splayTemp.map(step => {
        // Create a new root that combines splayed left subtree with right subtree
        if (step.tree) {
          const newRoot = { 
            key: this.root.key, 
            left: step.tree, 
            right: rightTree 
          };
          return {
            tree: newRoot,
            description: step.description,
            cursor: step.cursor
          };
        }
        return step;
      });
      
      steps.push(...adaptedSplaySteps);
      
      // Update our tree - the largest element is now the root of the left subtree
      leftTree = tempTree.root;
      
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Predecessor ${maxKey} splayed to root of left subtree`,
        cursor: leftTree,
      });
      
      // Now leftTree has no right child, so we can attach rightTree
      leftTree.right = rightTree;
      this.root = leftTree;
      
      steps.push({
        tree: this.cloneNode(this.root),
        description: `Joined subtrees, ${key} removed, new root is ${this.root.key}`,
        cursor: this.root,
      });
    }

    return steps;
  }

  /**
   * Splay a key to the root of the tree
   * @param {number} key The key to splay
   * @returns {Array<import('./types').AnimationStep>} Animation steps for the splay operation
   */
  splay(key) {
    const steps = [];

    if (!this.root) {
      return steps;
    }

    // Create a temporary tree structure to use during splaying
    const header = { left: null, right: null, key: -1 };
    let leftTreeMax = header;
    let rightTreeMin = header;

    let current = this.root;
    let found = false;

    steps.push({
      tree: this.cloneNode(this.root),
      description: `Starting splay operation for ${key}`,
      cursor: current,
    });

    // Keep going while we haven't found the key or hit a leaf
    while (current && !found) {
      if (key < current.key) {
        // No left child, we've reached a leaf
        if (!current.left) {
          found = true;
          steps.push({
            tree: this.cloneNode(this.root),
            description: `Reached leaf node ${current.key}, can't go left`,
            cursor: current,
          });
          break;
        }

        // Zig step (rotate right)
        if (current.left && key < current.left.key) {
          const temp = current.left;
          current.left = temp.right;
          temp.right = current;
          current = temp;

          // If we still can't go left, we've reached a leaf
          if (!current.left) {
            found = true;
            steps.push({
              tree: this.cloneNode(this.root),
              description: `Performed right rotation at ${current.key}`,
              cursor: current,
            });
            break;
          }
        }

        // Link right
        rightTreeMin.left = current;
        rightTreeMin = current;
        current = current.left;
        rightTreeMin.left = null;

        steps.push({
          tree: this.cloneNode(this.root),
          description: `Moving left to ${current.key}`,
          cursor: current,
        });
      } else if (key > current.key) {
        // No right child, we've reached a leaf
        if (!current.right) {
          found = true;
          steps.push({
            tree: this.cloneNode(this.root),
            description: `Reached leaf node ${current.key}, can't go right`,
            cursor: current,
          });
          break;
        }

        // Zag step (rotate left)
        if (current.right && key > current.right.key) {
          const temp = current.right;
          current.right = temp.left;
          temp.left = current;
          current = temp;

          // If we still can't go right, we've reached a leaf
          if (!current.right) {
            found = true;
            steps.push({
              tree: this.cloneNode(this.root),
              description: `Performed left rotation at ${current.key}`,
              cursor: current,
            });
            break;
          }
        }

        // Link left
        leftTreeMax.right = current;
        leftTreeMax = current;
        current = current.right;
        leftTreeMax.right = null;

        steps.push({
          tree: this.cloneNode(this.root),
          description: `Moving right to ${current.key}`,
          cursor: current,
        });
      } else {
        // Found the key
        found = true;
        steps.push({
          tree: this.cloneNode(this.root),
          description: `Found ${key}`,
          cursor: current,
        });
      }
    }

    // Reassemble the tree
    leftTreeMax.right = current.left;
    rightTreeMin.left = current.right;
    current.left = header.right;
    current.right = header.left;

    this.root = current;

    steps.push({
      tree: this.cloneNode(this.root),
      description: `Reassembled tree, ${key} is now at or near the root`,
      cursor: this.root,
    });

    return steps;
  }

  /**
   * Create a random splay tree
   * @param {number} size The number of nodes
   * @returns {SplayTree} A new random splay tree
   */
  static random(size) {
    const tree = new SplayTree();
    const values = new Set();

    // Generate unique random values
    while (values.size < size) {
      values.add(Math.floor(Math.random() * 100) + 1);
    }

    // Insert values into the tree
    for (const value of values) {
      const steps = tree.insert(value);
    }

    return tree;
  }
}
