import { Col, Row } from '@nextui-org/react'
import { type ComponentType, useEffect, useState } from 'react'
import {
  Route,
  Switch,
  type DefaultParams,
  type RouteComponentProps,
} from 'wouter'
import Loader from '../components/Loader'
import { pages, type TPage } from '../constants/configs'

const routes = pages.slice().sort((a, b) => a.order - b.order)

function Routes() {
  const [components, setComponents] = useState<
    ComponentType<RouteComponentProps<DefaultParams>>[]
  >([])

  useEffect(() => {
    const fetchComponents = async () => {
      const p = routes.map(async (i) => {
        const c = await import(`../pages/${i.component}.tsx`)
        return c.default
      })
      const r = await Promise.all(p)
      setComponents(r)
    }
    fetchComponents()
  }, [])

  const renderRoutes = ({ key, path }: TPage, index: number) => {
    return <Route key={key} path={path} component={components[index]} />
  }

  if (components.length === 0) return <Loader />

  return (
    <Row css={{ fg: 1 }}>
      <Col
        css={{
          h: 'stretch',
          px: '$10',
          '@xsMax': {
            px: '$sm',
          },
        }}
      >
        <Switch>{routes.map(renderRoutes)}</Switch>
      </Col>
    </Row>
  )
}

export default Routes
