#!/usr/bin/env python3
import re

# Read the file
with open('src/features/archive/data/leetCodeData.js', 'r') as f:
    content = f.read()

# Function to replace solution URLs
def replace_solution_url(match):
    leetcode_url = match.group(1)
    # Extract problem slug from leetcode URL
    # e.g., from 'https://leetcode.com/problems/add-two-numbers/' to 'add-two-numbers'
    problem_slug = leetcode_url.split('/problems/')[1].rstrip('/')
    solution_url = f'https://leetcode.com/problems/{problem_slug}/solutions/'
    return f"leetcodeUrl: '{leetcode_url}',\n        solutionUrl: '{solution_url}',"

# Pattern to match leetcodeUrl followed by solutionUrl
pattern = r"leetcodeUrl: '([^']+)',\s*solutionUrl: [^,]+,"

# Replace all occurrences
new_content = re.sub(pattern, replace_solution_url, content)

# Write back to file
with open('src/features/archive/data/leetCodeData.js', 'w') as f:
    f.write(new_content)

print("Fixed all solution URLs to point to LeetCode solutions!")
