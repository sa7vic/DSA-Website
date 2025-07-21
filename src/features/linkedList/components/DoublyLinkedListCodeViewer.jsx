import React, { useState, useEffect, useCallback } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaPlay, FaStop, FaForward, FaBackward } from 'react-icons/fa';
import Editor from "@monaco-editor/react";
import { generateDoublyLinkedListCode } from '../../../utils/doublyLinkedListCodeGenerator';

const DoublyLinkedListCodeViewer = ({ code, onChange, nodes, onStepChange, currentLine = 0, isAnimating = false }) => {
  const [showInteractiveCode, setShowInteractiveCode] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  // Enhanced C code with detailed comments for line highlighting
  const getEnhancedCode = () => {
    return `#include <stdio.h>
#include <stdlib.h>

// Node structure for doubly linked list
struct Node {
    int data;                      // Data stored in the node
    struct Node* prev;             // Pointer to previous node
    struct Node* next;             // Pointer to next node
};

// Create a new node
struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->prev = NULL;
    newNode->next = NULL;
    return newNode;
}

// Doubly Linked List structure
struct DoublyLinkedList {
    struct Node* head;             // Pointer to first node
    struct Node* tail;             // Pointer to last node
};

// Initialize empty list
struct DoublyLinkedList* createList() {
    struct DoublyLinkedList* list = (struct DoublyLinkedList*)malloc(sizeof(struct DoublyLinkedList));
    list->head = NULL;
    list->tail = NULL;
    return list;
}

// Insert element at beginning of list
void insertAtBeginning(struct DoublyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->prev = NULL;                      // Set prev to null

    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        list->tail = newNode;                  // Node also becomes tail
    } else {                                   // List has nodes
        newNode->next = list->head;            // Point to current head
        list->head->prev = newNode;            // Current head's prev points to new node
        list->head = newNode;                  // Update head pointer
    }
    printf("Inserted %d\\n", value);
}

// Insert element at end of list
void insertAtEnd(struct DoublyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->next = NULL;                      // Set next to null
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        list->tail = newNode;                  // Node also becomes tail
    } else {                                   // List has nodes
        newNode->prev = list->tail;            // New node's prev points to current tail
        list->tail->next = newNode;            // Current tail's next points to new node
        list->tail = newNode;                  // Update tail pointer
    }
    printf("Inserted %d\\n", value);
}

// Insert element at specific position
void insertAtPosition(struct DoublyLinkedList* list, int value, int position) {
    if (position < 0) {                        // Validate position
        printf("Position cannot be negative\\n");
        return;
    }
    
    if (position == 0) {                       // Insert at beginning
        insertAtBeginning(list, value);
        return;
    }
    
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    
    struct Node* current = list->head;         // Start from head
    int i = 0;
    while (i < position - 1 && current != NULL) {
        current = current->next;               // Traverse to position
        i++;
    }
    
    if (current == NULL) {                     // Position beyond list
        printf("Position out of range\\n");
        free(newNode);
        return;
    }
    
    if (current->next == NULL) {               // Insert at end
        insertAtEnd(list, value);
        free(newNode);                         // Free the extra node since insertAtEnd creates one
        return;
    }
    
    newNode->next = current->next;             // Link new node to next node
    newNode->prev = current;                   // Link new node to current node
    current->next->prev = newNode;             // Update next node's prev pointer
    current->next = newNode;                   // Update current node's next pointer
    printf("Inserted %d at position %d\\n", value, position);
}

// Delete element from beginning
void deleteFromBeginning(struct DoublyLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    struct Node* nodeToDelete = list->head;    // Store reference
    
    if (list->head == list->tail) {            // Only one node
        list->head = NULL;                     // List becomes empty
        list->tail = NULL;
    } else {
        list->head = list->head->next;         // Move head pointer
        list->head->prev = NULL;               // New head's prev is NULL
    }
    
    free(nodeToDelete);                        // Free memory
    printf("Deleted from beginning\\n");
}

// Delete element from end
void deleteFromEnd(struct DoublyLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    struct Node* nodeToDelete = list->tail;    // Store reference
    
    if (list->head == list->tail) {            // Only one node
        list->head = NULL;                     // List becomes empty
        list->tail = NULL;
    } else {
        list->tail = list->tail->prev;         // Move tail pointer
        list->tail->next = NULL;               // New tail's next is NULL
    }
    
    free(nodeToDelete);                        // Free memory
    printf("Deleted from end\\n");
}

// Delete element from specific position
void deleteFromPosition(struct DoublyLinkedList* list, int position) {
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
    for (int i = 0; i < position && current != NULL; i++) {
        current = current->next;               // Traverse to position
    }
    
    if (current == NULL) {                     // Position beyond list
        printf("Position out of range\\n");
        return;
    }
    
    if (current == list->tail) {               // Last node
        deleteFromEnd(list);
        return;
    }
    
    current->prev->next = current->next;       // Update previous node's next
    current->next->prev = current->prev;       // Update next node's prev
    
    free(current);                             // Free memory
    printf("Deleted from position %d\\n", position);
}

// Display the list from head to tail
void displayForward(struct DoublyLinkedList* list) {
    printf("List (forward): ");
    struct Node* current = list->head;
    while (current != NULL) {
        printf("%d <-> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
}

// Display the list from tail to head
void displayBackward(struct DoublyLinkedList* list) {
    printf("List (backward): ");
    struct Node* current = list->tail;
    while (current != NULL) {
        printf("%d <-> ", current->data);
        current = current->prev;
    }
    printf("NULL\\n");
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
            defaultValue={code || generateDoublyLinkedListCode(nodes)}
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

export default DoublyLinkedListCodeViewer;
