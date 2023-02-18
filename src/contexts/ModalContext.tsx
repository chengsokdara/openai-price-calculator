import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

export type TModalNames = 'close' | (typeof modals)[number]['key']

export type TModalValue<T> = {
  open: TModalNames
  payload: T
  toggle: (name?: TModalNames | null, payload?: T) => void
} | null

export const ModalContext = createContext<TModalValue<any>>(null)

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [components, setComponents] = useState<any[]>([])
  const [open, setOpen] = useState<TModalNames>('close')
  const [payload, setPayload] = useState<any>()

  const toggle = useCallback((name?: TModalNames | null, payload?: any) => {
    if (name) {
      const foundModal = modals.find((modal) => modal.key === name)
      if (foundModal) {
        import(`../modals/${foundModal.modal}.tsx`).then((component) => {
          setComponents([component.default])
        })
      }
      setPayload(payload)
      setOpen(name)
    } else {
      setComponents([])
      setPayload(undefined)
      setOpen('close')
    }
  }, [])

  const Modal = useMemo(() => {
    if (!components.length) return null
    const Component = components[0]
    return <Component />
  }, [components])

  return (
    <ModalContext.Provider value={{ open, payload, toggle }}>
      {children}
      {Modal}
    </ModalContext.Provider>
  )
}

export const modals = [
  { modal: 'DatasetModal', key: 'dataset-modal' },
  {
    modal: 'DatasetDataModal',
    key: 'dataset-data-modal',
  },
] as const
