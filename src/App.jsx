import { useState } from 'react'
import './App.css'
import CodeViewer from './components/CodeViewer'
import LinkedListVisualizer from './components/LinkedListVisualizer'
import DiySection from './components/DiySection'
import DoublyLinkedListExplanation from './components/DoublyLinkedListExplanation'
import { generateCppCode } from './utils/codeGenerator'

function App() {
  const [nodes, setNodes] = useState([]);
  const [code, setCode] = useState(generateCppCode([]));

  // Function to update both nodes and code
  const updateNodesAndCode = (newNodes) => {
    setNodes(newNodes);
    setCode(generateCppCode(newNodes));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>C++ Doubly Linked List Visualization</h1>
      </header>
      <div className="split-view">
        <div className="panel panel-left">
          <h2>C++ Implementation</h2>
          <CodeViewer code={code} />
          <DiySection code={code} />
        </div>
        <div className="panel panel-right">
          <h2>Interactive Visualization</h2>
          <LinkedListVisualizer 
            nodes={nodes} 
            onNodesChange={updateNodesAndCode} 
          />
          <DoublyLinkedListExplanation />
        </div>
      </div>
    </div>
  )
}

export default App
