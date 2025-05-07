// C++ Doubly Linked List implementation code
export const cppDoublyLinkedListCode = `#include <iostream>
#include <iostream>
#include <string>
using namespace std;

// You assign "nodes" which are just objects that contain data and memory addresses 
//Later you take these nodes and assign them to a memory pool, with their addresses linked together
struct Node {
    string data;
    Node* prev; // Pointer to previous node
    Node* next; //Pointer to the next node 
    
    // Constructor
    Node(const std::string& value) : data(value), prev(nullptr), next(nullptr) {}
};

// Doubly Linked List class
class DoublyLinkedList {
private:
    Node* head;
    Node* tail;
    int size;

public:
    // Constructor
    DoublyLinkedList() : head(nullptr), tail(nullptr), size(0) {}
    
    // Destructor
    ~DoublyLinkedList() {
        clear();
    }
    
    // Check if list is empty
    bool isEmpty() const {
        return head == nullptr;
    }
    
    // Get size of list
    int getSize() const {
        return size;
    }
    
    // Insert at beginning
    void insertAtBeginning(const std::string& value) {
        Node* newNode = new Node(value);
        
        if (isEmpty()) {
            head = tail = newNode;
        } else {
            newNode->next = head;
            head->prev = newNode;
            head = newNode;
        }
        
        size++;
    }
    
    // Insert at end
    void insertAtEnd(const std::string& value) {
        Node* newNode = new Node(value);
        
        if (isEmpty()) {
            head = tail = newNode;
        } else {
            newNode->prev = tail;
            tail->next = newNode;
            tail = newNode;
        }
        
        size++;
    }
    
    // Insert at position
    bool insertAtPosition(int position, const std::string& value) {
        // Invalid position
        if (position < 0 || position > size) {
            return false;
        }
        
        // Insert at beginning
        if (position == 0) {
            insertAtBeginning(value);
            return true;
        }
        
        // Insert at end
        if (position == size) {
            insertAtEnd(value);
            return true;
        }
        
        // Insert in the middle
        Node* current = head;
        for (int i = 0; i < position - 1; i++) {
            current = current->next;
        }
        
        Node* newNode = new Node(value);
        newNode->next = current->next;
        newNode->prev = current;
        current->next->prev = newNode;
        current->next = newNode;
        
        size++;
        return true;
    }
    
    // Delete from beginning
    bool deleteFromBeginning() {
        if (isEmpty()) {
            return false;
        }
        
        Node* temp = head;
        
        if (head == tail) {
            head = tail = nullptr;
        } else {
            head = head->next;
            head->prev = nullptr;
        }
        
        delete temp; // Free memory
        size--;
        return true;
    }
    
    // Delete from end
    bool deleteFromEnd() {
        if (isEmpty()) {
            return false;
        }
        
        Node* temp = tail;
        
        if (head == tail) {
            head = tail = nullptr;
        } else {
            tail = tail->prev;
            tail->next = nullptr;
        }
        
        delete temp; // Free memory
        size--;
        return true;
    }
    
    // Delete from position
    bool deleteFromPosition(int position) {
        // Invalid position
        if (position < 0 || position >= size) {
            return false;
        }
        
        // Delete from beginning
        if (position == 0) {
            return deleteFromBeginning();
        }
        
        // Delete from end
        if (position == size - 1) {
            return deleteFromEnd();
        }
        
        // Delete from middle
        Node* current = head;
        for (int i = 0; i < position; i++) {
            current = current->next;
        }
        
        current->prev->next = current->next;
        current->next->prev = current->prev;
        
        delete current; // Free memory
        size--;
        return true;
    }
    
    // Clear the list
    void clear() {
        Node* current = head;
        while (current != nullptr) {
            Node* temp = current;
            current = current->next;
            delete temp; // Free memory
        }
        
        head = tail = nullptr;
        size = 0;
    }
    
    // Display the list
    void display() const {
        if (isEmpty()) {
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

// Example usage
int main() {
    DoublyLinkedList list;
    
    list.insertAtEnd("Apple");
    list.insertAtEnd("Banana");
    list.insertAtBeginning("Orange");
    list.insertAtPosition(2, "Grape");
    
    std::cout << "List: ";
    list.display();
    
    list.deleteFromPosition(1);
    std::cout << "After deleting at position 1: ";
    list.display();
    
    list.deleteFromBeginning();
    std::cout << "After deleting from beginning: ";
    list.display();
    
    list.deleteFromEnd();
    std::cout << "After deleting from end: ";
    list.display();
    
    return 0;
}`;