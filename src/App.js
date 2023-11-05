import './App.css';
import React, { useState, useEffect } from 'react';
import Scatterplot from './components/Scatterplot';
import * as d3 from 'd3';
import Grid2D from './components/basic/Grid2D';
import PointWTooltip from './components/basic/PointWTooltip';
import Legend from './components/Legend';
import RD3 from './components/RD3';

function App() {
  // Write data as a state to trigger rerender when it changes
  const [data, setData] = useState(
    d3.range(100).map((_) => [
      Math.random(),  // first field
      Math.random(),  // second field
      Math.floor(Math.random() * 3)  // third field (categorical: 0, 1, or 2)
    ])
  );
  const [data1, setData1] = useState(
    d3.range(100).map((_) => [
      Math.random(),  // first field
      Math.random(),  // second field
      Math.floor(Math.random() * 5)  // third field (categorical: 0, 1, or 2)
    ])
  );
  useEffect(() => {
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const xRange = Math.floor(randomInRange(10, 20));
      const yRangeFrom = Math.floor(randomInRange(0, 4));
      const yRangeTo = Math.floor(randomInRange(5, 10));
      const numCat = Math.floor(randomInRange(0, 10));
      setData1(d3.range(100).map((_) => [
        randomInRange(0, xRange),  // first field
        randomInRange(yRangeFrom, yRangeTo),  // second field
        Math.floor(Math.random() * numCat)  // third field (categorical: 0, 1, or 2)
      ]));
    }, 2000);
    return () => clearInterval(interval);
  }, [])

  // const data = [[0,0,0], [1,0,1], [0.5, 0, 2], [0, 1, 0], [0, 2, 1]];
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [tooltip, setTooltip] = useState({ content: "", x: 0, y: 0, show: false });

  return (
    <div>
      <svg width={width} height={height}>
        <RD3>
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
        </RD3>
      </svg>
      <svg width={width+100} height={height}>
        <RD3>
          <Scatterplot
            plotId="sp2"
            data={data}
            xVar="0"
            yVar="1"
            zVar="2"
            x="0" y="0"
            width={width}
            height={height}
            title="+ Tooltip and Legend"
            Grid={({gridProps}) => (<Grid2D {...gridProps} />)}
          >
          {
            ({ xScale, yScale, colorScale }) => (
              <PointWTooltip data={data} xScale={xScale} yScale={yScale} colorScale={colorScale} />
            )
          }
          </Scatterplot>
          <Legend
            forPlotId="sp2"
            x={width + 20}
            y="20"
          />
        </RD3>
      </svg>
      <svg width={width+100} height={height}>
        <RD3>
          <Scatterplot
            plotId="sp3"
            data={data1}
            xVar="0"
            yVar="1"
            zVar="2"
            x="0" y="0"
            width={width}
            height={height}
            title="Dynamic Updates"
            Grid={({gridProps}) => (<Grid2D {...gridProps} xNTicks="5" />)}
          >
            {
              ({ xScale, yScale, colorScale }) => data1.map((d, i) => (
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
          <Legend
            forPlotId="sp3"
            x={width + 20}
            y="20"
          />
        </RD3>
      </svg>

    </div>
  );
}


export default App;
