import React, { useState, useEffect, useCallback } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaPlay, FaStop, FaForward, FaBackward } from 'react-icons/fa';
import Editor from "@monaco-editor/react";

const CodeViewer = ({ code, onChange, nodes, onStepChange, currentLine = 0, isAnimating = false }) => {
  const [showInteractiveCode, setShowInteractiveCode] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  // Enhanced C++ code with detailed comments for line highlighting
  const getEnhancedCode = () => {
    return `#include <iostream>
#include <memory>
#include <stdexcept>

// Node structure for doubly linked list
struct Node {
    int data;                      // Data stored in the node
    std::shared_ptr<Node> next;    // Pointer to next node
    std::shared_ptr<Node> prev;    // Pointer to previous node
    
    Node(int value) : data(value), next(nullptr), prev(nullptr) {}
};

class DoublyLinkedList {
private:
    std::shared_ptr<Node> head;    // Pointer to first node
    std::shared_ptr<Node> tail;    // Pointer to last node

public:
    // Constructor: Initialize empty list
    DoublyLinkedList() : head(nullptr), tail(nullptr) {}
    
    // Insert element at beginning of list
    void insertAtBeginning(int value) {
        auto newNode = std::make_shared<Node>(value);  // Allocate memory
        newNode->data = value;                         // Set data
        newNode->prev = nullptr;                       // Set prev to null
        if (head == nullptr) {                         // Check if empty
            head = tail = newNode;                     // Node becomes head
        } else {                                       // List has nodes
            newNode->next = head;                      // Link to current head
            head->prev = newNode;                      // Update head's prev
        }
        head = newNode;                                // Update head pointer
        std::cout << "Inserted " << value << std::endl;
    }
    
    // Insert element at end of list
    void insertAtEnd(int value) {
        auto newNode = std::make_shared<Node>(value);  // Allocate memory
        newNode->data = value;                         // Set data
        newNode->next = nullptr;                       // Set next to null
        if (tail == nullptr) {                         // Check if empty
            head = tail = newNode;                     // Node becomes head/tail
        } else {                                       // List has nodes
            tail->next = newNode;                      // Link tail to new node
            newNode->prev = tail;                      // Link new node to tail
        }
        tail = newNode;                                // Update tail pointer
        std::cout << "Inserted " << value << std::endl;
    }
    
    // Insert element at specific position
    void insertAtPosition(int value, int position) {
        if (position < 0) {                            // Validate position
            throw std::invalid_argument("Position cannot be negative");
        }
        
        if (position == 0) {                           // Insert at beginning
            insertAtBeginning(value);
            return;
        }
        
        auto newNode = std::make_shared<Node>(value);  // Allocate memory
        newNode->data = value;                         // Set data
        
        auto current = head;                           // Start from head
        for (int i = 0; i < position - 1 && current != nullptr; i++) {
            current = current->next;                   // Traverse to position
        }
        
        if (current == nullptr) {                      // Position beyond list
            insertAtEnd(value);                        // Insert at end
            return;
        }
        
        newNode->next = current->next;                 // Link new node's next
        newNode->prev = current;                       // Link new node's prev
        
        if (current->next != nullptr) {                // Update next node's prev
            current->next->prev = newNode;
        } else {                                       // New node is tail
            tail = newNode;
        }
        
        current->next = newNode;                       // Update current's next
        std::cout << "Inserted " << value << " at position " << position << std::endl;
    }
    
    // Delete element from beginning
    void deleteFromBeginning() {
        if (head == nullptr) {                         // Check if empty
            throw std::runtime_error("List is empty");
        }
        
        auto nodeToDelete = head;                      // Store reference
        head = head->next;                             // Move head pointer
        if (head != nullptr) {                         // If new head exists
            head->prev = nullptr;                      // Set prev to null
        } else {                                       // List becomes empty
            tail = nullptr;                            // Update tail
        }
        // Memory automatically freed by shared_ptr     // Free memory
        std::cout << "Deleted from beginning" << std::endl;
    }
    
    // Delete element from end
    void deleteFromEnd() {
        if (head == nullptr) {                         // Check if empty
            throw std::runtime_error("List is empty");
        }
        
        if (head == tail) {                            // Only one node
            head = tail = nullptr;                     // List becomes empty
            std::cout << "Deleted from end" << std::endl;
            return;
        }
        
        auto nodeToDelete = tail;                      // Store reference
        tail = tail->prev;                             // Move tail backward
        tail->next = nullptr;                          // Set next to null
        // Memory automatically freed by shared_ptr     // Free memory
        std::cout << "Deleted from end" << std::endl;
    }
    
    // Delete element from specific position
    void deleteFromPosition(int position) {
        if (head == nullptr) {                         // Check if empty
            throw std::runtime_error("List is empty");
        }
        
        if (position < 0) {                            // Validate position
            throw std::invalid_argument("Position cannot be negative");
        }
        
        if (position == 0) {                           // Delete from beginning
            deleteFromBeginning();
            return;
        }
        
        auto current = head;                           // Start from head
        for (int i = 0; i < position && current != nullptr; i++) {
            current = current->next;                   // Traverse to position
        }
        
        if (current == nullptr) {                      // Position beyond list
            throw std::out_of_range("Position out of range");
        }
        
        if (current->prev != nullptr) {                // Update prev node's next
            current->prev->next = current->next;
        }
        
        if (current->next != nullptr) {                // Update next node's prev
            current->next->prev = current->prev;
        } else {                                       // Deleting tail
            tail = current->prev;
        }
        
        // Memory automatically freed by shared_ptr     // Free memory
        std::cout << "Deleted from position " << position << std::endl;
    }
    
    // Display the list
    void display() {
        auto current = head;
        while (current != nullptr) {
            std::cout << current->data << " <-> ";
            current = current->next;
        }
        std::cout << "nullptr" << std::endl;
    }
};`;
  };

  // Watch for changes in nodes to trigger animations
  useEffect(() => {
    if (nodes && nodes.length > 0) {
      // Simple heuristic: if first node changed, likely an insert at beginning
      // In a real implementation, you'd track the specific operation
      const lastOperation = 'display'; // Placeholder
      if (lastOperation && !isAnimating) {
        // simulateOperation('display'); // Commented out for now
      }
    }
  }, [nodes, isAnimating]);

  const handleEditorChange = useCallback((value) => {
    if (!onChange) return;

    // Parse the code to extract operations (simplified)
    const lines = value.split('\n');
    const nodesData = [];
    
    try {
      // Look for insertAtBeginning, insertAtEnd, etc. calls
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.includes('insertAtBeginning') || trimmed.includes('insertAtEnd')) {
          const matches = trimmed.match(/\d+/);
          if (matches) {
            const val = parseInt(matches[0]);
            nodesData.push({ data: val.toString() });
          }
        }
      }
      
      onChange(nodesData);
    } catch (error) {
      console.error('Error parsing code:', error);
    }
  }, [onChange]);

  return (
    <div className="code-viewer-container">
      {/* Mode Toggle */}
      <div className="code-mode-toggle">
        <button 
          className={`mode-button ${!showInteractiveCode ? 'active' : ''}`}
          onClick={() => setShowInteractiveCode(false)}
        >
          Editable Code
        </button>
        <button 
          className={`mode-button ${showInteractiveCode ? 'active' : ''}`}
          onClick={() => setShowInteractiveCode(true)}
        >
          Highlighted Code Demo
        </button>
      </div>

      {showInteractiveCode ? (
        <div className="interactive-code-section">
          {/* Highlighted Code Display with Live Animation */}
          <div className="highlighted-code-display">
            <SyntaxHighlighter
              language="cpp"
              style={vs2015}
              wrapLines={true}
              showLineNumbers={true}
              lineProps={lineNumber => ({
                style: { 
                  backgroundColor: lineNumber === currentLine ? 'rgba(88, 166, 255, 0.3)' : 'transparent',
                  display: 'block',
                  color: lineNumber === currentLine ? '#fff' : undefined,
                  fontWeight: lineNumber === currentLine ? 'bold' : 'normal'
                }
              })}
              customStyle={{
                margin: 0,
                padding: '1rem',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                height: '70vh',
                overflow: 'auto'
              }}
            >
              {getEnhancedCode()}
            </SyntaxHighlighter>
          </div>
        </div>
      ) : (
        <div className="editable-code-section">
          <Editor
            height="70vh"
            defaultLanguage="cpp"
            defaultValue={code}
            theme="vs-dark"
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
              folding: true,
              fixedOverflowWidgets: true,
            }}
            onChange={handleEditorChange}
          />
        </div>
      )}
    </div>
  );
};

export default CodeViewer;