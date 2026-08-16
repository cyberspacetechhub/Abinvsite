import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';

const ThemeWrapper = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default ThemeWrapper;