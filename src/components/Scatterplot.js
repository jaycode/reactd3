import React, { forwardRef, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import Axes from './basic/Axes';
import { effect, signal } from "@preact/signals-react";
import { scales } from './basic/scales';
import { generateRandomPlotId } from './basic/helpers';
import { axesDimensions } from './basic/Axes';

export function prepareScales(width, height, xMin, xMax, yMin, yMax, colorScheme) {
  const xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height, 0]);

  // Create color scale based on zVar and colorMap
  const colorScale = d3.scaleOrdinal(colorScheme);
  return {xScale, yScale, colorScale};
}

const Scatterplot = forwardRef(({plotId, data, xVar, yVar, zVar,
colorScheme = d3.schemeCategory10,
s=3, width, height, children, ...props}, ref) => {
  if (!plotId) {
    throw new Error("Please pass a plotId prop to Scatterplot!");
  }

  const xMin = d3.min(data, d => d[xVar]);
  const xMax = d3.max(data, d => d[xVar]);
  const yMin = d3.min(data, d => d[yVar]);
  const yMax = d3.max(data, d => d[yVar]);

  effect(() => {
    scales.value[plotId] = prepareScales(width, height, xMin, xMax, yMin, yMax, colorScheme);
  });

  return (
    <g>
      <Axes
        plotId={plotId+"-axes-"+generateRandomPlotId()}
        xScale={scales.value[plotId].xScale}
        yScale={scales.value[plotId].yScale}
        width={width}
        height={height}
        axisConfigs={
          [
            {
              type: "Left",
              nTicks: 10
            },
            {
              type: "Bottom",
              nTicks: 10
            }
          ]
        }
        {...props}>
          {
            (typeof children === 'function')
            ? children({
              'xScale': scales.value[plotId].xScale,
              'yScale': scales.value[plotId].yScale,
              'colorScale': scales.value[plotId].colorScale})
            : children
          }
      </Axes>
    </g>
  )
});

export default Scatterplot;
