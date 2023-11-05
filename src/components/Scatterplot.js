import React, { forwardRef, useRef, useState, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import Axes from './basic/Axes';
import { effect, signal } from "@preact/signals-react";
import { generateRandomPlotId } from './basic/helpers';
import { axesDimensions } from './basic/Axes';
import { RD3Context } from './RD3';

export function prepareScales(width, height, xMin, xMax, yMin, yMax, zVals, colorScheme) {
  const xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height, 0]);

  let colorScale = null;
  if (zVals) {
    // Create color scale based on zVar and colorMap
    colorScale = d3.scaleOrdinal()
      .domain(zVals)
      .range(colorScheme);
  }
  return {xScale, yScale, colorScale};
}

const Scatterplot = forwardRef(({plotId, data, xVar, yVar, zVar,
colorScheme = d3.schemeCategory10,
s=3, width, height, children, ...props}, ref) => {
  const { addSignal, updateSignal } = useContext(RD3Context);

  const [scales, setScales] = useState({
    xScale: null,
    yScale: null,
    colorScale: null
  });

  useEffect(() => {
    const xMin = d3.min(data, d => d[xVar]);
    const xMax = d3.max(data, d => d[xVar]);
    const yMin = d3.min(data, d => d[yVar]);
    const yMax = d3.max(data, d => d[yVar]);
    let zVals = null;
    if (zVar) {
      zVals = Array.from(new Set(data.map(d => d[zVar])));
    }
    const newScales = prepareScales(width, height, xMin, xMax, yMin, yMax, zVals, colorScheme);
    setScales(newScales);
    if (zVar) {
      addSignal('colorScaleDomain', newScales.colorScale.domain());
      updateSignal('colorScaleDomain', newScales.colorScale.domain());
      const values = newScales.colorScale.domain().map(d => newScales.colorScale(d));
      addSignal('colorScaleValues', values);
      updateSignal('colorScaleValues', values);
    }
    // addSignal('xScale', newScales.xScale);
    // addSignal('yScale', newScales.yScale);

  }, [data, xVar, yVar, colorScheme, width, height]);

  const { xScale, yScale, colorScale } = scales;

  return (
    <g>
      {xScale && yScale && (
        <Axes
          plotId={plotId+"-axes-"+generateRandomPlotId()}
          xScale={xScale}
          yScale={yScale}
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
              (typeof children === 'function' )
              ? children({
                'xScale': xScale,
                'yScale': yScale,
                'colorScale': colorScale})
              : children
            }
        </Axes>
      )}
    </g>
  )


});

export default Scatterplot;
