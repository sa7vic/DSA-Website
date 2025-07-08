/**
 * BFS (Breadth-First Search) Visualization Page
 */

import React from 'react';
import GraphVisualizerTemplate from './GraphVisualizerTemplate';
import { BFS_CODE, ALGORITHM_CONFIGS } from '../data/algorithmCodes';
import { runBFS } from '../data/algorithmUtils';

const BFSPage = () => {
  // Default graph for BFS demonstration
  const defaultGraph = [
    [0, 1, 1, 0, 0, 0],
    [1, 0, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 1],
    [0, 0, 1, 1, 1, 0]
  ];

  return (
    <GraphVisualizerTemplate
      algorithmName="Breadth-First Search (BFS)"
      algorithmCode={BFS_CODE}
      initialGraph={defaultGraph}
      onAlgorithmStep={runBFS}
      controlsConfig={ALGORITHM_CONFIGS.BFS}
      algorithmDescription={ALGORITHM_CONFIGS.BFS.description}
      timeComplexity={ALGORITHM_CONFIGS.BFS.timeComplexity}
      spaceComplexity={ALGORITHM_CONFIGS.BFS.spaceComplexity}
    />
  );
};

export default BFSPage;