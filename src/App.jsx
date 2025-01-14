import React from 'react'
import AppRoutes from './routes'
import { MantineProvider, ColorSchemeScript, Anchor, createTheme, Button, Card, Checkbox, Paper } from '@mantine/core'
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
    deepBlue: [
      '#eef3ff',
      '#dce4f5',
      '#b9c7e2',
      '#94a8d0',
      '#748dc1',
      '#5f7cb8',
      '#5474b4',
      '#44639f',
      '#39588f',
      '#2d4b81',
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