import { useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";

const CodeViewer = ({ code, onChange }) => {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Remove the blue outline
    editor.getDomNode()?.style.setProperty('outline', 'none');
  }

  function handleEditorChange(value) {
    if (onChange) {
      // Parse the code and update visualization
      try {
        const lines = value.split('\n');
        const nodesData = [];
        
        // Find the main function or relevant code section
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          // Look for node creation and operations
          if (line.includes('insert') || line.includes('delete')) {
            const matches = line.match(/\d+/);
            if (matches) {
              const value = parseInt(matches[0]);
              if (line.includes('insertAtBeginning')) {
                nodesData.unshift({ data: value });
              } else if (line.includes('insertAtEnd')) {
                nodesData.push({ data: value });
              } else if (line.includes('deleteFromBeginning')) {
                nodesData.shift();
              } else if (line.includes('deleteFromEnd')) {
                nodesData.pop();
              }
            }
          }
        }
        onChange(nodesData);
      } catch (error) {
        console.error('Error parsing code:', error);
      }
    }
  }

  return (
    <div className="code-viewer" style={{ outline: 'none' }}>
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
          // Remove focus outline
          folding: true,
          fixedOverflowWidgets: true,
        }}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeViewer;
