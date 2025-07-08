/**
 * Kruskal's Minimum Spanning Tree Visualization Page
 */

import React from 'react';
import GraphVisualizerTemplate from './GraphVisualizerTemplate';
import { KRUSKAL_CODE, ALGORITHM_CONFIGS } from '../data/algorithmCodes';
import { runKruskal } from '../data/algorithmUtils';

const KruskalPage = () => {
  // Default weighted graph for Kruskal demonstration
  const defaultGraph = [
    [0, 10, 6, 5],
    [10, 0, 0, 15],
    [6, 0, 0, 4],
    [5, 15, 4, 0]
  ];

  return (
    <GraphVisualizerTemplate
      algorithmName="Kruskal's Minimum Spanning Tree"
      algorithmCode={KRUSKAL_CODE}
      initialGraph={defaultGraph}
      onAlgorithmStep={runKruskal}
      controlsConfig={ALGORITHM_CONFIGS.KRUSKAL}
      algorithmDescription={ALGORITHM_CONFIGS.KRUSKAL.description}
      timeComplexity={ALGORITHM_CONFIGS.KRUSKAL.timeComplexity}
      spaceComplexity={ALGORITHM_CONFIGS.KRUSKAL.spaceComplexity}
    />
  );
};

export default KruskalPage;