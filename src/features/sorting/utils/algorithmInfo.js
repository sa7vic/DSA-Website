// Algorithm metadata for educational purposes
export const algorithmInfo = {
  "Bubble Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Bubble sort repeatedly compares adjacent elements and swaps them if they are in the wrong order.",
    pseudocode: `function bubbleSort(arr):
  n = length(arr)
  for i from 0 to n-2:
    for j from 0 to n-i-2:
      if arr[j] > arr[j+1]:
        swap arr[j] and arr[j+1]
  return arr`,
    bestCase: "O(n) - when array is already sorted",
    worstCase: "O(n²) - when array is reverse sorted",
    stable: true,
    inPlace: true
  },
  "Insertion Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Insertion sort builds the final sorted array one item at a time by repeatedly inserting a new element into the sorted portion of the array.",
    pseudocode: `function insertionSort(arr):
  n = length(arr)
  for i from 1 to n-1:
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j+1] = arr[j]
      j = j - 1
    arr[j+1] = key
  return arr`,
    bestCase: "O(n) - when array is already sorted",
    worstCase: "O(n²) - when array is reverse sorted",
    stable: true,
    inPlace: true
  },
  "Heap Sort": {
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    description: "Heap sort converts the array into a heap data structure, then repeatedly extracts the maximum element to build the sorted array.",
    pseudocode: `function heapSort(arr):
  n = length(arr)
  buildMaxHeap(arr)
  for i from n-1 down to 1:
    swap arr[0] with arr[i]
    heapify(arr, 0, i)
  return arr`,
    bestCase: "O(n log n)",
    worstCase: "O(n log n)",
    stable: false,
    inPlace: true
  },
  "Counting Sort": {
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(k)",
    description: "Counting sort works by counting the occurrences of each element, then reconstructing the sorted array using the counts.",
    pseudocode: `function countingSort(arr):
  max = maximum value in arr
  count = new array of size max+1
  for num in arr:
    count[num]++
  index = 0
  for i from 0 to max:
    while count[i] > 0:
      arr[index] = i
      index++
      count[i]--
  return arr`,
    bestCase: "O(n + k)",
    worstCase: "O(n + k)",
    stable: true,
    inPlace: false
  },
  "Selection Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Selection sort works by repeatedly finding the minimum element from the unsorted part and putting it at the beginning.",
    pseudocode: `function selectionSort(arr):
  n = length(arr)
  
  for i from 0 to n-1:
    min_idx = i
    
    for j from i+1 to n-1:
      if arr[j] < arr[min_idx]:
        min_idx = j
    
    swap arr[i] with arr[min_idx]
    
  return arr`,
    bestCase: "O(n²)",
    worstCase: "O(n²)",
    stable: false,
    inPlace: true
  },
  "Merge Sort": {
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Merge sort is a divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.",
    pseudocode: `function mergeSort(arr):
  if length(arr) <= 1:
    return arr
    
  mid = length(arr) / 2
  left = mergeSort(arr[0...mid-1])
  right = mergeSort(arr[mid...n])
  
  return merge(left, right)
  
function merge(left, right):
  result = []
  i = 0, j = 0
  
  while i < length(left) and j < length(right):
    if left[i] <= right[j]:
      append left[i] to result
      i++
    else:
      append right[j] to result
      j++
      
  append remaining elements from left and right
  return result`,
    bestCase: "O(n log n)",
    worstCase: "O(n log n)",
    stable: true,
    inPlace: false
  },
  "Quick Sort": {
    timeComplexity: "O(n log n) average, O(n²) worst case",
    spaceComplexity: "O(log n)",
    description: "Quick sort works by selecting a 'pivot' element and partitioning the array around the pivot, placing smaller elements before it and larger ones after it.",
    pseudocode: `function quickSort(arr, low, high):
  if low < high:
    pivot_idx = partition(arr, low, high)
    
    quickSort(arr, low, pivot_idx - 1)
    quickSort(arr, pivot_idx + 1, high)
    
function partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  
  for j from low to high-1:
    if arr[j] <= pivot:
      i++
      swap arr[i] with arr[j]
      
  swap arr[i+1] with arr[high]
  return i+1`,
    bestCase: "O(n log n)",
    worstCase: "O(n²) - when pivot is always smallest/largest",
    stable: false,
    inPlace: true
  }
};

// Algorithm comparison data
export const algorithmComparison = {
  simple: ["Bubble Sort", "Selection Sort", "Insertion Sort"],
  efficient: ["Merge Sort", "Quick Sort", "Heap Sort"],
  special: ["Counting Sort"],
  
  // Performance characteristics
  stable: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Counting Sort"],
  inPlace: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort", "Heap Sort"],
  
  // Recommended use cases
  recommendations: {
    "small arrays": "Insertion Sort",
    "nearly sorted": "Insertion Sort",
    "worst-case guaranteed": "Merge Sort",
    "average performance": "Quick Sort",
    "memory constrained": "Heap Sort",
    "integer values": "Counting Sort"
  }
};
