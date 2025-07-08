/**
 * DFS (Depth-First Search) Visualization Page
 */

import React from 'react';
import GraphVisualizerTemplate from './GraphVisualizerTemplate';
import { DFS_CODE, ALGORITHM_CONFIGS } from '../data/algorithmCodes';
import { runDFS } from '../data/algorithmUtils';

const DFSPage = () => {
  // Default graph for DFS demonstration
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
      algorithmName="Depth-First Search (DFS)"
      algorithmCode={DFS_CODE}
      initialGraph={defaultGraph}
      onAlgorithmStep={runDFS}
      controlsConfig={ALGORITHM_CONFIGS.DFS}
      algorithmDescription={ALGORITHM_CONFIGS.DFS.description}
      timeComplexity={ALGORITHM_CONFIGS.DFS.timeComplexity}
      spaceComplexity={ALGORITHM_CONFIGS.DFS.spaceComplexity}
    />
  );
};

export default DFSPage;