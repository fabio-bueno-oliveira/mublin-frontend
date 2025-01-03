import React from 'react'
import AppRoutes from './routes'
import { MantineProvider, ColorSchemeScript, Anchor, createTheme, Button } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'

const theme = createTheme({
  colorScheme: 'light',
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
        fw: '440',
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