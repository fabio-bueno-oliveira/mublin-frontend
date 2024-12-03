import React from 'react'
import AppRoutes from './routes'
import { MantineProvider, ColorSchemeScript, Anchor, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import '@mantine/core/styles.css'
// import '@mantine/carousel/styles.css'

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
  },
  fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, Roboto, sans-serif',
  fontFamilyMonospace: '-apple-system, system-ui, BlinkMacSystemFont, Roboto, Courier, monospace',
  headings: { fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, Roboto, sans-serif' }
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