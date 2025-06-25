# Contributing to DSA Website

Thank you for your interest in contributing to our Data Structures and Algorithms visualization website! This guide will help you understand the codebase structure, design patterns, and how to maintain consistency across visualizers.

## Project Structure

```
DSA-Website/
├── src/
│   ├── features/           # Feature-based modules
│   │   ├── home/          # Landing page
│   │   ├── about/         # About page
│   │   ├── linkedList/    # Linked List visualizer
│   │   ├── stackQueue/    # Stack & Queue visualizer  
│   │   ├── tree/          # Binary Search Tree visualizer
│   │   ├── sorting/       # Sorting algorithms visualizer
│   │   ├── pathfinding/   # Pathfinding visualizer
│   │   └── common/        # Shared components
│   ├── constants/         # App-wide constants & theme
│   ├── utils/             # Utility functions
│   ├── assets/           # Images, icons, etc.
│   └── App.jsx           # Main application router
├── public/               # Static assets
└── dist/                # Build output
```

##  Design System & Theme

### Color Scheme
Our website uses a consistent dark theme across all visualizers:

```javascript
// Primary Colors (src/constants/index.js)
COLORS = {
  PRIMARY: '#58a6ff',      // Blue - primary actions, highlights
  SECONDARY: '#238636',    // Green - success, normal states
  DANGER: '#f85149',       // Red - errors, warnings
  WARNING: '#d29922',      // Yellow - cautions
  SUCCESS: '#238636',      // Green - confirmations
  NODE_ACTIVE: '#5bc9b1',  // Teal - active/highlighted nodes
  NODE_INACTIVE: '#30363d', // Gray - inactive elements
  BACKGROUND: '#0d1117',   // Dark gray - main background
  SURFACE: '#161b22',      // Slightly lighter - panels, cards
  BORDER: '#30363d'        // Border color
}
```

### Typography
- **Primary Font**: 'Rajdhani' (headings, UI elements)
- **Code Font**: 'JetBrains Mono', 'Fira Code' (code blocks)
- **Body Font**: System fonts as fallback

### Layout Patterns

#### Split-View Layout (Tree, Stack/Queue, Linked List)
```css
.split-view {
  display: flex;
  gap: 2rem;
  height: calc(100vh - 80px);
}

.panel {
  flex: 1;
  background: var(--surface-color);
  border-radius: 12px;
  overflow: hidden;
}
```

#### Code Panel Structure
All visualizers use consistent code highlighting with these features:
- **Syntax highlighting** using `react-syntax-highlighter` with `vs2015` theme
- **Line highlighting** with blue background for current operations
- **Auto-scroll** to highlighted lines
- **Error highlighting** with red borders for validation errors

#### Animation System
- **Speed Control**: All visualizers include speed sliders (100ms - 2000ms)
- **Step Controls**: Play/pause, step forward/backward
- **State Management**: Consistent animation state across components

##  Component Architecture

### Visualizer Component Pattern
Each visualizer follows this structure:

```jsx
const SomeVisualizer = () => {
  // Core state
  const [dataStructure] = useState(new DataStructureClass());
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation control
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [currentLine, setCurrentLine] = useState(0);
  
  // UI feedback  
  const [message, setMessage] = useState('Ready');
  
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="home-btn">Home</Link>
        <h1>Visualizer Title</h1>
      </header>
      
      <main className="split-view">
        <section className="panel code-panel">
          <h2>C Implementation</h2>
          <SyntaxHighlighter>
            {getCode()}
          </SyntaxHighlighter>
        </section>
        
        <section className="panel viz-panel">
          <h2>Interactive Visualization</h2>
          <div className="controls">
            {/* Input controls */}
          </div>
          <div className="animation-controls">
            {/* Play/pause/step controls */}
          </div>
          <div className="visualization">
            {/* Visual representation */}
          </div>
        </section>
      </main>
    </div>
  );
};
```

### Data Structure Classes
Each visualizer implements its data structure with animation support:

```javascript
class DataStructure {
  constructor() {
    this.animationSteps = [];
  }
  
  operation(params) {
    this.animationSteps = []; // Clear previous steps
    // ... perform operation
    // ... add animation steps with line numbers and descriptions
    return this.animationSteps;
  }
}
```

##  Code Standards

