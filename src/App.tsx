import { NextUIProvider } from '@nextui-org/react'
import { darkTheme, lightTheme } from 'src/constants/themes'
import { ModalProvider } from 'src/contexts/ModalContext'
import { UserProvider } from 'src/contexts/UserContext'
import { globalStyles } from 'src/global.style'
import useTheme from 'src/hooks/useTheme'
import Layout from 'src/layout/Layout'

function App() {
  globalStyles()
  const { isDark } = useTheme()

  return (
    <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
      <UserProvider>
        <ModalProvider>
          <Layout />
        </ModalProvider>
      </UserProvider>
    </NextUIProvider>
  )
}

export default App
