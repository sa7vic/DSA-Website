import React from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaPlus, FaSearch, FaTrash, FaRandom, FaListOl, FaCode, FaSitemap } from 'react-icons/fa';

/**
 * Controls for the tree visualizer
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
  return (
    <div className="controls-container">
      <div className="controls-row">
        <TreeOperationControls 
          value={value}
          setValue={setValue}
          handleInsert={handleInsert}
          handleFind={handleFind}
          handleDelete={handleDelete}
          handleInOrderTraversal={handleInOrderTraversal}
          handlePreOrderTraversal={handlePreOrderTraversal}
          handlePostOrderTraversal={handlePostOrderTraversal}
        />
        
        <div className="controls-group">
          <TreeGenControls 
            handleGenerateRandom={handleGenerateRandom}
            handleClear={handleClear}
          />
          <AnimationControls 
            handleStepBack={handleStepBack}
            handleStepForward={handleStepForward}
            currentStepIndex={currentStepIndex}
            isPlaying={isPlaying}
            handlePlayPause={handlePlayPause}
            animationSteps={animationSteps}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
          />
        </div>
      </div>
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
