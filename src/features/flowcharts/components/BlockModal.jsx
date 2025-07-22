import { useState, useCallback } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { BLOCK_TYPES } from '../types';

const BlockModal = ({ blockType, onCreateBlock, onCancel, placeholder, availableTypes }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState(blockType);

  // Validation with enhanced rules
  const validateInput = useCallback(() => {
    setError('');
    
    switch (selectedType) {
      case BLOCK_TYPES.START:
      case BLOCK_TYPES.STOP:
        return true;
      
      case BLOCK_TYPES.ASSIGN:
        if (!value.trim()) {
          setError('Please enter a variable declaration or assignment (e.g., int x or x = 5)');
          return false;
        }
        // Allow both declarations (int x) and assignments (x = 5)
        const trimmedValue = value.trim();
        const isDeclaration = /^(int|float|double|char|string)\s+[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedValue);
        const isAssignment = trimmedValue.includes('=');
        
        if (!isDeclaration && !isAssignment) {
          setError('Enter either a variable declaration (e.g., int x) or assignment (e.g., x = 5)');
          return false;
        }
        return true;
      
      case BLOCK_TYPES.INCREMENT:
      case BLOCK_TYPES.DECREMENT:
        if (!value.trim()) {
          setError('Please enter a variable name (e.g., x, count)');
          return false;
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value.trim())) {
          setError('Variable name must be valid (letters, numbers, underscore only)');
          return false;
        }
        return true;
      
      case BLOCK_TYPES.INPUT:
        if (!value.trim()) {
          setError('Please enter a variable name (e.g., x, number)');
          return false;
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value.trim())) {
          setError('Variable name must be valid (letters, numbers, underscore only)');
          return false;
        }
        return true;
      
      case BLOCK_TYPES.IF:
      case BLOCK_TYPES.WHILE:
        if (!value.trim()) {
          setError('Please enter a condition (e.g., x < 10)');
          return false;
        }
        return true;
      
      case BLOCK_TYPES.PRINT:
        if (!value.trim()) {
          setError('Please enter a value to print (e.g., x or "Hello")');
          return false;
        }
        return true;
      
      default:
        return false;
    }
  }, [selectedType, value]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!validateInput()) {
      return;
    }

    const blockData = {
      type: selectedType,
      value: value.trim(),
      children: [],
      elseChildren: selectedType === BLOCK_TYPES.IF ? [] : undefined
    };

    // For IF blocks, automatically create the structure with else branch
    if (selectedType === BLOCK_TYPES.IF) {
      blockData.elseChildren = [];
    }

    // For WHILE blocks, ensure proper loop structure
    if (selectedType === BLOCK_TYPES.WHILE) {
      blockData.children = [];
    }

    onCreateBlock(blockData);
  }, [selectedType, value, validateInput, onCreateBlock]);

  const getModalTitle = () => {
    if (placeholder) {
      return `Add Block to ${placeholder.branchType} Branch`;
    }
    
    const targetType = selectedType || blockType;
    switch (targetType) {
      case BLOCK_TYPES.START:
        return 'Add Start Block';
      case BLOCK_TYPES.STOP:
        return 'Add Stop Block';
      case BLOCK_TYPES.ASSIGN:
        return 'Add Assignment Block';
      case BLOCK_TYPES.INCREMENT:
        return 'Add Increment Block';
      case BLOCK_TYPES.DECREMENT:
        return 'Add Decrement Block';
      case BLOCK_TYPES.INPUT:
        return 'Add Input Block';
      case BLOCK_TYPES.IF:
        return 'Add If Statement Block';
      case BLOCK_TYPES.WHILE:
        return 'Add While Loop Block';
      case BLOCK_TYPES.PRINT:
        return 'Add Print Block';
      default:
        return 'Add Block';
    }
  };

  const getPlaceholder = () => {
    const targetType = selectedType || blockType;
    switch (targetType) {
      case BLOCK_TYPES.ASSIGN:
        return 'e.g., int x, x = 5, or count = count + 1';
      case BLOCK_TYPES.INCREMENT:
      case BLOCK_TYPES.DECREMENT:
        return 'e.g., x, count, number';
      case BLOCK_TYPES.INPUT:
        return 'e.g., x, userInput, number';
      case BLOCK_TYPES.IF:
      case BLOCK_TYPES.WHILE:
        return 'e.g., x < 10 or count != 0';
      case BLOCK_TYPES.PRINT:
        return 'e.g., x or "Hello World"';
      default:
        return '';
    }
  };

  const getInputLabel = () => {
    const targetType = selectedType || blockType;
    switch (targetType) {
      case BLOCK_TYPES.ASSIGN:
        return 'Variable Declaration or Assignment:';
      case BLOCK_TYPES.INCREMENT:
        return 'Variable to Increment:';
      case BLOCK_TYPES.DECREMENT:
        return 'Variable to Decrement:';
      case BLOCK_TYPES.INPUT:
        return 'Variable to Store Input:';
      case BLOCK_TYPES.IF:
      case BLOCK_TYPES.WHILE:
        return 'Condition:';
      case BLOCK_TYPES.PRINT:
        return 'Value to Print:';
      default:
        return 'Value:';
    }
  };

  const needsInput = ![
    BLOCK_TYPES.START, 
    BLOCK_TYPES.STOP
  ].includes(selectedType || blockType);

  const getBlockDescription = () => {
    const targetType = selectedType || blockType;
    switch (targetType) {
      case BLOCK_TYPES.START:
        return 'Marks the beginning of your algorithm.';
      case BLOCK_TYPES.STOP:
        return 'Marks the end of your algorithm.';
      default:
        return '';
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{getModalTitle()}</h3>
          <button className="modal-close" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {availableTypes && (
            <div className="input-group">
              <label htmlFor="block-type">Block Type</label>
              <select 
                id="block-type"
                value={selectedType || ''}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setValue('');
                  setError('');
                }}
                required
              >
                <option value="">Select a block type...</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {needsInput && selectedType && (
            <div className="input-group">
              <label htmlFor="block-value">
                {getInputLabel()}
              </label>
              <input
                id="block-value"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={getPlaceholder()}
                autoFocus
                required={needsInput}
              />
            </div>
          )}

          {!needsInput && (
            <div className="block-preview">
              <p>This block doesn't require any input.</p>
              <small>{getBlockDescription()}</small>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="create-btn">
              <FaCheck /> Create Block
            </button>
          </div>
        </form>

        {/* Enhanced help section */}
        <div className="modal-help">
          <h4>Examples:</h4>
          {blockType === BLOCK_TYPES.ASSIGN && (
            <ul>
              <li><code>x = 5</code> - Assign constant value</li>
              <li><code>count = count + 1</code> - Increment variable</li>
              <li><code>sum = a + b</code> - Assign expression result</li>
            </ul>
          )}
          {(blockType === BLOCK_TYPES.INCREMENT || blockType === BLOCK_TYPES.DECREMENT) && (
            <ul>
              <li><code>x</code> - Simple variable name</li>
              <li><code>count</code> - Counter variable</li>
              <li><code>index</code> - Loop index variable</li>
            </ul>
          )}
          {blockType === BLOCK_TYPES.INPUT && (
            <ul>
              <li><code>x</code> - Store input in variable x</li>
              <li><code>userInput</code> - Store in userInput variable</li>
              <li><code>number</code> - Store in number variable</li>
            </ul>
          )}
          {(blockType === BLOCK_TYPES.IF || blockType === BLOCK_TYPES.WHILE) && (
            <ul>
              <li><code>x &lt; 10</code> - Less than comparison</li>
              <li><code>count != 0</code> - Not equal comparison</li>
              <li><code>x &gt;= y</code> - Greater than or equal</li>
              <li><code>x == 5</code> - Equality comparison</li>
            </ul>
          )}
          {blockType === BLOCK_TYPES.PRINT && (
            <ul>
              <li><code>x</code> - Print variable value</li>
              <li><code>"Hello World"</code> - Print text</li>
              <li><code>result</code> - Print variable result</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockModal;
