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
  
  // Calculate tree depth and node count for dynamic scaling
  const getTreeStats = (node, depth = 0) => {
    if (!node) return { maxDepth: depth, nodeCount: 0 };
    
    const left = getTreeStats(node.left, depth + 1);
    const right = getTreeStats(node.right, depth + 1);
    
    return {
      maxDepth: Math.max(left.maxDepth, right.maxDepth),
      nodeCount: 1 + left.nodeCount + right.nodeCount
    };
  };
  
  const { maxDepth, nodeCount } = getTreeStats(root);
  
  // Dynamic scaling based on tree size - much more generous sizing
  const baseWidth = nodeCount <= 3 ? 180 : nodeCount <= 7 ? 150 : 120;
  const baseHeight = maxDepth <= 3 ? 120 : maxDepth <= 5 ? 100 : 85;
  
  const WIDTH_DELTA = Math.max(100, baseWidth - (nodeCount - 3) * 5);
  const HEIGHT_DELTA = Math.max(80, baseHeight - (maxDepth - 2) * 3);
  const STARTING_Y = 60; // Good starting position

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

  // Determine the starting x position for optimal centering
  const totalWidth = leftWidth + rightWidth;
  const viewBoxWidth = 1200; // Match our SVG viewBox width
  let startingX = viewBoxWidth / 2; // Center of the viewBox
  
  // Adjust positioning based on tree size and balance
  if (totalWidth > viewBoxWidth * 0.8) {
    // Tree is wide, use more space
    startingX = Math.max(leftWidth + 50, viewBoxWidth * 0.15);
  } else if (nodeCount <= 3) {
    // Small tree, keep centered
    startingX = viewBoxWidth / 2;
  } else {
    // Medium tree, slight adjustment for balance
    startingX = viewBoxWidth / 2 + (leftWidth - rightWidth) * 0.1;
  }

  // Create and connect all nodes
  createPositionedNodes(root, startingX, STARTING_Y, 0);

  return positionedNodes;
}
