import { useState } from 'react';

const DiySection = ({ dataStructure = 'stack' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const [copyText, setCopyText] = useState("Copy Code to Clipboard");
  
  const code = dataStructure === 'stack' 
    ? `#include <iostream>
#include <vector>
#include <stdexcept>

class Stack {
private:
    std::vector<int> elements;
    int maxSize;
    
public:
    // Constructor with optional size limit
    Stack(int size = 10) : maxSize(size) {}
    
    // Push element to top of stack
    void push(int value) {
        if (isFull()) {
            throw std::overflow_error("Stack overflow");
        }
        elements.push_back(value);
        std::cout << "Pushed " << value << " to stack" << std::endl;
    }
    
    // Remove and return top element
    int pop() {
        if (isEmpty()) {
            throw std::underflow_error("Stack underflow");
        }
        int topValue = elements.back();
        elements.pop_back();
        std::cout << "Popped " << topValue << " from stack" << std::endl;
        return topValue;
    }
    
    // View top element without removing
    int peek() {
        if (isEmpty()) {
            throw std::underflow_error("Stack is empty");
        }
        std::cout << "Top element: " << elements.back() << std::endl;
        return elements.back();
    }
    
    // Check if stack is empty
    bool isEmpty() const {
        return elements.empty();
    }
    
    // Check if stack is full
    bool isFull() const {
        return elements.size() >= maxSize;
    }
    
    // Get current stack size
    int size() const {
        return elements.size();
    }
    
    // Display stack contents
    void display() const {
        if (isEmpty()) {
            std::cout << "Stack is empty" << std::endl;
            return;
        }
        
        std::cout << "Stack contents (top to bottom): ";
        for (int i = elements.size() - 1; i >= 0; --i) {
            std::cout << elements[i];
            if (i > 0) std::cout << ", ";
        }
        std::cout << std::endl;
    }
};

int main() {
    Stack stack(5);  // Create a stack with max size 5
    
    try {
        stack.push(10);
        stack.push(20);
        stack.push(30);
        
        stack.display();  // 30, 20, 10
        
        stack.peek();     // 30
        stack.pop();      // removes 30
        stack.peek();     // 20
        
        stack.push(40);
        stack.push(50);
        
        stack.display();  // 50, 40, 20, 10
    } catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }
    
    return 0;
}`
    : `#include <iostream>
#include <vector>
#include <stdexcept>

class Queue {
private:
    std::vector<int> elements;
    int maxSize;
    
public:
    // Constructor with optional size limit
    Queue(int size = 10) : maxSize(size) {}
    
    // Add element to rear of queue
    void enqueue(int value) {
        if (isFull()) {
            throw std::overflow_error("Queue overflow");
        }
        elements.push_back(value);
        std::cout << "Enqueued " << value << " to queue" << std::endl;
    }
    
    // Remove and return front element
    int dequeue() {
        if (isEmpty()) {
            throw std::underflow_error("Queue underflow");
        }
        int frontValue = elements.front();
        elements.erase(elements.begin());
        std::cout << "Dequeued " << frontValue << " from queue" << std::endl;
        return frontValue;
    }
    
    // View front element without removing
    int peek() {
        if (isEmpty()) {
            throw std::underflow_error("Queue is empty");
        }
        std::cout << "Front element: " << elements.front() << std::endl;
        return elements.front();
    }
    
    // Check if queue is empty
    bool isEmpty() const {
        return elements.empty();
    }
    
    // Check if queue is full
    bool isFull() const {
        return elements.size() >= maxSize;
    }
    
    // Get current queue size
    int size() const {
        return elements.size();
    }
    
    // Display queue contents
    void display() const {
        if (isEmpty()) {
            std::cout << "Queue is empty" << std::endl;
            return;
        }
        
        std::cout << "Queue contents (front to rear): ";
        for (size_t i = 0; i < elements.size(); ++i) {
            std::cout << elements[i];
            if (i < elements.size() - 1) std::cout << ", ";
        }
        std::cout << std::endl;
    }
};

int main() {
    Queue queue(5);  // Create a queue with max size 5
    
    try {
        queue.enqueue(10);
        queue.enqueue(20);
        queue.enqueue(30);
        
        queue.display();  // 10, 20, 30
        
        queue.peek();     // 10
        queue.dequeue();  // removes 10
        queue.peek();     // 20
        
        queue.enqueue(40);
        queue.enqueue(50);
        
        queue.display();  // 20, 30, 40, 50
    } catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }
    
    return 0;
}`;

  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopyCount(prev => prev + 1);
    
    // Fun copy messages
    const messages = [
      "Copied!",
      "Copied twice!",
      "Mega copy!",
      "Super copy!",
      "Ultra copy!",
      "MAXIMUM COPY!",
      "LEGENDARY COPY!!",
      "GODLIKE COPY!!!",
      "BEYOND COPY!!!!",
      "∞ COPY ∞"
    ];
    
    setCopyText(messages[Math.min(copyCount, messages.length - 1)]);
    
    // Reset text after 2 seconds
    setTimeout(() => {
      setCopyText("Copy Code to Clipboard");
    }, 2000);
  };
  
  return (
    <div className="diy-section">
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} How to Run This Code Yourself
      </h3>
      
      {isExpanded && (
        <div className="diy-content">
          <h4>Option 1: Online C++ Compiler</h4>
          <ol>
            <li>Copy the code below</li>
            <li>Visit an online C++ compiler like <a href="https://www.onlinegdb.com/online_c++_compiler" target="_blank" rel="noopener noreferrer">OnlineGDB</a> or <a href="https://www.programiz.com/cpp-programming/online-compiler/" target="_blank" rel="noopener noreferrer">Programiz</a></li>
            <li>Paste the code and click "Run"</li>
            <li>Experiment by modifying the operations in the main() function</li>
          </ol>
          
          <h4>Option 2: Local Development</h4>
          <ol>
            <li>Save the code as <code>{dataStructure === 'stack' ? 'stack.cpp' : 'queue.cpp'}</code></li>
            <li>Compile with g++: <code>g++ -o {dataStructure} {dataStructure}.cpp</code></li>
            <li>Run the program: <code>./{dataStructure}</code></li>
          </ol>
          
          <h4>Try These Exercises:</h4>
          <ul>
            <li>Add a method to display all elements in the {dataStructure}</li>
            <li>Implement a method to check if a specific value exists in the {dataStructure}</li>
            {dataStructure === 'stack' ? (
              <li>Implement a function to reverse a string using a stack</li>
            ) : (
              <li>Implement a circular queue that reuses empty spaces</li>
            )}
          </ul>
          
          <pre className="code-block">
            <code>{code}</code>
          </pre>
          
          <button 
            onClick={handleCopy}
            className={`copy-button ${copyText !== "Copy Code to Clipboard" ? 'copied' : ''}`}
          >
            {copyText}
          </button>
        </div>
      )}
    </div>
  );
};

export default DiySection;
