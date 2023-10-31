import './App.css';
import React, { useState } from 'react';
import Scatterplot from './components/Scatterplot';
import * as d3 from 'd3';
import Grid2D from './components/basic/Grid2D';
import PointWTooltip from './components/basic/PointWTooltip';
import Legend from './components/Legend';

function App() {
  // Write data as a state to trigger rerender when it changes
  const [data, setData] = useState(
    d3.range(100).map((_) => [
      Math.random(),  // first field
      Math.random(),  // second field
      Math.floor(Math.random() * 3)  // third field (categorical: 0, 1, or 2)
    ])
  );

  // const data = [[0,0,0], [1,0,1], [0.5, 0, 2], [0, 1, 0], [0, 2, 1]];
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [tooltip, setTooltip] = useState({ content: "", x: 0, y: 0, show: false });

  return (
    <div>
      <svg width={width+50} height={height+50}>
        <Scatterplot
          data={data}
          xVar="0"
          yVar="1"
          zVar="2"
          x="0" y="0"
          width={width}
          height={height}
          title="Basic Scatterplot"
        >
          {
            ({ xScale, yScale, colorScale }) => data.map((d, i) => (
              <circle
                key={i}
                cx={xScale(d[0])}
                cy={yScale(d[1])}
                r="3"
                fill={colorScale(d[2])}
              />
            ))
          }
        </Scatterplot>
      </svg>
      <svg width={width+50} height={height+50}>
        <Scatterplot
          data={data}
          xVar="0"
          yVar="1"
          zVar="2"
          x="0" y="0"
          width={width}
          height={height}
          title="Scatterplot + Grid"
          Grid={({gridProps}) => (<Grid2D {...gridProps} xNTicks="5" />)}
        >
          {
            ({ xScale, yScale, colorScale }) => data.map((d, i) => (
              <circle
                key={i}
                cx={xScale(d[0])}
                cy={yScale(d[1])}
                r="3"
                fill={colorScale(d[2])}
              />
            ))
          }
        </Scatterplot>
      </svg>
      <svg width={width+400} height={height+50}>
        <Scatterplot
          data={data}
          xVar="0"
          yVar="1"
          zVar="2"
          x="0" y="0"
          width={width}
          height={height}
          title="Scatterplot + Grid + Legend"
          Grid={({gridProps}) => (<Grid2D {...gridProps} />)}
        >
        {
          ({ xScale, yScale, colorScale }) => (
            <PointWTooltip data={data} xScale={xScale} yScale={yScale} colorScale={colorScale} />
          )
        }
        </Scatterplot>
        <Legend />
      </svg>
    </div>
  );
}

export default App;
