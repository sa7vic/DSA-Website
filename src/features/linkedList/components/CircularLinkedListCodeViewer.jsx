import React, { useState, useEffect, useCallback } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaPlay, FaStop, FaForward, FaBackward } from 'react-icons/fa';
import Editor from "@monaco-editor/react";
import { generateCircularLinkedListCode } from '../../../utils/circularLinkedListCodeGenerator';

const CircularLinkedListCodeViewer = ({ code, onChange, nodes, onStepChange, currentLine = 0, isAnimating = false }) => {
  const [showInteractiveCode, setShowInteractiveCode] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  // Enhanced C code with detailed comments for line highlighting
  const getEnhancedCode = () => {
    return `#include <stdio.h>
#include <stdlib.h>

// Node structure for circular linked list
struct Node {
    int data;                      // Data stored in the node
    struct Node* next;             // Pointer to next node
};

// Create a new node
struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;
    return newNode;
}

// Circular Linked List structure
struct CircularLinkedList {
    struct Node* head;             // Pointer to first node
};

// Initialize empty list
struct CircularLinkedList* createList() {
    struct CircularLinkedList* list = (struct CircularLinkedList*)malloc(sizeof(struct CircularLinkedList));
    list->head = NULL;
    return list;
}

// Insert element at beginning of list
void insertAtBeginning(struct CircularLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        newNode->next = newNode;               // Points to itself
    } else {                                   // List has nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != list->head) {  // Find last node
            current = current->next;
        }
        newNode->next = list->head;            // New node points to head
        current->next = newNode;               // Last node points to new node
        list->head = newNode;                  // Update head pointer
    }
    printf("Inserted %d\\n", value);
}

// Insert element at end of list
void insertAtEnd(struct CircularLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        newNode->next = newNode;               // Points to itself
    } else {                                   // List has nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != list->head) {  // Find last node
            current = current->next;
        }
        current->next = newNode;               // Last node points to new node
        newNode->next = list->head;            // New node points to head
    }
    printf("Inserted %d\\n", value);
}

// Insert element at specific position
void insertAtPosition(struct CircularLinkedList* list, int value, int position) {
    if (position < 0) {                        // Validate position
        printf("Position cannot be negative\\n");
        return;
    }
    
    if (position == 0) {                       // Insert at beginning
        insertAtBeginning(list, value);
        return;
    }
    
    if (list->head == NULL) {                  // Empty list
        printf("Position out of range\\n");
        return;
    }
    
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    
    struct Node* current = list->head;         // Start from head
    for (int i = 0; i < position - 1; i++) {
        current = current->next;               // Traverse to position
        if (current == list->head) {           // Full circle
            printf("Position out of range\\n");
            free(newNode);
            return;
        }
    }
    
    newNode->next = current->next;             // Link new node
    current->next = newNode;                   // Update previous link
    printf("Inserted %d at position %d\\n", value, position);
}

// Delete element from beginning
void deleteFromBeginning(struct CircularLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (list->head->next == list->head) {      // Only one node
        free(list->head);                      // Free memory
        list->head = NULL;                     // List becomes empty
    } else {                                   // Multiple nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != list->head) {  // Find last node
            current = current->next;
        }
        struct Node* nodeToDelete = list->head; // Store reference
        current->next = list->head->next;      // Update last node's link
        list->head = list->head->next;         // Move head pointer
        free(nodeToDelete);                    // Free memory
    }
    printf("Deleted from beginning\\n");
}

// Delete element from end
void deleteFromEnd(struct CircularLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (list->head->next == list->head) {      // Only one node
        free(list->head);                      // Free memory
        list->head = NULL;                     // List becomes empty
    } else {                                   // Multiple nodes
        struct Node* current = list->head;     // Start from head
        while (current->next->next != list->head) { // Find second last
            current = current->next;
        }
        struct Node* nodeToDelete = current->next; // Store reference
        current->next = list->head;            // Update link to head
        free(nodeToDelete);                    // Free memory
    }
    printf("Deleted from end\\n");
}

// Delete element from specific position
void deleteFromPosition(struct CircularLinkedList* list, int position) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (position < 0) {                        // Validate position
        printf("Position cannot be negative\\n");
        return;
    }
    
    if (position == 0) {                       // Delete from beginning
        deleteFromBeginning(list);
        return;
    }
    
    struct Node* current = list->head;         // Start from head
    for (int i = 0; i < position - 1; i++) {
        current = current->next;               // Traverse to position
        if (current->next == list->head) {     // Full circle
            printf("Position out of range\\n");
            return;
        }
    }
    
    if (current->next == list->head) {         // Position beyond list
        printf("Position out of range\\n");
        return;
    }
    
    struct Node* nodeToDelete = current->next; // Store reference
    current->next = nodeToDelete->next;        // Update link
    free(nodeToDelete);                        // Free memory
    printf("Deleted from position %d\\n", position);
}

// Display the list
void display(struct CircularLinkedList* list) {
    if (list->head == NULL) {
        printf("Empty list\\n");
        return;
    }
    
    struct Node* current = list->head;
    do {
        printf("%d -> ", current->data);
        current = current->next;
    } while (current != list->head);
    printf("(back to head)\\n");
}`;
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
    if (!onChange) {
      return;
    }

    // Parse the code to extract operations (simplified)
    const lines = value.split('\n');
    const nodesData = [];
    
    try {
      // Simple pattern matching for insertAtBeginning and insertAtEnd calls
      lines.forEach(line => {
        const insertBeginMatch = line.match(/insertAtBeginning\s*\(\s*list\s*,\s*(\d+)\s*\)/);
        const insertEndMatch = line.match(/insertAtEnd\s*\(\s*list\s*,\s*(\d+)\s*\)/);
        
        if (insertBeginMatch) {
          const value = parseInt(insertBeginMatch[1]);
          nodesData.unshift({ data: value }); // Add to beginning
        } else if (insertEndMatch) {
          const value = parseInt(insertEndMatch[1]);
          nodesData.push({ data: value }); // Add to end
        }
      });
      
      onChange(nodesData);
    } catch (error) {
      console.warn('Error parsing code:', error);
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
          📝 Interactive Code
        </button>
        <button 
          className={`mode-button ${showInteractiveCode ? '' : 'active'}`}
          onClick={() => setShowInteractiveCode(false)}
        >
          🎯 Highlighted Code
        </button>
      </div>

      {/* Animation Controls */}
      <div className="animation-controls">
        <div className="control-btn-group">
          <button 
            className="control-btn"
            disabled={isAnimating}
            onClick={() => onStepChange && onStepChange('reset')}
          >
            🔄 Reset Highlight
          </button>
        </div>
        
        <div className="speed-control">
          <label>Highlight Speed:</label>
          <input 
            type="range" 
            min="100" 
            max="2000" 
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
          />
          <span>{animationSpeed}ms</span>
        </div>

        {isAnimating && (
          <div className="animation-status">
            <div className="spinner"></div>
            <span>Code Highlighting Active</span>
          </div>
        )}
      </div>

      {showInteractiveCode ? (
        <div className="interactive-code-section">
          {/* Highlighted Code Display with Live Animation */}
          <div className="highlighted-code-display">
            <SyntaxHighlighter
              language="c"
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
                overflow: 'auto',
                background: '#1e1e1e'
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
            defaultLanguage="c"
            defaultValue={code || generateCircularLinkedListCode(nodes)}
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
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
                verticalSliderSize: 8,
                horizontalSliderSize: 8,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                arrowSize: 15,
                useShadows: true
              },
            }}
            onChange={handleEditorChange}
          />
        </div>
      )}
    </div>
  );
};

export default CircularLinkedListCodeViewer;
