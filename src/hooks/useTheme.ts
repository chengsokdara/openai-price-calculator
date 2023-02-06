import { getDocumentTheme } from '@nextui-org/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export type TUseThemeReturns = {
  isDark: boolean
  setIsDark: Dispatch<SetStateAction<boolean>>
}

function useTheme(): TUseThemeReturns {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // you can use any storage
    let theme = window.localStorage.getItem('data-theme')
    setIsDark(theme !== 'light')

    const observer = new MutationObserver(() => {
      let newTheme = getDocumentTheme(document?.documentElement)
      setIsDark(newTheme !== 'light')
    })

    // Observe the document theme changes
    observer.observe(document?.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style'],
    })

    return () => observer.disconnect()
  }, [])

  return { isDark, setIsDark }
}

export default useTheme
