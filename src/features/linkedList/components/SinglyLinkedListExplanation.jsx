import { useState } from 'react';
import { Link } from 'react-router-dom';

const SinglyLinkedListExplanation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="explanation-section">
      
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} Understanding Singly Linked Lists
      </h3>
      
      {isExpanded && (
        <div className="explanation-content">
          <h4>What is a Singly Linked List?</h4>
          <p>
            A singly linked list is a linear data structure where each node contains a data element and a single pointer 
            that points to the next node in the sequence. Unlike arrays, linked lists don't store elements in contiguous memory locations.
          </p>
          
          <h4>Key Characteristics:</h4>
          <ul>
            <li><strong>Unidirectional Navigation:</strong> Can only be traversed in one direction (forward)</li>
            <li><strong>Dynamic Size:</strong> Can grow or shrink during runtime</li>
            <li><strong>Memory Efficient:</strong> Uses less memory compared to doubly linked lists</li>
            <li><strong>Simple Structure:</strong> Each node has only one pointer</li>
          </ul>
          
          <h4>Common Operations:</h4>
          <ul>
            <li><strong>Insertion:</strong> O(1) time complexity at beginning, O(n) for specific positions</li>
            <li><strong>Deletion:</strong> O(1) time complexity at beginning, O(n) for specific positions</li>
            <li><strong>Search:</strong> O(n) time complexity in the worst case</li>
            <li><strong>Traversal:</strong> O(n) time complexity to visit all nodes</li>
          </ul>
          
          <h4>Advantages:</h4>
          <ul>
            <li>Dynamic memory allocation - no need to declare size beforehand</li>
            <li>Efficient insertion and deletion at the beginning</li>
            <li>Memory efficient compared to doubly linked lists</li>
            <li>Simple implementation and understanding</li>
          </ul>

          <h4>Disadvantages:</h4>
          <ul>
            <li>No backward traversal capability</li>
            <li>No random access - must traverse from head to reach specific elements</li>
            <li>Extra memory overhead for storing pointers</li>
            <li>Not cache-friendly due to non-contiguous memory allocation</li>
          </ul>
          
          <h4>Real-world Applications:</h4>
          <ul>
            <li>Implementation of stacks and queues</li>
            <li>Music playlist (next song functionality)</li>
            <li>Undo functionality in applications (chain of previous states)</li>
            <li>Memory management in operating systems</li>
            <li>Implementation of hash tables with chaining</li>
            <li>Browser history (forward navigation)</li>
          </ul>

          <h4>Memory Structure:</h4>
          <p>
            Each node in a singly linked list contains:
          </p>
          <ul>
            <li><strong>Data field:</strong> Stores the actual value</li>
            <li><strong>Next pointer:</strong> Points to the memory address of the next node</li>
            <li><strong>NULL terminator:</strong> The last node's next pointer is NULL</li>
          </ul>

          <h4>When to Use Singly Linked Lists:</h4>
          <ul>
            <li>When you need frequent insertions/deletions at the beginning</li>
            <li>When memory usage is a concern (compared to doubly linked lists)</li>
            <li>When you only need forward traversal</li>
            <li>When implementing other data structures like stacks</li>
            <li>When the size of data is not known in advance</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SinglyLinkedListExplanation;
