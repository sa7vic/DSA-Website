import React, { useState } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaPlus, FaSearch, FaTrash, FaRandom, FaListOl, FaCode, FaSitemap, FaEraser, FaPlayCircle } from 'react-icons/fa';

/**
 * Modern Controls for the tree visualizer
 */
export function VisualizerControls({
  value,
  setValue,
  handleGenerateRandom,
  animationSpeed,
  setAnimationSpeed,
  currentStepIndex,
  isPlaying,
  handleStepForward,
  handlePlayPause,
  handleStepBack,
  handleClear,
  animationSteps,
  handleInsert,
  handleFind,
  handleDelete,
  handleInOrderTraversal,
  handlePreOrderTraversal,
  handlePostOrderTraversal
}) {
  const [activeSection, setActiveSection] = useState('operations');

  return (
    <div className="modern-controls">
      {/* Section Tabs */}
      <div className="control-tabs">
        <button 
          className={`tab ${activeSection === 'operations' ? 'active' : ''}`}
          onClick={() => setActiveSection('operations')}
        >
          <FaPlus />
          Operations
        </button>
        <button 
          className={`tab ${activeSection === 'traversal' ? 'active' : ''}`}
          onClick={() => setActiveSection('traversal')}
        >
          <FaListOl />
          Traversal
        </button>
        <button 
          className={`tab ${activeSection === 'animation' ? 'active' : ''}`}
          onClick={() => setActiveSection('animation')}
        >
          <FaPlayCircle />
          Animation
        </button>
      </div>

      {/* Operations Section */}
      {activeSection === 'operations' && (
        <div className="control-section">
          <div className="input-group">
            <label htmlFor="node-value">Node Value</label>
            <input
              id="node-value"
              type="number"
              placeholder="Enter value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="modern-input"
              min="1"
              max="999"
            />
          </div>

          <div className="operation-buttons">
            <button onClick={handleInsert} className="operation-btn insert-btn">
              <FaPlus />
              Insert
            </button>
            <button onClick={handleFind} className="operation-btn search-btn">
              <FaSearch />
              Search
            </button>
            <button onClick={handleDelete} className="operation-btn delete-btn">
              <FaTrash />
              Delete
            </button>
          </div>

          <div className="utility-buttons">
            <button onClick={handleGenerateRandom} className="utility-btn generate-btn">
              <FaRandom />
              Random Tree
            </button>
            <button onClick={handleClear} className="utility-btn clear-btn">
              <FaEraser />
              Clear Tree
            </button>
          </div>
        </div>
      )}

      {/* Traversal Section */}
      {activeSection === 'traversal' && (
        <div className="control-section">
          <div className="traversal-info">
            <h4>Tree Traversal Methods</h4>
            <p>Explore different ways to visit tree nodes</p>
          </div>
          
          <div className="traversal-buttons">
            <button onClick={handleInOrderTraversal} className="traversal-btn inorder-btn">
              <FaListOl />
              In-Order
              <small>Left → Root → Right</small>
            </button>
            <button onClick={handlePreOrderTraversal} className="traversal-btn preorder-btn">
              <FaSitemap />
              Pre-Order
              <small>Root → Left → Right</small>
            </button>
            <button onClick={handlePostOrderTraversal} className="traversal-btn postorder-btn">
              <FaCode />
              Post-Order
              <small>Left → Right → Root</small>
            </button>
          </div>
        </div>
      )}

      {/* Animation Section */}
      {activeSection === 'animation' && (
        <div className="control-section">
          <div className="animation-info">
            <h4>Animation Controls</h4>
            <p>Control the visualization playback</p>
          </div>

          <div className="playback-controls">
            <button 
              onClick={handleStepBack} 
              className="playback-btn"
              disabled={currentStepIndex <= 0}
            >
              <FaStepBackward />
            </button>
            <button 
              onClick={handlePlayPause} 
              className={`playback-btn play-pause ${isPlaying ? 'playing' : 'paused'}`}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button 
              onClick={handleStepForward} 
              className="playback-btn"
              disabled={currentStepIndex >= animationSteps.length - 1}
            >
              <FaStepForward />
            </button>
          </div>

          {animationSteps.length > 0 && (
            <div className="step-info">
              <span>Step {currentStepIndex + 1} of {animationSteps.length}</span>
              <div className="step-progress">
                <div 
                  className="step-progress-fill"
                  style={{ width: `${((currentStepIndex + 1) / animationSteps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="speed-control">
            <label htmlFor="animation-speed">Animation Speed</label>
            <input
              id="animation-speed"
              type="range"
              min="100"
              max="2000"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="speed-slider"
            />
            <div className="speed-labels">
              <span>Fast</span>
              <span>Slow</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * TreeOperationControls handles operations like insert, find, delete
 */
function TreeOperationControls({
  value,
  setValue,
  handleInsert,
  handleDelete,
  handleFind,
  handleInOrderTraversal,
  handlePreOrderTraversal,
  handlePostOrderTraversal,
}) {
  return (
    <div className="operation-controls">
      <input
        type="number"
        placeholder="Enter value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="value-input"
      />
      <button onClick={handleInsert} className="control-button">
        <FaPlus className="icon" />
        Insert
      </button>

      <button onClick={handleFind} className="control-button">
        <FaSearch className="icon" />
        Find
      </button>

      <button onClick={handleDelete} className="control-button">
        <FaTrash className="icon" />
        Delete
      </button>
      
      <div className="operation-divider"></div>
      
      <button onClick={handleInOrderTraversal} className="control-button">
        <FaListOl className="icon" />
        In-Order
      </button>
      
      <button onClick={handlePreOrderTraversal} className="control-button">
        <FaSitemap className="icon" />
        Pre-Order
      </button>
      
      <button onClick={handlePostOrderTraversal} className="control-button">
        <FaCode className="icon" />
        Post-Order
      </button>
    </div>
  );
}

/**
 * TreeGenControls handles creating random trees and clearing
 */
function TreeGenControls({
  handleGenerateRandom,
  handleClear,
}) {
  return (
    <div className="gen-controls">
      <button
        onClick={handleGenerateRandom}
        className="control-button random-button"
      >
        <FaRandom className="icon" />
        Random Tree
      </button>
      <button onClick={handleClear} className="control-button clear-button">
        <FaTrash className="icon" />
        Clear Tree
      </button>
    </div>
  );
}

/**
 * AnimationControls handles playback of animations
 */
function AnimationControls({
  handleStepBack,
  handleStepForward,
  currentStepIndex,
  isPlaying,
  handlePlayPause,
  animationSteps,
  animationSpeed,
  setAnimationSpeed,
}) {
  return (
    <div className="animation-controls">
      <div className="playback-controls">
        <button
          onClick={handleStepBack}
          className="control-button"
          disabled={currentStepIndex <= 0}
        >
          <FaStepBackward className="icon" />
        </button>
        <button onClick={handlePlayPause} className="control-button play-button">
          {isPlaying ? (
            <FaPause className="icon" />
          ) : (
            <FaPlay className="icon" />
          )}
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={handleStepForward}
          className="control-button"
          disabled={currentStepIndex >= animationSteps.length - 1}
        >
          <FaStepForward className="icon" />
        </button>
      </div>

      <div className="speed-control">
        <div className="speed-label">
          <span>Animation Speed</span>
          <span>{(animationSpeed / 1000).toFixed(1)}s</span>
        </div>
        <input
          type="range"
          min={100}
          max={2000}
          step={100}
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(Number(e.target.value))}
          className="speed-slider"
        />
      </div>
    </div>
  );
}
