import { getDocumentTheme } from '@nextui-org/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export type TUseThemeOptions = {
  isDark?: boolean
}

export type TUseThemeReturns = {
  isDark: boolean
  setIsDark: Dispatch<SetStateAction<boolean>>
}

function useTheme(options?: TUseThemeOptions): TUseThemeReturns {
  const [isDark, setIsDark] = useState(options?.isDark ?? true)

  useEffect(() => {
    // you can use any storage
    let theme = window.localStorage.getItem('data-theme')
    setIsDark(theme === 'dark')

    const observer = new MutationObserver(() => {
      let newTheme = getDocumentTheme(document?.documentElement)
      setIsDark(newTheme === 'dark')
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
