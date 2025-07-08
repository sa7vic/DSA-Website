/**
 * Prim's Minimum Spanning Tree Visualization Page
 */

import React from 'react';
import GraphVisualizerTemplate from './GraphVisualizerTemplate';
import { PRIM_CODE, ALGORITHM_CONFIGS } from '../data/algorithmCodes';
import { runPrim } from '../data/algorithmUtils';

const PrimPage = () => {
  // Default weighted graph for Prim demonstration
  const defaultGraph = [
    [0, 2, 0, 6, 0],
    [2, 0, 3, 8, 5],
    [0, 3, 0, 0, 7],
    [6, 8, 0, 0, 9],
    [0, 5, 7, 9, 0]
  ];

  return (
    <GraphVisualizerTemplate
      algorithmName="Prim's Minimum Spanning Tree"
      algorithmCode={PRIM_CODE}
      initialGraph={defaultGraph}
      onAlgorithmStep={runPrim}
      controlsConfig={ALGORITHM_CONFIGS.PRIM}
      algorithmDescription={ALGORITHM_CONFIGS.PRIM.description}
      timeComplexity={ALGORITHM_CONFIGS.PRIM.timeComplexity}
      spaceComplexity={ALGORITHM_CONFIGS.PRIM.spaceComplexity}
    />
  );
};

export default PrimPage;