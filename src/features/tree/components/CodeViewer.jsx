import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCode, FaPlay, FaEye } from 'react-icons/fa';

const CodeViewer = ({ 
  operation = 'insert', 
  currentLine = 0, 
  isAnimating = false,
  codeSnippets = {},
  className = '',
  showLineNumbers = true,
  showTitle = true
}) => {
  const [activeTab, setActiveTab] = useState('pseudocode');
  const codeRef = useRef(null);

  // Default code snippets for tree operations
  const defaultCodeSnippets = {
    insert: {
      pseudocode: `function insert(root, value):
  if root is null:
    return new Node(value)
    
  if value < root.value:
    root.left = insert(root.left, value)
  else if value > root.value:
    root.right = insert(root.right, value)
  
  return root`,
      javascript: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function insert(root, value) {
  if (!root) {
    return new TreeNode(value);
  }
  
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  }
  
  return root;
}`,
      cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* insert(TreeNode* root, int val) {
    if (!root) {
        return new TreeNode(val);
    }
    
    if (val < root->val) {
        root->left = insert(root->left, val);
    } else if (val > root->val) {
        root->right = insert(root->right, val);
    }
    
    return root;
}`
    },
    search: {
      pseudocode: `function search(root, value):
  if root is null:
    return false
    
  if value equals root.value:
    return true
  else if value < root.value:
    return search(root.left, value)
  else:
    return search(root.right, value)`,
      javascript: `function search(root, value) {
  if (!root) return false;
  
  if (value === root.value) {
    return true;
  } else if (value < root.value) {
    return search(root.left, value);
  } else {
    return search(root.right, value);
  }
}`,
      cpp: `bool search(TreeNode* root, int val) {
    if (!root) return false;
    
    if (val == root->val) {
        return true;
    } else if (val < root->val) {
        return search(root->left, val);
    } else {
        return search(root->right, val);
    }
}`
    },
    delete: {
      pseudocode: `function delete(root, value):
  if root is null:
    return null
    
  if value < root.value:
    root.left = delete(root.left, value)
  else if value > root.value:
    root.right = delete(root.right, value)
  else:
    if root has no children:
      return null
    if root has one child:
      return that child
    else:
      successor = findMin(root.right)
      root.value = successor
      root.right = delete(root.right, successor)
  
  return root`,
      javascript: `function deleteNode(root, value) {
  if (!root) return null;
  
  if (value < root.value) {
    root.left = deleteNode(root.left, value);
  } else if (value > root.value) {
    root.right = deleteNode(root.right, value);
  } else {
    if (!root.left && !root.right) {
      return null;
    }
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    
    const successor = findMin(root.right);
    root.value = successor.value;
    root.right = deleteNode(root.right, successor.value);
  }
  
  return root;
}`,
      cpp: `TreeNode* deleteNode(TreeNode* root, int val) {
    if (!root) return nullptr;
    
    if (val < root->val) {
        root->left = deleteNode(root->left, val);
    } else if (val > root->val) {
        root->right = deleteNode(root->right, val);
    } else {
        if (!root->left && !root->right) {
            delete root;
            return nullptr;
        }
        if (!root->left) {
            TreeNode* temp = root->right;
            delete root;
            return temp;
        }
        if (!root->right) {
            TreeNode* temp = root->left;
            delete root;
            return temp;
        }
        
        TreeNode* successor = findMin(root->right);
        root->val = successor->val;
        root->right = deleteNode(root->right, successor->val);
    }
    
    return root;
}`
    }
  };

  const codeData = codeSnippets[operation] || defaultCodeSnippets[operation] || defaultCodeSnippets.insert;

  const tabs = [
    { id: 'pseudocode', label: 'Pseudocode', icon: FaEye },
    { id: 'javascript', label: 'JavaScript', icon: FaCode },
    { id: 'cpp', label: 'C++', icon: FaPlay }
  ];

  // Scroll to highlighted line
  useEffect(() => {
    if (currentLine && codeRef.current && isAnimating) {
      const highlightedLine = codeRef.current.querySelector(`[data-line-number="${currentLine}"]`);
      if (highlightedLine) {
        highlightedLine.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentLine, isAnimating]);

  const getLanguage = () => {
    switch (activeTab) {
      case 'javascript': return 'javascript';
      case 'cpp': return 'cpp';
      default: return 'text';
    }
  };

  const lineProps = (lineNumber) => {
    const isHighlighted = currentLine === lineNumber && isAnimating;
    return {
      style: {
        display: 'block',
        backgroundColor: isHighlighted ? 'rgba(88, 166, 255, 0.2)' : 'transparent',
        borderLeft: isHighlighted ? '3px solid #58a6ff' : '3px solid transparent',
        paddingLeft: '0.75rem',
        margin: '0',
        transition: 'all 0.3s ease'
      },
      'data-line-number': lineNumber
    };
  };

  return (
    <motion.div 
      className={`code-viewer-container ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {showTitle && (
        <div className="code-viewer-header">
          <h3 className="code-viewer-title">
            <FaCode className="title-icon" />
            {operation.charAt(0).toUpperCase() + operation.slice(1)} Algorithm
          </h3>
          
          <div className="code-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="tab-icon" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="code-content" ref={codeRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="code-display"
          >
            <SyntaxHighlighter
              language={getLanguage()}
              style={atomDark}
              showLineNumbers={showLineNumbers}
              wrapLines={true}
              lineProps={lineProps}
              customStyle={{
                margin: 0,
                borderRadius: '0 0 8px 8px',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                minHeight: '200px',
                maxHeight: '400px',
                overflow: 'auto'
              }}
              lineNumberStyle={{
                minWidth: '2.5em',
                paddingRight: '1em',
                color: '#6e7681',
                textAlign: 'right',
                userSelect: 'none'
              }}
            >
              {codeData[activeTab] || codeData.pseudocode}
            </SyntaxHighlighter>
          </motion.div>
        </AnimatePresence>
      </div>

      {isAnimating && currentLine && (
        <motion.div 
          className="animation-indicator"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="indicator-dot"></div>
          <span>Line {currentLine}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CodeViewer;
