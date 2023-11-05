import React, { useState, useEffect } from 'react';

const PointWTooltip = ({ data, xScale, yScale, colorScale, debug=false }) => {
  const [tooltip, setTooltip] = useState({ content: "", x: 0, y: 0, show: false });
  const [mousePositionDebugger, setMousePositionDebugger] = useState({ x: 0, y: 0 });


  const findClosestPoint = (mouseX, mouseY) => {
    let minDistance = Infinity;
    let closestPoint = null;

    data.forEach((d) => {
      const dx = xScale(d[0]) - mouseX;
      const dy = yScale(d[1]) - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = d;
      }
    });
    if (closestPoint) {
      setTooltip({
        content: `(${closestPoint[0].toFixed(2)}, ${closestPoint[1].toFixed(2)})`,
        x: xScale(closestPoint[0]) + 5, // 5 units to the right of the point
        y: yScale(closestPoint[1]),
        show: true
      });
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.target.parentNode.getBoundingClientRect();
    const x = e.clientX - rect.left - 10;
    const y = e.clientY - rect.top - 10;
    if (debug) {
      setMousePositionDebugger({ x, y });
    }
    findClosestPoint(x, y);
  };

  const handleMouseOut = () => {
    setTooltip({ ...tooltip, show: false });
  };

  return (
    <g transform={`translate(0, 0)`} onMouseMove={handleMouseMove} onMouseOut={handleMouseOut}>
      {data.map((d, i) => (
        <circle
          key={i}
          cx={xScale(d[0])}
          cy={yScale(d[1])}
          r="3"
          fill={colorScale(d[2])}
        />
      ))}
      {/* Transparent circles to increase hover area */}
      {data.map((d, i) => (
        <circle
          key={i}
          cx={xScale(d[0])}
          cy={yScale(d[1])}
          r="10"  // Larger radius
          fill="transparent"
        />
      ))}
      {debug && <circle cx={mousePositionDebugger.x} cy={mousePositionDebugger.y} r="5" fill="black" />}
      {tooltip.show && (
        <g transform={`translate(${tooltip.x}, ${tooltip.y})`}>
          <rect x="5" y="5" width="100" height="30" rx="5" ry="5" fill="black" opacity="0.8"/>
          <text x="10" y="25" fill="white">{tooltip.content}</text>
        </g>
      )}
    </g>
  );
};

export default PointWTooltip;
