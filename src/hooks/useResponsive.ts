import { useMediaQuery } from 'react-responsive'

export type TUseResponsiveReturn = {
  isDesktop: boolean
  isMobile: boolean
  isNotMobile: boolean
  isTablet: boolean
}

export const useResponsive = (): TUseResponsiveReturn => {
  const isDesktop = useMediaQuery({ minWidth: 992 })
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const isNotMobile = useMediaQuery({ minWidth: 768 })
  return {
    isDesktop,
    isMobile,
    isNotMobile,
    isTablet,
  }
}
