import { createTheme, NextUIProvider } from '@nextui-org/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const darkTheme = createTheme({
  type: 'dark',
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NextUIProvider theme={darkTheme}>
      <App />
    </NextUIProvider>
  </React.StrictMode>
)
