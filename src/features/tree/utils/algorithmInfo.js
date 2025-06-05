/**
 * Tree Algorithm Information and Educational Content
 * Comprehensive information about tree algorithms, complexity analysis, and examples
 */

/**
 * Tree Algorithm Information
 */
export const treeAlgorithmInfo = {
  insert: {
    name: "Insert",
    timeComplexity: "O(log n) average, O(n) worst case",
    spaceComplexity: "O(log n) for recursion stack",
    description: "Inserts a new value into the binary search tree while maintaining the BST property. Values less than the current node go to the left subtree, and values greater go to the right subtree.",
    bestCase: "O(log n) - balanced tree",
    averageCase: "O(log n) - randomly built tree",
    worstCase: "O(n) - skewed tree (essentially a linked list)",
    pseudocode: `function insert(root, value):
    if root is null:
        return new Node(value)
    
    if value < root.value:
        root.left = insert(root.left, value)
    else if value > root.value:
        root.right = insert(root.right, value)
    
    return root`,
    realWorldUse: [
      "Database indexing systems",
      "Expression parsing in compilers",
      "File system organization",
      "Auto-complete suggestions"
    ]
  },

  search: {
    name: "Search",
    timeComplexity: "O(log n) average, O(n) worst case",
    spaceComplexity: "O(log n) recursive, O(1) iterative",
    description: "Searches for a specific value in the binary search tree by comparing the target with each node and traversing left or right accordingly.",
    bestCase: "O(1) - target is at root",
    averageCase: "O(log n) - balanced tree",
    worstCase: "O(n) - skewed tree",
    pseudocode: `function search(root, value):
    if root is null or root.value equals value:
        return root
    
    if value < root.value:
        return search(root.left, value)
    else:
        return search(root.right, value)`,
    realWorldUse: [
      "Dictionary lookups",
      "Symbol table in compilers",
      "IP routing tables",
      "Database query optimization"
    ]
  },

  delete: {
    name: "Delete",
    timeComplexity: "O(log n) average, O(n) worst case",
    spaceComplexity: "O(log n) for recursion stack",
    description: "Removes a node from the binary search tree while maintaining the BST property. Handles three cases: leaf node, node with one child, and node with two children.",
    bestCase: "O(log n) - balanced tree",
    averageCase: "O(log n) - randomly built tree",
    worstCase: "O(n) - skewed tree",
    pseudocode: `function delete(root, value):
    if root is null:
        return root
    
    if value < root.value:
        root.left = delete(root.left, value)
    else if value > root.value:
        root.right = delete(root.right, value)
    else:
        // Node to delete found
        if root.left is null:
            return root.right
        else if root.right is null:
            return root.left
        
        // Node with two children
        root.value = findMin(root.right)
        root.right = delete(root.right, root.value)
    
    return root`,
    realWorldUse: [
      "Cache management systems",
      "Undo operations in editors",
      "Memory management",
      "Dynamic resource allocation"
    ]
  },

  inOrder: {
    name: "In-Order Traversal",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) where h is tree height",
    description: "Visits nodes in left-root-right order. For BST, this produces values in sorted ascending order.",
    pattern: "Left → Root → Right",
    pseudocode: `function inOrder(root):
    if root is not null:
        inOrder(root.left)
        visit(root)
        inOrder(root.right)`,
    realWorldUse: [
      "Retrieving sorted data from BST",
      "Expression evaluation",
      "Syntax tree processing",
      "Data validation in sorted order"
    ]
  },

  preOrder: {
    name: "Pre-Order Traversal",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) where h is tree height",
    description: "Visits nodes in root-left-right order. Useful for creating a copy of the tree or prefix expression evaluation.",
    pattern: "Root → Left → Right",
    pseudocode: `function preOrder(root):
    if root is not null:
        visit(root)
        preOrder(root.left)
        preOrder(root.right)`,
    realWorldUse: [
      "Tree cloning/copying",
      "Prefix expression evaluation",
      "Directory structure traversal",
      "Serialization of tree structures"
    ]
  },

  postOrder: {
    name: "Post-Order Traversal",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) where h is tree height",
    description: "Visits nodes in left-right-root order. Useful for deleting the tree or postfix expression evaluation.",
    pattern: "Left → Right → Root",
    pseudocode: `function postOrder(root):
    if root is not null:
        postOrder(root.left)
        postOrder(root.right)
        visit(root)`,
    realWorldUse: [
      "Tree deletion",
      "Postfix expression evaluation",
      "Calculating directory sizes",
      "Dependency resolution"
    ]
  },

  levelOrder: {
    name: "Level-Order Traversal",
    timeComplexity: "O(n)",
    spaceComplexity: "O(w) where w is maximum width",
    description: "Visits nodes level by level from top to bottom, left to right. Uses a queue data structure.",
    pattern: "Level by Level (BFS)",
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
            queue.enqueue(node.right)`,
    realWorldUse: [
      "Breadth-first search",
      "Level-wise tree printing",
      "Shortest path algorithms",
      "Web crawling strategies"
    ]
  }
};

/**
 * Tree Concepts and Educational Content
 */
export const treeConcepts = {
  binarySearchTree: {
    definition: "A binary search tree (BST) is a hierarchical data structure where each node has at most two children, and the left child's value is less than the parent's value, while the right child's value is greater.",
    properties: [
      "Each node has at most two children (left and right)",
      "Left subtree contains only nodes with values less than the parent",
      "Right subtree contains only nodes with values greater than the parent",
      "Both left and right subtrees are also binary search trees",
      "No duplicate values are allowed (in standard BST)"
    ],
    advantages: [
      "Efficient searching: O(log n) average case",
      "Maintains sorted order automatically",
      "Dynamic size - can grow and shrink",
      "In-order traversal gives sorted sequence",
      "Supports range queries efficiently"
    ],
    disadvantages: [
      "Can become unbalanced (worst case O(n))",
      "No constant-time operations",
      "Memory overhead for storing pointers",
      "Not suitable for frequent insertions/deletions",
      "Performance depends on tree balance"
    ]
  },

  treeTerminology: {
    root: "The topmost node of the tree with no parent",
    leaf: "A node with no children (terminal node)",
    height: "The length of the longest path from root to any leaf",
    depth: "The length of the path from root to a specific node",
    level: "All nodes at the same depth from the root",
    subtree: "A tree consisting of a node and all its descendants",
    parent: "A node that has one or more children",
    child: "A node that has a parent",
    sibling: "Nodes that share the same parent",
    ancestor: "Any node on the path from root to a given node",
    descendant: "Any node in the subtree rooted at a given node"
  },

  balancedTrees: {
    definition: "A balanced binary tree is one where the height difference between left and right subtrees of any node is at most 1",
    importance: [
      "Guarantees O(log n) operations",
      "Prevents worst-case linear performance",
      "Maintains tree efficiency",
      "Essential for database indexing"
    ],
    types: [
      "AVL Trees - strictly balanced",
      "Red-Black Trees - approximately balanced",
      "Splay Trees - self-adjusting",
      "B-Trees - for disk-based storage"
    ]
  }
};

/**
 * Code snippets for different traversal algorithms
 */
export const traversalCodeSnippets = {
  inOrder: `function inOrderTraversal(node, result) {
    // Base case: if node is null, return
    if (node === null) {
        return;
    }
    
    // Traverse left subtree
    inOrderTraversal(node.left, result);
    
    // Visit current node
    result.push(node.value);
    
    // Traverse right subtree
    inOrderTraversal(node.right, result);
}`,

  preOrder: `function preOrderTraversal(node, result) {
    // Base case: if node is null, return
    if (node === null) {
        return;
    }
    
    // Visit current node
    result.push(node.value);
    
    // Traverse left subtree
    preOrderTraversal(node.left, result);
    
    // Traverse right subtree
    preOrderTraversal(node.right, result);
}`,

  postOrder: `function postOrderTraversal(node, result) {
    // Base case: if node is null, return
    if (node === null) {
        return;
    }
    
    // Traverse left subtree
    postOrderTraversal(node.left, result);
    
    // Traverse right subtree
    postOrderTraversal(node.right, result);
    
    // Visit current node
    result.push(node.value);
}`,

  levelOrder: `function levelOrderTraversal(root) {
    if (root === null) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node.value);
        
        if (node.left !== null) {
            queue.push(node.left);
        }
        
        if (node.right !== null) {
            queue.push(node.right);
        }
    }
    
    return result;
}`
};

/**
 * Tree visualization concepts
 */
export const visualizationConcepts = {
  nodeRepresentation: {
    circle: "Nodes are typically represented as circles containing the value",
    color: "Different colors can represent different states (normal, highlighted, visited)",
    size: "Node size can indicate importance or current focus",
    animation: "Smooth transitions help users follow the algorithm execution"
  },

  edgeRepresentation: {
    lines: "Edges are drawn as lines connecting parent and child nodes",
    direction: "Left edges go to smaller values, right edges to larger values",
    styling: "Different line styles can indicate traversal paths",
    animation: "Edge highlighting shows the current path being explored"
  },

  layoutStrategies: {
    hierarchical: "Nodes arranged in levels with root at top",
    spacing: "Adequate spacing prevents overlap and improves readability",
    symmetry: "Balanced layout makes tree structure more apparent",
    scalability: "Layout should adapt to different tree sizes"
  }
};

/**
 * Interactive features for tree visualization
 */
export const interactiveFeatures = {
  operations: [
    "Click to select nodes",
    "Drag to rearrange (where applicable)",
    "Keyboard shortcuts for common operations",
    "Step-by-step animation controls",
    "Speed adjustment for animations"
  ],

  feedback: [
    "Visual highlights for current operation",
    "Step-by-step explanations",
    "Error messages for invalid operations",
    "Success indicators for completed operations",
    "Progress indicators for long operations"
  ],

  accessibility: [
    "Keyboard navigation support",
    "Screen reader compatibility",
    "High contrast mode support",
    "Adjustable font sizes",
    "Alternative text for visual elements"
  ]
};
