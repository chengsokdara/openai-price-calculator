import { globalCss, type CSS } from '@nextui-org/react'

const defaultContainerStyle: CSS = {
  d: 'flex',
  fd: 'column',
  h: '100%',
  overflowY: 'auto',
  position: 'relative',
}

export const globalStyles = globalCss({
  html: defaultContainerStyle,
  body: defaultContainerStyle,
  '#root': {
    ...defaultContainerStyle,
    '& div[data-overlay-container="true"]': defaultContainerStyle,
  },
})
