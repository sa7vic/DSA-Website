import { useState } from 'react';

const AVLExplanation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="explanation-section">
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} Understanding AVL Trees
      </h3>
      {isExpanded && (
        <div className="explanation-content">
          <h4>What is an AVL Tree?</h4>
          <p>
            An AVL Tree is a self-balancing Binary Search Tree where the heights of the left and right
            subtrees of any node differ by at most 1. After insertions and deletions, rotations are applied
            to restore balance.
          </p>

          <h4>Balance Factor and Height:</h4>
          <ul>
            <li><strong>Height:</strong> Length of the longest path to a leaf. Empty tree has height -1.</li>
            <li><strong>Balance Factor (BF):</strong> height(left) − height(right). Valid AVL requires BF in (-1, 0, 1).</li>
          </ul>

          <h4>Rotations:</h4>
          <ul>
            <li><strong>Right Rotation (LL case):</strong> Performed when a node's left subtree is heavy.</li>
            <li><strong>Left Rotation (RR case):</strong> Performed when a node's right subtree is heavy.</li>
            <li><strong>Left-Right (LR):</strong> Left rotate on left child, then right rotate on node.</li>
            <li><strong>Right-Left (RL):</strong> Right rotate on right child, then left rotate on node.</li>
          </ul>

          <h4>Complexities:</h4>
          <ul>
            <li>Insert/Search/Delete: O(log n) guaranteed due to balancing</li>
            <li>Space: O(n)</li>
          </ul>

          <h4>When to use AVL:</h4>
          <ul>
            <li>When read and write operations are both frequent and you need strict balancing.</li>
            <li>When worst-case guarantees are important.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AVLExplanation;
