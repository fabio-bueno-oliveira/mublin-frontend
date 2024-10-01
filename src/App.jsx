import React from 'react';
import AppRoutes from './routes';
import { MantineProvider, ColorSchemeScript, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

const theme = createTheme({
  colorScheme: 'light',
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
  colors: {
    'ocean-blue': ['#7AD1DD', '#5FCCDB', '#44CADC', '#2AC9DE', '#1AC2D9', '#11B7CD', '#09ADC3', '#0E99AC', '#128797', '#147885'],
    'bright-pink': ['#F0BBDD', '#ED9BCF', '#EC7CC3', '#ED5DB8', '#F13EAF', '#F71FA7', '#FF00A1', '#E00890', '#C50E82', '#AD1374'],
  },
  fontFamily: 'Poppins, sans-serif',
  fontFamilyMonospace: 'Poppins, Courier, monospace',
  headings: { fontFamily: 'Poppins, sans-serif' }
});

function App() {
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider theme={theme}>
      <AppRoutes />
      </MantineProvider>
    </>
  );
}

export default App;