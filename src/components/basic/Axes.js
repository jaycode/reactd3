// Axes is a component that have two Axis objects that we can later use to draw visuals on top of.
// It also has some basic functionalities of a chart, like a title and labels.
// TODOs:
// - Wrap title when too long
// - Additional Axis configurations

import React, { useState, useRef, useEffect, useContext } from 'react';
import Axis from './Axis';
import styled from 'styled-components';
import { RD3Context } from '../RD3';
import { generateRandomPlotId } from './helpers';

const TitleText = styled.text`
  color: #212529;
  font-family: var(--bs-font-sans-serif);
  text-anchor: middle;
  font-size: 15;
  font-weight: bold;
`;

export default function Axes(
{
  plotId, title, x, y, xLabel, yLabel,
  xScale, yScale, Grid,
  titlePaddingBottom=5,
  axisConfigs, children,
  ...props
}) {
  const [_plotId] = useState(plotId ? plotId : generateRandomPlotId());

  const { signals, setSignals } = useContext(RD3Context);

  const titleRef = useRef();
  const [lAxisRefCurrent, setLAxisRefCurrent] = useState();
  const [bAxisRefCurrent, setBAxisRefCurrent] = useState();
  const vizRef = useRef();

  // Title Text width & height
  const [titleTextAreaHeight, setTitleTextAreaHeight] = useState(0);
  const [titleTextWidth, setTitleTextWidth] = useState(0);
  const [titleTextHeight, setTitleTextHeight] = useState(0);

  const [lAxisMaxTickWidth, setLAxisMaxTickWidth] = useState(0);
  const [lAxisOffsetTop, setLAxisOffsetTop] = useState(yScale.range()[0] + titleTextHeight);
  const [lAxisWidth, setLAxisWidth] = useState(0);
  const [lAxisHeight, setLAxisHeight] = useState(0);
  const [bAxisWidth, setBAxisWidth] = useState(0);
  const [bAxisHeight, setBAxisHeight] = useState(0);

  const [innerAxisConfigs, setInnerAxisConfigs] = useState([]);

  // This useEffect sets up innerAxisConfigs so it will draw the axes properly.
  // It will be run multiple times. The first time to draw the axes,
  // then next times after the axes are drawn, to correct their positions.
  useEffect(() => {
    // If axisConfigs is provided, use it. Set default axes otherwise.
    let finalAxisConfigs = axisConfigs ? [...axisConfigs] : [];
    if (!axisConfigs) {

      // Set default y axis only when yScale is available.
      if (yScale) {
        finalAxisConfigs.push({
          type: "Left",
          nTicks: 10,
        });
      }

      // Set default x axis only when xScale is available.
      if (xScale) {
        finalAxisConfigs.push({
          type: "Bottom",
          nTicks: 10
        });
      }
    }

    // Merge any missing default properties
    finalAxisConfigs = finalAxisConfigs.map(config => {
      if (config.type === "Left") {
        return {
          x: lAxisMaxTickWidth,
          y: titleTextAreaHeight-lAxisOffsetTop,
          scale: yScale,
          className: "axis",
          label: yLabel,
          afterDrawn: (ref, maxTickWidth, offsetTop) => {
            setLAxisRefCurrent(ref.current);
            setLAxisMaxTickWidth(maxTickWidth);
            setLAxisOffsetTop(offsetTop);
          },
          ...config, // This overwrites the default configurations
        };
      } else if (config.type === "Bottom") {
        // console.log("set y to " + yScale.range()[0] + " + " + titleTextAreaHeight + " + " + lAxisOffsetTop);
        return {
          x: lAxisMaxTickWidth,
          y: yScale.range()[0] + titleTextAreaHeight - lAxisOffsetTop,
          scale: xScale,
          className: "axis",
          label: xLabel,
          textAnchor: "end",
          textRotate: -30,
          textX: -10,
          textY: 0,
          afterDrawn: (ref, maxTickWidth, offsetTop) => {
            setBAxisRefCurrent(ref.current);
          },
          ...config, // This overwrites the default configurations
        };
      }
      // TODO: top and bottom
      return config;
    });

    setInnerAxisConfigs(finalAxisConfigs);
  }, [titleTextAreaHeight, lAxisOffsetTop, lAxisMaxTickWidth, xScale, yScale]);
  // Determine how to render the Axis components
  const renderAxes = () => {
    return innerAxisConfigs.map((config, index) => (
      <Axis
        key={index}
        {...config}
      />
    ))
  }

  useEffect(() => {
    if (titleRef.current) {
      const titleBBox = titleRef.current.getBBox();
      setTitleTextHeight(titleBBox.height);
      setTitleTextWidth(titleBBox.width);
      setTitleTextAreaHeight(titleBBox.height + titlePaddingBottom);
    }
    if (lAxisRefCurrent) {
      const lAxisDim = lAxisRefCurrent.getBBox();
      setLAxisWidth(lAxisDim.width);
      setLAxisHeight(lAxisDim.height);
    }
    if (bAxisRefCurrent) {
      const bAxisDim = bAxisRefCurrent.getBBox();
      setBAxisHeight(bAxisDim.height);
      setBAxisWidth(bAxisDim.width);
    }
    // Push the dimensions to the context
    setSignals({
      ...signals,
      [_plotId + '-lAxisMaxTickWidth']: lAxisMaxTickWidth,
      [_plotId + '-lAxisWidth']: lAxisWidth,
      [_plotId + '-lAxisHeight']: lAxisHeight,
      [_plotId + '-titleTextAreaHeight']: titleTextAreaHeight,
      [_plotId + '-lAxisOffsetTop']: lAxisOffsetTop,
      [_plotId + '-bAxisWidth']: bAxisWidth,
      [_plotId + '-bAxisHeight']: bAxisHeight
    });
  }, [titlePaddingBottom, lAxisRefCurrent, innerAxisConfigs, bAxisRefCurrent]);

  const [gridObj, setGridObj] = useState();
  useEffect(() => {
    if (Grid) {
      const hasLeftOrRight = innerAxisConfigs.some(config => ["Left", "Right"].includes(config.type));
      const hasTopOrBottom = innerAxisConfigs.some(config => ["Top", "Bottom"].includes(config.type));

      const leftOrRight = innerAxisConfigs.find(c => c.name === 'Left' || c.name === 'Right');
      const topOrBottom = innerAxisConfigs.find(c => c.name === 'Top' || c.name === 'Bottom');


      let gridAxis = null;
      let xNTicks = null;
      let yNTicks = null;
      if (hasLeftOrRight && !hasTopOrBottom) {
        gridAxis = 'y';
        xNTicks = leftOrRight.nTicks;
      }
      else if (!hasLeftOrRight && hasTopOrBottom) {
        gridAxis = 'x';
        yNTicks = leftOrRight.nTicks;
      }
      const gridProps = {
        width: xScale.range()[1],
        height: yScale.range()[0],
        xScale: xScale,
        yScale: yScale,
        axis: gridAxis,
        xNTicks: xNTicks,
        yNTicks: yNTicks,
      }
      setGridObj((
        <>
          <Grid
            gridProps={gridProps}
          />
        </>
      ));
    }
  }, [innerAxisConfigs]);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {title &&
        <TitleText ref={titleRef} className="title"
          x={lAxisWidth + Math.max(xScale.range()[1]/2, titleTextWidth/2)}
          y={titleTextHeight}>
          {title}
        </TitleText>
      }
      <g>
        {renderAxes()}
        <g ref={vizRef} transform={`translate(${lAxisMaxTickWidth}, ${titleTextAreaHeight-lAxisOffsetTop})`}>
          {gridObj}
          {children}
        </g>
      </g>
    </g>
  )

}
