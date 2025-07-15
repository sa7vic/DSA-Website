import React, { useState, useEffect, useCallback } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaPlay, FaStop, FaForward, FaBackward } from 'react-icons/fa';
import Editor from "@monaco-editor/react";
import { generateSinglyLinkedListCode } from '../../../utils/singlyLinkedListCodeGenerator';

const SinglyLinkedListCodeViewer = ({ code, onChange, nodes, onStepChange, currentLine = 0, isAnimating = false }) => {
  const [showInteractiveCode, setShowInteractiveCode] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  // Enhanced C code with detailed comments for line highlighting
  const getEnhancedCode = () => {
    return `#include <stdio.h>
#include <stdlib.h>

// Node structure for singly linked list
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

// Singly Linked List structure
struct SinglyLinkedList {
    struct Node* head;             // Pointer to first node
};

// Initialize empty list
struct SinglyLinkedList* createList() {
    struct SinglyLinkedList* list = (struct SinglyLinkedList*)malloc(sizeof(struct SinglyLinkedList));
    list->head = NULL;
    return list;
}

// Insert element at beginning of list
void insertAtBeginning(struct SinglyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->next = list->head;                // Point to current head
    list->head = newNode;                      // Update head pointer
    printf("Inserted %d\\n", value);
}

// Insert element at end of list
void insertAtEnd(struct SinglyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->next = NULL;                      // Set next to null
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
    } else {                                   // List has nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != NULL) {        // Traverse to end
            current = current->next;
        }
        current->next = newNode;               // Link to new node
    }
    printf("Inserted %d\\n", value);
}

// Insert element at specific position
void insertAtPosition(struct SinglyLinkedList* list, int value, int position) {
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
    for (int i = 0; i < position - 1 && current != NULL; i++) {
        current = current->next;               // Traverse to position
    }
    
    if (current == NULL) {                     // Position beyond list
        printf("Position out of range\\n");
        free(newNode);
        return;
    }
    
    newNode->next = current->next;             // Link new node
    current->next = newNode;                   // Update previous link
    printf("Inserted %d at position %d\\n", value, position);
}

// Delete element from beginning
void deleteFromBeginning(struct SinglyLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    struct Node* nodeToDelete = list->head;    // Store reference
    list->head = list->head->next;             // Move head pointer
    free(nodeToDelete);                        // Free memory
    printf("Deleted from beginning\\n");
}

// Delete element from end
void deleteFromEnd(struct SinglyLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (list->head->next == NULL) {            // Only one node
        free(list->head);                      // Free memory
        list->head = NULL;                     // List becomes empty
        printf("Deleted from end\\n");
        return;
    }
    
    struct Node* current = list->head;         // Start from head
    while (current->next->next != NULL) {     // Find second last
        current = current->next;
    }
    
    free(current->next);                       // Free last node
    current->next = NULL;                      // Update link
    printf("Deleted from end\\n");
}

// Delete element from specific position
void deleteFromPosition(struct SinglyLinkedList* list, int position) {
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
    for (int i = 0; i < position - 1 && current != NULL; i++) {
        current = current->next;               // Traverse to position
    }
    
    if (current == NULL || current->next == NULL) { // Position beyond list
        printf("Position out of range\\n");
        return;
    }
    
    struct Node* nodeToDelete = current->next; // Store reference
    current->next = nodeToDelete->next;        // Update link
    free(nodeToDelete);                        // Free memory
    printf("Deleted from position %d\\n", position);
}

// Display the list
void display(struct SinglyLinkedList* list) {
    struct Node* current = list->head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
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
            defaultValue={code || generateSinglyLinkedListCode(nodes)}
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

export default SinglyLinkedListCodeViewer;
