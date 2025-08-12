import { useState } from 'react';

const AVLDiySection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const [copyText, setCopyText] = useState("Copy Code to Clipboard");
  
  const avlCode = `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_DEPTH 4  // Maximum tree depth for visualization

// AVL Tree Node structure
typedef struct AVLNode {
    int value;
    struct AVLNode* left;
    struct AVLNode* right;
    int height;
} AVLNode;

// AVL Tree structure
typedef struct {
    AVLNode* root;
    int nodeCount;
    int maxDepth;
} AVLTree;

// Get height of a node
int getHeight(AVLNode* node) {
    return node ? node->height : 0;
}

// Update height of a node
void updateHeight(AVLNode* node) {
    if (node) {
        int leftHeight = getHeight(node->left);
        int rightHeight = getHeight(node->right);
        node->height = 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
    }
}

// Get balance factor of a node
int getBalance(AVLNode* node) {
    return node ? getHeight(node->left) - getHeight(node->right) : 0;
}

// Create a new AVL node
AVLNode* createAVLNode(int value) {
    AVLNode* node = (AVLNode*)malloc(sizeof(AVLNode));
    if (node == NULL) {
        printf("Memory allocation failed\\n");
        return NULL;
    }
    node->value = value;
    node->left = NULL;
    node->right = NULL;
    node->height = 1;
    return node;
}

// Right rotation
AVLNode* rotateRight(AVLNode* y) {
    printf("Performing right rotation on %d\\n", y->value);
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;

    // Perform rotation
    x->right = y;
    y->left = T2;

    // Update heights
    updateHeight(y);
    updateHeight(x);

    printf("Right rotation complete. New root: %d\\n", x->value);
    return x;
}

// Left rotation
AVLNode* rotateLeft(AVLNode* x) {
    printf("Performing left rotation on %d\\n", x->value);
    AVLNode* y = x->right;
    AVLNode* T2 = y->left;

    // Perform rotation
    y->left = x;
    x->right = T2;

    // Update heights
    updateHeight(x);
    updateHeight(y);

    printf("Left rotation complete. New root: %d\\n", y->value);
    return y;
}

// Insert a value into AVL tree
AVLNode* insertAVL(AVLNode* node, int value, AVLTree* tree) {
    // Step 1: Perform normal BST insertion
    if (node == NULL) {
        tree->nodeCount++;
        printf("Inserted %d successfully\\n", value);
        return createAVLNode(value);
    }

    if (value < node->value) {
        printf("Going left from %d to insert %d\\n", node->value, value);
        node->left = insertAVL(node->left, value, tree);
    } else if (value > node->value) {
        printf("Going right from %d to insert %d\\n", node->value, value);
        node->right = insertAVL(node->right, value, tree);
    } else {
        printf("Value %d already exists in the tree\\n", value);
        return node; // Duplicate values not allowed
    }

    // Step 2: Update height of current node
    updateHeight(node);

    // Step 3: Get the balance factor
    int balance = getBalance(node);
    printf("Node %d: height=%d, balance=%d\\n", node->value, node->height, balance);

    // Step 4: If unbalanced, perform rotations
    // Left Left Case
    if (balance > 1 && value < node->left->value) {
        printf("LL imbalance detected at %d\\n", node->value);
        return rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && value > node->right->value) {
        printf("RR imbalance detected at %d\\n", node->value);
        return rotateLeft(node);
    }

    // Left Right Case
    if (balance > 1 && value > node->left->value) {
        printf("LR imbalance detected at %d\\n", node->value);
        node->left = rotateLeft(node->left);
        return rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && value < node->right->value) {
        printf("RL imbalance detected at %d\\n", node->value);
        node->right = rotateRight(node->right);
        return rotateLeft(node);
    }

    // Return unchanged node pointer
    return node;
}

// Search for a value in AVL tree
bool searchAVL(AVLNode* root, int value) {
    if (root == NULL) {
        printf("Value %d not found\\n", value);
        return false;
    }
    
    printf("Checking node with value %d (height=%d, balance=%d)\\n", 
           root->value, root->height, getBalance(root));
    
    if (value == root->value) {
        printf("Found %d!\\n", value);
        return true;
    } else if (value < root->value) {
        printf("Going left from %d to search for %d\\n", root->value, value);
        return searchAVL(root->left, value);
    } else {
        printf("Going right from %d to search for %d\\n", root->value, value);
        return searchAVL(root->right, value);
    }
}

// Inorder traversal (shows sorted order)
void inorderAVL(AVLNode* root) {
    if (root != NULL) {
        inorderAVL(root->left);
        printf("%d(h:%d,b:%d) ", root->value, root->height, getBalance(root));
        inorderAVL(root->right);
    }
}

// Free all nodes in the AVL tree
void freeAVL(AVLNode* root) {
    if (root != NULL) {
        freeAVL(root->left);
        freeAVL(root->right);
        free(root);
    }
}

// Initialize AVL Tree
AVLTree* createAVLTree() {
    AVLTree* tree = (AVLTree*)malloc(sizeof(AVLTree));
    if (tree == NULL) {
        printf("Memory allocation failed\\n");
        return NULL;
    }
    tree->root = NULL;
    tree->nodeCount = 0;
    tree->maxDepth = MAX_DEPTH;
    return tree;
}

// Check if tree is balanced (for verification)
bool isBalanced(AVLNode* root) {
    if (root == NULL) return true;
    
    int balance = getBalance(root);
    return (abs(balance) <= 1) && isBalanced(root->left) && isBalanced(root->right);
}

// Example usage
int main() {
    AVLTree* myAVL = createAVLTree();
    if (myAVL == NULL) {
        return 1;
    }
    
    printf("=== AVL Tree Demo ===\\n");
    
    // Insert values that would cause rotations
    printf("\\nInserting values: 10, 20, 30 (should trigger LL rotation)\\n");
    myAVL->root = insertAVL(myAVL->root, 10, myAVL);
    myAVL->root = insertAVL(myAVL->root, 20, myAVL);
    myAVL->root = insertAVL(myAVL->root, 30, myAVL);
    
    printf("\\nAfter insertions - Tree is balanced: %s\\n", 
           isBalanced(myAVL->root) ? "Yes" : "No");
    
    printf("\\nInorder traversal (with heights and balances): ");
    inorderAVL(myAVL->root);
    printf("\\n");
    
    // Insert more values
    printf("\\nInserting more values: 40, 50, 25\\n");
    myAVL->root = insertAVL(myAVL->root, 40, myAVL);
    myAVL->root = insertAVL(myAVL->root, 50, myAVL);
    myAVL->root = insertAVL(myAVL->root, 25, myAVL);
    
    printf("\\nFinal inorder traversal: ");
    inorderAVL(myAVL->root);
    printf("\\n");
    
    printf("\\nTotal nodes: %d\\n", myAVL->nodeCount);
    printf("Tree is balanced: %s\\n", isBalanced(myAVL->root) ? "Yes" : "No");
    
    // Search examples
    printf("\\nSearching for 25:\\n");
    searchAVL(myAVL->root, 25);
    
    printf("\\nSearching for 100:\\n");
    searchAVL(myAVL->root, 100);
    
    // Clean up
    freeAVL(myAVL->root);
    free(myAVL);
    
    return 0;
}

/*
Expected Output (partial):
=== AVL Tree Demo ===

Inserting values: 10, 20, 30 (should trigger LL rotation)
Inserted 10 successfully
Going right from 10 to insert 20
Inserted 20 successfully
Going right from 10 to insert 30
Going right from 20 to insert 30
Inserted 30 successfully
Node 30: height=1, balance=0
Node 20: height=2, balance=-1
Node 10: height=3, balance=-2
RR imbalance detected at 10
Performing left rotation on 10
Left rotation complete. New root: 20

After insertions - Tree is balanced: Yes

Inorder traversal (with heights and balances): 10(h:1,b:0) 20(h:2,b:0) 30(h:1,b:0)
*/`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(avlCode);
      const newCount = copyCount + 1;
      setCopyCount(newCount);
      setCopyText(`Copied! (${newCount})`);
      
      setTimeout(() => {
        setCopyText("Copy Code to Clipboard");
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
      setCopyText("Copy failed - try selecting manually");
      setTimeout(() => {
        setCopyText("Copy Code to Clipboard");
      }, 2000);
    }
  };

  return (
    <div className="diy-section">
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} How to Run This AVL Tree Code Yourself
      </h3>
      
      {isExpanded && (
        <div className="diy-content">
          <p>
            Want to implement and experiment with AVL Trees yourself? 
            Here's a complete, runnable C implementation with rotations and self-balancing!
          </p>
          
          <h4>🚀 Quick Start:</h4>
          <ol>
            <li>Copy the code below</li>
            <li>Save it as <code>avl.c</code></li>
            <li>Compile: <code>gcc -o avl avl.c</code></li>
            <li>Run: <code>./avl</code></li>
          </ol>
          
          <h4>💡 Try These AVL Experiments:</h4>
          <ul>
            <li>Insert sequences that trigger each rotation type: LL, RR, LR, RL</li>
            <li>Compare AVL vs BST by inserting sorted sequences (1,2,3,4,5...)</li>
            <li>Verify balance factors and heights are correctly maintained</li>
            <li>Test with duplicate values and see rejection behavior</li>
            <li>Insert/delete randomly and verify tree remains balanced</li>
            <li>Measure tree height vs number of nodes for different inputs</li>
          </ul>
          
          <h4>🔧 AVL-Specific Features:</h4>
          <ul>
            <li>Automatic height tracking and balance factor calculation</li>
            <li>Four rotation types (LL, RR, LR, RL) with detailed output</li>
            <li>Balance verification function to confirm AVL property</li>
            <li>Enhanced traversal showing heights and balance factors</li>
            <li>Guaranteed O(log n) operations due to self-balancing</li>
            <li>Step-by-step rotation explanations for learning</li>
          </ul>
          
          <div className="code-container">
            <div className="code-header">
              <span className="language-label">C</span>
              <button 
                onClick={handleCopyCode}
                className="copy-button"
                title="Copy AVL code to clipboard"
              >
                {copyText}
              </button>
            </div>
            <div className="code-content">
              <pre><code>{avlCode}</code></pre>
            </div>
          </div>
          
          <h4>🎯 AVL Learning Extensions:</h4>
          <ul>
            <li><strong>Rotation Visualization:</strong> Add functions to print tree structure before/after rotations</li>
            <li><strong>Performance Comparison:</strong> Compare AVL vs regular BST insertion times</li>
            <li><strong>Deletion Implementation:</strong> Add AVL deletion with rebalancing</li>
            <li><strong>Tree Statistics:</strong> Track rotation counts and tree rebalancing frequency</li>
            <li><strong>Interactive Mode:</strong> Add menu-driven interface for dynamic operations</li>
            <li><strong>Stress Testing:</strong> Generate large random datasets and verify balance</li>
          </ul>
          
          <div className="tip-box">
            <h4>💡 AVL Pro Tip:</h4>
            <p>
              AVL trees guarantee O(log n) height by maintaining the balance factor (height difference) 
              between left and right subtrees within [-1, 0, 1]. When this is violated, rotations 
              restore balance while preserving the BST property!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AVLDiySection;
