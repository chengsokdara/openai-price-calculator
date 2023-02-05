import { getDocumentTheme, globalCss, NextUIProvider } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { darkTheme, lightTheme } from '../constants/themes'
import useTheme from '../hooks/useTheme'
import Layout from './Layout'

const globalStyles = globalCss({
  html: { height: '100%' },
  body: { height: '100%' },
  '#root': { height: '100%' },
  'div[data-overlay-container="true"]': { height: '100%' },
})

function App() {
  globalStyles()
  const { isDark } = useTheme()

  return (
    <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
      <Layout />
    </NextUIProvider>
  )
}

export default App
