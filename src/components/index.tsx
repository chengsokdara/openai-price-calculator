import * as n from '@nextui-org/react'

export const Col = n.styled(n.Col, {
  d: 'flex',
  fd: 'column',
  position: 'relative',
  variants: {
    between: {
      true: {
        jc: 'space-between',
      },
    },
    center: {
      true: {
        ai: 'center',
        jc: 'center',
      },
    },
    centerX: {
      true: {
        ai: 'center',
      },
    },
    centerY: {
      true: {
        jc: 'center',
      },
    },
    flex: {
      true: {
        fg: 1,
      },
    },
    stretch: {
      true: {
        h: 'stretch',
      },
    },
  },
})

export const Form = n.styled('form', {
  d: 'flex',
  fd: 'column',
  fg: 1,
})

export const Row = n.styled(n.Row, {
  d: 'flex',
  fd: 'row',
  position: 'relative',
  variants: {
    flex: {
      true: {
        fg: 1,
      },
    },
  },
})

export const Scroll = n.styled(n.Col, {
  d: 'flex',
  fd: 'column',
  fg: 1,
  position: 'relative',
  overflowY: 'auto',
})
