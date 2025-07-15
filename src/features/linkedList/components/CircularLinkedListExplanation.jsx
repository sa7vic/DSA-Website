import { useState } from 'react';
import { Link } from 'react-router-dom';

const CircularLinkedListExplanation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="explanation-section">
      
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} Understanding Circular Linked Lists
      </h3>
      
      {isExpanded && (
        <div className="explanation-content">
          <h4>What is a Circular Linked List?</h4>
          <p>
            A circular linked list is a variation of a linked list where the last node points back to the first node 
            instead of pointing to NULL. This creates a circular structure where you can traverse the entire list 
            starting from any node and eventually return to the starting point.
          </p>
          
          <h4>Key Characteristics:</h4>
          <ul>
            <li><strong>Circular Structure:</strong> Last node's next pointer points to the first node</li>
            <li><strong>No NULL Pointers:</strong> Every node points to another valid node</li>
            <li><strong>Infinite Traversal:</strong> Can traverse indefinitely in a loop</li>
            <li><strong>Memory Efficient:</strong> Utilizes every allocated node without NULL termination</li>
          </ul>
          
          <h4>Common Operations:</h4>
          <ul>
            <li><strong>Insertion:</strong> O(1) at beginning/end with tail pointer, O(n) at specific positions</li>
            <li><strong>Deletion:</strong> O(1) at beginning/end with tail pointer, O(n) at specific positions</li>
            <li><strong>Search:</strong> O(n) time complexity, must check to avoid infinite loops</li>
            <li><strong>Traversal:</strong> O(n) time complexity with careful loop termination</li>
          </ul>
          
          <h4>Advantages:</h4>
          <ul>
            <li>Efficient insertion and deletion at both ends with tail pointer</li>
            <li>No memory wastage - no NULL pointers</li>
            <li>Can start traversal from any node</li>
            <li>Useful for applications requiring cyclic iteration</li>
            <li>Can represent circular structures naturally</li>
          </ul>

          <h4>Disadvantages:</h4>
          <ul>
            <li>Risk of infinite loops if not handled carefully</li>
            <li>More complex implementation than linear linked lists</li>
            <li>Difficult to find the end of the list</li>
            <li>Requires special handling for empty list cases</li>
            <li>Memory management can be tricky</li>
          </ul>
          
          <h4>Real-world Applications:</h4>
          <ul>
            <li>Round-robin scheduling in operating systems</li>
            <li>Multiplayer games (turn-based systems)</li>
            <li>Music playlists with repeat functionality</li>
            <li>Josephus problem (elimination games)</li>
            <li>Computer graphics (polygons and closed curves)</li>
            <li>Circular buffers in embedded systems</li>
            <li>Board games with circular movement</li>
          </ul>

          <h4>Memory Structure:</h4>
          <p>
            Each node in a circular linked list contains:
          </p>
          <ul>
            <li><strong>Data field:</strong> Stores the actual value</li>
            <li><strong>Next pointer:</strong> Points to the memory address of the next node</li>
            <li><strong>Circular reference:</strong> The last node's next pointer points back to the head</li>
            <li><strong>No NULL termination:</strong> All nodes have valid next pointers</li>
          </ul>

          <h4>Types of Circular Linked Lists:</h4>
          <ul>
            <li><strong>Singly Circular:</strong> Each node has one next pointer, last points to first</li>
            <li><strong>Doubly Circular:</strong> Each node has next and prev pointers, forming a complete cycle</li>
            <li><strong>Header Node:</strong> Special implementation with a dummy header node</li>
          </ul>

          <h4>When to Use Circular Linked Lists:</h4>
          <ul>
            <li>When you need to repeatedly cycle through a collection</li>
            <li>For implementing round-robin algorithms</li>
            <li>When representing naturally circular data</li>
            <li>For undo/redo functionality with limited history</li>
            <li>In gaming applications for turn management</li>
            <li>For implementing circular buffers</li>
          </ul>

          <h4>Important Considerations:</h4>
          <ul>
            <li>Always check for loop termination to prevent infinite loops</li>
            <li>Maintain proper head/tail pointers for efficient operations</li>
            <li>Handle empty list cases carefully</li>
            <li>Consider using a counter to track list size</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CircularLinkedListExplanation;
