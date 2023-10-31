import React from 'react';
import * as d3 from 'd3';
import Axes from './basic/Axes';

function Scatterplot({data, xVar, yVar, zVar,
colorScheme = d3.schemeCategory10,
s=3, width, height, children, ...props}) {
  const xMin = d3.min(data, d => d[xVar]);
  const xMax = d3.max(data, d => d[xVar]);
  const yMin = d3.min(data, d => d[yVar]);
  const yMax = d3.max(data, d => d[yVar]);

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

  // const [xScale, setXScale] = useState(() => defaultXScale);
  // const [yScale, setYScale] = useState(() => defaultYScale);
  // console.log(typeof children)

  return (
    <>
      <Axes
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
            typeof children === 'function'
            ? children({xScale, yScale, colorScale})
            : children
          }
      </Axes>
    </>
  )
}

export default Scatterplot;
