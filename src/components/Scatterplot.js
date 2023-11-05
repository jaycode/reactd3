import React, { forwardRef, useRef, useState, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import Axes from './basic/Axes';
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
  const { signals, setSignals } = useContext(RD3Context);
  const randomId = generateRandomPlotId();
  const [_plotId] = useState(plotId ? plotId : randomId);
  const [axesPlotId] = useState(
    plotId
    ? plotId+"-axes-"+generateRandomPlotId()
    : randomId+"-axes-"+generateRandomPlotId());

  const [scales, setScales] = useState({
    xScale: null,
    yScale: null,
    colorScale: null
  });

  const [updatedWidth, setUpdatedWidth] = useState();
  const [updatedHeight, setUpdatedHeight] = useState();

  const xMin = d3.min(data, d => d[xVar]);
  const xMax = d3.max(data, d => d[xVar]);
  const yMin = d3.min(data, d => d[yVar]);
  const yMax = d3.max(data, d => d[yVar]);
  let zVals = null;
  if (zVar) {
    zVals = Array.from(new Set(data.map(d => d[zVar])));
  }

  const plotRef = useRef();
  // Change width and height of plot depending on the axes.
  const [resizeIteration, setResizeIteration] = useState(0);
  useEffect(() => {
    if (signals[axesPlotId+'-bAxisWidth']
        && signals[axesPlotId+'-bAxisHeight']
        && signals[axesPlotId+'-titleTextAreaHeight']
        && signals[axesPlotId+'-lAxisHeight']
        && signals[axesPlotId+'-lAxisMaxTickWidth']) {
      // console.log(signals);
      const plotDim = plotRef.current.getBBox();
      if (plotDim.height > height && plotDim.width > width) {
        console.log("resizeIteration: " + resizeIteration);
        if (resizeIteration == 0) {
          const newWidth = width - signals[axesPlotId+'-lAxisMaxTickWidth'];
          const newHeight = height - signals[axesPlotId+'-titleTextAreaHeight']
            - signals[axesPlotId+'-bAxisHeight'];
          const newScales = prepareScales(
            newWidth,
            newHeight,
            xMin, xMax, yMin, yMax, zVals, colorScheme);
            setScales(newScales);
            setUpdatedWidth(newWidth);
            setUpdatedHeight(newHeight);
        }
        else {
          const newWidth = signals[axesPlotId+'-bAxisWidth'] - 2;
          const newHeight = signals[axesPlotId+'-lAxisHeight'] - 2;
          const newScales = prepareScales(
            newWidth,
            newHeight,
            xMin, xMax, yMin, yMax, zVals, colorScheme);
            setScales(newScales);
          setUpdatedWidth(newWidth);
          setUpdatedHeight(newHeight);
        }
        setResizeIteration((v) => v+1);
      }
    }
  }, [signals[axesPlotId+'-bAxisWidth'], signals[axesPlotId+'-bAxisHeight'],
      signals[axesPlotId+'-titleTextAreaHeight'],
      signals[axesPlotId+'-lAxisHeight'],
      signals[axesPlotId+'-lAxisMaxTickWidth']]
  );

  useEffect(() => {
    let newScales;
    if (updatedWidth && updatedHeight) {
      newScales = prepareScales(updatedWidth, updatedHeight, xMin, xMax, yMin, yMax, zVals, colorScheme);
    }
    else {
      newScales = prepareScales(width, height, xMin, xMax, yMin, yMax, zVals, colorScheme);
    }

    setScales(newScales);
    if (zVar) {

      const values = newScales.colorScale.domain().map(d => newScales.colorScale(d));
      setSignals({
        ...signals,
        [_plotId+'-colorScaleDomain']: newScales.colorScale.domain(),
        [_plotId+'-colorScaleValues']: values,
      });
    }

  }, [data, xVar, yVar, colorScheme, width, height, updatedWidth, updatedHeight]);

  const { xScale, yScale, colorScale } = scales;

  return (
    <g ref={plotRef}>
      {xScale && yScale && (
        <Axes
          plotId={axesPlotId}
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
