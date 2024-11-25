import React, { useEffect, useState } from 'react';
import { ApplicationStateType } from '../ourtypes';
import Slider from '@mui/material/Slider';
import { format, addDays } from 'date-fns';
import PriceDomAdjust from '../assets/price_dom_adjustments.json';
import './HorizontalTimeline.css'

interface Mark {
    value: number;
    label: string;
  }
  
  interface ArchesProps {
    marks: Mark[];
    sliderMin: number;
    sliderMax: number;
  }

  const Arches: React.FC<ArchesProps> = ({ marks, sliderMin, sliderMax }) => {
    const sliderWidth = 550;
    const positions = marks.map((mark) => (mark.value - sliderMin) / (sliderMax - sliderMin) * sliderWidth);
  
    // Adjust vertical control point to make the curve more pronounced
    const controlOffset1 = 150; // The vertical offset for the curve
    const controlOffset2 = 200; // The vertical offset for the curve
  
    // Set the height of the SVG to accommodate the curve
    const svgHeight = 160;
  
    return (
        <svg width={sliderWidth} height={140} style={{ position: 'relative', top: '15px' }}>
          {/* First Arch: From the first mark to the second */}
          <path
            d={`M ${positions[0]} ${svgHeight - 20} Q ${(positions[0] + positions[1]) / 2} ${svgHeight - controlOffset1}, ${positions[1]} ${svgHeight - 20}`}
            fill="none"
            stroke="blue"
            strokeWidth="2"
          />
          
          {/* Second Arch: From the first mark to the fourth */}
          <path
            d={`M ${positions[0]} ${svgHeight - 20} Q ${(positions[0] + positions[3]) / 2} ${svgHeight - controlOffset2}, ${positions[3]} ${svgHeight - 20}`}
            fill="none"
            stroke="red"
            strokeWidth="2"
          />
        </svg>
      );
    };
  
  export default Arches;