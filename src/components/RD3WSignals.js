import { createContext } from 'react';
import { signal } from '@preact/signals-react';

export const RD3Context = createContext(null);

export default function RD3({ children, data }) {
  // Create a reactive state manager using signals
  const signals = signal({});

  // Expose a function to add a new signal
  const addSignal = (key, initialValue) => {
    if (!signals.value[key]) {
      signals.value[key] = initialValue;
      console.log("After updating signal, signals is:");
      console.log(signals);
    }
  };

  // Expose a function to update a specific signal
  const updateSignal = (key, updater) => {
    if (signals.value[key]) {
      if (typeof updater === 'function') {
        // Use an updater function if provided
        signals.value[key] = updater(signals.value[key]);
      } else {
        // Otherwise, directly set the value
        signals.value[key] = updater;
      }
    }
  };

  return (
    <RD3Context.Provider value={{ signals, addSignal, updateSignal }}>
      {children}
    </RD3Context.Provider>
  );
}

function generateScale(data, type) {
  // Placeholder function to generate scales
  // Implement scale generation logic based on the data and axis type ('x' or 'y')
  return {}; // Return the scale object
}
