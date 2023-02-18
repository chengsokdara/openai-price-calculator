import { useContext } from 'react'
import { ModalContext, type TModalValue } from 'src/contexts/ModalContext'

export const useModal = <T>() =>
  useContext<TModalValue<T>>(ModalContext) ?? {
    open: 'close',
    payload: undefined,
    toggle: () => {},
  }
