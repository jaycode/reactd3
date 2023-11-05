import { signal } from '@preact/signals-react';
import { generateRandomPlotId } from './helpers';

// {plotRef: {xScale: ..., yScale: ..., etc.}}
export const scales = signal({
  '': {}
});
