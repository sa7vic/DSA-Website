import { useState } from 'react';

const DoublyLinkedListExplanation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="explanation-section">
      
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} Understanding Doubly Linked Lists
      </h3>
      
      {isExpanded && (
        <div className="explanation-content">
          <h4>What is a Doubly Linked List?</h4>
          <p>
            A doubly linked list is a type of linked list where each node contains a data element and two pointers: 
            one pointing to the next node and another pointing to the previous node in the sequence. This bidirectional 
            linking enables traversal in both directions.
          </p>
          
          <h4>Key Characteristics:</h4>
          <ul>
            <li><strong>Bidirectional Navigation:</strong> Can be traversed in both forward and backward directions</li>
            <li><strong>Dynamic Size:</strong> Can grow or shrink during runtime</li>
            <li><strong>More Memory Usage:</strong> Requires extra space for the previous pointer</li>
            <li><strong>More Complex Structure:</strong> Each node has two pointers (prev and next)</li>
          </ul>
          
          <h4>Common Operations:</h4>
          <ul>
            <li><strong>Insertion:</strong> O(1) time complexity at beginning or end, O(n) for specific positions</li>
            <li><strong>Deletion:</strong> O(1) time complexity at beginning or end, O(n) for specific positions</li>
            <li><strong>Search:</strong> O(n) time complexity in the worst case</li>
            <li><strong>Reverse Traversal:</strong> O(1) to navigate to previous nodes (unlike singly linked list)</li>
          </ul>
          
          <h4>Advantages:</h4>
          <ul>
            <li>Bidirectional traversal - can navigate forward and backward</li>
            <li>Efficient deletion - no need to keep track of previous nodes</li>
            <li>Efficient insertion before a given node without traversal</li>
            <li>Easy implementation of certain algorithms requiring backward traversal</li>
          </ul>

          <h4>Disadvantages:</h4>
          <ul>
            <li>Extra memory overhead for storing previous pointers</li>
            <li>More complex implementation compared to singly linked lists</li>
            <li>Additional overhead for maintaining the previous pointer when modifying the list</li>
            <li>Not cache-friendly due to non-contiguous memory allocation</li>
          </ul>
          
          <h4>Real-world Applications:</h4>
          <ul>
            <li>Browser's forward and backward navigation (history)</li>
            <li>Music players with next and previous song functionality</li>
            <li>Undo and redo functionality in applications</li>
            <li>MRU/LRU (Most/Least Recently Used) caches</li>
            <li>Text editors for navigation and editing</li>
            <li>Implementation of deques (double-ended queues)</li>
          </ul>

          <h4>Memory Structure:</h4>
          <p>
            Each node in a doubly linked list contains:
          </p>
          <ul>
            <li><strong>Data field:</strong> Stores the actual value</li>
            <li><strong>Next pointer:</strong> Points to the memory address of the next node</li>
            <li><strong>Previous pointer:</strong> Points to the memory address of the previous node</li>
            <li><strong>NULL terminators:</strong> First node's prev and last node's next pointers are NULL</li>
          </ul>

          <h4>When to Use Doubly Linked Lists:</h4>
          <ul>
            <li>When bidirectional traversal is required</li>
            <li>When you need efficient deletions anywhere in the list</li>
            <li>When implementing algorithms that need access to previous elements</li>
            <li>When implementing data structures like deques</li>
            <li>When implementing LRU caches or similar structures</li>
          </ul>

          <h4>Comparison with Singly Linked Lists:</h4>
          <ul>
            <li><strong>Memory Usage:</strong> Doubly linked lists use more memory</li>
            <li><strong>Complexity:</strong> Doubly linked lists have more complex operations</li>
            <li><strong>Traversal:</strong> Doubly linked lists allow bidirectional traversal</li>
            <li><strong>Deletion:</strong> More efficient in doubly linked lists as no separate traversal needed to find previous node</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DoublyLinkedListExplanation;
