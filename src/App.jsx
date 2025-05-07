import './App.css'
import CodeViewer from './components/CodeViewer'
import LinkedListVisualizer from './components/LinkedListVisualizer'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>C++ Doubly Linked List Visualization</h1>
      </header>
      <div className="split-view">
        <div className="panel panel-left">
          <h2>C++ Implementation</h2>
          <CodeViewer />
        </div>
        <div className="panel panel-right">
          <h2>Interactive Visualization</h2>
          <LinkedListVisualizer />
        </div>
      </div>
    </div>
  )
}

export default App
