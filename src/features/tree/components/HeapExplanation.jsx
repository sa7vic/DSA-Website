import { useState } from 'react';

const HeapExplanation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="explanation-section">
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} Understanding Heaps (Min/Max)
      </h3>
      {isExpanded && (
        <div className="explanation-content">
          <h4>What is a Heap?</h4>
          <p>
            A Heap is a complete binary tree backed by an array where each node satisfies the heap property:
            <em> parent is ≤ children (min-heap) or ≥ children (max-heap)</em>.
          </p>

          <h4>Key Properties:</h4>
          <ul>
            <li><strong>Complete tree:</strong> All levels filled except possibly the last, which is filled left to right.</li>
            <li><strong>Heap property:</strong> For every node i, parent(i) ≤ children for min-heap (or ≥ for max-heap).</li>
            <li><strong>Array mapping:</strong> left=2i+1, right=2i+2, parent=⌊(i-1)/2⌋.</li>
          </ul>

          <h4>Core Operations:</h4>
          <ul>
            <li><strong>Insert:</strong> O(log n) — push at end, sift up (percolate up).</li>
            <li><strong>Extract root:</strong> O(log n) — swap root with last, pop, sift down (heapify down).</li>
            <li><strong>Peek:</strong> O(1) — return root.</li>
            <li><strong>Build heap:</strong> O(n) by heapifying from ⌊n/2⌋ down to 0.</li>
          </ul>

          <h4>Complexities:</h4>
          <ul>
            <li>Insert/Extract: O(log n)</li>
            <li>Peek: O(1)</li>
            <li>Space: O(n)</li>
          </ul>

          <h4>Use Cases:</h4>
          <ul>
            <li>Priority queues, Dijkstra/Prim algorithms</li>
            <li>Scheduling, event simulation</li>
            <li>Top-k problems, streaming medians (with two heaps)</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeapExplanation;
