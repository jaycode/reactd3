import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const G = styled.g`
stroke: lightgrey;
stroke-dasharray: 2,2;
stroke-opacity: 0.7;
`;

const Grid2D = ({ xScale, yScale, xNTicks=10, yNTicks=10, height, width, axis }) => {
  const ref = useRef();

  useEffect(() => {
    const grid = d3.select(ref.current);
    grid.selectAll("line").remove();

    if (xScale && (!axis || axis === 'x')) {
      const ticks = xScale.ticks(xNTicks);
      const update = grid
        .selectAll(".grid .grid-x")
        .data(ticks);
      update.exit().remove();
      update
          .enter()
          .append("line")
          .attr("class", "grid")
          .merge(update)
          .attr("x1", d => xScale(d))
          .attr("x2", d => xScale(d))
          .attr("y1", 0)
          .attr("y2", height);
    }

    if (yScale && (!axis || axis === 'y')) {
      const ticks = yScale.ticks(yNTicks);
      const update = grid
        .selectAll(".grid .grid-y")
        .data(ticks);
      update.exit().remove();
      update
          .enter()
          .append("line")
          .attr("class", "grid")
          .merge(update)
          .attr("y1", d => yScale(d))
          .attr("y2", d => yScale(d))
          .attr("x1", 0)
          .attr("x2", width);
    }
  }, [xScale, yScale, height, width, xNTicks, yNTicks]);

  return (
    <G ref={ref}></G>
  );
};

export default Grid2D;
