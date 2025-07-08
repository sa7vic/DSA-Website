/**
 * Dijkstra's Shortest Path Visualization Page
 */

import React from 'react';
import GraphVisualizerTemplate from './GraphVisualizerTemplate';
import { DIJKSTRA_CODE, ALGORITHM_CONFIGS } from '../data/algorithmCodes';
import { runDijkstra } from '../data/algorithmUtils';

const DijkstraPage = () => {
  // Default weighted graph for Dijkstra demonstration
  const defaultGraph = [
    [0, 4, 2, 0, 0, 0],
    [4, 0, 1, 5, 0, 0],
    [2, 1, 0, 8, 10, 0],
    [0, 5, 8, 0, 2, 6],
    [0, 0, 10, 2, 0, 3],
    [0, 0, 0, 6, 3, 0]
  ];

  return (
    <GraphVisualizerTemplate
      algorithmName="Dijkstra's Shortest Path"
      algorithmCode={DIJKSTRA_CODE}
      initialGraph={defaultGraph}
      onAlgorithmStep={runDijkstra}
      controlsConfig={ALGORITHM_CONFIGS.DIJKSTRA}
      algorithmDescription={ALGORITHM_CONFIGS.DIJKSTRA.description}
      timeComplexity={ALGORITHM_CONFIGS.DIJKSTRA.timeComplexity}
      spaceComplexity={ALGORITHM_CONFIGS.DIJKSTRA.spaceComplexity}
    />
  );
};

export default DijkstraPage;