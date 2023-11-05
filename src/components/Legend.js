import React, { useContext } from 'react';
import { signal, effect } from "@preact/signals-react";
import { RD3Context } from './RD3';

const Legend = ({plotId, x=0, y=0, ...props}) => {
  const { signals, addSignal, updateSignal } = useContext(RD3Context);

  const colorScale = signal();

  // Determine spacing for the legend items
  const spacing = 30;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {signals.colorScaleDomain && signals.colorScaleDomain.map((item, index) => (
        <g key={item} transform={`translate(0, ${index * spacing})`}>
          <rect width="20" height="20" fill={signals.colorScaleValues[index]} />
          <text x="25" y="15" style={{ fontSize: '0.9em' }}>{item}</text>
        </g>
      ))}
    </g>
  );
}

export default Legend;
