import React from 'react';
import { scales } from './basic/scales'
import { signal, effect } from "@preact/signals-react"

const Legend = ({plotId, x=0, y=0, ...props}) => {
  if (!plotId) {
    throw new Error("A Legend component requires a plotId prop!"
      + "This prop should be set to the plotId of the component"
      + "to draw the legend for.");
  }
  console.log(scales.value);

  const colorScale = signal();

  effect(() => {
    if (scales.value[plotId]) {
      if (scales.value[plotId].xScale) {
        colorScale.value = scales.value[plotId].xScale
      }
    }
    else {
      throw new Error("The Legend component's plotId prop does not reference"
        + "any valid plot object.")
    }
  });

  // Determine spacing for the legend items
  const spacing = 30;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {colorScale.value && colorScale.value.domain().map((item, index) => (
        <g key={item} transform={`translate(0, ${index * spacing})`}>
          <rect width="20" height="20" fill={colorScale.value(item)} />
          <text x="25" y="15" style={{ fontSize: '0.9em' }}>{item}</text>
        </g>
      ))}
    </g>
  );
}

export default Legend;
