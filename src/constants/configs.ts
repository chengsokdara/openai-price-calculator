export type TPage = {
  component: string
  key: string
  hide?: boolean
  order: number
  path: string
  title: string
}

export const pages: TPage[] = [
  // Route with NavLink
  {
    component: 'Calculator',
    key: 'price-calculator',
    order: 3,
    path: '/',
    title: 'Price Calculator',
  },
  {
    component: 'Tokenizer',
    key: 'token-counter',
    order: 1,
    path: '/tokenizer',
    title: 'Token Counter',
  },
  {
    component: 'Chat',
    key: 'chat',
    order: 0,
    path: '/chat',
    title: 'Chat',
  },
  // Route with parameters
  {
    component: 'Calculator',
    key: 'price-calculator-by-token',
    hide: true,
    order: 2,
    path: '/token/:token',
    title: 'Price Calculator',
  },
]
