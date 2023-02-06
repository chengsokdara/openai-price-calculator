import { globalCss, NextUIProvider } from '@nextui-org/react'
import { darkTheme, lightTheme } from './constants/themes'
import useTheme from './hooks/useTheme'
import Layout from './layout/Layout'

const globalStyles = globalCss({
  html: { height: '100%' },
  body: { height: '100%' },
  '#root': { height: '100%' },
  'div[data-overlay-container="true"]': { height: '100%' },
})

function App() {
  globalStyles()
  const { isDark } = useTheme()
  console.log({ isDark })

  return (
    <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
      <Layout />
    </NextUIProvider>
  )
}

export default App
