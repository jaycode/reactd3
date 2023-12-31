import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const Text = styled.text`
  fill: black;
  font-family: sans-serif;
  font-size: 12px;
`;

const Axis = ({ x, y, label, type, scale, textAnchor, nTicks=10,
textRotate=0, textX, textY,
setMaxTickWidth, afterDrawn, ...props }) => {
  const gRef = useRef();
  const [maxTickWidth, setMaxTickWidthLocal] = useState(0);

  useEffect(() => {
    const d3Render = () => {
      if (scale) {
        let ticks = d3.select(gRef.current)
          .call(d3[`axis${type}`](scale).ticks(nTicks))
          .selectAll(".tick");
        const tickTexts = ticks
          .selectAll(" text");
        if (textRotate !== undefined) {
          tickTexts.attr("transform", `rotate(${textRotate})`);
        }
        if (textAnchor !== undefined) {

          tickTexts.attr("text-anchor", textAnchor);
        }
        if (textX !== undefined) {
          tickTexts.attr("x", textX);
        }
        if (textY !== undefined) {
          tickTexts.attr("y", textY);
        }

        let maxTickWidth = 0;
        let offsetTop = 0;
        if (ticks._groups.length > 0) {
          for (let i = 0; i < ticks._groups[0].length; i++) {
            const dim = ticks._groups[0][i].getBBox();
            const tickWidth = dim.width;
            if (tickWidth > maxTickWidth) {
              maxTickWidth = tickWidth;
            }
            const tickTop = dim.y;
            if (tickTop < offsetTop) {
              offsetTop = tickTop;
            }
          }
          setMaxTickWidthLocal(maxTickWidth);
          if (setMaxTickWidth !== undefined) {
            setMaxTickWidth(maxTickWidth);
          }

          if (afterDrawn) {
            afterDrawn(gRef, maxTickWidth, offsetTop);
          }
        }
      }
    };

    d3Render();
  }, [afterDrawn, scale, setMaxTickWidth, textAnchor, textRotate, textX, textY, type]);

  const [labelPos, setLabelPos] = useState();

  useEffect(() => {
    if (!scale) return;
    let newPos = { x: 0, y: 0, textAnchor: 'middle' };
    switch (type) {
      case 'Top':
        newPos = { x: Math.max(...scale.range()) / 2, y: -25 };
        break;
      case 'Right':
        newPos = { x: 25, y: 0, textAnchor: 'start' };
        break;
      case 'Bottom':
        let yOffset = 25 + maxTickWidth * Math.abs(Math.sin(textRotate * (Math.PI / 180)));
        newPos = { x: Math.max(...scale.range()) / 2, y: yOffset };
        break;
      case 'Left':
        newPos = {
          x: -25 - maxTickWidth,
          y: Math.max(...scale.range()) / 2,
          transform: 'rotate(-90)',
          dominantBaseline: 'middle',
        };
        break;
      default:
        console.error('Axis type must be either "Top", "Bottom", "Left", or "Right"');
        return;
    }
    setLabelPos(newPos);
  }, [maxTickWidth, scale, textRotate, type]);

  return (
    <g ref={gRef} transform={`translate(${x}, ${y})`} {...props}>
      <Text {...labelPos}>{label}</Text>
    </g>
  );
};

export default Axis;
