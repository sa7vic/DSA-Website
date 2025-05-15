import React from "react";
import ydgImage from "../../assets/ydg.png";
import baviImage from "../../assets/bavi.png";

const Node = ({ 
  value,
  isWall,
  isStart,
  isEnd,
  isVisited,
  isShortestPath,
  row,
  col,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onMouseLeave
}) => {
  // Determine the class name based on node properties
  const getNodeClassName = () => {
    if (isStart) return "node_start";
    if (isEnd) return "node_end";
    if (isWall) return "node_wall";
    if (isShortestPath) return "node_path";
    if (isVisited) return "node_visited";
    return "node_";
  };
  
  // Use preventDefaultEvent to prevent text selection during drag operations
  const preventDefaultEvent = (e) => {
    e.preventDefault();
    return false;
  };
  
  return (
    <td 
      id={`node-${row}-${col}`}
      className={getNodeClassName()}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(row, col);
      }}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      onMouseLeave={() => onMouseLeave(row, col)}
      onDragStart={preventDefaultEvent}
      draggable={false}
      style={{ 
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {isStart && (
        <img 
          src={ydgImage} 
          alt="Start" 
          className="node-image start-image"
        />
      )}
      {isEnd && (
        <img 
          src={baviImage} 
          alt="End" 
          className="node-image end-image"
        />
      )}
    </td>
  );
};

export default Node;
