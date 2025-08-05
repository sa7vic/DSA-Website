import React from 'react';
import { Stage, Layer, Line, Circle, Text, Rect } from 'react-konva';

const KleeCanvas = ({
  segments,
  onSegmentDraw,
  isDrawing,
  sweepLineX,
  activeSegments,
  currentStep,
  mode
}) => {
  const CANVAS_WIDTH = 1600; // Doubled from 800
  const CANVAS_HEIGHT = 800; // Doubled from 400
  const DRAWING_Y = 400; // Doubled from 200
  const SEGMENT_THICKNESS = 16; // Doubled from 8

  const [isDrawingSegment, setIsDrawingSegment] = React.useState(false);
  const [drawStart, setDrawStart] = React.useState(null);
  const [currentMouse, setCurrentMouse] = React.useState(null);

  // Handle mouse down - start drawing a segment
  const handleMouseDown = (e) => {
    if (!isDrawing) {
      return;
    }
    
    const pos = e.target.getStage().getPointerPosition();
    setDrawStart({ x: pos.x, y: DRAWING_Y });
    setIsDrawingSegment(true);
    setCurrentMouse({ x: pos.x, y: DRAWING_Y });
  };

  // Handle mouse move - update the segment being drawn
  const handleMouseMove = (e) => {
    if (!isDrawing || !isDrawingSegment) {
      return;
    }
    
    const pos = e.target.getStage().getPointerPosition();
    setCurrentMouse({ x: pos.x, y: DRAWING_Y });
  };

  // Handle mouse up - finish drawing a segment
  const handleMouseUp = (e) => {
    if (!isDrawing || !isDrawingSegment || !drawStart) {
      return;
    }
    
    const pos = e.target.getStage().getPointerPosition();
    const endX = pos.x;
    
    // Only create segment if it has meaningful length
    if (Math.abs(endX - drawStart.x) > 10) {
      onSegmentDraw(drawStart.x, endX, DRAWING_Y);
    }
    
    // Reset drawing state
    setIsDrawingSegment(false);
    setDrawStart(null);
    setCurrentMouse(null);
  };

  // Get color for a segment based on its state
  const getSegmentColor = (segmentId) => {
    // Colors for different segments
    const segmentColors = [
      '#2196F3', // Blue
      '#FF9800', // Orange
      '#9C27B0', // Purple
      '#00BCD4', // Cyan
      '#F44336', // Red
      '#FFEB3B', // Yellow
      '#795548', // Brown
      '#607D8B'  // Blue Grey
    ];
    
    if (mode === 'visualizing' && activeSegments && activeSegments.has(segmentId)) {
      return '#4CAF50'; // Green for active segments
    }
    return segmentColors[segmentId % segmentColors.length];
  };

  // Render coordinate system
  const renderCoordinateSystem = () => {
    const elements = [];
    
    // Main horizontal line (x-axis)
    elements.push(
      <Line
        key="x-axis"
        points={[100, DRAWING_Y + 100, CANVAS_WIDTH - 100, DRAWING_Y + 100]}
        stroke="#666"
        strokeWidth={4}
      />
    );

    // Tick marks and labels
    for (let i = 0; i <= 10; i++) {
      const x = 100 + (i * (CANVAS_WIDTH - 200) / 10);
      const value = i * 160; // Scale: each tick represents 160 units (doubled)
      
      elements.push(
        <Line
          key={`tick-${i}`}
          points={[x, DRAWING_Y + 90, x, DRAWING_Y + 110]}
          stroke="#666"
          strokeWidth={2}
        />
      );
      
      elements.push(
        <Text
          key={`label-${i}`}
          x={x - 20}
          y={DRAWING_Y + 120}
          text={value.toString()}
          fontSize={24}
          fill="#999"
          align="center"
        />
      );
    }

    return elements;
  };

  // Render all segments
  const renderSegments = () => {
    const elements = [];

    // Render completed segments
    segments.forEach((segment) => {
      const color = getSegmentColor(segment.id);
      const strokeWidth = mode === 'visualizing' && activeSegments && activeSegments.has(segment.id) 
        ? SEGMENT_THICKNESS + 2 
        : SEGMENT_THICKNESS;

      elements.push(
        <Line
          key={`segment-${segment.id}`}
          points={[segment.start, segment.y, segment.end, segment.y]}
          stroke={color}
          strokeWidth={strokeWidth}
          lineCap="round"
        />
      );

      // Add segment endpoints
      elements.push(
        <Circle
          key={`start-${segment.id}`}
          x={segment.start}
          y={segment.y}
          radius={8}
          fill={color}
        />
      );
      
      elements.push(
        <Circle
          key={`end-${segment.id}`}
          x={segment.end}
          y={segment.y}
          radius={8}
          fill={color}
        />
      );

      // Add segment ID label
      elements.push(
        <Text
          key={`label-${segment.id}`}
          x={(segment.start + segment.end) / 2 - 10}
          y={segment.y - 50}
          text={`S${segment.id}`}
          fontSize={24}
          fill="#fff"
          align="center"
        />
      );
    });

    // Render segment being drawn
    if (isDrawingSegment && drawStart && currentMouse) {
      elements.push(
        <Line
          key="drawing-segment"
          points={[drawStart.x, drawStart.y, currentMouse.x, currentMouse.y]}
          stroke="#FF9800"
          strokeWidth={SEGMENT_THICKNESS}
          lineCap="round"
          opacity={0.7}
        />
      );
    }

    return elements;
  };

  // Render sweep line
  const renderSweepLine = () => {
    if (mode !== 'visualizing' || sweepLineX === null) {
      return null;
    }

    return (
      <>
        <Line
          points={[sweepLineX, 100, sweepLineX, CANVAS_HEIGHT - 100]}
          stroke="#FF5722"
          strokeWidth={6}
          dash={[10, 10]}
        />
        <Text
          x={sweepLineX - 40}
          y={60}
          text={`x=${sweepLineX.toFixed(1)}`}
          fontSize={28}
          fill="#FF5722"
          fontStyle="bold"
        />
      </>
    );
  };

  // Render union intervals
  const renderUnionIntervals = () => {
    if (!currentStep || !currentStep.unionIntervals) {
      return [];
    }

    const elements = [];
    const unionY = DRAWING_Y + 200; // Position union visualization below segments
    
    // Colors for different union intervals
    const intervalColors = [
      '#4CAF50', // Green
      '#2196F3', // Blue  
      '#FF9800', // Orange
      '#9C27B0', // Purple
      '#F44336', // Red
      '#00BCD4', // Cyan
      '#FFEB3B', // Yellow
      '#795548'  // Brown
    ];

    // Add union axis label
    elements.push(
      <Text
        key="union-label"
        x={40}
        y={unionY - 30}
        text="Union:"
        fontSize={28}
        fill="#4CAF50"
        fontStyle="bold"
      />
    );

    // Render union intervals with different colors and better text positioning
    currentStep.unionIntervals.forEach((interval, index) => {
      const color = intervalColors[index % intervalColors.length];
      const midX = (interval.start + interval.end) / 2;
      const intervalWidth = interval.end - interval.start;
      
      // Render the interval rectangle
      elements.push(
        <Rect
          key={`union-${index}`}
          x={interval.start}
          y={unionY}
          width={intervalWidth}
          height={30}
          fill={color}
          opacity={0.8}
          cornerRadius={4}
          stroke="#fff"
          strokeWidth={1}
        />
      );
      
      // Add interval index label inside the rectangle (if wide enough)
      if (intervalWidth > 60) {
        elements.push(
          <Text
            key={`union-index-${index}`}
            x={midX}
            y={unionY + 20}
            text={`I${index + 1}`}
            fontSize={16}
            fill="#000"
            align="center"
            fontStyle="bold"
          />
        );
      }
      
      // Add length label below with proper spacing to avoid overlap
      const textY = unionY + 50 + (index % 2) * 25; // Alternate text positions
      elements.push(
        <Text
          key={`union-length-${index}`}
          x={midX}
          y={textY}
          text={`${interval.length.toFixed(1)}`}
          fontSize={18}
          fill={color}
          align="center"
          fontStyle="bold"
        />
      );
      
      // Add interval range text above the rectangle
      elements.push(
        <Text
          key={`union-range-${index}`}
          x={midX}
          y={unionY - 10}
          text={`[${interval.start.toFixed(1)}, ${interval.end.toFixed(1)}]`}
          fontSize={14}
          fill={color}
          align="center"
          fontStyle="bold"
        />
      );
    });

    return elements;
  };

  return (
    <div className="canvas-container">
      <Stage
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: isDrawing ? 'crosshair' : 'default' }}
      >
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            fill="#1a1a1a"
          />
          
          {/* Coordinate system */}
          {renderCoordinateSystem()}
          
          {/* Segments */}
          {renderSegments()}
          
          {/* Union intervals */}
          {renderUnionIntervals()}
          
          {/* Sweep line */}
          {renderSweepLine()}
          
          {/* Step info overlay */}
          <Rect
            x={20}
            y={20}
            width={700}
            height={160}
            fill="rgba(0,0,0,0.8)"
            cornerRadius={16}
            stroke="rgba(100, 181, 246, 0.5)"
            strokeWidth={2}
            visible={currentStep !== null}
          />
          
          {/* Current step message */}
          {currentStep && (
            <>
              <Text
                x={40}
                y={50}
                text={currentStep.message || ''}
                fontSize={26}
                fill="#64b5f6"
                fontStyle="bold"
                width={660}
                wrap="word"
              />
              {currentStep.explanation && (
                <Text
                  x={40}
                  y={100}
                  text={currentStep.explanation}
                  fontSize={22}
                  fill="#fff"
                  width={660}
                  wrap="word"
                />
              )}
            </>
          )}
          
          {/* Instructions */}
          {isDrawing && segments.length === 0 && (
            <Text
              x={CANVAS_WIDTH / 2 - 400}
              y={CANVAS_HEIGHT / 2 - 40}
              text="Click and drag to draw line segments"
              fontSize={32}
              fill="#888"
              align="center"
              width={800}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default KleeCanvas;
