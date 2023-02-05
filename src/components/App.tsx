import { globalCss, NextUIProvider } from '@nextui-org/react'
import { logEvent } from 'firebase/analytics'
import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { darkTheme, lightTheme } from '../constants/themes'
import { analytics } from '../firebase'
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
  const [location] = useLocation()
  const { isDark } = useTheme()

  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_title: 'OpenAI API Price Calculator',
      page_location: location,
      page_path: '/',
    })
  }, [])

  return (
    <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
      <Layout />
    </NextUIProvider>
  )
}

export default App
