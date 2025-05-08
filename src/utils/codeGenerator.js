// src/utils/codeGenerator.js
export const generateCppCode = (nodes) => {
  // Base code structure
  const baseCode = `#include <iostream>
#include <string>
using namespace std;

struct Node {
    string data;
    Node* prev;
    Node* next;
    
    Node(const std::string& value) : data(value), prev(nullptr), next(nullptr) {}
};

class DoublyLinkedList {
private:
    Node* head;
    Node* tail;
    int size;

public:
    DoublyLinkedList() : head(nullptr), tail(nullptr), size(0) {}
    
    // Methods will be implemented below
    
    void display() const {
        if (head == nullptr) {
            std::cout << "List is empty" << std::endl;
            return;
        }
        
        Node* current = head;
        while (current != nullptr) {
            std::cout << current->data;
            if (current->next != nullptr) {
                std::cout << " <-> ";
            }
            current = current->next;
        }
        std::cout << std::endl;
    }
};

int main() {
    DoublyLinkedList list;
    
    // Operations will be added here based on visualization state
    
    std::cout << "Current list: ";
    list.display();
    
    return 0;
}`;

  // Generate operations based on current nodes
  let operations = '';
  
  nodes.forEach((node, index) => {
    if (index === 0) {
      operations += `\n    list.insertAtBeginning("${node.data}");`;
    } else {
      operations += `\n    list.insertAtEnd("${node.data}");`;
    }
  });
  
  // Insert operations into the code
  return baseCode.replace('// Operations will be added here based on visualization state', operations);
};