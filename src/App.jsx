import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import CodeViewer from './components/CodeViewer'
import LinkedListVisualizer from './components/LinkedListVisualizer'
import DiySection from './components/DiySection'
import DoublyLinkedListExplanation from './components/DoublyLinkedListExplanation'
import HomePage from './components/HomePage'
import { generateCppCode } from './utils/codeGenerator'

function App() {
  // Maintain shared state at the top level
  const [nodes, setNodes] = useState([]);
  const [code, setCode] = useState(generateCppCode([]));

  // Function to update both nodes and code
  const updateNodesAndCode = (newNodes) => {
    setNodes(newNodes);
    setCode(generateCppCode(newNodes));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/linked-list" 
          element={
            <div className="app-container">
              <header className="app-header">
                <h1>C++ Doubly Linked List Visualization</h1>
              </header>
              <div className="split-view">
                <div className="panel panel-left">
                  <h2>C++ Implementation</h2>
                  <CodeViewer code={code} />
                </div>
                <div className="panel panel-right">
                  <h2>Interactive Visualization</h2>
                  <LinkedListVisualizer 
                    nodes={nodes} 
                    onNodesChange={updateNodesAndCode} 
                  />
                  <DoublyLinkedListExplanation />
                  <DiySection code={code} />
                </div>
              </div>
            </div>
          }
        />
        {/* Redirect legacy URLs to the new paths if needed */}
        <Route path="/index.html" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
