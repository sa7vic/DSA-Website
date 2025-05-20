import React from 'react';
import { motion } from 'framer-motion';
import { layoutSplayTree } from '../lib/binary-tree-layout';

// Styling constants
const LINE_COLOR = "#696969";
const CIRCLE_WIDTH = 12;
const NODE_COLOR = "#3b82f6";
const CURSOR_COLOR = "#4CAF50";

/**
 * SvgNode renders a single node in the tree
 */
const SvgNode = ({ node, isCursor }) => (
  <g>
    {/* Draw lines to children */}
    {node.left && (
      <motion.line
        animate={{
          x1: node.x,
          y1: node.y,
          x2: node.left.x,
          y2: node.left.y,
        }}
        stroke={LINE_COLOR}
        strokeWidth="1"
      />
    )}
    {node.right && (
      <motion.line
        animate={{
          x1: node.x,
          y1: node.y,
          x2: node.right.x,
          y2: node.right.y,
        }}
        stroke={LINE_COLOR}
        strokeWidth="1"
      />
    )}
    
    {/* Draw node circle */}
    <motion.circle
      r={CIRCLE_WIDTH}
      fill={NODE_COLOR}
      animate={{ cx: node.x, cy: node.y }}
    />
    
    {/* Draw node value */}
    <motion.text
      dy=".33em"
      fontSize={8}
      fontFamily="Arial"
      textAnchor="middle"
      fill="white"
      style={{ pointerEvents: "none" }}
      animate={{
        x: node.x,
        y: node.y,
      }}
    >
      {node.treeNode.key}
    </motion.text>
  </g>
);

/**
 * SvgTree renders the entire tree
 */
export function SvgTree({ tree, cursor }) {
  const positionedNodes = layoutSplayTree(tree);
  const cursorNode = positionedNodes.find((node) => node.value === cursor);
  
  return (
    <svg
      className="svg-tree"
      viewBox="0 0 300 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="300" height="200" fill="#0F2317" rx="8" ry="8" opacity="0.3" />
      
      {/* Render all nodes */}
      {positionedNodes.map((node) => (
        <SvgNode
          key={node.value}
          node={node}
          isCursor={node.treeNode.key === cursor}
        />
      ))}
      
      {/* Highlight cursor node */}
      {cursorNode && (
        <motion.circle
          animate={{
            cx: cursorNode.x,
            cy: cursorNode.y,
          }}
          r={CIRCLE_WIDTH}
          fill="none"
          stroke={CURSOR_COLOR}
          strokeWidth="2"
        />
      )}
    </svg>
  );
}
