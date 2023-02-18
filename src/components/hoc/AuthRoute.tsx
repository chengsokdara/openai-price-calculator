import Loader from '@ui/Loader'
import { cloneElement, type ReactElement } from 'react'
import { useUser } from 'src/hooks/useUser'
import { Route, useLocation, type DefaultParams, type RouteProps } from 'wouter'

function AuthRoute<T extends DefaultParams>(props: RouteProps<T>) {
  const [, navigate] = useLocation()
  const user = useUser()

  if (user === null) return null
  if (user === undefined) return <Loader message="Welcome!" />

  return cloneElement(Route as unknown as ReactElement, { ...props, user })
}

export default AuthRoute
