import React, { useContext } from 'react';
import { RD3Context } from './RD3';

const Legend = ({plotId, forPlotId, x=0, y=0, ...props}) => {
  const { signals, addSignal, updateSignal } = useContext(RD3Context);

  if (!forPlotId) {
    throw new Error("To use a Legend component, pass in a forPlotId prop"
      + " that points to the propId of the plot component.");
  }

  // Determine spacing for the legend items
  const spacing = 30;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {signals[forPlotId + "-colorScaleDomain"] && signals[forPlotId + "-colorScaleDomain"].map((item, index) => (
        <g key={item} transform={`translate(0, ${index * spacing})`}>
          <rect width="20" height="20" fill={signals[forPlotId + "-colorScaleValues"][index]} />
          <text x="25" y="15" style={{ fontSize: '0.9em' }}>{item}</text>
        </g>
      ))}
    </g>
  );
}

export default Legend;
