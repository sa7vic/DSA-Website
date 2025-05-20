/**
 * Layout algorithm for binary trees
 * Calculates positions of nodes for visualization
 */

/**
 * Calculates the layout for a splay tree, positioning nodes for visualization
 * @param {import('./types').SplayTreeNode} root The root node of the splay tree
 * @returns {Array<import('./types').PositionedNode>} An array of positioned nodes with their coordinates and references
 */
export function layoutSplayTree(root) {
  if (!root) return [];

  const nodeMap = new Map();
  const positionedNodes = [];
  const WIDTH_DELTA = 40;
  const HEIGHT_DELTA = 35;
  const STARTING_Y = 30;

  // Calculate the width requirements for each subtree
  function calculateWidths(node) {
    if (!node) return { leftWidth: 0, rightWidth: 0 };

    const left = calculateWidths(node.left);
    const right = calculateWidths(node.right);

    // Store width info on the node for later use
    node.leftWidth = Math.max(
      left.leftWidth + left.rightWidth,
      WIDTH_DELTA / 2,
    );
    node.rightWidth = Math.max(
      right.leftWidth + right.rightWidth,
      WIDTH_DELTA / 2,
    );

    return {
      leftWidth: node.leftWidth,
      rightWidth: node.rightWidth,
    };
  }

  // First pass: create positioned nodes without connections
  function createPositionedNodes(
    node,
    xPosition,
    yPosition,
    side,
  ) {
    if (!node) return null;

    // Adjust x position based on which side we're on
    if (side === -1) {
      xPosition = xPosition - node.rightWidth;
    } else if (side === 1) {
      xPosition = xPosition + node.leftWidth;
    }

    // Create positioned node
    const positionedNode = {
      treeNode: node,
      value: node.key,
      x: xPosition,
      y: yPosition,
      left: null,
      right: null,
    };

    // Store in map and results array
    nodeMap.set(node, positionedNode);
    positionedNodes.push(positionedNode);

    // Recursively position children
    const leftPositioned = createPositionedNodes(
      node.left,
      xPosition,
      yPosition + HEIGHT_DELTA,
      -1,
    );
    const rightPositioned = createPositionedNodes(
      node.right,
      xPosition,
      yPosition + HEIGHT_DELTA,
      1,
    );

    // Connect children
    positionedNode.left = leftPositioned;
    positionedNode.right = rightPositioned;

    return positionedNode;
  }

  // Calculate the width requirements
  const { leftWidth, rightWidth } = calculateWidths(root);

  // Determine the starting x position
  let startingX = 150; // Default center point

  if (leftWidth > startingX) {
    startingX = leftWidth;
  } else if (rightWidth > startingX) {
    startingX = Math.max(leftWidth, 2 * startingX - rightWidth);
  }

  // Create and connect all nodes
  createPositionedNodes(root, startingX, STARTING_Y, 0);

  return positionedNodes;
}
