import { useEffect, useRef, type EffectCallback } from 'react'

export const useStrictModeEffect = (effect: EffectCallback) => {
  const countRef = useRef<number>(0)

  useEffect(() => {
    if (countRef.current === 0) {
      effect()
    }
    countRef.current = countRef.current + 1
  }, [])
}
