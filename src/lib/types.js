// Types for Splay Tree visualization
export const NodeTypes = {
  SplayTreeNode: 'SplayTreeNode'
};

/**
 * @typedef {Object} SplayTreeNode
 * @property {number} key - The key/value stored in the node
 * @property {SplayTreeNode|null} left - The left child node
 * @property {SplayTreeNode|null} right - The right child node
 */

/**
 * @typedef {Object} AnimationStep
 * @property {SplayTreeNode|null} tree - The current state of the tree
 * @property {SplayTreeNode|null} cursor - The node that's currently focused
 * @property {string} description - Description of what's happening in this step
 */

/**
 * @typedef {Object} PositionedNode
 * @property {SplayTreeNode} treeNode - The original tree node
 * @property {number} value - The key value of the node
 * @property {number} x - X coordinate for rendering
 * @property {number} y - Y coordinate for rendering 
 * @property {PositionedNode|null} left - Left child positioned node
 * @property {PositionedNode|null} right - Right child positioned node
 */
