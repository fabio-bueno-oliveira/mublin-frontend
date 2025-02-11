import React from 'react'
import AppRoutes from './routes'
import { MantineProvider, ColorSchemeScript, virtualColor, Anchor, createTheme, Button, Card, Checkbox, Paper } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'

const theme = createTheme({
  autoContrast: true,
  focusRing: 'never',
  defaultRadius: 'md',
  luminanceThreshold: 0.3,
  colorScheme: 'light',
  colors: {
    primary: virtualColor({
      name: 'primary',
      dark: 'white',
      light: 'dark',
    }),
    violet: [
      "#f4ecfe",
      "#e4d3f9",
      "#c7a2f4",
      "#aa6ef1",
      "#9143ee",
      "#812aed",
      "#791ded",
      "#6813d3",
      "#5c0fbd",
      "#4f08a6"
    ],
  },
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
  components: {
    Anchor: Anchor.extend({
      defaultProps: {
        underline: 'never',
      },
    }),
    Button: Button.extend({
      defaultProps: {
        fw: '550',
        radius: 'md'
      },
    }),
    Card: Card.extend({
      defaultProps: {
        radius: 'lg'
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: 'lg'
      },
    }),
    Checkbox: Checkbox.extend({
      defaultProps: {
        radius: 'sm'
      },
    }),
  },
  fontFamily: 'Geist, Helvetica, Arial, sans-serif',
  fontFamilyMonospace: 'Geist, Helvetica, Arial, monospace',
  headings: { fontFamily: 'Geist, Helvetica, Arial, sans-serif' }
});

function App() {
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider theme={theme}>
        <Notifications />
        <AppRoutes />
      </MantineProvider>
    </>
  );
}

export default App