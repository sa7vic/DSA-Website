/**
 * Tree Component Integration Test
 * Tests the functionality of the TreeVisualizer component
 */

import { BinarySearchTree, TreeTraversal, treeUtils } from '../src/features/tree/utils/treeOperations.js';
import { treeAlgorithmInfo, traversalCodeSnippets } from '../src/features/tree/utils/algorithmInfo.js';

// Sample test for tree operations
function testBinarySearchTree() {
  console.log('🌳 Starting TreeVisualizer Integration Tests...\n');

  // Test 1: Tree Operations
  console.log('1. Testing BinarySearchTree operations...');
  const bst = new BinarySearchTree();

  // Test insertions
  const testValues = [50, 30, 70, 20, 40, 60, 80];
  testValues.forEach(val => {
    const result = bst.insert(val);
    console.log(`   Insert ${val}: ${result.steps ? '✅' : '❌'} (${result.steps?.length || 0} steps)`);
  });

  // Test search
  console.log('\n2. Testing search functionality...');
  [30, 65].forEach(val => {
    const result = bst.search(val);
    console.log(`   Search ${val}: ${result.found ? '✅ Found' : '❌ Not found'} (${result.steps?.length || 0} steps)`);
  });

  // Test delete
  console.log('\n3. Testing delete functionality...');
  [20, 30, 50].forEach(val => {
    const result = bst.delete(val);
    console.log(`   Delete ${val}: ${result.steps ? '✅' : '❌'} (${result.steps?.length || 0} steps)`);
  });

  // Test traversals
  console.log('\n4. Testing traversals...');
  
  const traversalResults = {
    inOrder: TreeTraversal.inOrder(bst),
    preOrder: TreeTraversal.preOrder(bst),
    postOrder: TreeTraversal.postOrder(bst),
    levelOrder: TreeTraversal.levelOrder(bst)
  };

  for (const [type, result] of Object.entries(traversalResults)) {
    console.log(`   ${type}: [${result.result.join(', ')}] (${result.steps.length} steps)`);
  }
}

// Export the test function for use in a test runner
export { testBinarySearchTree };

// If this file is run directly, execute the tests
if (typeof require !== 'undefined' && require.main === module) {
  testBinarySearchTree();
}