### Animation Step Format
```javascript
{
  type: 'operation_type',        // 'insert', 'search', 'traverse', etc.
  currentNode: nodeValue,        // Currently highlighted node
  description: 'Step description', // User-friendly explanation
  line: 42,                     // Line number in C code to highlight
  error: false                  // Optional: mark as error step
}
```

### Line Highlighting Requirements
- Line numbers must correspond **exactly** to the C code shown
- Use clear, educational descriptions for each step
- Include error states with appropriate styling
- Implement auto-scroll to highlighted lines

### CSS Custom Properties
Use CSS custom properties for theming:
```css
:root {
  --primary-color: #58a6ff;
  --surface-color: #161b22;
  --text-color: #c9d1d9;
  /* etc. */
}
```

## 🚀 Adding a New Visualizer

1. **Create directory structure**:
   ```
   src/features/yourVisualizer/
   ├── components/
   │   └── YourVisualizer.jsx
   ├── styles/
   │   └── YourVisualizer.css
   └── utils/ (if needed)
   ```

2. **Follow the component pattern** shown above

3. **Implement data structure class** with animation support

4. **Use consistent styling**:
   - Import and extend from `common.css`
   - Use color constants from `constants/index.js`
   - Follow the split-view layout pattern

5. **Add route** in `App.jsx`:
   ```jsx
   <Route path="/your-visualizer" element={<YourVisualizer />} />
   ```

6. **Update navigation** in `HomePage.jsx`

##  Key Design Principles

### Educational Focus
- **Clear explanations**: Every animation step should teach something
- **C code alignment**: Visual operations must match C implementation exactly
- **Progressive complexity**: Start simple, build up to complex operations

### Performance
- **Debounced inputs**: Use `debounce()` from `utils/helpers.js`
- **Efficient animations**: Minimize DOM updates during animations
- **Memory management**: Clean up timeouts and references

### Accessibility
- **Color contrast**: Ensure sufficient contrast ratios
- **Keyboard navigation**: Support keyboard controls where applicable
- **Screen readers**: Use semantic HTML and ARIA labels

### User Experience
- **Immediate feedback**: Show loading states, validation errors
- **Consistent interactions**: Same patterns across all visualizers
- **Mobile-friendly**: Responsive design for smaller screens

##  Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

##  Common Issues & Solutions

### Animation State Problems
- Always call `resetAnimation()` before starting new operations
- Clear timeouts properly in cleanup functions
- Use React refs for stable references across renders

### Line Highlighting Mismatches
- Count C code lines carefully (including empty lines)
- Test highlighting with actual user interactions
- Add comments in code for line number clarity

### CSS Specificity Issues
- Follow the cascade: common → feature → component
- Use CSS custom properties for theming
- Avoid `!important` unless absolutely necessary

## Testing Your Changes

1. **Build test**: `npm run build` should complete without errors
2. **Manual testing**: Test all animations, edge cases, and error states
3. **Cross-browser testing**: Verify in Chrome, Firefox, Safari
4. **Responsive testing**: Check on different screen sizes
5. **Performance**: Ensure smooth animations at all speeds

##  Tips for LLMs

When working with this codebase:

1. **Always check existing patterns** before creating new components
2. **Use the constants file** for colors and common values
3. **Follow the established file structure** strictly
4. **Test animations thoroughly** - they're the core feature
5. **Maintain educational value** - every change should enhance learning

## Getting Help

If you have questions or need clarification:
- Check existing visualizers for patterns
- Review this contributing guide
- Look at the constants file for available utilities
- Test your changes thoroughly before submitting
- contact @oghostyyy on discord, (Prajwal-k-tech on github)
- Join our Awesome discord server - https://discord.gg/B2bDXryfKP

## Security and Maintenance

### Known Dependencies Status
The project has been audited and dependencies updated as of **June 2025**. Some notes:

- **react-syntax-highlighter**: Updated to latest version (15.6.1) but may have transitive dependency vulnerabilities in prismjs. These are known moderate-severity DOM clobbering vulnerabilities that don't affect the core functionality of this educational project but should be monitored for future updates.

- **Regular maintenance**: Run `npm audit` periodically and update dependencies with `npm update` and `npm audit fix` when safe to do so.

- **Breaking changes**: Some dependency updates may introduce breaking changes. Always test the application thoroughly after updates by running `npm run build` and testing the visualizers.

### Security Best Practices
- Keep dependencies updated regularly
- Review security advisories for critical vulnerabilities
- Test functionality after any security updates
- Use `npm audit` to monitor for new vulnerabilities

Thank you for contributing to opensource! 
