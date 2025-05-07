import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cppDoublyLinkedListCode } from '../cppCode';

const CodeViewer = () => {
  return (
    <div className="code-viewer">
      <SyntaxHighlighter 
        language="cpp" 
        style={vscDarkPlus}
        showLineNumbers={true}
        wrapLines={true}
        customStyle={{
          backgroundColor: '#161b22',
          margin: 0,
          padding: '1rem',
          borderRadius: '6px',
          fontSize: '14px',
          overflow: 'auto',
          maxHeight: 'calc(100vh - 2rem)'
        }}
      >
        {cppDoublyLinkedListCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeViewer;