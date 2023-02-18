import { Col } from '@ui'
import Loader from '@ui/Loader'
import { useEffect, useMemo, useState, type ComponentType } from 'react'
import {
  Route,
  Switch,
  type DefaultParams,
  type RouteComponentProps,
} from 'wouter'

function Routes() {
  const [components, setComponents] = useState<
    ComponentType<RouteComponentProps<DefaultParams>>[]
  >([])

  useEffect(() => {
    ;(async () => {
      const modules = import.meta.glob('/src/pages/**/*.tsx')
      let promises = pages.map(
        async (page) =>
          ((await modules[`/src/pages/${page.component}.tsx`]()) as any).default
      )
      const result = await Promise.all(promises)
      setComponents(result)
    })()
  }, [])

  const renderRoute = useMemo(
    () =>
      ({ key, path }: TPage, index: number) => {
        return <Route key={key} path={path} component={components[index]} />
      },
    [components]
  )

  return (
    <Col css={{ flex: 1, px: '$10', '@xsMax': { px: '$sm' } }}>
      {components.length === 0 ? (
        <Loader message="Welcome!" />
      ) : (
        <Switch>{pages.map(renderRoute)}</Switch>
      )}
    </Col>
  )
}

export default Routes

export type TPage = {
  component: string
  key: string
  hide?: boolean
  matcher?: string
  path: string
  title: string
  auth?: boolean
}

export const pages: TPage[] = [
  // Route with parameters
  {
    component: 'DatasetData',
    key: 'dataset-data',
    hide: true,
    path: '/dataset/:datasetId',
    title: 'Dataset Data',
  },
  {
    component: 'Calculator',
    key: 'price-calculator-by-token',
    hide: true,
    path: '/token/:token',
    title: 'Price Calculator',
  },
  // Admin route
  {
    component: 'admin/Dataset',
    key: 'admin-dataset-manager',
    hide: true,
    path: '/admin/dataset',
    title: 'Admin Dataset Manager',
  },
  // Route with navigation
  {
    component: 'Dataset',
    key: 'dataset-manager',
    matcher: '/dataset/:datasetId*',
    path: '/dataset',
    title: 'Dataset Manager',
    // auth: true,
  },
  {
    component: 'Calculator',
    key: 'price-calculator',
    matcher: '/calculator',
    path: '/calculator',
    title: 'Price Calculator',
  },
  {
    component: 'Tokenizer',
    key: 'token-counter',
    matcher: '/tokenizer',
    path: '/tokenizer',
    title: 'Token Counter',
  },
  {
    component: 'Chat',
    key: 'chat',
    hide: true,
    matcher: '/chat',
    path: '/chat',
    title: 'Chat',
  },
  // Default Route
  {
    component: 'auth/Login',
    key: 'auth-signin',
    hide: true,
    path: '/auth/signin',
    title: 'Login',
  },
  {
    component: 'auth/Verify',
    key: 'auth-verify',
    hide: true,
    path: '/auth/verify',
    title: 'Login Verification',
  },
  {
    component: 'Dataset',
    key: 'home',
    // matcher: '/',
    hide: true,
    path: '/',
    title: 'Price Calculator',
    // auth: true,
  },
  {
    component: '404',
    key: '404',
    hide: true,
    path: '/:rest*',
    title: 'Not Found',
  },
]
